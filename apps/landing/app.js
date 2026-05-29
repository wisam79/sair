// ==========================================================================
// Sair Landing — Premium Interactive Application Logic v2
// ==========================================================================

// ── 1. Translation Dictionary ─────────────────────────────────────────────
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
    'mock.msgDriver1':
      'صباح الخير طلاب، انطلقت الآن وباتجاه نقطة التجمع الأولى.',
    'mock.msgStudent1': 'صباح النور عمو، بانتظارك في المحطة.',
    'mock.msgDriver2': 'تمام علي، 5 دقائق وأكون يمكم.',
    'mock.chatPlaceholder': 'أكتب رسالة...',

    'marquee.label': 'معتمد من جامعات عراقية رائدة',

    'features.tag': 'المنصة المتكاملة',
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

    'demo.tag': 'محاكاة تفاعلية',
    'demo.title': 'شاهد التتبع الحي في الميدان',
    'demo.desc':
      'جرب المحاكاة التفاعلية هنا لرؤية كيف يقوم التطبيق ببث موقع الحافلة والسرعة ووقت الوصول المتوقع بدقة متناهية.',
    'demo.liveStatus': 'حافلة الجادرية - محاكاة حية',
    'demo.speed': 'السرعة الحالية',
    'demo.eta': 'وقت الوصول',
    'demo.btnRestart': 'إعادة تشغيل المحاكاة',
    'demo.start': 'نقطة الانطلاق',
    'demo.end': 'الجامعة',

    'how.tag': 'سهولة الاستخدام',
    'how.title': 'كيف تبدأ مع سير؟',
    'how.subtitle': 'خطوات بسيطة لتنعم برحلة هادئة وخالية من التوتر.',
    'how.step1': 'تنزيل التطبيق وإنشاء حساب',
    'how.step1Desc':
      'قم بتحميل التطبيق لهاتفك الذكي وسجل بياناتك كطالب في كليتك.',
    'how.step2': 'اختيار وتفعيل الخط',
    'how.step2Desc':
      'ابحث عن مسار منطقتك المخصص لجامعتك وفعل اشتراكك عبر زين كاش أو كود الترخيص.',
    'how.step3': 'تتبع حافلتك وانطلق',
    'how.step3Desc':
      'احصل على إشعارات فورية عند انطلاق الرحلة وتابع موقع الحافلة لتلتحق بها في الوقت المحدد.',

    'testimonials.tag': 'آراء المستخدمين',
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

    'faq.tag': 'مركز المساعدة',
    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle':
      'إجابات سريعة ومفصلة على الأسئلة التي يطرحها الطلاب وأولياء الأمور.',
    'faq.q1': 'كيف يمكنني تفعيل الاشتراك لأول مرة؟',
    'faq.a1': 'يمكنك تفعيل الاشتراك إما بالدفع الإلكتروني المباشر داخل التطبيق عبر بوابة زين كاش (Zain Cash) أو من خلال شراء كود ترخيص (License Code) مكون من 8 رموز من الممثلين المعتمدين لتطبيق سير داخل حرم كليتك، وتفعيله فوراً داخل التطبيق لحجز مقعدك.',
    'faq.q2': 'هل يمكنني تتبع السائق بدون توفر إنترنت في هاتفي؟',
    'faq.a2': 'تحتاج إلى توفر اتصال بالإنترنت لرؤية التحديثات المباشرة وموقع الحافلة الفوري على الخريطة. ومع ذلك، يحتفظ التطبيق ببيانات آخر موقع للسائق وتفاصيل مساره للرجوع إليها دون اتصال.',
    'faq.q3': 'هل يتم الحفاظ على خصوصية أرقام الهواتف؟',
    'faq.a3': 'نعم، أمان وخصوصية طلابنا هي أولويتنا القصوى. عند التواصل مع السائق أو إرسال الرسائل الفورية داخل المحادثة الخاصة بالرحلة، يتم ذلك عبر التطبيق دون الكشف عن رقم هاتفك الشخصي للسائق أو المشتركين الآخرين مطلقاً.',
    'faq.q4': 'كيف يعمل زر الطوارئ SOS؟',
    'faq.a4': 'في حال حدوث أي طارئ أثناء الرحلة، يمكن للطالب أو السائق الضغط على زر SOS. سيقوم النظام فوراً بإرسال بلاغ طارئ لمشرفي المنصة يتضمن موقع الحافلة الجغرافي الدقيق لحظة البلاغ وتفاصيل المشتركين لتوفير الدعم السريع.',

    'cta.title': 'جاهز لتجربة رحلة جامعية أذكى؟',
    'cta.desc':
      'حمل تطبيق سير الآن المتوفر مجاناً لأجهزة الـ Android والـ iOS وابدأ بتتبع رحلاتك اليومية.',
    'cta.getItOn': 'احصل عليه من',
    'cta.downloadOn': 'تنزيل من',

    'driver.title': 'هل تمتلك حافلة نقل جامعي وتريد الانضمام؟',
    'driver.desc':
      'انضم إلى شبكة سائقي سير الموثقين. نحن نوفر لك لوحة تحكم كاملة، إدارة ذكية للمشتركين والمقاعد، واستلام فوري ومضمون للأرباح.',
    'driver.btnJoin': 'سجل شريكاً معنا',

    'footer.desc':
      'المنصة الأذكى لتسيير وتتبع خطوط النقل الجامعي للطلاب في العراق بأعلى معايير السلامة والسرعة.',
    'footer.linksTitle': 'روابط سريعة',
    'footer.contactTitle': 'اتصل بنا',
    'footer.rights': 'جميع الحقوق محفوظة.',
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
    'mock.msgDriver1':
      'Good morning students, started now heading to first pickup.',
    'mock.msgStudent1': 'Good morning, waiting for you at the stop.',
    'mock.msgDriver2': "Awesome Ali, 5 minutes and I'll be there.",
    'mock.chatPlaceholder': 'Type a message...',

    'marquee.label': 'Trusted by leading Iraqi universities',

    'features.tag': 'All-in-One Platform',
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

    'demo.tag': 'Interactive Simulation',
    'demo.title': 'See Live Tracking In Action',
    'demo.desc':
      'Interact with our real-time simulator to see how the Sair app displays the live bus location, current speed, and estimated time of arrival.',
    'demo.liveStatus': 'Jadriyah Bus - Live Simulation',
    'demo.speed': 'Current Speed',
    'demo.eta': 'ETA',
    'demo.btnRestart': 'Restart Simulation',
    'demo.start': 'Departure',
    'demo.end': 'Campus',

    'how.tag': 'Easy to Use',
    'how.title': 'How to Start with Sair?',
    'how.subtitle':
      'Simple steps to achieve a stress-free daily university commute.',
    'how.step1': 'Download & Sign Up',
    'how.step1Desc':
      'Get the app on your device and register your university credentials.',
    'how.step2': 'Select & Activate Line',
    'how.step2Desc':
      'Choose the route for your district, then activate via Zain Cash or license codes.',
    'how.step3': 'Track & Ride',
    'how.step3Desc':
      'Receive notifications when the trip starts and watch the live bus marker to catch your ride.',

    'testimonials.tag': 'User Reviews',
    'testimonials.title': 'What Students Say',
    'testimonials.subtitle':
      'Real feedback from university students using Sair daily to streamline their commute.',
    'testimonials.t1Text':
      '"This app completely changed my campus life! I used to stand in the street for hours waiting. Now I leave home exactly on time watching the driver live."',
    'testimonials.t1Name': 'Noor Al-Huda',
    'testimonials.t1Meta': 'Student at Mustansiriyah University',
    'testimonials.t2Text':
      '"Subscribing and paying via Zain Cash is incredibly easy. Ticket codes resolved accounting issues and immediately activated the line."',
    'testimonials.t2Name': 'Mustafa Sajjad',
    'testimonials.t2Meta': 'Student at University of Baghdad - Eng.',
    'testimonials.t3Text':
      '"Direct chat with the driver protects our phone number privacy. I message if I am absent, very structured system."',
    'testimonials.t3Name': 'Sara Mohammed',
    'testimonials.t3Meta': 'Student at Al-Nahrain University',

    'faq.tag': 'Help Center',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle':
      'Quick and detailed answers to common questions asked by students and parents.',
    'faq.q1': 'How do I activate my subscription for the first time?',
    'faq.a1': 'You can activate by paying online using Zain Cash directly inside the app, or by purchasing an 8-character License Code from Sair campus agents and redeeming it to book your seat instantly.',
    'faq.q2': 'Can I track the driver offline without internet?',
    'faq.a2': 'You need an active internet connection to see real-time map updates. However, the app caches the last known location and route details for offline reference.',
    'faq.q3': 'Is phone number privacy preserved?',
    'faq.a3':
      "Yes. When chatting with the driver, it's done securely through the app without exposing your personal phone number to the driver or other riders.",
    'faq.q4': 'How does the SOS emergency button work?',
    'faq.a4': 'In case of any emergency, pressing the SOS button immediately alerts Sair supervisors, sending the precise GPS coordinates and passenger details for quick response.',

    'cta.title': 'Ready for a Smarter Campus Ride?',
    'cta.desc':
      'Download Sair now, available for free on Google Play and App Store.',
    'cta.getItOn': 'Get it on',
    'cta.downloadOn': 'Download on the',

    'driver.title': 'Own a Bus? Join Our Driver Network',
    'driver.desc':
      'Register as a verified partner. We provide full routing dashboard, smart seat management, and secure payout requests.',
    'driver.btnJoin': 'Register as Partner',

    'footer.desc':
      'The smartest platform for organizing and tracking university student bus lines in Iraq with top safety standards.',
    'footer.linksTitle': 'Quick Links',
    'footer.contactTitle': 'Contact Us',
    'footer.rights': 'All rights reserved.',
  },
};

