import { BlogPost } from '@/types/blog-post';
import {
  Badge,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue as mode,
  VStack
} from '@chakra-ui/react';
import Nextlink from 'next/link';
import { DARK_CARD_COLOR, LIGHT_CARD_COLOR } from 'src/constants';

const BlogPostCard = ({ title, description, date, tags, slug }: BlogPost) => {
  const hoverBg = mode('gray.100', 'whiteAlpha.300');

  return (
    <LinkBox as='article'>
      <VStack
        w='full'
        p={{ base: 2, md: 4 }}
        boxShadow='lg'
        bg={mode(LIGHT_CARD_COLOR, DARK_CARD_COLOR)}
        rounded='lg'
        alignItems='stretch'
        transitionProperty='all'
        transitionTimingFunction='ease-out'
        transitionDuration='slow'
        _hover={{
          bg: hoverBg,
          transform: 'scale(1.05, 1.05)',
        }}
      >
        <Stack
          direction={{ base: 'column-reverse', md: 'row' }}
          justify='space-between'
          w='full'
        >
          <Heading size='md'>
            <LinkOverlay as={Nextlink} href={`/blog/${slug}`} passHref>
              {title}
            </LinkOverlay>
          </Heading>
          <Badge
            fontSize={{ base: 'xs', lg: 'sm' }}
            colorScheme='hakka'
            w='fit-content'
            flexShrink={0}
          >
            {date}
          </Badge>
        </Stack>
        <Text fontSize='sm' color='gray.500'>
          {description}
        </Text>
        <Text fontSize='xs' color='hakka.300'>
          #{tags.join(', #')}
        </Text>
      </VStack>
    </LinkBox>
  );
};

export default BlogPostCard;
