import { Heading, StackProps, VStack } from '@chakra-ui/react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { PropsWithChildren, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import SummaryTitle from '../summary-title';

const variants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

type Props = PropsWithChildren<{
  id?: string;
  number: number;
  title: string;
  summaryTitle: string;
  align: string;
}>;

const MotionStack = motion<StackProps>(VStack);

const Scene = ({ children, id, number, title, summaryTitle, align }: Props) => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start('visible');
    } else {
      animation.start('hidden');
    }
  }, [animation, inView]);

  return (
    <MotionStack
      id={id}
      variants={variants}
      initial='hidden'
      animate={animation}
      ref={ref}
      as='section'
      spacing={3}
      minH='100vh'
      w='full'
      py={20}
    >
      <VStack spacing={-2} align={align}>
        <SummaryTitle number={number} title={summaryTitle} />
        <Heading as='h1' textTransform='uppercase'>
          {title}
        </Heading>
      </VStack>
      {children}
    </MotionStack>
  );
};

export default Scene;
