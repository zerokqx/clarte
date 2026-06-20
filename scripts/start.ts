#!/usr/bin/env tsx

import { select, checkbox } from '@inquirer/prompts';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Функция для выполнения синхронных shell-команд (для подготовки)
function runCommandSync(command: string) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Ошибка при выполнении команды: ${command}`);
    process.exit(1);
  }
}

// Функция для запуска долгоживущих процессов (микросервисов)
function spawnCommand(command: string, args: string[]) {
  const env = { ...process.env, NX_DAEMON: 'false' };

  const child = spawn(command, args, {
    stdio: 'inherit',
    env,
    shell: true,
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`\nПроцесс завершился с кодом ${code}`);
    }
  });
}

// Динамическое получение списка приложений (микросервисов)
function getAppProjects(): string[] {
  // 1. Попытка получить список через Nx (только type: app)
  try {
    const output = execSync('npx nx show projects --type app', { encoding: 'utf-8' });
    const projects = output
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (projects.length > 0) {
      return projects;
    }
  } catch (error) {
    console.warn(
      '⚠️ Не удалось получить список через Nx. Перехожу к динамическому сканированию папки apps/...',
    );
  }

  // 2. Резервный вариант: динамическое сканирование директории apps/
  try {
    const appsDir = path.join(process.cwd(), 'apps');
    if (fs.existsSync(appsDir)) {
      return fs
        .readdirSync(appsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    }
  } catch (fsError) {
    console.error('❌ Ошибка при сканировании директории apps:', fsError);
  }

  return [];
}

async function main() {
  console.log('🚀 Starting deployment and setup for Clarte...\n');

  // 1. Установка pnpm
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    console.log('✔ pnpm is already installed');
  } catch {
    console.log('📦 Installing pnpm globally...');
    runCommandSync('npm install -g pnpm');
  }

  // 2. Установка зависимостей
  console.log('📦 Installing project dependencies...');
  runCommandSync('pnpm install');

  // 3. Установка nx
  try {
    execSync('nx --version', { stdio: 'ignore' });
    console.log('✔ nx is already installed');
  } catch {
    console.log('📦 Installing nx globally...');
    try {
      execSync('pnpm add --global nx', { stdio: 'inherit' });
    } catch {
      console.log(
        '⚠️ Warning: Failed to install nx globally. Proceeding with local execution.',
      );
    }
  }

  // 4. Запуск инфраструктуры
  console.log('\n🐳 Starting docker-compose infrastructure...');
  runCommandSync('pnpm nx run-many --targets=compose-infra-up --no-tui');

  // 5. Интерактивный выбор микросервисов
  console.log('\n');
  const runMode = await select({
    message: 'Как запустить микросервисы?',
    choices: [
      { name: '🚀 Запустить все микросервисы', value: 'all' },
      { name: '✅ Выбрать определенные (через галочку)', value: 'select' },
    ],
  });

  if (runMode === 'all') {
    console.log('\n⚡ Starting all microservices...');
    spawnCommand('pnpm', ['nx', 'run-many', '--targets=serve', '--no-tui']);
    return;
  }

  // Режим ручного выбора (только apps)
  const projects = getAppProjects();

  if (projects.length === 0) {
    console.error('❌ Приложения не найдены в папке apps или через Nx.');
    process.exit(1);
  }

  const selectedProjects = await checkbox({
    message:
      'Выберите микросервисы для запуска (Пробел - поставить галочку, Enter - подтвердить):',
    choices: projects.map((project) => ({ name: project, value: project })),
    loop: false,
  });

  if (selectedProjects.length === 0) {
    console.log('\n🛑 Ни один микросервис не выбран. Выход.');
    process.exit(0);
  }

  console.log(
    `\n⚡ Starting selected microservices: ${selectedProjects.join(', ')}...`,
  );

  // Формируем аргумент --projects=app1,app2
  const projectsArg = `--projects=${selectedProjects.join(',')}`;
  spawnCommand('pnpm', [
    'nx',
    'run-many',
    '--targets=serve',
    projectsArg,
    '--no-tui',
  ]);
}

main().catch(console.error);
