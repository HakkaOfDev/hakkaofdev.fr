import { IconButton, Tooltip } from '@chakra-ui/react';
import { useContext } from 'react';
import { FiCommand } from 'react-icons/fi';
import { PaletteContext } from 'src/providers/palette-provider';

const PaletteButton = () => {
  const { open: openPalette } = useContext(PaletteContext);
  return (
    <Tooltip label='Command Palette (Ctrl + G)' placement='bottom-end'>
      <IconButton
        display='inline-flex'
        key='Palette button'
        colorScheme='hakka'
        aria-label='Palette button'
        variant='solid'
        color='gray.600'
        icon={<FiCommand />}
        onClick={openPalette}
      />
    </Tooltip>
  );
};

export default PaletteButton;
