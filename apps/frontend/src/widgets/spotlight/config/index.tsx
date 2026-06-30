import { LayoutIcon } from '@phosphor-icons/react/dist/csr/Layout';

import { YinYangIcon } from '@phosphor-icons/react/dist/csr/YinYang';
import { layoutStore } from '@/shared/model';
import { SpotlightActionData, SpotlightActionGroupData } from '@mantine/spotlight';
export const spotlightActions: (SpotlightActionGroupData | SpotlightActionData)[] = [
  {
    group: 'Layout',
    actions: [
      {
        id: 'header',
        leftSection: <LayoutIcon />,
        label: 'Переключить шапку ',
        description: 'Скроет или покажет шапку в зависимости от текущего состояния',
        onClick: () => layoutStore.toggleHeader(),
      },

      {
        id: 'yin-yang',
        leftSection: <YinYangIcon />,
        label: 'Переключить Zen-Mode',
        description: 'Скроет все элементы',
        onClick: () => layoutStore.toggleZenMode(),
      },

    ],
  },
];
