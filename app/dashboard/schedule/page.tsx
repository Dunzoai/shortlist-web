'use client';

import { useState } from 'react';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM - 7 PM

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
          Schedule
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="p-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: '#d9cfbf' }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: '#5b544c' }} />
          </button>
          <span className="text-sm px-3" style={{ color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}>
            {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="p-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: '#d9cfbf' }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#5b544c' }} />
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b" style={{ borderColor: '#d9cfbf' }}>
          <div className="p-2 text-[10px] uppercase" style={{ color: '#8a8078', fontFamily: 'monospace' }} />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="p-2 text-center border-l"
              style={{ borderColor: '#d9cfbf', background: isSameDay(day, new Date()) ? '#F5C6A015' : 'transparent' }}
            >
              <p className="text-[10px] uppercase" style={{ color: '#8a8078', fontFamily: 'monospace' }}>{format(day, 'EEE')}</p>
              <p className="text-lg font-bold" style={{ color: isSameDay(day, new Date()) ? '#F5C6A0' : '#2b2722', fontFamily: 'var(--font-caveat), cursive' }}>
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        {/* Hour rows */}
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b last:border-0" style={{ borderColor: '#d9cfbf20' }}>
            <div className="p-2 text-[10px] text-right pr-3" style={{ color: '#b8ad9f', fontFamily: 'monospace' }}>
              {hour > 12 ? `${hour - 12}p` : hour === 12 ? '12p' : `${hour}a`}
            </div>
            {days.map((day) => (
              <div
                key={`${day.toISOString()}-${hour}`}
                className="border-l min-h-[40px]"
                style={{ borderColor: '#d9cfbf20' }}
              />
            ))}
          </div>
        ))}
      </div>

      <p className="text-xs text-center mt-4" style={{ color: '#b8ad9f', fontFamily: 'var(--font-kalam), cursive' }}>
        <Calendar className="w-3 h-3 inline mr-1" />
        Sessions will appear here when booked from lead details
      </p>
    </div>
  );
}
