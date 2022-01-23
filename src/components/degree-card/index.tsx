import { Degree } from '@/types/degree';
import {
  Box,
  Heading,
  HStack,
  Icon,
  ListItem,
  Text,
  UnorderedList,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';
import {
  DARK_BLUE_COLOR,
  DARK_CARD_COLOR,
  LIGHT_BLUE_COLOR,
  LIGHT_CARD_COLOR,
} from 'src/constants';

const DegreeCard = ({ title, date, location, icon, details }: Degree) => {
  return (
    <Box
      p={4}
      w='100%'
      rounded='lg'
      bg={mode(LIGHT_CARD_COLOR, DARK_CARD_COLOR)}
      boxShadow='lg'
    >
      <HStack spacing={6}>
        <Icon
          as={icon}
          color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
          boxSize='12'
        />
        <VStack spacing={1} align='start'>
          <Heading fontSize='lg'>{title}</Heading>
          <Text fontWeight='light'>
            {date} •<em> {location}</em>
          </Text>
          <UnorderedList>
            {details.map((detail) => (
              <ListItem key={detail}>{detail}</ListItem>
            ))}
          </UnorderedList>
        </VStack>
      </HStack>
    </Box>
  );
};

export default DegreeCard;
