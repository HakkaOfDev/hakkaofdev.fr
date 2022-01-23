import langs from '@/data/langs';
import {
  Avatar,
  Divider,
  Heading,
  HStack,
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

const LangsCard = () => {
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
        Languages
      </Heading>
      {langs.map(({ locale, prefix, level }) => (
        <HStack key={prefix} spacing={2} w='full'>
          <Avatar name={locale} src={`/assets/images/langs/${prefix}.png`} />
          <VStack align='start' spacing={0}>
            <Heading fontSize='lg'>{locale}</Heading>
            <Divider />
            <Text>{level}</Text>
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
};

export default LangsCard;
