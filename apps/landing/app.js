// ==========================================================================
// Sair Landing Page Interactive Application Logic - Updated
// ==========================================================================

// 1. Translation Dictionary (Bilingual Support: Arabic & English)
const translations = {
  ar: {
    'nav.features': 'الميزات',
    'nav.demo': 'التتبع الحي',
    'nav.howItWorks': 'كيف يعمل؟',
    'nav.faq': 'الأسئلة الشائعة',
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

    // Mockup Phone Translations
    'mock.studentName': 'علي حسين',
    'mock.university': 'جامعة بغداد',
    'mock.statusActive': 'نشط الآن',
    'mock.routeTitle': 'خط الجادرية - الدورة',
    'mock.driverName': 'أبو محمد (موثق)',
    'mock.eta': 'تبعد الحافلة 5 دقائق عن موقعك',
    'mock.tabMap': 'الخريطة',
    'mock.tabSub': 'الاشتراك',
    'mock.tabChat': 'المحادثة',
    'mock.subTitle': 'اشتراك الخط النشط',
    'mock.subLine': 'المسار:',
    'mock.subStatus': 'الحالة:',
    'mock.subActive': 'مفعل',
    'mock.subExpiry': 'تاريخ الانتهاء:',
    'mock.subCheckout': 'تجديد الاشتراك',
    'mock.subZainCash': 'تجديد عبر زين كاش',
    'mock.subOr': 'أو',
    'mock.subActivate': 'تفعيل',
    'mock.msgDriver1': 'صباح الخير طلاب، انطلقت الآن وباتجاه نقطة التجمع الأولى.',
    'mock.msgStudent1': 'صباح النور عمو، بانتظارك في المحطة.',
    'mock.msgDriver2': 'تمام علي، 5 دقائق وأكون يمكم.',
    'mock.chatPlaceholder': 'أكتب رسالة...',

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

    'testimonials.title': 'ماذا يقول طلابنا؟',
    'testimonials.subtitle':
      'آراء حقيقية من طلاب الجامعات الذين يستخدمون سير يومياً لتسهيل تنقلهم.',
    'testimonials.t1Text':
      '"التطبيق غير حياتي الجامعية تماماً! كنت أقف ساعات بالشارع انتظر الخط، الآن أخرج من البيت في الدقيقة المحددة تماماً وأنا أراقب موقع السائق."',
    'testimonials.t1Name': 'نور الهدى',
    'testimonials.t1Meta': 'طالبة في جامعة المستنصرية',
    'testimonials.t2Text':
      '"الاشتراك والدفع عبر زين كاش جداً سهل وسريع. التذاكر وكود التراخيص يحل مشكلة كبيرة مع محاسب الكلية والاشتراك مفعّل مباشرة."',
    'testimonials.t2Name': 'مصطفى سجاد',
    'testimonials.t2Meta': 'طالب في جامعة بغداد - هندسة',
    'testimonials.t3Text':
      '"ميزة المحادثة مع السائق داخل التطبيق ممتازة وتحمي خصوصية أرقامنا. أرسل له تنبيه إذا كنت غائب اليوم والمنظومة جداً مرتبة."',
    'testimonials.t3Name': 'سارة محمد',
    'testimonials.t3Meta': 'طالبة في جامعة النهرين',

    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle': 'إجابات سريعة ومفصلة على الأسئلة التي يطرحها الطلاب وأولياء الأمور.',
    'faq.q1': 'كيف يمكنني تفعيل الاشتراك لأول مرة؟',
    'faq.a1':
      'يمكنك تفعيل الاشتراك إما بالدفع الإلكتروني المباشر داخل التطبيق عبر بوابة زين كاش (Zain Cash) أو من خلال شراء كود ترخيص (License Code) مكون من 8 رموز من الممثلين المعتمدين لتطبيق سير داخل حرم كليتك، وتفعيله فوراً داخل التطبيق لحجز مقعدك.',
    'faq.q2': 'هل يمكنني تتبع السائق بدون توفر إنترنت في هاتفي؟',
    'faq.a2':
      'تحتاج إلى توفر اتصال بالإنترنت لرؤية التحديثات المباشرة وموقع الحافلة الفوري على الخريطة. ومع ذلك، يحتفظ التطبيق ببيانات آخر موقع للسائق وتفاصيل مساره للرجوع إليها دون اتصال.',
    'faq.q3': 'هل يتم الحفاظ على خصوصية أرقام الهواتف؟',
    'faq.a3':
      'نعم، أمان وخصوصية طلابنا هي أولويتنا القصوى. عند التواصل مع السائق أو إرسال الرسائل الفورية داخل المحادثة الخاصة بالرحلة، يتم ذلك عبر التطبيق دون الكشف عن رقم هاتفك الشخصي للسائق أو المشتركين الآخرين مطلقاً.',
    'faq.q4': 'كيف يعمل زر الطوارئ SOS؟',
    'faq.a4':
      'في حال حدوث أي طارئ أثناء الرحلة، يمكن للطالب أو السائق الضغط على زر SOS. سيقوم النظام فوراً بإرسال بلاغ طارئ لمشرفي المنصة يتضمن موقع الحافلة الجغرافي الدقيق لحظة البلاغ وتفاصيل المشتركين لتوفير الدعم السريع.',

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
    'nav.faq': 'FAQ',
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

    // Mockup Phone Translations
    'mock.studentName': 'Ali Hussein',
    'mock.university': 'University of Baghdad',
    'mock.statusActive': 'Active Now',
    'mock.routeTitle': 'Jadriyah - Doura Route',
    'mock.driverName': 'Abu Mohammed (Verified)',
    'mock.eta': 'Bus is 5 minutes away from you',
    'mock.tabMap': 'Map',
    'mock.tabSub': 'Subscription',
    'mock.tabChat': 'Chat',
    'mock.subTitle': 'Active Line Subscription',
    'mock.subLine': 'Route:',
    'mock.subStatus': 'Status:',
    'mock.subActive': 'Active',
    'mock.subExpiry': 'Expiry Date:',
    'mock.subCheckout': 'Renew Subscription',
    'mock.subZainCash': 'Renew via Zain Cash',
    'mock.subOr': 'Or',
    'mock.subActivate': 'Activate',
    'mock.msgDriver1': 'Good morning students, started now and heading to first pickup stop.',
    'mock.msgStudent1': 'Good morning uncle, waiting for you at the stop.',
    'mock.msgDriver2': "Awesome Ali, 5 minutes and I'll be there.",
    'mock.chatPlaceholder': 'Type a message...',

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

    'testimonials.title': 'What Students Say',
    'testimonials.subtitle':
      'Real feedback from university students using Sair daily to streamline their commute.',
    'testimonials.t1Text':
      '"This app completely changed my campus life! I used to stand in the street for hours waiting. Now I leave home exactly on the dot while watching the driver live."',
    'testimonials.t1Name': 'Noor Al-Huda',
    'testimonials.t1Meta': 'Student at Mustansiriyah University',
    'testimonials.t2Text':
      '"Subscribing and paying via Zain Cash is incredibly easy and fast. Ticket codes resolved accounting issues and immediately activated the line."',
    'testimonials.t2Name': 'Mustafa Sajjad',
    'testimonials.t2Meta': 'Student at University of Baghdad - Eng.',
    'testimonials.t3Text':
      '"Direct chat with the driver inside the app protects our phone number privacy. I message him if I am absent, very structured system."',
    'testimonials.t3Name': 'Sara Mohammed',
    'testimonials.t3Meta': 'Student at Al-Nahrain University',

    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Quick and detailed answers to common questions asked by students and parents.',
    'faq.q1': 'How do I activate my subscription for the first time?',
    'faq.a1':
      'You can activate by paying online using Zain Cash directly inside the app, or by purchasing an 8-character License Code from Sair campus agents and redeeming it to book your seat instantly.',
    'faq.q2': 'Can I track the driver offline without internet?',
    'faq.a2':
      'You need an active internet connection to see real-time map updates. However, the app caches the last known location and route details for offline reference.',
    'faq.q3': 'Is phone number privacy preserved?',
    'faq.a3':
      "Yes. When chatting or communicating with the driver, it's done securely through the app without exposing your personal phone number to the driver or other riders.",
    'faq.q4': 'How does the SOS emergency button work?',
    'faq.a4':
      'In case of any emergency, pressing the SOS button immediately alerts Sair supervisors, sending the precise GPS coordinates and passenger details for quick response.',

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

// 2. Language Switcher Logic
let currentLang = 'ar';
const langToggleBtn = document.getElementById('lang-toggle');
const langText = langToggleBtn.querySelector('.lang-text');

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach((elem) => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      elem.textContent = translations[lang][key];
    }
  });

  langText.textContent = lang === 'ar' ? 'English' : 'العربية';
  document.title =
    lang === 'ar'
      ? 'سير | منصة النقل الجامعي الذكي في العراق'
      : 'Sair | Smart University Transit Platform in Iraq';

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

langToggleBtn.addEventListener('click', () => {
  setLanguage(currentLang === 'ar' ? 'en' : 'ar');
});

// 3. Theme Toggle Logic (Light / Dark Theme)
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('.theme-icon');

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  document.documentElement.className = savedTheme;
  themeIcon.textContent = savedTheme === 'dark-theme' ? '🌙' : '☀️';
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.className;
  const nextTheme = currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
  document.documentElement.className = nextTheme;
  localStorage.setItem('theme', nextTheme);
  themeIcon.textContent = nextTheme === 'dark-theme' ? '🌙' : '☀️';
});

// Run theme initializer
initTheme();

// 4. Simulated Phone Mockup Tabs Switching
const mockTabs = document.querySelectorAll('.mock-tab');
const mockScreens = document.querySelectorAll('.mock-screen');

mockTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetTab = tab.getAttribute('data-tab');

    // Switch active tab class
    mockTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    // Switch active screen class
    mockScreens.forEach((screen) => {
      screen.classList.remove('active');
      if (screen.id === `screen-${targetTab}`) {
        screen.classList.add('active');
      }
    });

    // If map screen is selected, restart route simulation from current point for better visuals
    if (targetTab === 'map') {
      startSimulation();
    }
  });
});

// 5. Interactive FAQ Accordion Logic
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const parentItem = question.parentElement;
    const isActive = parentItem.classList.contains('active');

    // Close all other FAQ items for a neat accordion behavior
    document.querySelectorAll('.faq-item').forEach((item) => {
      item.classList.remove('active');
    });

    // Toggle active state
    if (!isActive) {
      parentItem.classList.add('active');
    }
  });
});

