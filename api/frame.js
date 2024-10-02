export default function handler(req, res) {
    if (req.method === 'POST') {
      const buttonIndex = req.body.untrustedData.buttonIndex;
      const stateIndex = parseInt(req.body.state?.index || '0');
  
      const images = [
        'https://ipfs.io/ipfs/QmQLpsvzjsbjFGNbyS36kfBCsjhfWe4s9nD5gB6FH5DdAm',
        'https://ipfs.io/ipfs/QmTUCCubUb51wEWAhy7m64HSWHsTK3Wdnjp7UVrASHh1F1',
        'https://ipfs.io/ipfs/QmVwxEDWazmYrzhYW4WUEoaCoJUgbvo4h6HS2RnH3bXsas'
      ];
  
      let nextIndex = buttonIndex === 1 ? Math.min(stateIndex + 1, images.length - 1) : Math.max(stateIndex - 1, 0);
  
      let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Arte Del Diablo Frame</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${images[nextIndex]}" />
      `;
  
      if (nextIndex === 0) {
        html += `<meta property="fc:frame:button:1" content="Next" />`;
      } else if (nextIndex === images.length - 1) {
        html += `
          <meta property="fc:frame:button:1" content="Back" />
          <meta property="fc:frame:button:2" content="Visit my Zora page" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta property="fc:frame:button:2:target" content="https://zora.co/@0xdiablo" />
        `;
      } else {
        html += `
          <meta property="fc:frame:button:1" content="Back" />
          <meta property="fc:frame:button:2" content="Next" />
        `;
      }
  
      html += `
            <meta property="fc:frame:post_url" content="https://test-frame-html.vercel.app/" />
            <meta property="fc:frame:state" content="${JSON.stringify({ index: nextIndex })}" />
        </head>
        <body>
            <h1>Arte Del Diablo</h1>
        </body>
        </html>
      `;
  
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }