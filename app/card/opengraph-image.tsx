import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Dani Díaz - Bilingual Realtor';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1B365D 0%, #162c4d 50%, #0f1f35 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Left side - Photo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '60px',
          }}
        >
          <div
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C4A25A 0%, #d4b46a 50%, #C4A25A 100%)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="https://demo-danidiaz.shortlistpass.com/dani-diaz-home-about.JPG"
              width="268"
              height="268"
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
              }}
            />
          </div>
        </div>

        {/* Right side - Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              fontFamily: 'serif',
            }}
          >
            Dani Díaz
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#C4A25A',
              marginBottom: '8px',
            }}
          >
            Bilingual Realtor®
          </div>
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '24px',
            }}
          >
            Faircloth Real Estate Group
          </div>
          <div
            style={{
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, #C4A25A, transparent)',
              marginBottom: '24px',
            }}
          />
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📍 Myrtle Beach, SC
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
