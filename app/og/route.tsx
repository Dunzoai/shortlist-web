import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET() {
  // Read Gia's photo as base64
  const photoPath = join(process.cwd(), 'public', 'clients', 'Gia', 'gia_about.jpeg');
  const photoBuffer = await readFile(photoPath);
  const photoBase64 = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF5EF',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background petals — decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -60,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: '#F2A1B3',
            opacity: 0.15,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: '#8DD3D6',
            opacity: 0.12,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: '#C6B4E2',
            opacity: 0.1,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 200,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: '#F0D264',
            opacity: 0.1,
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 60,
            padding: '0 80px',
            position: 'relative',
          }}
        >
          {/* Photo */}
          <div
            style={{
              width: 280,
              height: 340,
              borderRadius: 32,
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoBase64}
              alt="Gia"
              width={280}
              height={340}
              style={{
                width: 280,
                height: 340,
                objectFit: 'cover',
              }}
            />
            {/* Lavender accent behind photo */}
            <div
              style={{
                position: 'absolute',
                bottom: -8,
                right: -8,
                width: 280,
                height: 340,
                borderRadius: 32,
                background: '#C6B4E2',
                opacity: 0.2,
                zIndex: -1,
                display: 'flex',
              }}
            />
          </div>

          {/* Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: '-1px',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: '#E88BA0' }}>G</span>
              <span style={{ color: '#6BBFC4' }}>r</span>
              <span style={{ color: '#D4A843' }}>o</span>
              <span style={{ color: '#A08EC8' }}>w</span>
              <span style={{ color: '#E88BA0' }}>i</span>
              <span style={{ color: '#6BBFC4' }}>n</span>
              <span style={{ color: '#D4A843' }}>g</span>
              <span style={{ color: '#A08EC8', marginLeft: 16 }}>W</span>
              <span style={{ color: '#E88BA0' }}>i</span>
              <span style={{ color: '#6BBFC4' }}>t</span>
              <span style={{ color: '#D4A843' }}>h</span>
              <span style={{ color: '#A08EC8', marginLeft: 16 }}>G</span>
              <span style={{ color: '#E88BA0' }}>i</span>
              <span style={{ color: '#6BBFC4' }}>a</span>
            </div>

            <div
              style={{
                fontSize: 28,
                color: '#6B7280',
                marginTop: 4,
                display: 'flex',
              }}
            >
              Personalized Tutoring
            </div>

            <div
              style={{
                fontSize: 18,
                color: '#9CA3AF',
                marginTop: 16,
                lineHeight: 1.5,
                maxWidth: 450,
                display: 'flex',
              }}
            >
              Every student can grow.
            </div>

            {/* Color dots */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 24,
              }}
            >
              {['#F2A1B3', '#8DD3D6', '#F0D264', '#C6B4E2', '#7BC8A4'].map((color) => (
                <div
                  key={color}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: color,
                    display: 'flex',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
