const fs = require('fs');
const path = require('path');

// Parse arguments
let name = '';
let project = '';

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--name=')) {
    name = arg.split('=')[1];
  } else if (arg.startsWith('--project=') || arg.startsWith('--service=')) {
    project = arg.split('=')[1];
  } else if (!name) {
    name = arg;
  } else if (!project) {
    project = arg;
  }
}

if (!name) {
  console.error('Error: Please specify command name, e.g., --name=my-command');
  process.exit(1);
}

if (!project) {
  console.error('Error: Please specify project, e.g., --service=auth-service');
  process.exit(1);
}

// Convert kebab-case to PascalCase
const pascalName = name
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

// Determine project path
let projectDir = '';
if (project.startsWith('apps/') || project.startsWith('packages/')) {
  projectDir = path.join(__dirname, '..', project);
} else {
  const appsPath = path.join(__dirname, '..', 'apps', project);
  const pkgsPath = path.join(__dirname, '..', 'packages', project);
  if (fs.existsSync(appsPath)) {
    projectDir = appsPath;
  } else if (fs.existsSync(pkgsPath)) {
    projectDir = pkgsPath;
  } else {
    projectDir = appsPath;
  }
}

const targetDir = path.join(projectDir, 'src/application/commands', name);

if (!fs.existsSync(projectDir)) {
  console.error(`Error: Project directory not found at ${projectDir}`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const commandContent = `import { Command } from '@nestjs/cqrs';

export class ${pascalName}Command extends Command<any> {
  constructor() {
    super();
  }
}
`;

const handlerContent = `import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ${pascalName}Command } from './${name}.command';

@CommandHandler(${pascalName}Command)
export class ${pascalName}Handler implements ICommandHandler<${pascalName}Command> {
  constructor() {super()}

}
`;

fs.writeFileSync(path.join(targetDir, `${name}.command.ts`), commandContent, 'utf-8');
fs.writeFileSync(path.join(targetDir, `${name}.handler.ts`), handlerContent, 'utf-8');

const indexContent = `export * from './${name}.command';
export * from './${name}.handler';
`;
fs.writeFileSync(path.join(targetDir, 'index.ts'), indexContent, 'utf-8');

console.log(`Successfully generated CQRS command:`);
console.log(`  Project: ${project}`);
console.log(`  Folder: ${path.relative(path.join(__dirname, '..'), targetDir)}`);
console.log(`  File: ${name}.command.ts`);
console.log(`  File: ${name}.handler.ts`);
console.log(`  File: index.ts`);

