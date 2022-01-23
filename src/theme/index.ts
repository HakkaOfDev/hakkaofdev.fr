import { extendTheme, theme as base } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode('#fdfdff', '#2d3142')(props),
      },
    }),
  },
  colors: {
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
  },
  fonts: {
    heading: `Noto Sans, ${base.fonts.heading}`,
    body: `Open Sans, ${base.fonts.body}`,
  },
  components: {
    Button: {
      variants: {
        pill: (props) => ({
          ...base.components.Button.variants.outline(props),
          rounded: 'full',
          color: 'gray.500',
        }),
      },
    },
  },
});

export default theme;
