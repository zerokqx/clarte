import { Spotlight as SpotlightMantine } from '@mantine/spotlight';
import { spotlightActions } from '../config';

export const Spotlight = () => {
  return <SpotlightMantine actions={spotlightActions} shortcut={'ctrl+k'} highlightQuery />;
};
