// ==========================================================================
// Sair Landing Page Interactive Application Logic
// ==========================================================================

// 1. Translation Dictionary (Bilingual Support: Arabic & English)
const translations = {
  ar: {
    'nav.features': 'الميزات',
    'nav.demo': 'التتبع الحي',
    'nav.howItWorks': 'كيف يعمل؟',
    'nav.download': 'تحميل التطبيق',
    'hero.badge': 'الإصدار الثاني Sair v2 متاح الآن',
    'hero.title1': 'تنقّل ذكي لجامعتك،',
    'hero.title2': 'بأمان وراحة تامة',
    'hero.subtitle':
      'منصة النقل الجامعي الأولى في العراق لربط الطلاب بسائقي الخطوط. تتبع حافلتك مباشرة، واشترك بسهولة، واستمتع برحلة يومية مريحة وآمنة.',
    'hero.btnStudent': 'تحميل كطالب',
    'hero.btnDriver': 'انضم كسائق',
    'hero.statStudents': 'طالب مشترك',
    'hero.statDrivers': 'سائق موثق',
    'hero.statSuccess': 'رحلات ناجحة',
    'features.title': 'لماذا تختار تطبيق سير؟',
    'features.subtitle':
      'صممنا التطبيق ليوفر تجربة نقل حديثة ومريحة تلبي احتياجات الطالب العراقي اليومية.',
    'features.liveTracking': 'تتبع حي مباشر',
    'features.liveTrackingDesc':
      'شاهد موقع الحافلة الجغرافي مباشرة على الخريطة وتفادى عناء الانتظار الطويل في حر الصيف أو برد الشتاء.',
    'features.smartPayments': 'اشتراكات سهلة وآمنة',
    'features.smartPaymentsDesc':
      'اشترك وادفع مباشرة عبر زين كاش (Zain Cash) أو من خلال تفعيل أكواد التراخيص التي يوزعها وكلاؤنا في الكليات.',
    'features.directChat': 'اتصال فوري مباشر',
    'features.directChatDesc':
      'تواصل بشكل فوري وآمن مع سائق حافلتك للتنبيه أو التنسيق اليومي بخصوص الرحلات دون الكشف عن رقم هاتفك.',
    'features.sosSafety': 'زر طوارئ SOS',
    'features.sosSafetyDesc':
      'أمانك أولويتنا؛ نوفر زر طوارئ ذكي داخل التطبيق لمشاركة موقعك الفوري وتنبيه المشرفين في الحالات الطارئة.',
    'demo.title': 'شاهد التتبع الحي في الميدان',
    'demo.desc':
      'جرب المحاكاة التفاعلية هنا لرؤية كيف يقوم التطبيق ببث موقع الحافلة والسرعة ووقت الوصول المتوقع بدقة متناهية.',
    'demo.liveStatus': 'حافلة الجادرية - محاكاة حية',
    'demo.speed': 'السرعة الحالية',
    'demo.eta': 'وقت الوصول',
    'demo.btnRestart': 'إعادة تشغيل المحاكاة',
    'demo.start': 'نقطة الانطلاق',
    'demo.end': 'الجامعة',
    'how.title': 'كيف تبدأ مع سير؟',
    'how.subtitle': 'خطوات بسيطة لتنعم برحلة هادئة وخالية من التوتر.',
    'how.step1': 'تنزيل التطبيق وإنشاء حساب',
    'how.step1Desc': 'قم بتحميل التطبيق لهاتفك الذكي وسجل بياناتك كطالب في كليتك.',
    'how.step2': 'اختيار وتفعيل الخط',
    'how.step2Desc': 'ابحث عن مسار منطقتك المخصص لجامعتك وفعل اشتراكك عبر زين كاش أو كود الترخيص.',
    'how.step3': 'تتبع حافلتك وانطلق',
    'how.step3Desc':
      'احصل على إشعارات فورية عند انطلاق الرحلة وتابع موقع الحافلة لتلتحق بها في الوقت المحدد.',
    'cta.title': 'جاهز لتجربة رحلة جامعية أذكى؟',
    'cta.desc':
      'حمل تطبيق سير الآن المتوفر مجاناً لأجهزة الـ Android والـ iOS وابدأ بتتبع رحلاتك اليومية.',
    'driver.title': 'هل تمتلك حافلة نقل جامعي وتريد الانضمام؟',
    'driver.desc':
      'انضم إلى شبكة سائقي سير الموثقين. نحن نوفر لك لوحة تحكم كاملة، إدارة ذكية للمشتركين والمقاعد، واستلام فوري ومضمون للأرباح.',
    'driver.btnJoin': 'سجل شريكاً معنا',
    'footer.desc':
      'المنصة الأذكى لتسيير وتتبع خطوط النقل الجامعي للطلاب في العراق بأعلى معايير السلامة والسرعة.',
    'footer.linksTitle': 'روابط سريعة',
    'footer.contactTitle': 'اتصل بنا',
  },
  en: {
    'nav.features': 'Features',
    'nav.demo': 'Live Tracking',
    'nav.howItWorks': 'How it works?',
    'nav.download': 'Download App',
    'hero.badge': 'Sair v2 is now available',
    'hero.title1': 'Smart Commute for Campus,',
    'hero.title2': 'Safe and Seamless Rides',
    'hero.subtitle':
      'The leading university transit platform in Iraq connecting students with verified bus lines. Track your bus live, subscribe easily, and enjoy a comfortable commute.',
    'hero.btnStudent': 'Student Download',
    'hero.btnDriver': 'Join as Driver',
    'hero.statStudents': 'Active Students',
    'hero.statDrivers': 'Verified Drivers',
    'hero.statSuccess': 'Successful Trips',
    'features.title': 'Why Choose Sair?',
    'features.subtitle':
      'Our app is built to provide a modern, comfortable transit experience tailored for university students.',
    'features.liveTracking': 'Live GPS Tracking',
    'features.liveTrackingDesc':
      'Watch your bus location in real-time on the map. Avoid waiting under the hot summer sun or during freezing winter mornings.',
    'features.smartPayments': 'Easy Subscriptions',
    'features.smartPaymentsDesc':
      'Subscribe and pay securely via Zain Cash or by redeeming license codes distributed directly on campus.',
    'features.directChat': 'Instant Messaging',
    'features.directChatDesc':
      'Chat directly and securely with your driver for coordination or status updates without sharing your private phone number.',
    'features.sosSafety': 'SOS Safety Button',
    'features.sosSafetyDesc':
      'Your safety is our priority. A built-in SOS emergency trigger lets you share your live location and alert supervisors instantly.',
    'demo.title': 'See Live Tracking In Action',
    'demo.desc':
      'Interact with our real-time simulator to see how the Sair app displays the live bus location, current speed, and estimated time of arrival.',
    'demo.liveStatus': 'Jadriyah Bus - Live Simulation',
    'demo.speed': 'Current Speed',
    'demo.eta': 'ETA',
    'demo.btnRestart': 'Restart Simulation',
    'demo.start': 'Departure',
    'demo.end': 'Campus',
    'how.title': 'How to Start with Sair?',
    'how.subtitle': 'Simple steps to achieve a stress-free daily university commute.',
    'how.step1': 'Download & Sign Up',
    'how.step1Desc':
      'Get the app on your iOS or Android device and register your university credentials.',
    'how.step2': 'Select & Activate Line',
    'how.step2Desc':
      'Browse and choose the route matching your district, then activate via Zain Cash or license codes.',
    'how.step3': 'Track & Ride',
    'how.step3Desc':
      'Receive notifications when the trip starts and watch the live bus marker to catch your ride on time.',
    'cta.title': 'Ready for a Smarter Campus Ride?',
    'cta.desc':
      'Download Sair now, available for free on both Google Play and Apple App Store, and begin tracking your commute.',
    'driver.title': 'Own a Bus? Join Our Driver Network',
    'driver.desc':
      'Register as a verified partner. We provide full routing dashboard, smart seat management, passenger lists, and secure payout requests.',
    'driver.btnJoin': 'Register as Partner',
    'footer.desc':
      'The smartest platform for organizing and tracking university student bus lines in Iraq with top safety standards.',
    'footer.linksTitle': 'Quick Links',
    'footer.contactTitle': 'Contact Us',
  },
};

