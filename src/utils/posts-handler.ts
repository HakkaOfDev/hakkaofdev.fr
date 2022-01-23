import { BlogPost } from '@/types/blog-post';
import { promises as fs } from 'fs';
import matter from 'gray-matter';
import path from 'path';

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const result: BlogPost[] = [];
  const dir = path.join(process.cwd(), './blog-posts');
  const blogPosts = await fs.readdir(dir);

  await Promise.all(
    blogPosts.map(async (post) => {
      const postPath = path.join(dir, post, 'index.mdx');
      const slug = post.replace('.mdx', '');

      const fileContent = await fs.readFile(postPath, 'utf8');

      const {
        data: { title, description, date, tags },
      } = matter(fileContent);

      result.push({
        title,
        description,
        date,
        tags,
        slug,
      });
    })
  );

  return result.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};

export const readBlogPost = async (slug: string) => {
  const blogPath = path.join(process.cwd(), './blog-posts/', slug, 'index.mdx');
  return await fs.readFile(blogPath, 'utf8');
};
