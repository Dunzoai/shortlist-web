import { headers } from 'next/headers';
import { Metadata } from 'next';
import { getClient } from '@/lib/getClient';
import { BlogPostPage as DaniDiazBlogPostPage } from '@/clients/danidiaz/pages/BlogPostPage';
import { BlogPostPage as KaterinaBlogPostPage } from '@/clients/katerina/pages/BlogPostPage';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  const isKaterina = client?.slug === 'katerina';
  const baseUrl = isKaterina ? 'https://katerina-demo.shortlistpass.com' : 'https://daniglobalhomes.com';
  const siteName = isKaterina ? 'Katerina Sells Florida' : 'Dani Díaz Real Estate';
  const clientId = isKaterina ? client?.id : '3c125122-f3d9-4f75-91d9-69cf84d6d20e';

  // Fetch blog post data for OG tags
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, featured_image, category')
    .eq('slug', slug)
    .eq('client_id', clientId)
    .single();

  if (!post) {
    return {
      title: `Blog | ${siteName}`,
    };
  }

  const title = `${post.title} | ${siteName}`;
  const description = post.excerpt || `Read this article from ${siteName}.`;
  const fallbackImage = isKaterina ? `${baseUrl}/placeholder-og.svg` : `${baseUrl}/dani-diaz-home-about.JPG`;
  const image = post.featured_image || fallbackImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${slug}`,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
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
    // TODO: Create /clients/nitos/pages/BlogPostPage.tsx
    return <ComingSoonPage />;
  }

  if (client?.slug === 'katerina') {
    return <KaterinaBlogPostPage />;
  }

  return <DaniDiazBlogPostPage />;
}
