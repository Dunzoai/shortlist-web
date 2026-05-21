'use client';

import { EditModeProvider } from './EditModeContext';
import EditToolbar from './components/EditToolbar';
import NavEdit from './sections/NavEdit';
import HeroEdit from './sections/HeroEdit';
import ParallaxBarEdit from './sections/ParallaxBarEdit';
import StoryEdit from './sections/StoryEdit';
import ParallaxGrandmaEdit from './sections/ParallaxGrandmaEdit';
import LocationsEdit from './sections/LocationsEdit';
import GalleryEdit from './sections/GalleryEdit';
import MenuEdit from './sections/MenuEdit';
import OrderEdit from './sections/OrderEdit';

type Props = {
  slug: string;
  businessName: string;
  initialContent: Record<string, any>;
};

export default function EditShell({ slug, businessName, initialContent }: Props) {
  return (
    <EditModeProvider slug={slug} initialContent={initialContent}>
      {/* Internal banner */}
      <div className="bg-amber-600 text-black text-center py-2 text-xs font-bold tracking-wide z-[9999] relative">
        INTERNAL EDITOR — {businessName} ({slug})
      </div>

      {/* The actual site, rendered with edit affordances */}
      <main>
        <NavEdit />
        <HeroEdit />
        <ParallaxBarEdit />
        <StoryEdit />
        <ParallaxGrandmaEdit />
        <LocationsEdit />
        <GalleryEdit />

        {/* Menu + Order are normally separate pages, but included here for editing */}
        <div className="bg-gray-900 py-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            — Menu Page Content —
          </span>
        </div>
        <MenuEdit />

        <div className="bg-gray-900 py-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            — Order Page Content —
          </span>
        </div>
        <OrderEdit />
      </main>

      <EditToolbar />

      {/* Animation for popup slide-up */}
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </EditModeProvider>
  );
}
