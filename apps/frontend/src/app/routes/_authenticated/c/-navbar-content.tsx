import { ChecksIcon } from '@phosphor-icons/react/dist/csr/Checks';
import { LogoutButton } from '@/features/logout';
import { Navbar } from '@/widgets/navbar';

export const NavbarContent = () => (
  <Navbar>
    <Navbar.Top>Top</Navbar.Top>
    <Navbar.Body>
      <Navbar.Item to="/c/todos" name="todos" leftSection={<ChecksIcon weight="bold" size={20} />}>
        Задачи
      </Navbar.Item>
    </Navbar.Body>
    <Navbar.Down>
      <LogoutButton />
    </Navbar.Down>
  </Navbar>
);
