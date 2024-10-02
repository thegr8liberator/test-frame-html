import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    const images = [
      'https://ipfs.io/ipfs/QmQLpsvzjsbjFGNbyS36kfBCsjhfWe4s9nD5gB6FH5DdAm',
      'https://ipfs.io/ipfs/QmTUCCubUb51wEWAhy7m64HSWHsTK3Wdnjp7UVrASHh1F1',
      'https://ipfs.io/ipfs/QmVwxEDWazmYrzhYW4WUEoaCoJUgbvo4h6HS2RnH3bXsas'
    ];

    const buttonIndex = body?.untrustedData?.buttonIndex || 1;
    let index = parseInt(body?.state?.index || '0');

    if (buttonIndex === 1) {
      index = Math.min(index + 1, images.length - 1);
    } else if (buttonIndex === 2) {
      index = Math.max(index - 1, 0);
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Arte Del Diablo Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${images[index]}" />
          ${index === 0 ? 
            `<meta property="fc:frame:button:1" content="Next" />` :
            index === images.length - 1 ?
            `<meta property="fc:frame:button:1" content="Back" />
             <meta property="fc:frame:button:2" content="Visit my Zora page" />
             <meta property="fc:frame:button:2:action" content="link" />
             <meta property="fc:frame:button:2:target" content="https://zora.co/@0xdiablo" />` :
            `<meta property="fc:frame:button:1" content="Back" />
             <meta property="fc:frame:button:2" content="Next" />`
          }
          <meta property="fc:frame:post_url" content="https://test-frame-html.vercel.app/" />
          <meta property="fc:frame:state" content='${JSON.stringify({ index })}' />
      </head>
      <body>
          <h1>Arte Del Diablo</h1>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error in frame handler:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
