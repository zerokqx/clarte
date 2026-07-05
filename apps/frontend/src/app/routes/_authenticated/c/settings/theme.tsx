import { SettingsThemeSection } from '@/widgets/settings-theme-section';
import { Tabs } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/c/settings/theme')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettingsThemeSection />;
}
