import { Text, useColorModeValue as mode, VStack } from '@chakra-ui/react';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';

const DesktopCopyright = () => {
  return (
    <VStack fontSize='lg' fontWeight='thin' transform='rotate(180deg)'>
      <Text transform='rotate(90deg)'>©</Text>
      <Text sx={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
        {new Date().getFullYear() + ' '}
        <Text as='span' color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}>
          Alexandre Gossard
        </Text>
        .
      </Text>
    </VStack>
  );
};

export default DesktopCopyright;
