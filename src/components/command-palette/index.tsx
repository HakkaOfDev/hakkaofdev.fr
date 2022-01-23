import { Command } from '@/types/command';
import { createDescendantContext } from '@chakra-ui/descendant';
import {
  Flex,
  FlexProps,
  Input,
  List,
  Portal,
  StackProps,
  useColorMode,
  useColorModeValue as mode,
  useMenu,
  VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useCallback, useContext } from 'react';
import { useKeyPressEvent } from 'react-use';
import { PaletteContext } from 'src/providers/palette-provider';
import PaletteItem from './command-item';

export const [
  MenuDescendantsProvider,
  useMenuDescendantsContext,
  useMenuDescendants,
  useMenuDescendant,
] = createDescendantContext<HTMLElement>();

const backdropVariants: Variants = {
  initial: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const paletteVariants: Variants = {
  initial: {
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  enter: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const MotionFlex = motion<FlexProps>(Flex);
const MotionVStack = motion<StackProps>(VStack);

const Palette = () => {
  const {
    isOpened,
    open,
    close,
    focusedIndex,
    setFocusedIndex,
    commands,
    filterCommands,
  } = useContext(PaletteContext);
  const { descendants } = useMenu();
  const { setColorMode } = useColorMode();
  const hidePalette = useCallback(() => {
    close();
    setFocusedIndex(0);
  }, [close, setFocusedIndex]);

  useKeyPressEvent((e) => {
    if (!isOpened && e.key === 'g' && (e.metaKey || e.ctrlKey)) {
      e.stopPropagation();
      e.preventDefault();
      open();
    }
    return true;
  });

  useKeyPressEvent('ArrowDown', () => {
    const next = descendants.nextEnabled(focusedIndex);
    if (next) {
      setFocusedIndex(next.index);
      next.node.focus();
      next.node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  useKeyPressEvent('ArrowUp', () => {
    const prev = descendants.prevEnabled(focusedIndex);
    if (prev) {
      setFocusedIndex(prev.index);
      prev.node.focus();
      prev.node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  useKeyPressEvent('Escape', hidePalette);

  const backdropColor = mode('whiteAlpha.700', 'blackAlpha.700');
  const paletteBackgroundColor = mode('white', 'gray.800');

  return (
    <AnimatePresence exitBeforeEnter>
      {isOpened && (
        <Portal>
          <MotionFlex
            onClick={close}
            variants={backdropVariants}
            initial='initial'
            animate='enter'
            exit='exit'
            position='fixed'
            inset={0}
            bg={backdropColor}
            zIndex='tooltip'
            alignItems='flex-start'
            justifyContent='center'
          >
            <MotionVStack
              variants={paletteVariants}
              initial='initial'
              animate='enter'
              exit='exit'
              mt={{ base: 12, md: 24 }}
              mx={2}
              onClick={(e) => e.stopPropagation()}
              bg={paletteBackgroundColor}
              shadow='xl'
              maxW='2xl'
              maxH={{ base: '40vh', md: 'md' }}
              overflow='hidden'
              w='full'
              rounded='lg'
            >
              <Input
                placeholder='Search commands...'
                variant='flushed'
                px={4}
                py={6}
                rounded='none'
                autoFocus
                borderBottomStyle='solid'
                onChange={(e) => filterCommands(e.currentTarget.value)}
              />
              <List w='full' overflow='auto'>
                <MenuDescendantsProvider value={descendants}>
                  {commands.map((command) => {
                    const { title, icon, href, isExternal } =
                      command as Command;
                    const isThemeItem: boolean = href === undefined;

                    if (isThemeItem) {
                      return (
                        <PaletteItem
                          key={title}
                          title={title}
                          icon={icon}
                          onClick={() =>
                            setColorMode(title.split(' ', 1)[0].toLowerCase())
                          }
                        />
                      );
                    } else {
                      return (
                        <PaletteItem
                          key={title}
                          title={title}
                          icon={icon}
                          href={href}
                          isExternal={isExternal}
                        />
                      );
                    }
                  })}
                </MenuDescendantsProvider>
              </List>
            </MotionVStack>
          </MotionFlex>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default Palette;
