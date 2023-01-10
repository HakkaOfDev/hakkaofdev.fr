import {
  Button,
  Heading,
  Stack,
  Text,
  useColorModeValue as mode
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import { BiArrowToRight } from 'react-icons/bi';
import Typed from 'react-typed';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';
import ExternalLink from '../external-link';
import HomeHeroImage from './home-hero-image';

const HomeHero = () => {
  return (
    <Stack
      align='center'
      justify='center'
      spacing={{ base: 5, md: 10 }}
      minH='100vh'
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack
        flex={1}
        spacing={{ base: 3, md: 6 }}
        flexGrow={{ base: 0, md: 1 }}
      >
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.4,
            ease: [0.15, 0.85, 0.15, 0.85],
          }}
        >
          <Heading as='h1' lineHeight={1.1} fontWeight='extrabold'>
            <Text
              as='span'
              position='relative'
              fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
              _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bgColor: mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR),
                zIndex: -1,
              }}
            >
              Alexandre Gossard
            </Text>
            <br />
            <Text
              as='span'
              color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
              fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
            >
              <Typed
                strings={['Software Enginner', 'Student', 'UI/UX Designer']}
                typeSpeed={30}
                backSpeed={40}
                backDelay={1500}
                startDelay={800}
                loop
              />
            </Text>
          </Heading>
        </motion.div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <Text
            fontSize='lg'
            color={mode('gray.800', 'gray.400')}
            as='h2'
            align='justify'
          >
            <strong>Student</strong> by day, <strong>Software Enginner</strong> by
            night. Passionate about computer science and{' '}
            <strong>new technologies</strong>, currently{' '}
            <ExternalLink href='https://nextjs.org/'>Next.js</ExternalLink> and{' '}
            <ExternalLink href='https://chakra-ui.com/'>Chakra UI</ExternalLink>
            , I develop in order to propose different{' '}
            <strong>opensource</strong> contents.
          </Text>
        </motion.div>
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <NextLink href='/portfolio' passHref>
            <Button
              rightIcon={<BiArrowToRight />}
              w={{ base: '100%', lg: '50%' }}
              size='md'
              rounded='full'
              fontWeight='normal'
              colorScheme='hakka'
              transition='ease-in-out .3s'
            >
              View my projects
            </Button>
          </NextLink>
        </motion.div>
      </Stack>
      <HomeHeroImage w={{ base: '100%', md: '50%' }} h='100%' />
    </Stack>
  );
};

export default HomeHero;
