import Nav from '../components/Nav';
import Hero from '../components/Hero';
import ParallaxBar from '../components/ParallaxBar';
import OurStory from '../components/OurStory';
import ParallaxGrandma from '../components/ParallaxGrandma';
import Locations from '../components/Locations';
import Gallery from '../components/Gallery';
import content from '../content';

type HomePageProps = {
  dbContent?: Record<string, any>;
};

export default function HomePage({ dbContent }: HomePageProps) {
  const c = dbContent ?? content;

  return (
    <main>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />
      <Hero hero={c.hero} backdropImage={c.hero.backdropImage} />
      <ParallaxBar parallaxBar={c.parallaxBar} />
      <OurStory story={c.story} />
      <ParallaxGrandma parallaxGrandma={c.parallaxGrandma} />
      <Locations locations={c.locations} seo={c.seo} businessName={c.businessName} />
      <Gallery gallery={c.gallery} />
    </main>
  );
}
