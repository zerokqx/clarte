import { LayoutIcon } from '@phosphor-icons/react/dist/csr/Layout';
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
    ],
  },
];
