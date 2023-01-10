import BlogPostCard from '@/components/blog-post-card';
import Layout from '@/components/layout';
import Scene from '@/components/scene';
import { BlogPost } from '@/types/blog-post';
import { getBlogPosts } from '@/utils/posts-handler';
import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { ChangeEventHandler, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

type Props = {
  posts: BlogPost[];
};

const BlogPage = ({ posts }: Props) => {
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(posts);

  const onSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
    const query = event.currentTarget.value;

    setDisplayedPosts(
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <Layout
      title='Blog'
      description='Read what I wrote, discover tutorials and more articles about new technologies, crypto currencies and others...'
    >
      <Scene number={6} summaryTitle='What I wrote' title='My blog' align='end'>
        <Text color='gray.500'>
          See, read, explore {displayedPosts.length} posts !
        </Text>
        <InputGroup w={{ base: '100%', lg: '75%' }}>
          <InputLeftElement pointerEvents='none'>
            <Icon as={BsSearch} color='gray.400' />
          </InputLeftElement>
          <Input
            placeholder='Search posts...'
            variant='flushed'
            onChange={onSearch}
          />
        </InputGroup>
        <List spacing={3} w={{ base: '100%', lg: '75%' }}>
          {displayedPosts.map((post) => (
            <ListItem key={post.slug}>
              <BlogPostCard {...post} />
            </ListItem>
          ))}
        </List>
        {displayedPosts.length === 0 && (
          <Text>No posts found for this query.</Text>
        )}
      </Scene>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getBlogPosts();

  const props: Props = {
    posts,
  };

  return {
    props,
  };
};

export default BlogPage;
