import { headers } from 'next/headers';
import { Metadata } from 'next';
import { getClient } from '@/lib/getClient';
import { ListingDetailPage as DaniDiazListingDetailPage } from '@/clients/danidiaz/pages/ListingDetailPage';
import { supabase } from '@/lib/supabase';

const baseUrl = 'https://demo-danidiaz.shortlistpass.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // Fetch listing data for OG tags
  const { data: listing } = await supabase
    .from('featured_properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!listing) {
    return {
      title: 'Property Listing | Dani Díaz',
    };
  }

  const title = `${listing.address} - $${listing.price?.toLocaleString()} | Dani Díaz`;
  const description = `${listing.beds} bed, ${listing.baths} bath property in ${listing.city}, ${listing.state}. ${listing.sqft?.toLocaleString() || ''} sq ft. Contact Dani Díaz for more info.`;
  const image = listing.images?.[0] || `${baseUrl}/dani-diaz-home-about.JPG`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/listings/${id}`,
      siteName: 'Dani Díaz Real Estate',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: listing.address,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-slate-300">We're building something amazing.</p>
      </div>
    </div>
  );
}

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'nitos') {
    // TODO: Create /clients/nitos/pages/ListingDetailPage.tsx
    return <ComingSoonPage />;
  }

  return <DaniDiazListingDetailPage />;
}
