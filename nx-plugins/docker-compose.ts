import { CreateNodesV2 } from '@nx/devkit';
import { dirname, basename } from 'path';

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
      if (suffixName === 'microservice') {
        suffixName = 'service';
      }

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
                    command: `docker compose -f ${configFile} up -d`,
                  },
                },
                [`compose${targetSuffix}-down`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${configFile} down`,
                  },
                },
                [`compose${targetSuffix}-logs`]: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `docker compose -f ${configFile} logs -f`,
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
