import { Button } from '@chakra-ui/react';
import { HiOutlineArrowNarrowDown } from 'react-icons/hi';

const ScrollIDButton = ({ text, id }) => {
  const scrollTo = (id) => {
    document.querySelector(`#${id}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  return (
    <Button
      display='inline'
      rightIcon={<HiOutlineArrowNarrowDown />}
      colorScheme='hakka'
      variant='link'
      onClick={() => scrollTo(id)}
    >
      {text}
    </Button>
  );
};

export default ScrollIDButton;
