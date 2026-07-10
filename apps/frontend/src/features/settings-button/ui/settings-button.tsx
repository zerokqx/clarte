import { GearIcon } from '@phosphor-icons/react/dist/csr/Gear';
import { ActionIcon } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export const SettingsButtoon = () => {
  return (
    <Link to="/c/settings" style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <ActionIcon color="gray" variant={isActive ? 'filled' : 'subtle'}>
          <GearIcon />
        </ActionIcon>
      )}
    </Link>
  );
};
