import HomeHero from '@/components/home-hero';
import Layout from '@/components/layout';

const IndexPage = () => {
  return (
    <Layout
      title='Home'
      description='Student by day, Software Enginner by night. I develop in order to propose different opensource contents. Click to discover me !'
    >
      <HomeHero />
    </Layout>
  );
};

export default IndexPage;
