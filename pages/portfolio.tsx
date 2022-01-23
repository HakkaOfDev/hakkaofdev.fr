import Layout from '@/components/layout';
import ProjectCard from '@/components/project-card';
import Scene from '@/components/scene';
import { Raindrop } from '@/types/raindrop';
import { getRaindrops } from '@/utils/raindrop-handler';
import {
  Button,
  SimpleGrid,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { useState } from 'react';

type Props = {
  projects: Raindrop[];
  tags: string[];
};

const PortfolioPage = ({ projects, tags }: Props) => {
  const [displayedProjects, setDisplayedProjects] =
    useState<Raindrop[]>(projects);
  const [selectedTag, setSelectedTag] = useState<string>();

  const filterProjects = (tag?: string) => {
    if (tag) {
      setDisplayedProjects(projects.filter(({ tags }) => tags.includes(tag)));
    } else {
      setDisplayedProjects(projects);
    }
    setSelectedTag(tag);
  };

  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Layout
      title='Portfolio'
      description='Discover what my projects, my librairies, my websites, my opensources works, and more with a simple click.'
    >
      <Scene
        number={0}
        summaryTitle='What I created'
        title='My Portfolio'
        align='end'
      >
        <Text fontSize='xl'>
          See what I built, what I did, and discover it with a simple click.
        </Text>
        <Wrap justify='center' spacing={2} align='center'>
          <WrapItem>
            <Button
              textTransform='uppercase'
              size={isMobile ? 'xs' : 'sm'}
              colorScheme='hakka'
              variant={!selectedTag ? 'solid' : 'ghost'}
              onClick={() => filterProjects()}
            >
              All
            </Button>
          </WrapItem>
          {tags.map((tag) => (
            <WrapItem key={tag}>
              <Button
                textTransform='uppercase'
                size={isMobile ? 'xs' : 'sm'}
                colorScheme='hakka'
                variant={selectedTag === tag ? 'solid' : 'ghost'}
                onClick={() => filterProjects(tag)}
              >
                {tag}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
        <SimpleGrid
          boxShadow='lg'
          overflowY='scroll'
          h={{ base: 500, md: 375, lg: 400 }}
          columns={{ base: 1, sm: 2, md: 3 }}
          gap={6}
          p={2}
          alignItems='stretch'
          as='section'
        >
          {displayedProjects.map(({ title, excerpt, cover, link, tags }) => (
            <ProjectCard
              key={link}
              title={title}
              excerpt={excerpt}
              cover={cover}
              link={link}
              tags={tags}
            />
          ))}
        </SimpleGrid>
      </Scene>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await getRaindrops(
    process.env.RAINDROP_COLLECTION_PROJECTS,
    50,
    0
  );
  const tags = Array.from(new Set(projects.flatMap(({ tags }) => tags)));

  const props: Props = { projects, tags };

  return {
    props,
    revalidate: 60 * 60,
  };
};

export default PortfolioPage;
