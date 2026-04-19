import type { Metadata } from 'next';
import { Caveat, Kalam, Shippori_Mincho } from 'next/font/google';
import { DashboardShell } from './components/DashboardShell';

const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });
const kalam = Kalam({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-kalam' });
const shippori = Shippori_Mincho({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-shippori' });

export const metadata: Metadata = {
  title: 'Grow With Gia · Dashboard',
  description: 'Teacher admin dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${caveat.variable} ${kalam.variable} ${shippori.variable}`}>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
