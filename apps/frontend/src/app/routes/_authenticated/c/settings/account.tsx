import { SettingsUserSection } from '@/widgets/settings-user-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/c/settings/account')({
  component: SettingsUserSection,
});
