import { Raindrop } from '@/types/raindrop';
import {
  AspectRatio,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Text,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';
import {
  DARK_BLUE_COLOR,
  DARK_CARD_COLOR,
  LIGHT_BLUE_COLOR,
  LIGHT_CARD_COLOR,
} from 'src/constants';

const ProjectCard = ({
  title,
  excerpt,
  cover,
  link,
  tags,
}: Partial<Raindrop>) => {
  return (
    <LinkBox as='article'>
      <VStack
        spacing={0}
        alignItems='center'
        rounded='md'
        bg={mode(LIGHT_CARD_COLOR, DARK_CARD_COLOR)}
        overflow='hidden'
        shadow='lg'
        transitionProperty='transform'
        transitionDuration='slow'
        transitionTimingFunction='ease-out'
        _hover={{ transform: 'scale(1.05, 1.05)' }}
      >
        <AspectRatio ratio={16 / 9} w='full'>
          <Image
            alt={`Thumbnail of ${title}`}
            src={cover}
            layout='fill'
            fallback={<Skeleton w='full' h='full' />}
          />
        </AspectRatio>
        <VStack p={3} spacing={1} alignItems='flex-start' flex={1} w='full'>
          <LinkOverlay href={link} isExternal w='full'>
            <Heading
              isTruncated
              size='md'
              color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
            >
              {title}
            </Heading>
          </LinkOverlay>
          <Text fontSize='sm' noOfLines={4} w='100%'>
            {excerpt}
          </Text>
          <Text
            fontSize='xs'
            color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
            textTransform='capitalize'
          >
            {tags.join(', ')}
          </Text>
        </VStack>
      </VStack>
    </LinkBox>
  );
};

export default ProjectCard;
