import { supabase } from '@/lib/supabase';
import Editor from './Editor';

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const params = await searchParams;
  const slug = params.slug || 'riveroaks';

  const { data, error } = await supabase
    .from('web_clients')
    .select('slug, business_name, content')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Client &quot;{slug}&quot; not found.</p>
      </div>
    );
  }

  return (
    <Editor
      slug={data.slug}
      businessName={data.business_name || slug}
      initialContent={data.content}
    />
  );
}
