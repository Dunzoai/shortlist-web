import Nav from '../components/Nav';
import PizzaMenu from '../components/PizzaMenu';
import content from '../content';

type MenuPageProps = {
  dbContent?: Record<string, any>;
};

export default function MenuPage({ dbContent }: MenuPageProps) {
  const c = dbContent ?? content;

  return (
    <main className="bg-[#0a0807] min-h-screen">
      <Nav nav={c.nav} brandLabel={c.brandLabel} />
      <PizzaMenu menu={c.menu} />
    </main>
  );
}
