import { ChecksIcon } from '@phosphor-icons/react/dist/csr/Checks';
import { Navbar } from '@/widgets/navbar';
import { SettingsButtoon } from '@/features/settings-button';
import { useMe, UserView } from '@/entities/user';
import { useNavigate } from '@tanstack/react-router';

export const NavbarContent = () => {
  const { data, isLoading } = useMe();
  const navigate = useNavigate();
  return (
    <Navbar>
      <Navbar.Top>Top</Navbar.Top>
      <Navbar.Body>
        <Navbar.Item
          to="/c/todos"
          name="todos"
          leftSection={<ChecksIcon weight="bold" size={20} />}
        >
          Задачи
        </Navbar.Item>
      </Navbar.Body>
      <Navbar.Down>
        <SettingsButtoon />
        <UserView
          login={data?.login ?? ''}
          avatarUrl={data?.avatarUrl}
          isLoading={isLoading}
          onClick={() => navigate({ to: '/c/settings/account' })}
        />
      </Navbar.Down>
    </Navbar>
  );
};
