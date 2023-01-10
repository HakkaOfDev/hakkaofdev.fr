import {
  Icon,
  Link,
  LinkProps,
  useColorModeValue as mode
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';

const ExternalLink = ({ children, ...linkProps }: LinkProps) => {
  return (
    <span>
      <Link
        {...linkProps}
        color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}
        display='inline-flex'
        isExternal
        target='_blank'
      >
        {children}
      </Link>
      <Icon
        ml={2}
        as={FiExternalLink}
        color={mode('gray.800', 'white')}
        display='inline'
      />
    </span>
  );
};

export default ExternalLink;