// 6. Live Route GPS Simulation Logic
const routeProgressPath = document.getElementById('route-progress');
const simBus = document.getElementById('sim-bus');
const speedValEl = document.getElementById('demo-speed');
const etaValEl = document.getElementById('demo-eta');
const restartBtn = document.getElementById('demo-trigger');

let simAnimationId = null;
let simProgress = 0; // 0 to 1
const simDuration = 12000; // 12 seconds per trip
let lastTime = null;

// Initialize SVG path tracing metrics
const totalPathLength = routeProgressPath.getTotalLength();
routeProgressPath.style.strokeDasharray = totalPathLength;
routeProgressPath.style.strokeDashoffset = totalPathLength;

function animateSimulation(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const elapsed = timestamp - lastTime;

  simProgress = Math.min(elapsed / simDuration, 1);

  const currentLength = simProgress * totalPathLength;
  const point = routeProgressPath.getPointAtLength(currentLength);

  // Convert coordinates to viewport percentages (SVG viewBox: 500x350)
  const xPercent = (point.x / 500) * 100;
  const yPercent = (point.y / 350) * 100;

  simBus.style.left = `${xPercent}%`;
  simBus.style.top = `${yPercent}%`;

  // Highlight progressive line
  routeProgressPath.style.strokeDashoffset = totalPathLength - currentLength;

  // Fluctuate speed
  let currentSpeed = 0;
  if (simProgress < 0.95 && simProgress > 0.05) {
    currentSpeed = Math.floor(45 + Math.sin(timestamp / 500) * 7);
  } else if (simProgress >= 0.95) {
    currentSpeed = 0;
  } else {
    currentSpeed = Math.floor(simProgress * 1000 * 0.04);
  }

  const etaMinutes = Math.max(Math.ceil((1 - simProgress) * 12), 0);

  // Render values based on language
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

restartBtn.addEventListener('click', startSimulation);

// 7. Statistic Counter Increments
const statNumbers = document.querySelectorAll('.stat-num');

function animateCounters() {
  statNumbers.forEach((stat) => {
    const targetVal = parseInt(stat.getAttribute('data-val'));
    if (isNaN(targetVal)) return; // Skip non-numeric counters like percentages

    let currentVal = 0;
    const duration = 1800; // 1.8s
    const steps = 60;
    const increment = Math.ceil(targetVal / steps);
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      currentVal += increment;
      if (currentVal >= targetVal) {
        clearInterval(timer);
        stat.textContent = `+${targetVal.toLocaleString()}`;
      } else {
        stat.textContent = `+${currentVal.toLocaleString()}`;
      }
    }, stepTime);
  });
}

// 8. Scroll Reveal & Auto-Triggers (Intersection Observer)
const revealElements = document.querySelectorAll(
  '.feature-card, .step-card, .driver-card, .download-container, .testimonial-card, .faq-item',
);
const statsSection = document.querySelector('.hero-stats');

const observerOptions = {
  root: null,
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-slide-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((elem) => {
  elem.style.opacity = '0';
  elem.style.transform = 'translateY(30px)';
  revealObserver.observe(elem);
});

// Trigger stats counter animation once visible
let statsAnimated = false;
const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

// Auto-trigger simulation on boot
window.addEventListener('load', () => {
  setTimeout(startSimulation, 1000);
});

// Language changed event listener
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
