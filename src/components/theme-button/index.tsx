import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { BsMoon } from '@react-icons/all-files/bs/BsMoon';
import { WiDaySunny } from '@react-icons/all-files/wi/WiDaySunny';
import { AnimatePresence, motion, Variants } from 'framer-motion';

const variants: Variants = {
  initial: {
    y: -20,
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 0.2,
    },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 0.2,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 0.2,
    },
  },
};

const ThemeButton = () => {
  const { toggleColorMode } = useColorMode();

  const MotionButton = motion<IconButtonProps>(IconButton);

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <MotionButton
        style={{ display: 'inline-flex' }}
        variants={variants}
        key={mode('light', 'dark')}
        initial='initial'
        animate='animate'
        exit='exit'
        aria-label='Toggle theme'
        colorScheme={mode('purple', 'orange')}
        icon={mode(<BsMoon />, <WiDaySunny />)}
        onClick={toggleColorMode}
      />
    </AnimatePresence>
  );
};

export default ThemeButton;