// 2. Language Switcher State
let currentLang = 'ar';

const langToggleBtn = document.getElementById('lang-toggle');
const langText = langToggleBtn.querySelector('.lang-text');

function setLanguage(lang) {
  currentLang = lang;

  // Set html tags
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((elem) => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      elem.textContent = translations[lang][key];
    }
  });

  // Update toggle button text
  if (lang === 'ar') {
    langText.textContent = 'English';
  } else {
    langText.textContent = 'العربية';
  }

  // Update browser window title dynamically
  document.title =
    lang === 'ar'
      ? 'سير | منصة النقل الجامعي الذكي في العراق'
      : 'Sair | Smart University Transit Platform in Iraq';

  // Dispatch a custom event for other components if needed
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

langToggleBtn.addEventListener('click', () => {
  const nextLang = currentLang === 'ar' ? 'en' : 'ar';
  setLanguage(nextLang);
});

// Initialize with default Arabic
setLanguage('ar');

// 3. Live Route GPS Simulation Logic
const routeProgressPath = document.getElementById('route-progress');
const simBus = document.getElementById('sim-bus');
const speedValEl = document.getElementById('demo-speed');
const etaValEl = document.getElementById('demo-eta');
const restartBtn = document.getElementById('demo-trigger');

let simAnimationId = null;
let simProgress = 0; // 0 to 1
const simDuration = 12000; // 12 seconds per trip simulation
let lastTime = null;

