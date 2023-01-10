import Layout from '@/components/layout';
import MDXComponents from '@/components/mdx-components';
import { BlogPost } from '@/types/blog-post';
import imageMetadata from '@/utils/plugins/image-metadata';
import { getBlogPosts, readBlogPost } from '@/utils/posts-handler';
import {
  Button,
  Heading,
  Text,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import NextLink from 'next/link';
import { AiOutlineLeftCircle } from 'react-icons/ai';
import { DARK_BLUE_COLOR, LIGHT_BLUE_COLOR } from 'src/constants';

type Props = BlogPost & {
  source: MDXRemoteSerializeResult;
};

const BlogPostPage = ({ title, description, date, tags, source }: Props) => {
  return (
    <Layout title={title} description={description}>
      <VStack
        px={{ base: 4, lg: 0 }}
        pt={28}
        pb={20}
        spacing={8}
        w='full'
        alignItems='stretch'
        position='relative'
      >
        <VStack spacing={0.5} alignItems='flex-start'>
          <NextLink href='/blog' passHref>
            <Button
              variant='link'
              colorScheme='hakka'
              leftIcon={<AiOutlineLeftCircle />}
            >
              Return to blog
            </Button>
          </NextLink>
          <Heading
            size='lg'
            borderBottom='2px solid'
            pb={2}
            borderColor={mode('gray.600', 'gray.500')}
          >
            {title}
          </Heading>
          <Text color={mode(LIGHT_BLUE_COLOR, DARK_BLUE_COLOR)}>
            #{tags.join(', #')}
          </Text>
          <Text color='gray.500' fontSize='sm'>
            {date}
          </Text>
        </VStack>
        <MDXRemote {...source} components={MDXComponents} />
      </VStack>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getBlogPosts();

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params.slug as string;
  const post = await readBlogPost(slug);

  const {
    content,
    data: { title, description, date, tags },
  } = matter(post);

  return {
    props: {
      source: await serialize(content, {
        mdxOptions: {
          rehypePlugins: [imageMetadata],
        },
      }),
      title,
      description,
      date,
      tags,
      slug,
    },
  };
};

export default BlogPostPage;
