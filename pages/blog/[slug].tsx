import Layout from '@/components/layout';
import MDXComponents from '@/components/mdx-components';
import { BlogPost } from '@/types/blog-post';
import { getBlogPosts, readBlogPost } from '@/utils/posts-handler';
import { Heading, Text, VStack } from '@chakra-ui/react';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

type Props = BlogPost & {
  source: MDXRemoteSerializeResult;
};

const BlogPostPage = ({ title, description, date, tags, source }: Props) => {
  return (
    <Layout title={title} description={description}>
      <VStack
        px={{ base: 4, lg: 0 }}
        py={{ base: 20 }}
        spacing={6}
        w='full'
        alignItems='stretch'
        position='relative'
      >
        <VStack spacing={0.5} alignItems='flex-start'>
          <Heading size='lg'>{title}</Heading>
          <Text color='hakka.300'>∑{tags.join(', ')}</Text>
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
      source: await serialize(content),
      title,
      description,
      date,
      tags,
      slug,
    },
  };
};

export default BlogPostPage;
