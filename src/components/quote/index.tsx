import { Text, TextProps } from '@chakra-ui/react';

type Props = {
  quote: string;
  author: string;
  props?: TextProps;
};

const Quote = ({ quote, author, ...props }: Props) => {
  return (
    <Text align='center' color='gray.500' {...props}>
      “<strong>{quote}</strong>”<em> {author}</em>
    </Text>
  );
};

export default Quote;
