const fs = require('fs');

function replaceFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [from, to] of replacements) {
        content = content.replace(from, to);
    }
    fs.writeFileSync(file, content);
}

replaceFile('apps/ws-gateway/src/app/app.module.ts', [
    ["../infrastructure/hocuspocus/hocuspocus.module", "./hocuspocus/infrastructure/hocuspocus.module"],
    ["../application/ports", "./auth/application/ports"] // Might break HOCUSPOCUS_SERVER? No, app module only uses JWT_ALOGORITM and AUTH_CLIENT
]);

replaceFile('apps/ws-gateway/src/app/auth/infrastructure/auth.client.ts', [
    ["../../application/ports", "../application/ports"],
    ["../../application/decorators", "../application/decorators"]
]);

replaceFile('apps/ws-gateway/src/app/auth/infrastructure/auth.module.ts', [
    ["../../application/ports", "../application/ports"]
]);

replaceFile('apps/ws-gateway/src/app/auth/infrastructure/jwt.module.ts', [
    ["../../application/ports", "../application/ports"],
    ["'../auth'", "'./auth.module'"],
    ["cachedKey = token;", "cachedKey = String(token);"],
    ["Promise<unknown>", "Promise<string>"]
]);

replaceFile('apps/ws-gateway/src/app/hocuspocus/application/ports/hocuspocus-server.port.ts', [
    ["import type { internal } from 'node:stream';", "import type { Duplex } from 'node:stream';"],
    ["socket: internal.Duplex", "socket: Duplex"]
]);

replaceFile('apps/ws-gateway/src/app/hocuspocus/infrastructure/hocuspocus.adapter.ts', [
    ["../../application/ports", "../application/ports"],
    ["import type { internal } from 'node:stream';", "import type { Duplex } from 'node:stream';"],
    ["socket: internal.Duplex", "socket: Duplex"]
]);

replaceFile('apps/ws-gateway/src/app/hocuspocus/infrastructure/hocuspocus.module.ts', [
    ["../../application/ports", "../application/ports"],
    ["'../auth'", "'../../auth/infrastructure/auth.module'"]
]);

replaceFile('apps/ws-gateway/src/main.ts', [
    ["./application/ports", "./app/hocuspocus/application/ports"]
]);

console.log("Fixed imports");
