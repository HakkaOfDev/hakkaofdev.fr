import { Button, HStack, Link } from '@chakra-ui/react';
import {
  RiGithubFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterFill
} from 'react-icons/ri';

const SocialMedias = () => {
  return (
    <HStack spacing={4}>
      <Link href='https://www.github.com/hakkaofdev' isExternal>
        <Button colorScheme='pink' size='md' variant='outline'>
          <RiGithubFill />
        </Button>
      </Link>
      <Link href='https://www.linkedin.com/in/hakkaofdev' isExternal>
        <Button colorScheme='linkedin' size='md' variant='outline'>
          <RiLinkedinFill />
        </Button>
      </Link>
      <Link href='https://twitter.com/hakkaofdev' isExternal>
        <Button colorScheme='twitter' size='md' variant='outline'>
          <RiTwitterFill />
        </Button>
      </Link>
      <Link href='https://www.instagram.com/hakkaofdev/' isExternal>
        <Button colorScheme='pink' size='md' variant='outline'>
          <RiInstagramFill />
        </Button>
      </Link>
    </HStack>
  );
};

export default SocialMedias;
