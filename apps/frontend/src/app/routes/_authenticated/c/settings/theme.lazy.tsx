import { SettingsThemeSection } from '@/widgets/settings-theme-section';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/c/settings/theme')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettingsThemeSection />;
}