// ── 2. Language Switcher ──────────────────────────────────────────────────
let currentLang = 'ar';
const langToggleBtn = document.getElementById('lang-toggle');
const langBtnText = langToggleBtn.querySelector('.lang-btn__text');

function setLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });

  langBtnText.textContent = lang === 'ar' ? 'English' : 'العربية';
  document.title =
    lang === 'ar'
      ? 'سير | منصة النقل الجامعي الذكي في العراق'
      : 'Sair | Smart University Transit Platform in Iraq';

  window.dispatchEvent(
    new CustomEvent('languageChanged', { detail: { lang } }),
  );
}

langToggleBtn.addEventListener('click', () => {
  setLanguage(currentLang === 'ar' ? 'en' : 'ar');
});

// ── 3. Theme Toggle ───────────────────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');

function initTheme() {
  const saved = localStorage.getItem('sair-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sair-theme', next);
});

initTheme();

// ── 4. Header Scroll Effect ──────────────────────────────────────────────
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener(
  'scroll',
  () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 40);
    lastScroll = scrollY;
  },
  { passive: true },
);

// ── 5. Mobile Hamburger Menu ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open')
    ? 'hidden'
    : '';
});

// Close menu on nav link click
nav.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── 6. Phone Mockup Tab Switching ────────────────────────────────────────
const phoneTabs = document.querySelectorAll('.phone__tab');
const phoneViews = document.querySelectorAll('.phone__view');

phoneTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    phoneTabs.forEach((t) => t.classList.remove('phone__tab--active'));
    tab.classList.add('phone__tab--active');

    phoneViews.forEach((view) => {
      view.classList.toggle(
        'phone__view--active',
        view.getAttribute('data-view') === target,
      );
    });
  });
});

// ── 7. FAQ Accordion ─────────────────────────────────────────────────────
document.querySelectorAll('.faq-item__q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach((el) => {
      el.classList.remove('open');
      el.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── 8. Route Simulation ──────────────────────────────────────────────────
const routeProgress = document.getElementById('route-progress');
const simBus = document.getElementById('sim-bus');
const speedEl = document.getElementById('demo-speed');
const etaEl = document.getElementById('demo-eta');
const restartBtn = document.getElementById('demo-trigger');

let simAnimId = null;
let simStart = null;
const simDuration = 14000;

const totalLen = routeProgress.getTotalLength();
routeProgress.style.strokeDasharray = totalLen;
routeProgress.style.strokeDashoffset = totalLen;

function animateSim(timestamp) {
  if (!simStart) simStart = timestamp;
  const progress = Math.min((timestamp - simStart) / simDuration, 1);

  const len = progress * totalLen;
  const pt = routeProgress.getPointAtLength(len);

  simBus.style.left = `${(pt.x / 500) * 100}%`;
  simBus.style.top = `${(pt.y / 350) * 100}%`;
  routeProgress.style.strokeDashoffset = totalLen - len;

  // Speed calculation
  let speed = 0;
  if (progress > 0.05 && progress < 0.92) {
    speed = Math.floor(42 + Math.sin(timestamp / 400) * 8);
  } else if (progress >= 0.92) {
    speed = Math.max(0, Math.floor((1 - progress) * 200));
  } else {
    speed = Math.floor(progress * 400);
  }

  const eta = Math.max(0, Math.ceil((1 - progress) * 14));

  if (currentLang === 'ar') {
    speedEl.textContent = `${speed} كم/س`;
    etaEl.textContent = eta > 0 ? `${eta} دقيقة` : 'وصلت!';
  } else {
    speedEl.textContent = `${speed} km/h`;
    etaEl.textContent = eta > 0 ? `${eta} mins` : 'Arrived!';
  }

  if (progress < 1) {
    simAnimId = requestAnimationFrame(animateSim);
  } else {
    simAnimId = null;
  }
}

function startSim() {
  if (simAnimId) cancelAnimationFrame(simAnimId);
  simStart = null;
  simBus.style.left = '10%';
  simBus.style.top = '80%';
  routeProgress.style.strokeDashoffset = totalLen;
  simAnimId = requestAnimationFrame(animateSim);
}

restartBtn.addEventListener('click', startSim);

// ── 9. Animated Counters ─────────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const isFloat = String(target).includes('.');

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(tick);
}

