import { Container, ContainerProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{ title: string; description: string }>;

const variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: -40,
    transition: { duration: 0.4, type: 'easeInOut' },
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.4, type: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    x: -0,
    y: 40,
    transition: { duration: 0.4, type: 'easeInOut' },
  },
};

const MotionContainer = motion<ContainerProps>(Container);

const Layout = ({ children, title, description }: LayoutProps) => {
  return (
    <>
      <NextSeo
        title={title + ' | Alexandre Gossard'}
        description={description}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@hakkaofdev',
        }}
        openGraph={{
          url: 'https://www.hakkaofdev.fr',
          title: title + ' | Alexandre Gossard',
          description: description,
          locale: 'en_US',
          images: [
            {
              url: 'https://www.hakkaofdev.fr/assets/images/social.png',
              width: 1200,
              height: 630,
              alt: 'Alexandre Gossard',
              type: 'image/png',
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <MotionContainer
        display='flex'
        maxW={{ base: 'container.lg', xl: 'container.xl' }}
        minH={{ base: 'auto', md: '100vh' }}
        px={{ base: 4, lg: 0 }}
        overflow='hidden'
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        centerContent
      >
        {children}
      </MotionContainer>
    </>
  );
};

export default Layout;
