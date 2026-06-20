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
  console.error('Error: Please specify query name, e.g., --name=my-query');
  process.exit(1);
}

if (!project) {
  console.error('Error: Please specify project, e.g., --project=auth-service');
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

const targetDir = path.join(projectDir, 'src/application/queries', name);

if (!fs.existsSync(projectDir)) {
  console.error(`Error: Project directory not found at ${projectDir}`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const queryContent = `import { Query } from '@nestjs/cqrs';

export class ${pascalName}Query extends Query<any> {
  constructor() {super()}
}
`;

const handlerContent = `import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ${pascalName}Query } from './${name}.query';

@QueryHandler(${pascalName}Query)
export class ${pascalName}Handler implements IQueryHandler<${pascalName}Query> {
  constructor() {}

}
`;

fs.writeFileSync(path.join(targetDir, `${name}.query.ts`), queryContent, 'utf-8');
fs.writeFileSync(path.join(targetDir, `${name}.handler.ts`), handlerContent, 'utf-8');

const indexContent = `export * from './${name}.query';
export * from './${name}.handler';
`;
fs.writeFileSync(path.join(targetDir, 'index.ts'), indexContent, 'utf-8');

console.log(`Successfully generated CQRS query:`);
console.log(`  Project: ${project}`);
console.log(`  Folder: ${path.relative(path.join(__dirname, '..'), targetDir)}`);
console.log(`  File: ${name}.query.ts`);
console.log(`  File: ${name}.handler.ts`);
console.log(`  File: index.ts`);

