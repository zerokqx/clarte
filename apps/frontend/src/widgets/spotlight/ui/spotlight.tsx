import { Spotlight as SpotlightMantine } from '@mantine/spotlight';
import '@mantine/spotlight/styles.css';
import { spotlightActions } from '../config';

export const Spotlight = () => {
  return <SpotlightMantine actions={spotlightActions} shortcut={'ctrl+k'} highlightQuery />;
};
