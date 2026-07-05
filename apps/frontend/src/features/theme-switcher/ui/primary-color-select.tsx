import { themeStore } from '@/entities/theme';
import { AVAILABLE_THEME_COLORS } from '@/entities/theme';
import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';

export const PrimaryColorSelect = observer(() => (
  <Select
    defaultValue={themeStore.primaryColor}
    label="Главный цвет"
    data={AVAILABLE_THEME_COLORS}
    onChange={(e) => e && void themeStore.changePrimaryColoor(e)}
  />
));
