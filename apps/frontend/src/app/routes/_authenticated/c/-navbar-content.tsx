import { ChecksIcon } from '@phosphor-icons/react/dist/csr/Checks';
import { Navbar } from '@/widgets/navbar';
import { SettingsButtoon } from '@/features/settings-button';

export const NavbarContent = () => (
  <Navbar>
    <Navbar.Top>Top</Navbar.Top>
    <Navbar.Body>
      <Navbar.Item to="/c/todos" name="todos" leftSection={<ChecksIcon weight="bold" size={20} />}>
        Задачи
      </Navbar.Item>
    </Navbar.Body>
    <Navbar.Down>
      <SettingsButtoon />
    </Navbar.Down>
  </Navbar>
);
