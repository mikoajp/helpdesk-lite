import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.light,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
});
