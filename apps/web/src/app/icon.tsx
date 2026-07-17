import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Dynamic Favicon Generation
export default function Icon() {
  return new ImageResponse(
    (
      // JSX rendering of the favicon conforming to the App's logo design
      <div
        style={{
          background: 'linear-gradient(to bottom right, #85ff00, #10b981)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Microphone capsule body (filled black to match logo) */}
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="black" />
          {/* Microphone stand arc */}
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          {/* Microphone stand stem */}
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
