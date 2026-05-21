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

  // Temporary debug — remove after verifying DB pipe works
  console.log('[RiverOaks] dbContent received?', !!dbContent);
  console.log('[RiverOaks] hero.subtitle:', c.hero?.subtitle);

  return (
    <main>
      {/* Temporary debug indicator — remove after verification */}
      <div style={{ position: 'fixed', bottom: 8, left: 8, zIndex: 9999, background: dbContent ? 'lime' : 'red', color: '#000', padding: '4px 8px', fontSize: 11, borderRadius: 4, opacity: 0.9 }}>
        {dbContent ? 'DB' : 'FILE'}
      </div>
      <Nav />
      <Hero hero={c.hero} backdropImage={c.hero.backdropImage} />
      <ParallaxBar />
      <OurStory />
      <ParallaxGrandma />
      <Locations />
      <Gallery />
    </main>
  );
}
