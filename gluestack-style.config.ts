import { createConfig } from '@gluestack-style/react';
import { config as defaultConfig } from '@gluestack-ui/config'; // Optional if you want to use default theme

import { primary } from './constants/colors'

export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      ...primary
    },
    fontSizes: {
      ...defaultConfig.tokens.fontSizes,
      newFontSize: 90,
    },
  },
});