import React from 'react';
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

function truncate(s: string, n: number) {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';
  const apiOrigin = url.origin;

  let vendor: any | null = null;
  if (id) {
    try {
      const r = await fetch(`${apiOrigin}/api/vendors/approved?id=${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' },
      });
      if (r.ok) {
        const data = await r.json();
        vendor = data?.vendor || null;
      }
    } catch {
      // ignore
    }
  }

  const name = vendor?.name ? String(vendor.name) : 'Amari Vendor';
  const category = vendor?.category ? String(vendor.category) : 'Wedding Vendor';
  const location = vendor?.location ? String(vendor.location) : 'Diani Beach, Kenya';
  const imageUrl = vendor?.imageUrl ? String(vendor.imageUrl) : `${apiOrigin}/beach.jpeg`;

  const Root = React.createElement(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'row',
        background: '#0b0a07',
        color: '#fff',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          width: '480px',
          height: '630px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#111',
        },
      },
      React.createElement('img', {
        src: imageUrl,
        style: {
          width: '480px',
          height: '630px',
          objectFit: 'cover',
          opacity: 0.92,
        },
      }),
      React.createElement('div', {
        style: {
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.05) 100%), linear-gradient(0deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.25) 100%)',
        },
      })
    ),
    React.createElement(
      'div',
      {
        style: {
          flex: 1,
          padding: '70px 72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        React.createElement(
          'div',
          {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              width: 'fit-content',
              fontSize: '18px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.86)',
              fontWeight: 700,
            },
          },
          'AMARI EXPERIENCE'
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
          React.createElement(
            'div',
            { style: { fontSize: '64px', fontWeight: 800, lineHeight: 1.05 } },
            truncate(name, 38)
          ),
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '28px',
                color: 'rgba(255,255,255,0.82)',
                fontWeight: 600,
              },
            },
            React.createElement('div', null, truncate(category, 54)),
            React.createElement(
              'div',
              { style: { fontSize: '24px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 } },
              truncate(location, 60)
            )
          )
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        React.createElement(
          'div',
          {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 22px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #c9a76b 0%, #8b6f47 100%)',
              color: '#120e07',
              fontSize: '26px',
              fontWeight: 800,
              width: 'fit-content',
            },
          },
          'View Full Profile'
        ),
        React.createElement(
          'div',
          { style: { fontSize: '18px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.4 } },
          "Kenya's premier destination wedding platform — Diani Beach."
        )
      )
    )
  );

  return new ImageResponse(Root, {
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
