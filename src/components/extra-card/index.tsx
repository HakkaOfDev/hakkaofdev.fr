import { Extra } from '@/types/extra';
import {
  Heading,
  List,
  ListIcon,
  ListItem,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';
import {
  DARK_BLUE_COLOR,
  DARK_CARD_COLOR,
  LIGHT_BLUE_COLOR,
  LIGHT_CARD_COLOR,
} from 'src/constants';

type Props = {
  title: string;
  extras: Extra[];
};

const ExtraCard = ({ title, extras }: Props) => {
  return (
    <VStack
      spacing={4}
      p={6}
      rounded='lg'
      boxShadow='lg'
      bg={mode(LIGHT_CARD_COLOR, DARK_CARD_COLOR)}
    >
      <Heading
        fontSize='2xl'
        borderBottom='2px solid'
        borderBottomColor={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
        pb={2}
      >
        {title}
      </Heading>
      <List spacing={1}>
        {extras.map(({ icon, text }) => (
          <ListItem key={text}>
            <ListIcon
              as={icon}
              color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
            />
            {text}
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default ExtraCard;
