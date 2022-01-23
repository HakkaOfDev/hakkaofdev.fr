import status from '@/data/status';
import {
  HStack,
  StackProps,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';

const StatusIndicator = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  let stackStyles: StackProps;

  if (isMobile) {
    stackStyles = {
      width: 'fit-content',
      shadow: 'lg',
      spacing: 3,
    };
  } else {
    stackStyles = {
      width: 10,
      shadow: 'none',
      spacing: 0,
    };
  }

  return (
    <HStack
      _hover={{
        width: 'fit-content',
        shadow: 'lg',
      }}
      position='absolute'
      overflow='hidden'
      bottom={-5}
      marginLeft='auto'
      border='2px solid'
      borderColor={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
      height={10}
      alignItems='center'
      justifyContent='center'
      bg={mode('gray.400', '#2d3142')}
      rounded='3xl'
      px={2}
      role='group'
      transitionProperty='all'
      transitionDuration='slow'
      transitionTimingFunction='ease-out'
      {...stackStyles}
    >
      <Text>{status.emoji}</Text>
      <Text
        isTruncated
        width={0}
        maxWidth='full'
        opacity={0}
        transitionProperty='opacity'
        transitionDuration='slow'
        transitionTimingFunction='ease-out'
        _groupHover={{
          opacity: 1,
          width: 'fit-content',
          marginLeft: 3,
        }}
        sx={{
          '@media(hover: none)': {
            opacity: 1,
            width: 'fit-content',
            marginLeft: 3,
          },
        }}
      >
        {status.text}
      </Text>
    </HStack>
  );
};

export default StatusIndicator;
