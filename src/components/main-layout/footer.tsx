import { Box } from '@chakra-ui/react';
import DesktopCopyright from '../copyright';
import MobileCopyright from '../copyright/mobile-copyright';

const Footer = () => {
  return (
    <>
      <Box
        as='footer'
        position='fixed'
        display={{ base: 'none', lg: 'inline' }}
        bottom={5}
        left={5}
      >
        <DesktopCopyright />
      </Box>
      <Box
        as='footer'
        display={{ base: 'inline', lg: 'none' }}
        position={{ base: 'absolute' }}
        w='full'
        transform='translateY(-30px)'
      >
        <MobileCopyright />
      </Box>
    </>
  );
};

export default Footer;
