import easterEggs from '@/data/eastereggs';
import { EasterEgg } from '@/types/easter-egg';
import {
  Button,
  Divider,
  Heading,
  Image,
  Skeleton,
  Stack,
  StackProps,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue as mode,
  useToast,
  VStack
} from '@chakra-ui/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';
import ScrollIDButton from '../scroll-id-button';
import SocialMedias from '../social-medias';
import SummaryTitle from '../summary-title';

const leftVariants: Variants = {
  hidden: {
    x: -30,
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.5,
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const avatarVariants: Variants = {
  hidden: {
    y: 30,
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.8,
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const rightVariants: Variants = {
  hidden: {
    x: 30,
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.5,
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

const MotionStack = motion<StackProps>(VStack);

const AboutHero = () => {
  const toast = useToast();
  const [index, setIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const sendEasterEgg = () => {
    const { title, description } = easterEggs[index] as EasterEgg;

    toast({
      title: title,
      description: description,
      position: 'bottom-right',
      variant: isMobile ? 'solid' : 'left-accent',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });

    if (index + 1 === easterEggs.length) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <AnimatePresence mode='wait'>
      <Stack
        w='100%'
        minH='100vh'
        justify='center'
        align='center'
        spacing={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <MotionStack
          variants={leftVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          w={{ base: '100%', md: '33%' }}
          spacing={8}
          align={{ base: 'center', md: 'start' }}
        >
          <Heading
            as='h1'
            fontSize='4xl'
            textAlign={{ base: 'center', md: 'left' }}
            lineHeight='6'
          >
            Alexandre Gossard
            <Text
              as='span'
              fontSize='5rem'
              color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
            >
              .
            </Text>
          </Heading>
          <Divider
            w={10}
            borderWidth={4}
            borderColor={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
          />
          <SocialMedias />
        </MotionStack>
        <MotionStack
          variants={avatarVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          spacing={-1}
          w={{ base: '100%', md: '34%' }}
        >
          <Image
            alt='Avatar image'
            h={{ base: 480, lg: 600 }}
            fit='cover'
            src='/assets/images/avatar-about.png'
            fallback={<Skeleton h={{ base: 480, lg: 600 }} />}
          />
          <Tooltip label='See easter eggs...' hasArrow>
            <Button
              w='75%'
              variant='solid'
              colorScheme='hakka'
              onClick={sendEasterEgg}
            >
              Software Enginner
            </Button>
          </Tooltip>
        </MotionStack>
        <MotionStack
          variants={rightVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          w={{ base: '100%', md: '33%' }}
          spacing={4}
          align={{ base: 'center', md: 'end' }}
        >
          <VStack
            spacing={-2}
            color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
            align={{ base: 'center', md: 'end' }}
          >
            <SummaryTitle number={1} title='Introduction' />
            <Heading fontSize='3xl'>Enthusiast Developer</Heading>
          </VStack>
          <Text color='gray.500' textAlign={{ base: 'center', md: 'end' }}>
            A passionate <strong>developer</strong> having an experience of
            building <strong>smart</strong> and <strong>scalable</strong>{' '}
            websites with a great <strong>user experience</strong>.
          </Text>
          <ScrollIDButton text='Learn more' id='skills' />
        </MotionStack>
      </Stack>
    </AnimatePresence>
  );
};

export default AboutHero;