// Initialize SVG stroke dash arrays for progress drawing
const totalPathLength = routeProgressPath.getTotalLength();
routeProgressPath.style.strokeDasharray = totalPathLength;
routeProgressPath.style.strokeDashoffset = totalPathLength;

function animateSimulation(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const elapsed = timestamp - lastTime;

  // Update progress
  simProgress = Math.min(elapsed / simDuration, 1);

  // Get point coordinates at current length progress
  const currentLength = simProgress * totalPathLength;
  const point = routeProgressPath.getPointAtLength(currentLength);

  // Update Bus Marker position (Responsive viewport calculations)
  // The SVG viewBox is 500 x 350
  const xPercent = (point.x / 500) * 100;
  const yPercent = (point.y / 350) * 100;

  simBus.style.left = `${xPercent}%`;
  simBus.style.top = `${yPercent}%`;

  // Draw path highlight
  routeProgressPath.style.strokeDashoffset = totalPathLength - currentLength;

  // Metric calculations
  // Speed fluctuates between 38km/h and 52km/h
  let currentSpeed = 0;
  if (simProgress < 0.95 && simProgress > 0.05) {
    currentSpeed = Math.floor(45 + Math.sin(timestamp / 500) * 7);
  } else if (simProgress >= 0.95) {
    currentSpeed = 0; // Bus stopped at campus
  } else {
    currentSpeed = Math.floor(simProgress * 1000 * 0.04);
  }

  // ETA decreases from 12 minutes down to 0
  const etaMinutes = Math.max(Math.ceil((1 - simProgress) * 12), 0);

  // Update UI values depending on language
  if (currentLang === 'ar') {
    speedValEl.textContent = `${currentSpeed} كم/س`;
    etaValEl.textContent = etaMinutes > 0 ? `${etaMinutes} دقيقة` : 'وصلت الحافلة';
  } else {
    speedValEl.textContent = `${currentSpeed} km/h`;
    etaValEl.textContent = etaMinutes > 0 ? `${etaMinutes} mins` : 'Arrived';
  }

  if (simProgress < 1) {
    simAnimationId = requestAnimationFrame(animateSimulation);
  } else {
    simAnimationId = null;
  }
}

function startSimulation() {
  if (simAnimationId) {
    cancelAnimationFrame(simAnimationId);
  }
  simProgress = 0;
  lastTime = null;
  simBus.style.left = '10%';
  simBus.style.top = '80%';
  routeProgressPath.style.strokeDashoffset = totalPathLength;

  simAnimationId = requestAnimationFrame(animateSimulation);
}

// Attach listener to restart simulation button
restartBtn.addEventListener('click', () => {
  startSimulation();
});

// Run automatically on load
window.addEventListener('load', () => {
  // Delay slightly for smooth initial rendering
  setTimeout(startSimulation, 1000);
});

// Language change updates units immediately
window.addEventListener('languageChanged', () => {
  const currentSpeed = parseInt(speedValEl.textContent);
  const currentEta = parseInt(etaValEl.textContent) || 0;

  if (currentLang === 'ar') {
    if (isNaN(currentSpeed) || currentSpeed === 0) {
      speedValEl.textContent = '0 كم/س';
    } else {
      speedValEl.textContent = `${currentSpeed} كم/س`;
    }
    etaValEl.textContent = currentEta > 0 ? `${currentEta} دقيقة` : 'وصلت الحافلة';
  } else {
    if (isNaN(currentSpeed) || currentSpeed === 0) {
      speedValEl.textContent = '0 km/h';
    } else {
      speedValEl.textContent = `${currentSpeed} km/h`;
    }
    etaValEl.textContent = currentEta > 0 ? `${currentEta} mins` : 'Arrived';
  }
});

// 4. Scroll Reveal Animations (Intersection Observer)
const revealElements = document.querySelectorAll(
  '.feature-card, .step-card, .driver-card, .download-container',
);

const observerOptions = {
  root: null,
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-slide-up');
      // Unobserve once animation is triggered
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((elem) => {
  // Set initial hidden states
  elem.style.opacity = '0';
  elem.style.transform = 'translateY(30px)';
  revealObserver.observe(elem);
});
