import Nav from '../components/Nav';
import Hero from '../components/Hero';
import ParallaxBar from '../components/ParallaxBar';
import OurStory from '../components/OurStory';
import ParallaxGrandma from '../components/ParallaxGrandma';
import Locations from '../components/Locations';
import Gallery from '../components/Gallery';

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero backdropImage="/clients/riveroaks/riveroaks_bar.jpg" />
      <ParallaxBar />
      <OurStory />
      <ParallaxGrandma />
      <Locations />
      <Gallery />
    </main>
  );
}