// ── 10. Intersection Observer (Scroll Reveal + Counter Trigger) ──────────
const srElements = document.querySelectorAll(
  '.feature-card, .step-card, .testimonial-card, .faq-item, .cta__card, .driver-cta__card, .demo__map-wrap, .demo__panel',
);

const srObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        srObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
);

srElements.forEach((el) => {
  el.classList.add('sr');
  srObserver.observe(el);
});

// Stats counter
let statsTriggered = false;
const statsArea = document.querySelector('.hero__stats');

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        document.querySelectorAll('.hero__stat-num[data-target]').forEach((el) => {
          animateCounter(el, parseInt(el.getAttribute('data-target'), 10));
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

if (statsArea) statsObserver.observe(statsArea);

// Demo simulation auto-trigger
const demoSection = document.querySelector('.demo');
let demoTriggered = false;

const demoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !demoTriggered) {
        demoTriggered = true;
        startSim();
        demoObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

if (demoSection) demoObserver.observe(demoSection);

// ── 11. Language Change Listener ─────────────────────────────────────────
window.addEventListener('languageChanged', () => {
  const speed = parseInt(speedEl.textContent) || 0;
  const eta = parseInt(etaEl.textContent) || 0;

  if (currentLang === 'ar') {
    speedEl.textContent = `${speed} كم/س`;
    etaEl.textContent = eta > 0 ? `${eta} دقيقة` : 'وصلت!';
  } else {
    speedEl.textContent = `${speed} km/h`;
    etaEl.textContent = eta > 0 ? `${eta} mins` : 'Arrived!';
  }
});

// ── 12. Smooth Scroll for Anchor Links ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
