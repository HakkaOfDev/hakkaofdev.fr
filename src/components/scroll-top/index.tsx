import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiArrowToTop } from 'react-icons/bi';

const ScrollToTopButton = () => {
  const [showScrollToTop, setScrollToTop] = useState(false);
  const bgColor = useColorModeValue('gray.100', 'gray.600');

  const updateScrollToTop = () => {
    if (window.pageYOffset > 300) {
      setScrollToTop(true);
    } else {
      setScrollToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScrollToTop);

    return () => {
      window.removeEventListener('scroll', updateScrollToTop);
    };
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {showScrollToTop && (
        <IconButton
          position='fixed'
          bg={bgColor}
          bottom={{ base: 5, md: 10 }}
          right={{ base: 5, md: 10 }}
          rounded='full'
          aria-label='Back to the top'
          size='lg'
          zIndex='tooltip'
          onClick={scrollTop}
          icon={<BiArrowToTop />}
        />
      )}
    </>
  );
};

export default ScrollToTopButton;
