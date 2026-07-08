import classes from './settings-buttom.module.scss';
import { GearIcon } from '@phosphor-icons/react/dist/csr/Gear';
import { ActionIcon } from '@mantine/core';
import { Link, useNavigate } from '@tanstack/react-router';

export const SettingsButtoon = () => {
  const navigate = useNavigate();
  return (
    <Link to="/c/settings" style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <ActionIcon color="gray" variant={isActive ? 'filled' : 'transparent'}>
          <GearIcon />
        </ActionIcon>
      )}
    </Link>
  );
};
