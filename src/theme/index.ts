import { extendTheme, theme as base } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props) => ({
    body: {
      bg: mode('#fdfdff', '#2d3142')(props),
    },
  }),
};

const colors = {
  hakka: {
    100: '#CAF0F8',
    200: '#ADE8F4',
    300: '#90E0EF',
    400: '#48CAE4',
    500: '#00B4D8',
    600: '#0096C7',
    700: '#0077B6',
    800: '#023E8A',
    900: '#03045E',
  },
};

const fonts = {
  heading: `Noto Sans, ${base.fonts.heading}`,
  body: `Open Sans, ${base.fonts.body}`,
};

const components = {
  Button: {
    variants: {
      pill: (props) => ({
        ...base.components.Button.variants.outline(props),
        rounded: 'full',
        color: 'gray.500',
      }),
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const theme = extendTheme({ config, styles, components, fonts, colors });
export default theme;
