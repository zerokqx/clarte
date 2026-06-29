const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(process.cwd(), 'apps/ws-gateway/src');

// 1. Create directories
execSync(`mkdir -p ${root}/app/auth/application/decorators`);
execSync(`mkdir -p ${root}/app/auth/application/ports`);
execSync(`mkdir -p ${root}/app/auth/infrastructure`);
execSync(`mkdir -p ${root}/app/hocuspocus/application/decorators`);
execSync(`mkdir -p ${root}/app/hocuspocus/application/ports`);
execSync(`mkdir -p ${root}/app/hocuspocus/infrastructure`);

// 2. Move files
execSync(`mv ${root}/application/decorators/auth*.ts ${root}/app/auth/application/decorators/`);
execSync(`mv ${root}/application/decorators/jwt*.ts ${root}/app/auth/application/decorators/`);
execSync(
  `mv ${root}/application/decorators/hocuspocus*.ts ${root}/app/hocuspocus/application/decorators/`,
);

execSync(`mv ${root}/application/ports/auth*.ts ${root}/app/auth/application/ports/`);
execSync(`mv ${root}/application/ports/jwt*.ts ${root}/app/auth/application/ports/`);
execSync(`mv ${root}/application/ports/hocuspocus*.ts ${root}/app/hocuspocus/application/ports/`);

execSync(`mv ${root}/infrastructure/auth/* ${root}/app/auth/infrastructure/`);
execSync(`mv ${root}/infrastructure/jwt/* ${root}/app/auth/infrastructure/`);
execSync(`mv ${root}/infrastructure/hocuspocus/* ${root}/app/hocuspocus/infrastructure/`);

// 3. Create di-tokens.ts
fs.writeFileSync(
  `${root}/app/auth/application/ports/di-tokens.ts`,
  `export const JWT_VALIDATOR = Symbol('JWT Validator');
export const JWT_ALOGORITM = Symbol('JWT Algoritm');
export const AUTH_GRPC_CLIENT = Symbol("Auth gRPC client");
export const AUTH_CLIENT = Symbol("Auth client");\n`,
);

fs.writeFileSync(
  `${root}/app/hocuspocus/application/ports/di-tokens.ts`,
  `export const HOCUSPOCUS_SERVER = Symbol('Hocuspocus server port');\n`,
);

// 4. Create index.ts for ports
fs.writeFileSync(
  `${root}/app/auth/application/ports/index.ts`,
  `export * from './di-tokens';
export * from './auth.client.interface';
export * from './jwt-validator.interface';\n`,
);

fs.writeFileSync(
  `${root}/app/hocuspocus/application/ports/index.ts`,
  `export * from './di-tokens';
export * from './hocuspocus-server.port';\n`,
);

// 5. Create index.ts for decorators
fs.writeFileSync(
  `${root}/app/auth/application/decorators/index.ts`,
  `export * from './auth.client.inject';
export * from './auth.grpc.client.inject';
export * from './jwt-validator.inject';\n`,
);

fs.writeFileSync(
  `${root}/app/hocuspocus/application/decorators/index.ts`,
  `export * from './hocuspocus.inject';\n`,
);

// 6. Delete old folders
execSync(`rm -rf ${root}/application`);
execSync(`rm -rf ${root}/infrastructure`);

console.log('Moved files successfully');
