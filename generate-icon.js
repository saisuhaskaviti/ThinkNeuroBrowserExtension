const { Jimp } = require('jimp');

async function makeIcon(size, outPath) {
  const img = new Jimp({ width: size, height: size, color: 0xF7F9EFFF });

  const cx = size / 2, cy = size / 2;
  const blobR = size * 0.42;
  const blobColor = 0xC8E158FF;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const rx = Math.abs(x - cx), ry = Math.abs(y - cy);
      const cornerR = size * 0.22;
      const isInside = (rx <= size/2 - cornerR || ry <= size/2 - cornerR) &&
        Math.sqrt(Math.max(0, rx - (size/2 - cornerR))**2 + Math.max(0, ry - (size/2 - cornerR))**2) <= cornerR;

      if (!isInside) {
        img.setPixelColor(0x00000000, x, y);
        continue;
      }

      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < blobR) {
        img.setPixelColor(blobColor, x, y);
      }
    }
  }

  const barW  = Math.ceil(size * 0.09);
  const barH  = Math.ceil(size * 0.32);
  const barY  = Math.floor(cy - barH / 2);
  const bar1X = Math.floor(cx - barW - size * 0.06);
  const bar2X = Math.floor(cx + size * 0.06);
  const barColor = 0x2A3300FF;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const inBar1 = x >= bar1X && x <= bar1X + barW && y >= barY && y <= barY + barH;
      const inBar2 = x >= bar2X && x <= bar2X + barW && y >= barY && y <= barY + barH;
      if (inBar1 || inBar2) {
        img.setPixelColor(barColor, x, y);
      }
    }
  }

  // New jimp uses .write() which returns a promise
  await img.write(outPath);
  console.log('Generated', outPath);
}

(async () => {
  await makeIcon(128, 'icon128.png');
  await makeIcon(48,  'icon48.png');
  await makeIcon(16,  'icon16.png');
  console.log('All icons done');
})();
