import { Experience } from '@/types/experience';
import {
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  SkeletonCircle,
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

const ExperienceCard = ({
  title,
  company,
  date,
  location,
  tasks,
}: Experience) => {
  return (
    <VStack
      w='full'
      p={4}
      align='start'
      bgColor={mode(LIGHT_CARD_COLOR, DARK_CARD_COLOR)}
      rounded='lg'
      spacing={1}
    >
      <HStack>
        <SkeletonCircle
          startColor={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
          size='5'
        />
        <Text
          textTransform='uppercase'
          fontWeight='thin'
          color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
        >
          {date}
        </Text>
      </HStack>
      <Heading fontSize='xl'>{title}</Heading>
      <Text fontSize='md'>
        <strong>{company}</strong>
        <Text as='span' color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}>
          {' '}
          •{' '}
        </Text>
        <em>{location}</em>
      </Text>
      <List spacing={1}>
        {tasks.map(({ task, icon }) => (
          <ListItem key={task} fontSize='sm'>
            <ListIcon
              as={icon}
              color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
            />
            {task}
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default ExperienceCard;
