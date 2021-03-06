import {
  Alert,
  Box,
  chakra,
  HTMLChakraProps,
  Kbd,
  Link,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import NextImage from 'next/image';
import Highlight, { defaultProps } from 'prism-react-renderer';
import darkTheme from 'prism-react-renderer/themes/nightOwl';
import lightTheme from 'prism-react-renderer/themes/nightOwlLight';
import slugify from 'slugify';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';

const ChakraHighlight = chakra(Highlight, {
  shouldForwardProp: (prop) =>
    ['Prism', 'theme', 'code', 'language', 'children'].includes(prop),
});

const Pre = (props) => <chakra.div my='2em' borderRadius='sm' {...props} />;

const Table = (props) => (
  <chakra.div overflowX='auto'>
    <chakra.table textAlign='left' mt='32px' width='full' {...props} />
  </chakra.div>
);

const THead = (props) => (
  <chakra.th
    bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
    fontWeight='semibold'
    p={2}
    fontSize='sm'
    {...props}
  />
);

const TData = (props) => (
  <chakra.td
    p={2}
    borderTopWidth='1px'
    borderColor='inherit'
    fontSize='sm'
    whiteSpace='normal'
    {...props}
  />
);

const CodeHighlight = ({ children: codeString, className: language }: any) => {
  language = language.replace('language-', '');
  const theme = useColorModeValue(lightTheme, darkTheme);
  const lineNumberColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const preBackground = useColorModeValue('gray.50', 'gray.900');
  const showLineNumbers = !['shell', 'text'].includes(language);

  return (
    <ChakraHighlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        tokens.pop();
        return (
          <div data-language={className}>
            <chakra.pre
              className={className}
              sx={{ ...style, backgroundColor: preBackground }}
              overflowX='auto'
              rounded='md'
              p={4}
              mx={-4}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                return (
                  <chakra.div {...lineProps} display='table-row' key={i}>
                    {showLineNumbers && (
                      <chakra.span
                        w={8}
                        display='table-cell'
                        textAlign='right'
                        userSelect='none'
                        color={lineNumberColor}
                        px={3}
                      >
                        {i + 1}
                      </chakra.span>
                    )}
                    {line.map((token, key) => {
                      return (
                        <chakra.span
                          {...getTokenProps({ token, key })}
                          key={`${i}.${key}`}
                        />
                      );
                    })}
                  </chakra.div>
                );
              })}
            </chakra.pre>
          </div>
        );
      }}
    </ChakraHighlight>
  );
};

const InlineCode = (props: any) => (
  <chakra.code
    apply='mdx.code'
    color={useColorModeValue('hakka.100', 'hakka.900')}
    bg={useColorModeValue(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
    px={1.5}
    py={0.5}
    rounded='md'
    {...props}
  />
);

const LinkedHeading = (props: HTMLChakraProps<'h2'>) => {
  const slug = slugify(props.children as string, { lower: true });
  return (
    <Link href={`#${slug}`} role='group' fontSize='2xl'>
      <Box
        {...props}
        display='inline'
        fontFamily='heading'
        color={useColorModeValue('gray.700', 'white')}
      >
        {props.children}
      </Box>
      <chakra.span
        aria-label='anchor'
        color={useColorModeValue(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
        userSelect='none'
        fontWeight='normal'
        outline='none'
        _focus={{ opacity: 1, boxShadow: 'outline' }}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        ml='0.375rem'
      >
        #
      </chakra.span>
    </Link>
  );
};

const Image = (props) => {
  return (
    <NextImage {...props} layout='responsive' loading='lazy' quality={100} />
  );
};

const Anchor = (props) => {
  const { colorMode } = useColorMode();
  return (
    <chakra.a
      color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)({ colorMode })}
      {...props}
    />
  );
};

const MDXComponents = {
  code: CodeHighlight,
  inlineCode: InlineCode,
  h1: (props) => <LinkedHeading as='h1' apply='mdx.h1' {...props} />,
  h2: (props) => <LinkedHeading as='h2' apply='mdx.h2' {...props} />,
  h3: (props) => <LinkedHeading as='h3' apply='mdx.h3' {...props} />,
  h4: (props) => <LinkedHeading as='h4' apply='mdx.h4' {...props} />,
  hr: (props) => <chakra.hr apply='mdx.hr' {...props} />,
  strong: (props) => <Box as='strong' fontWeight='semibold' {...props} />,
  pre: Pre,
  kbd: Kbd,
  img: Image,
  br: ({ reset, ...props }) => (
    <Box
      as={reset ? 'br' : undefined}
      height={reset ? undefined : '10px'}
      {...props}
    />
  ),
  table: Table,
  th: THead,
  td: TData,
  a: Anchor,
  p: (props) => <chakra.p apply='mdx.p' {...props} />,
  ul: (props) => (
    <chakra.ul px={{ base: 4, md: 0 }} apply='mdx.ul' {...props} />
  ),
  ol: (props) => <chakra.ol apply='mdx.ul' {...props} />,
  li: (props) => <chakra.li pb='4px' {...props} />,
  blockquote: (props) => (
    <Box>
      <Alert
        status='warning'
        variant='left-accent'
        as='blockquote'
        rounded='md'
        {...props}
        w='unset'
      />
    </Box>
  ),
};

export default MDXComponents;
