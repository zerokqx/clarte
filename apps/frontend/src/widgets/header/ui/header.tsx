import { observer } from 'mobx-react-lite';
import { useMe } from '@/entities/user';
import { layoutStore } from '@/shared/model';
import { HeaderView } from './header.view';

export const Header = observer(() => {
  const { data, isLoading } = useMe();

  return (
    <HeaderView
      login={data?.login ?? 'anonymous'}
      avatarUrl={data?.avatarUrl}
      navbarVisible={layoutStore.navbarVisible}
      onToggleNavbar={() => layoutStore.toggleNavbar()}
      isLoading={isLoading}
    />
  );
});
