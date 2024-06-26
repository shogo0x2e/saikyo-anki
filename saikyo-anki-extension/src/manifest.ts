import { defineManifest } from '@crxjs/vite-plugin';
import { version } from '../package.json';

// NOTE: do not include src/ in paths,
// vite root folder: src, public folder: public (based on the project root)
// @see ../vite.config.ts#L16

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === 'development' ? '[Dev] ' : ''}最強暗記`,
  description: 'ハイライトした単語の解説を生成します．また，生成した解説を単語帳に追加することができます．',
  version,
  background: {
    service_worker: 'background/index.ts',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', 'file:///*'],
      js: ['content/index.tsx'],
    },
  ],
  host_permissions: ['<all_urls>'],
  options_ui: {
    page: 'options/options.html',
    open_in_tab: true,
  },
  web_accessible_resources: [
    {
      resources: [
        // this file is web accessible; it supports HMR b/c it's declared in `rollupOptions.input`
        'welcome/welcome.html',
      ],
      matches: ['<all_urls>'],
    },
  ],
  action: {
    default_popup: 'popup/popup.html',
    default_icon: {
      '16': 'images/saikyo_anki_icon_16.png',
      '32': 'images/saikyo_anki_icon_32.png',
      '48': 'images/saikyo_anki_icon_48.png',
      '128': 'images/saikyo_anki_icon_128.png',
    },
  },
  icons: {
    '16': 'images/saikyo_anki_icon_16.png',
    '32': 'images/saikyo_anki_icon_32.png',
    '48': 'images/saikyo_anki_icon_48.png',
    '128': 'images/saikyo_anki_icon_128.png',
  },
  permissions: ['storage', 'tabs', 'contextMenus'],
}));

export default manifest;
