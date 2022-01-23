import { Text } from '@chakra-ui/react';

type Props = {
  quote: string;
  author: string;
};

const Quote = ({ quote, author }: Props) => {
  return (
    <Text as='span'>
      “<strong>{quote}</strong>”<em> {author}</em>
    </Text>
  );
};

export default Quote;
