const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// التأكد من وجود مكتبة sharp
try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing sharp...');
  try {
    execSync('pnpm add -D sharp', { stdio: 'inherit', cwd: path.join(__dirname, '..', '..') });
  } catch (err) {
    execSync('npm install sharp --no-save', { stdio: 'inherit' });
  }
}

const sharp = require('sharp');
const ASSETS_DIR = path.join(__dirname, 'assets');

if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR);

/**
 * دالة توليد تأثيرات الظل والضوء للأجزاء المفرغة والبارزة
 */
const getShadowsAndHighlights = (isNotification) => {
  if (isNotification) return '';
  return `
    <!-- Cutout Highlight (Top-left crescent) & Raised Button Outer Shadow -->
    <g transform="translate(-2, -3)">
      <g fill="#D1FAE5" opacity="0.6">
        <path d="M 512 280 L 742 360 L 512 440 L 282 360 Z" />
        <path d="M 380 415 Q 512 495 644 415 L 644 485 Q 512 565 380 485 Z" />
        <path d="M 512 800 C 412 720, 612 640, 512 560" fill="none" stroke="#D1FAE5" stroke-width="22" stroke-dasharray="0, 55" stroke-linecap="round" />
        <path d="M 512 360 Q 670 370 680 430" fill="none" stroke="#D1FAE5" stroke-width="12" stroke-linecap="round" />
        <rect x="668" y="430" width="24" height="40" rx="12" />
        <circle cx="512" cy="360" r="6" />
      </g>
      <circle cx="512" cy="360" r="16" fill="#022C22" />
    </g>

    <!-- Cutout Shadow (Bottom-right crescent) & Raised Button Outer Highlight -->
    <g transform="translate(2, 3)">
      <g fill="#022C22">
        <path d="M 512 280 L 742 360 L 512 440 L 282 360 Z" />
        <path d="M 380 415 Q 512 495 644 415 L 644 485 Q 512 565 380 485 Z" />
        <path d="M 512 800 C 412 720, 612 640, 512 560" fill="none" stroke="#022C22" stroke-width="22" stroke-dasharray="0, 55" stroke-linecap="round" />
        <path d="M 512 360 Q 670 370 680 430" fill="none" stroke="#022C22" stroke-width="12" stroke-linecap="round" />
        <rect x="668" y="430" width="24" height="40" rx="12" />
        <circle cx="512" cy="360" r="6" />
      </g>
      <circle cx="512" cy="360" r="16" fill="#D1FAE5" opacity="0.6" />
    </g>
  `;
};

/**
 * دالة إنشاء الشعار المطور (Flat Minimalist, Perfect Math)
 */
const createLogoSvg = (includeBackground = false, isNotification = false) => {
  const bg = includeBackground ? '<rect width="1200" height="1200" fill="#161616" />' : '';
  const pinFill = isNotification ? '#FFFFFF' : 'url(#metalCopper)';

  const gradient = isNotification
    ? ''
    : `
    <linearGradient id="metalCopper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#86EFAC" />
      <stop offset="30%" stop-color="#4ADE80" />
      <stop offset="70%" stop-color="#16A34A" />
      <stop offset="100%" stop-color="#0A5C36" />
    </linearGradient>
  `;

  const shadowsAndHighlights = getShadowsAndHighlights(isNotification);

  return `
<svg width="1024" height="1024" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  ${bg}
  <defs>
    ${gradient}
    <mask id="capMask">
      <!-- White keeps the pin, Black cuts out the cap -->
      <rect x="-500" y="-500" width="2200" height="2200" fill="white" />
      
      <!-- Mortarboard (Diamond) -->
      <path d="M 512 280 L 742 360 L 512 440 L 282 360 Z" fill="black" />
      
      <!-- Skull Cap (Base) -->
      <path d="M 380 415 Q 512 495 644 415 L 644 485 Q 512 565 380 485 Z" fill="black" />
      
      <!-- Tassel Cord -->
      <path d="M 512 360 Q 670 370 680 430" fill="none" stroke="black" stroke-width="12" stroke-linecap="round" />
      
        <!-- Tassel Fringe -->
        <rect x="668" y="430" width="24" height="40" rx="12" fill="black" />
        <path d="M 670 442 L 690 442" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 674 452 L 674 465 M 680 452 L 680 465 M 686 452 L 686 465" stroke="white" stroke-width="2.5" stroke-linecap="round" />

        <!-- Center Button (Keeps pin color, drawn on top to avoid clipping) -->
        <circle cx="512" cy="360" r="16" fill="white" />
        <circle cx="512" cy="360" r="6" fill="black" />

        <!-- Dotted Route Path (GPS navigation path leading to the cap) -->
        <path d="M 512 800 C 412 720, 612 640, 512 560" fill="none" stroke="black" stroke-width="22" stroke-dasharray="0, 55" stroke-linecap="round" />
    </mask>
  </defs>

  <!-- تم تعديل التحجيم والإزاحة لضمان بقاء الأيقونة بالكامل داخل المنطقة الآمنة بأندرويد (Adaptive Icon Safe Zone) وتمركزها البصري (Optically Centered) -->
  <g transform="translate(600, 655) scale(0.78) translate(-512, -600)" mask="url(#capMask)">
    <!-- Perfect Location Pin Shape -->
    <path d="M 286.84 530 A 260 260 0 1 1 737.16 530 L 512 920 Z" fill="${pinFill}" />
    ${shadowsAndHighlights}
  </g>
</svg>
`;
};

// الشاشة الترحيبية الكاملة (Splash Screen)
const getSplashSvg = () => {
  return `
<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  <!-- الخلفية الداكنة الموحدة لمنع وميض الألوان والانتقال المباشر للأنيميشن -->
  <rect width="1284" height="2778" fill="#161616" />
</svg>
`;
};

async function generate() {
  console.log('🚀 Generating Perfect Flat Minimalist Assets...');

  const iconBuffer = Buffer.from(createLogoSvg(true, false));
  const adaptiveBuffer = Buffer.from(createLogoSvg(false, false));
  const notificationBuffer = Buffer.from(createLogoSvg(false, true));
  const splashBuffer = Buffer.from(getSplashSvg());

  // 1. الأيقونة الرسمية للمتجر (1024x1024)
  await sharp(iconBuffer).resize(1024, 1024).png().toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('Created icon.png');

  // 2. الأيقونة التكيفية لأندرويد (1080x1080)
  await sharp(adaptiveBuffer)
    .resize(1080, 1080)
    .png()
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));
  console.log('Created adaptive-icon.png');

  // 3. أيقونة الإشعارات للنظام (96x96)
  await sharp(notificationBuffer)
    .resize(96, 96)
    .png()
    .toFile(path.join(ASSETS_DIR, 'notification-icon.png'));
  console.log('Created notification-icon.png');

  // 4. الشاشة الترحيبية (Splash Screen) للنظام (1284x2778)
  await sharp(splashBuffer).png().toFile(path.join(ASSETS_DIR, 'splash.png'));
  console.log('Created splash.png');

  // 5. favicon للويب (48x48)
  await sharp(adaptiveBuffer).resize(48, 48).png().toFile(path.join(ASSETS_DIR, 'favicon.png'));
  console.log('Created favicon.png');

  // Save the SVGs to the file system so the user can see them easily
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.svg'), createLogoSvg(true, false));
  fs.writeFileSync(path.join(ASSETS_DIR, 'splash.svg'), getSplashSvg());

  console.log('✅ Perfect assets generated successfully in /assets folder!');
}

generate().catch(console.error);
