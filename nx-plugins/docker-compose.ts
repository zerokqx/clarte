import { CreateNodesV2 } from '@nx/devkit';
import { dirname, basename } from 'path';

const suffixTable = {
  microservice: 'service',
};
export const createNodes: CreateNodesV2 = [
  '**/compose*.{yml,yaml}',
  (configFiles) => {
    return configFiles.map((configFile) => {
      const projectRoot = dirname(configFile);
      const filename = basename(configFile);

      // Маппинг имени файла в суффикс таски:
      // compose.infra.yml -> suffix = "infra" (таска: compose-infra-up)
      // compose.microservice.yml -> suffix = "microservice" -> маппим в "service" (таска: compose-service-up)
      // compose.yml / docker-compose.yml -> suffix = "" (таска: compose-up)
      const match = filename.match(/^(?:docker-)?compose(?:\.([^.]+))?\.ya?ml$/);

      let suffixName = match && match[1] ? match[1] : '';
      suffixName = suffixTable[suffixName] ?? suffixName;

      const targetSuffix = suffixName ? `-${suffixName}` : '';

      return [
        configFile,
        {
          projects: {
            [projectRoot]: {
              targets: {
                [`compose${targetSuffix}-up`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${filename} up -d`,
                    cwd: projectRoot,
                  },
                },
                [`compose${targetSuffix}-down`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${filename} down --remove-orphans`,
                    cwd: projectRoot,
                  },
                },
                [`compose${targetSuffix}-restart`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${configFile} restart`,
                  },
                },
                [`compose${targetSuffix}-build`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${configFile} up -d --build --remove-orphans`,
                  },
                },
                [`compose${targetSuffix}-ps`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${configFile} ps`,
                  },
                },
                [`compose${targetSuffix}-logs`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${filename} logs -f`,
                    cwd: projectRoot,
                  },
                },
              },
            },
          },
        },
      ] as const;
    });
  },
];
