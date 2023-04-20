import AboutHero from '@/components/about-hero';
import DegreeCard from '@/components/degree-card';
import ExperienceCard from '@/components/experience-card';
import ExtraCard from '@/components/extra-card';
import LangsCard from '@/components/langs-card';
import Layout from '@/components/layout';
import Quote from '@/components/quote';
import Scene from '@/components/scene';
import ScrollIDButton from '@/components/scroll-id-button';
import ScrollToTopButton from '@/components/scroll-top';
import SkillCard from '@/components/skill-card';
import degrees from '@/data/degrees';
import experiences from '@/data/experiences';
import interests from '@/data/interests';
import qualities from '@/data/qualities';
import { Raindrop } from '@/types/raindrop';
import { getRaindrops } from '@/utils/raindrop-handler';
import {
  Button,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import { AiOutlineMail, AiOutlineRightCircle } from 'react-icons/ai';

type Props = {
  skills: Raindrop[];
  tags: string[];
};

const AboutPage = ({ skills, tags }: Props) => {
  const [displayedSkills, setDisplayedSkills] = useState<Raindrop[]>(
    skills.filter(({ tags }) => tags.includes('framework'))
  );
  const [selectedTag, setSelectedTag] = useState('framework');

  const filterSkills = (tag: string) => {
    setDisplayedSkills(skills.filter(({ tags }) => tags.includes(tag)));
    setSelectedTag(tag);
  };

  return (
    <Layout
      title='About'
      description='Discover who I am, my passions, my qualities, my spoken languages, my professional experiences, my skills and my background.'
    >
      <VStack maxW='full' py={{ base: 20, md: 0 }} px={2}>
        <AboutHero />
        <Scene
          id='skills'
          number={2}
          summaryTitle='What I learned'
          title='My skills'
          align='start'
        >
          <Text align='center' color='gray.500'>
            I was able to learn these skills mainly by{' '}
            <strong>self-taught</strong> and
            <strong> autonomously</strong>
            <br />
            but also from some of my experiences.{' '}
            <ScrollIDButton text="Check'em" id='experiences' />
          </Text>
          <Wrap justify='center' spacing={2}>
            {tags.map((tag) => (
              <WrapItem key={tag}>
                <Button
                  textTransform='uppercase'
                  size='xs'
                  colorScheme='hakka'
                  variant={selectedTag === tag ? 'solid' : 'ghost'}
                  onClick={() => filterSkills(tag)}
                >
                  {tag}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
          <SimpleGrid
            columns={{ base: 2, sm: 3, md: 4 }}
            gap={6}
            p={2}
            alignItems='stretch'
            as='section'
          >
            {displayedSkills.map(({ title, excerpt, cover, link, tags }) => (
              <SkillCard
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
        <Scene
          id='experiences'
          number={3}
          summaryTitle='Where I Worked'
          title='Work Experience'
          align='end'
        >
          <Text align='center' color='gray.500'>
            Between delivering pizzas in the summer and being the president of
            an association, <br />I did some jobs to discover{' '}
            <strong>the professional world</strong>.{' '}
            <ScrollIDButton text="See my certif's" id='degrees' />
          </Text>
          <VStack spacing={6}>
            {experiences.map(({ title, company, date, location, tasks }) => (
              <ExperienceCard
                key={company}
                title={title}
                company={company}
                date={date}
                location={location}
                tasks={tasks}
              />
            ))}
          </VStack>
        </Scene>
        <Scene
          id='degrees'
          number={4}
          summaryTitle='School curriculum'
          title='Degrees & Certifications'
          align='start'
        >
          <Text align='center' color='gray.500'>
            <strong>Student</strong> in Networks and Telecommunications and{' '}
            <strong>Software Engineer</strong>, <br />I base myself on
            principles and values which are for me fundamental{' '}
            <strong>to success</strong>.<br />{' '}
            <ScrollIDButton text='More details' id='details' />
          </Text>
          <Quote
            quote="Act with kindness, but don't expect recognition."
            author='Confucius'
          />
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            {degrees.map(({ title, date, location, icon, details }) => (
              <DegreeCard
                key={title}
                title={title}
                date={date}
                location={location}
                icon={icon}
                details={details}
              />
            ))}
          </Stack>
        </Scene>
        <Scene
          id='details'
          number={5}
          summaryTitle='Little extra'
          title='More details'
          align='end'
        >
          <Text align='center' color='gray.500'>
            <strong>Sporty</strong> and <strong>passionate</strong> about
            computers and new technologies. <br />
            <strong>Serious</strong> and <strong>determined</strong>, I have the
            qualities of adaptation essential <strong>to satisfy you</strong>.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            <ExtraCard title='Qualities' extras={qualities} />
            <LangsCard />
            <ExtraCard title='Interests' extras={interests} />
          </Stack>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify='center'
            align='center'
          >
            <Button
              colorScheme='hakka'
              variant='outline'
              leftIcon={<AiOutlineMail />}
              onClick={() =>
                window.open('mailto:alexandre.gossard.pro@gmail.com')
              }
            >
              alexandre.gossard.pro@gmail.com
            </Button>
            <Link href='/lib/resume.pdf' isExternal>
              <Button
                rightIcon={<AiOutlineRightCircle />}
                colorScheme='hakka'
                variant='solid'
              >
                See my resume
              </Button>
            </Link>
          </Stack>
        </Scene>
      </VStack>
      <ScrollToTopButton />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const skills = await getRaindrops(
    process.env.RAINDROP_COLLECTION_SKILLS,
    50,
    0
  );
  const tags = Array.from(new Set(skills.flatMap(({ tags }) => tags)));

  const props = { skills, tags };

  return {
    props,
    revalidate: 60 * 60,
  };
};

export default AboutPage;
