import { supabase } from '@/lib/supabase';

async function getClientData() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', 'danidiaz')
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    return null;
  }

  return data;
}

export default async function Home() {
  const client = await getClientData();

  const primaryColor = client?.primary_color || '#1B365D';
  const secondaryColor = client?.secondary_color || '#C9A227';
  const accentColor = client?.accent_color || '#FFFFFF';

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-lora)]"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="font-[family-name:var(--font-playfair)] text-xl font-semibold"
            style={{ color: accentColor }}
          >
            {client?.business_name || 'Dani Díaz Realty'}
          </div>
          <ul className="flex gap-8 text-sm tracking-wide">
            {['Home', 'Buyers', 'Sellers', 'About', 'Blog'].map((item) => (
              <li key={item}>
                <a
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="transition-colors hover:opacity-80"
                  style={{ color: accentColor }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <h1
          className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl font-bold mb-4"
          style={{ color: accentColor }}
        >
          {client?.name || 'Dani Díaz'}
        </h1>
        <p
          className="text-xl md:text-2xl mb-6 tracking-wide"
          style={{ color: secondaryColor }}
        >
          {client?.business_name || 'Bilingual Realtor'}
        </p>
        <p
          className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic"
          style={{ color: accentColor }}
        >
          From Global Roots to Local Roofs
        </p>
      </main>
    </div>
  );
}
