import { Command } from '@/types/command';
import {
  HStack,
  Icon,
  ListItem,
  Text,
  useColorModeValue as mode,
  useMenuDescendant,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef } from 'react';
import { AiOutlineEnter } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';
import { useKeyPressEvent } from 'react-use';
import { PaletteContext } from 'src/providers/palette-provider';

const PaletteItem = ({ title, icon, href, isExternal, onClick }: Command) => {
  const { focusedIndex, close } = useContext(PaletteContext);
  const { register, index } = useMenuDescendant();
  const ref = useRef<HTMLLIElement>();
  const router = useRouter();

  const hoverBg = mode('blackAlpha.50', 'whiteAlpha.50');
  const isFocused = focusedIndex === index;

  useEffect(() => {
    if (ref && ref.current) {
      register(ref.current);
    }
  }, [ref, register]);

  useKeyPressEvent('Enter', () => {
    if (isFocused) {
      activateItem();
    }
  });

  const activateItem = () => {
    if (href) {
      if (isExternal) {
        window.open(href, 'blank');
      } else {
        router.push(href, href);
      }
    } else if (onClick) {
      onClick?.();
    }
    close();
  };

  return (
    <ListItem
      ref={ref}
      p={3}
      cursor='pointer'
      _hover={{ bg: hoverBg }}
      bg={isFocused ? hoverBg : 'transparent'}
      onClick={activateItem}
    >
      <HStack w='full' justify='space-between'>
        <HStack spacing={2}>
          <Icon as={icon} />
          <Text>{title}</Text>
          {isExternal && <Icon as={FiExternalLink} display='inline' />}
        </HStack>
        {isFocused && <Icon as={AiOutlineEnter} display='inline' />}
      </HStack>
    </ListItem>
  );
};

export default PaletteItem;
