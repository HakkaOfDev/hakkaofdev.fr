import HomeHero from '@/components/home-hero';
import Layout from '@/components/layout';

const IndexPage = () => {
  return (
    <Layout
      title='Home'
      description='Student by day, mad developer by night. I develop in order to propose different opensource contents. Come to discover me !'
    >
      <HomeHero />
    </Layout>
  );
};

export default IndexPage;
