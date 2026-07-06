import { SettingsUserSection } from '@/widgets/settings-user-section';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/c/settings/account')({
  component: SettingsUserSection,
});
