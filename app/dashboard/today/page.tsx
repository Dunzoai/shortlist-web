'use client';

import { Sun, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function TodayPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
        Today
      </h1>
      <p className="text-sm mb-8" style={{ color: '#8a8078', fontFamily: 'var(--font-shippori), serif' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      <div className="space-y-6">
        {/* Upcoming sessions */}
        <div className="rounded-lg border p-5" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" style={{ color: '#A5C4D4' }} />
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Upcoming Sessions</h2>
          </div>
          <div className="text-center py-8" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No sessions scheduled today</p>
            <p className="text-xs mt-1" style={{ color: '#b8ad9f' }}>Book sessions from lead details</p>
          </div>
        </div>

        {/* Awaiting reply */}
        <div className="rounded-lg border p-5" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4" style={{ color: '#F3DFA2' }} />
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Awaiting Reply</h2>
          </div>
          <div className="text-center py-8" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>All caught up!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
