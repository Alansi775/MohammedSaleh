/* ==================================================================
   COPY — English, Arabic, Turkish
   Technical nouns stay in English in every language, because that is
   how they are read in the field. Only the prose is translated.
================================================================== */

export const LANGS = ['en', 'ar', 'tr'];
export const DIR = { en: 'ltr', ar: 'rtl', tr: 'ltr' };

export const T = {

  en: {
    'meta.title': 'Mohammed Saleh — AI, Autonomous & Embedded Systems',

    'nav.work': 'Work', 'nav.system': 'System', 'nav.stack': 'Stack',
    'nav.path': 'Path', 'nav.contact': 'Contact',

    'hero.role': 'AI · Autonomous Systems · Embedded',
    'hero.loc': 'Istanbul, Türkiye',
    'hero.l1': 'I build systems',
    'hero.l2': 'that sense,',
    'hero.l3': 'decide and act.',
    'hero.sub': 'Machine learning on real signals — from the sensor and the firmware up to the model and the interface. Shipped, not demoed.',
    'hero.scroll': 'Scroll',
    'hero.avail': 'Open to work',

    'm.params': 'Parameters, largest model',
    'm.latency': 'End-to-end inference',
    'm.audio': 'Hours of training audio',
    'm.years': 'Years shipping systems',

    'sys.k': 'System',
    'sys.h': 'Every system I build runs the same loop.',
    'sys.sub': 'Different sensors, different actuators, the same four stages. This is the shape of the work.',
    'p.sense': 'Sense',
    'p.sense.d': 'EMG electrodes, a microphone, a camera, a pressure line. Raw, noisy, and arriving faster than anything can think about it.',
    'p.infer': 'Infer',
    'p.infer.d': 'A model trained on real recordings rather than a public set — CNN + LSTM for gestures, a Transformer for voice, convolution for vision.',
    'p.decide': 'Decide',
    'p.decide.d': 'Confidence thresholds, debouncing, fallbacks. A wrong actuation is worse than no actuation, so the system is allowed to abstain.',
    'p.act': 'Act',
    'p.act.d': 'A prosthetic hand closes, a drone changes heading, a lock opens, a voice answers in another language — within the latency budget.',

    'work.k': 'Selected work',
    'work.h': 'Seven systems.',
    'work.sub': 'Research, products and things that are running right now.',
    'f.all': 'All', 'f.ai': 'AI / ML', 'f.auto': 'Autonomous', 'f.iot': 'Embedded / IoT', 'f.full': 'Full-stack',

    'emg.t': 'EMG Gesture Recognition',
    'emg.o': 'AI & Biomechatronics Lab, YTÜ',
    'emg.d': 'Real-time hand gesture recognition from forearm muscle signals, driving a prosthetic arm and a quadcopter. The CNN reads spatial structure across the electrode array; the LSTM reads how a gesture unfolds in time. Trained on recordings we captured ourselves, and published as an open model and dataset.',

    'noota.t': 'Noota — Voice Translation',
    'noota.o': 'Independent product',
    'noota.d': 'Speak in one language and come out the other side in another, still sounding like yourself. A custom Transformer handles translation while a cloned voice profile carries the speaker’s timbre across. Fine-tuned with LoRA so it fits and runs where it has to.',

    'drone.t': 'Autonomous Industrial Drone',
    'drone.o': 'AI & Autonomous Systems Engineer',
    'drone.d': 'A drone that reads its surroundings and commits to a decision without a pilot. Computer vision detects targets and obstacles on-board; the flight stack turns that into attitude and heading changes in the control loop, not after it.',

    'yshop.t': 'YSHOP — Commerce Platform',
    'yshop.o': 'Full-stack · AI',
    'yshop.d': 'E-commerce, CRM, ERP and delivery in one system. Recommendations run on vector embeddings and semantic search rather than category rules, with retrieval-augmented answers over the catalogue and live courier tracking across customer, store and admin.',

    'marin.t': 'IOTROCOP Marin — Yacht Control',
    'marin.o': 'Architecture to interface',
    'marin.d': 'End-to-end automation for a yacht: firmware on the board, the broker in between, and an iOS app that makes it feel like one object. Built the whole chain — hardware integration, backend, and the interface people actually touch.',

    'smarthome.t': 'Smart Home Controller',
    'smarthome.o': 'Embedded + on-device ML',
    'smarthome.d': 'Home automation with recognition that runs on the device rather than in someone else’s datacentre. Face and voice models trained on real captures, STM32 firmware for the hardware, and one app in front of all of it.',

    'minibus.t': 'MinibusCRM — Fleet Platform',
    'minibus.o': 'Delivered · in service',
    'minibus.d': 'Fleet management with live positions, routes and operational records. Built to be run daily by people who are not technical, which shaped more of the design than the stack did.',

    'l.model': 'Model', 'l.dataset': 'Dataset', 'l.code': 'Code',
    'l.demo': 'Demo', 'l.demo2': 'Second demo', 'l.case': 'Case study',
    's.channels': 'EMG channels', 's.inference': 'Inference', 's.control': 'Control',
    's.status': 'Status', 's.scope': 'Scope', 's.ml': 'ML runs',

    'stack.k': 'Stack',
    'stack.h': 'What I reach for.',
    'sk.ai': 'AI & Machine Learning', 'sk.auto': 'Autonomous Systems',
    'sk.embed': 'Embedded & IoT', 'sk.cloud': 'Backend & Cloud',
    'sk.mobile': 'Mobile', 'sk.web': 'Web',

    'exp.k': 'Path',
    'exp.h': 'Where the work happened.',
    't.full': 'Full-time', 't.part': 'Part-time',
    'ytu.t': 'AI & Embedded Systems Researcher',
    'e.ytu.1': 'Gesture recognition from EMG for prosthetic control',
    'e.ytu.2': 'Published an open model and dataset',
    'e.ytu.3': 'Drone control from the same signal pipeline',
    'iotrocop.t': 'Software Developer — AI, IoT & Autonomous Systems',
    'e.iot.1': 'Smart-home systems on ESP32 and STM32 with real-time control',
    'e.iot.2': 'Flutter apps for remote monitoring and control',
    'e.iot.3': 'Face and voice recognition models trained on real data',
    'mutlaq.t': 'IoT & Machine Learning Researcher',
    'e.mut.1': 'Applied ML on sensor streams',
    'e.mut.2': 'Connected devices and the services behind them',
    'lab.t': 'iOS & Flutter Developer — Embedded',
    'e.lab.1': 'IoT control for biological safety cabinets on STM32 and ESP8266',
    'e.lab.2': 'Flutter apps and sites that keep working offline',
    'e.lab.3': 'Full-stack services in Flask and Node.js',
    'okatan.t': 'iOS & Flutter Developer — Smart Home IoT',
    'e.oka.1': 'Native iOS in SwiftUI alongside cross-platform Flutter',
    'e.oka.2': 'Face recognition, voice control and home monitoring',
    'e.oka.3': 'RFID / NFC access with cloud sync',

    'edu.k': 'Education',
    'edu.d': 'BSc Software Development',
    'edu.o': 'Istanbul Aydın University',
    'edu.g': 'GPA 3.5',
    'lang.k': 'Languages',
    'lang.ar': 'Arabic', 'lang.en': 'English', 'lang.tr': 'Turkish',
    'lv.native': 'Native', 'lv.fluent': 'Fluent', 'lv.inter': 'Intermediate',

    'c.k': 'Contact',
    'c.h': 'Tell me what it has to do.',
    'c.sub': 'Research, a product, or something that has to work on real hardware.',
    'c.email': 'Email', 'c.phone': 'Phone', 'c.github': 'GitHub', 'c.linkedin': 'LinkedIn',
    'c.copy': 'Copy', 'c.copied': 'Copied',
    'foot.r': 'Designed and built from scratch',
    'ui.lang': 'Language', 'ui.theme': 'Theme', 'ui.menu': 'Menu', 'ui.close': 'Close'
  },

  /* ---------------------------------------------------------------- */

  ar: {
    'meta.title': 'محمد صالح — ذكاء اصطناعي وأنظمة ذاتية ومدمجة',

    'nav.work': 'الأعمال', 'nav.system': 'المنظومة', 'nav.stack': 'الأدوات',
    'nav.path': 'المسار', 'nav.contact': 'تواصل',

    'hero.role': 'ذكاء اصطناعي · أنظمة ذاتية · أنظمة مدمجة',
    'hero.loc': 'إسطنبول، تركيا',
    'hero.l1': 'أبني أنظمة',
    'hero.l2': 'تستشعر،',
    'hero.l3': 'تقرّر، وتتصرّف.',
    'hero.sub': 'تعلّم آلي على إشارات حقيقية — من الحسّاس والبرمجيات الثابتة حتى النموذج والواجهة. أنظمة تعمل فعلاً، لا عروض.',
    'hero.scroll': 'مرّر',
    'hero.avail': 'متاح للعمل',

    'm.params': 'معاملات أكبر نموذج',
    'm.latency': 'زمن الاستدلال الكامل',
    'm.audio': 'ساعة تدريب صوتي',
    'm.years': 'سنوات في بناء الأنظمة',

    'sys.k': 'المنظومة',
    'sys.h': 'كل نظام أبنيه يدور في الحلقة نفسها.',
    'sys.sub': 'حسّاسات مختلفة ومشغّلات مختلفة، وأربع مراحل ثابتة. هذا شكل العمل.',
    'p.sense': 'الاستشعار',
    'p.sense.d': 'أقطاب عضلية، ميكروفون، كاميرا، خط ضغط. إشارة خام ومشوّشة وتصل أسرع من أن يفكّر فيها أحد.',
    'p.infer': 'الاستدلال',
    'p.infer.d': 'نموذج مدرَّب على تسجيلات حقيقية لا على مجموعة جاهزة — CNN مع LSTM للإيماءات، ومحوّل للصوت، والتفافي للرؤية.',
    'p.decide': 'القرار',
    'p.decide.d': 'عتبات ثقة ومعالجة ارتداد وخطط بديلة. التصرّف الخاطئ أسوأ من عدم التصرّف، فالنظام مسموح له أن يمتنع.',
    'p.act': 'التنفيذ',
    'p.act.d': 'يد صناعية تنغلق، طائرة تغيّر اتجاهها، قفل ينفتح، صوت يردّ بلغة أخرى — ضمن ميزانية التأخير.',

    'work.k': 'أعمال مختارة',
    'work.h': 'سبعة أنظمة.',
    'work.sub': 'بحث ومنتجات وأشياء تعمل الآن.',
    'f.all': 'الكل', 'f.ai': 'ذكاء اصطناعي', 'f.auto': 'أنظمة ذاتية', 'f.iot': 'مدمجة', 'f.full': 'متكاملة',

    'emg.t': 'تمييز الإيماءات من إشارة العضلات',
    'emg.o': 'مختبر الذكاء الاصطناعي والميكاترونكس الحيوي — YTÜ',
    'emg.d': 'تمييز لحظي لإيماءات اليد من إشارات عضلات الساعد، يقود ذراعاً صناعية وطائرة رباعية. الشبكة الالتفافية تقرأ البنية المكانية عبر مصفوفة الأقطاب، وLSTM تقرأ كيف تتشكّل الإيماءة عبر الزمن. دُرِّب على تسجيلات التقطناها بأنفسنا، ونُشر كنموذج ومجموعة بيانات مفتوحة.',

    'noota.t': 'نوتا — ترجمة صوتية',
    'noota.o': 'منتج مستقل',
    'noota.d': 'تتكلّم بلغة فتخرج بلغة أخرى، وصوتك يبقى صوتك. محوّل مخصّص يتولّى الترجمة، وملف صوتي مستنسخ ينقل طابع المتحدّث. ضُبط بـLoRA ليعمل ضمن الموارد المتاحة.',

    'drone.t': 'طائرة صناعية ذاتية القيادة',
    'drone.o': 'مهندس ذكاء اصطناعي وأنظمة ذاتية',
    'drone.d': 'طائرة تقرأ محيطها وتلتزم بقرار بلا طيّار. الرؤية الحاسوبية تكشف الأهداف والعوائق على متنها، وحزمة الطيران تترجم ذلك إلى تغيّر في الاتجاه داخل حلقة التحكّم لا بعدها.',

    'yshop.t': 'YSHOP — منصّة تجارة',
    'yshop.o': 'متكاملة · ذكاء اصطناعي',
    'yshop.d': 'تجارة إلكترونية وإدارة علاقات وموارد وتوصيل في نظام واحد. التوصيات تقوم على تمثيلات متجهة وبحث دلالي لا على قواعد تصنيف، مع إجابات مدعومة بالاسترجاع وتتبّع حيّ للمندوب عبر لوحات العميل والمتجر والإدارة.',

    'marin.t': 'IOTROCOP Marin — تحكّم يخوت',
    'marin.o': 'من المعمارية إلى الواجهة',
    'marin.d': 'أتمتة كاملة ليخت: برمجيات ثابتة على اللوحة، ووسيط بينها، وتطبيق iOS يجعلها تبدو شيئاً واحداً. بنيت السلسلة كلها — العتاد والخادم والواجهة.',

    'smarthome.t': 'متحكّم المنزل الذكي',
    'smarthome.o': 'أنظمة مدمجة + تعلّم على الجهاز',
    'smarthome.d': 'أتمتة منزلية بتمييز يعمل على الجهاز لا في مركز بيانات بعيد. نماذج وجه وصوت مدرَّبة على التقاطات حقيقية، وبرمجيات STM32 للعتاد، وتطبيق واحد أمام كل ذلك.',

    'minibus.t': 'MinibusCRM — إدارة أسطول',
    'minibus.o': 'مُسلَّم · قيد التشغيل',
    'minibus.d': 'إدارة أسطول بمواقع حيّة ومسارات وسجلات تشغيل. بُني ليُستخدم يومياً من غير التقنيين، وهذا ما شكّل التصميم أكثر من التقنيات نفسها.',

    'l.model': 'النموذج', 'l.dataset': 'البيانات', 'l.code': 'الشيفرة',
    'l.demo': 'عرض', 'l.demo2': 'عرض آخر', 'l.case': 'دراسة الحالة',
    's.channels': 'قناة عضلية', 's.inference': 'الاستدلال', 's.control': 'التحكّم',
    's.status': 'الحالة', 's.scope': 'النطاق', 's.ml': 'التعلّم يعمل',

    'stack.k': 'الأدوات',
    'stack.h': 'ما أعمل به.',
    'sk.ai': 'الذكاء الاصطناعي والتعلّم الآلي', 'sk.auto': 'الأنظمة الذاتية',
    'sk.embed': 'الأنظمة المدمجة وإنترنت الأشياء', 'sk.cloud': 'الخوادم والسحابة',
    'sk.mobile': 'تطبيقات الجوال', 'sk.web': 'الويب',

    'exp.k': 'المسار',
    'exp.h': 'أين جرى العمل.',
    't.full': 'دوام كامل', 't.part': 'دوام جزئي',
    'ytu.t': 'باحث ذكاء اصطناعي وأنظمة مدمجة',
    'e.ytu.1': 'تمييز الإيماءات من إشارة العضلات للتحكّم بالأطراف الصناعية',
    'e.ytu.2': 'نشر نموذج ومجموعة بيانات مفتوحة',
    'e.ytu.3': 'التحكّم بالطائرة من مسار الإشارة نفسه',
    'iotrocop.t': 'مطوّر برمجيات — ذكاء اصطناعي وإنترنت أشياء وأنظمة ذاتية',
    'e.iot.1': 'أنظمة منزل ذكي على ESP32 وSTM32 بتحكّم لحظي',
    'e.iot.2': 'تطبيقات Flutter للمراقبة والتحكّم عن بُعد',
    'e.iot.3': 'نماذج تمييز وجه وصوت مدرَّبة على بيانات حقيقية',
    'mutlaq.t': 'باحث إنترنت أشياء وتعلّم آلي',
    'e.mut.1': 'تطبيق التعلّم الآلي على تدفّقات الحسّاسات',
    'e.mut.2': 'ربط الأجهزة بالخدمات التي تقف خلفها',
    'lab.t': 'مطوّر iOS وFlutter — أنظمة مدمجة',
    'e.lab.1': 'تحكّم بخزائن السلامة الحيوية على STM32 وESP8266',
    'e.lab.2': 'تطبيقات ومواقع تواصل العمل دون اتصال',
    'e.lab.3': 'خدمات متكاملة بـFlask وNode.js',
    'okatan.t': 'مطوّر iOS وFlutter — منزل ذكي',
    'e.oka.1': 'تطبيقات iOS بـSwiftUI إلى جانب Flutter',
    'e.oka.2': 'تمييز وجه وتحكّم صوتي ومراقبة منزلية',
    'e.oka.3': 'دخول بـRFID/NFC مع مزامنة سحابية',

    'edu.k': 'التعليم',
    'edu.d': 'بكالوريوس تطوير برمجيات',
    'edu.o': 'جامعة إسطنبول آيدن',
    'edu.g': 'المعدّل ٣٫٥',
    'lang.k': 'اللغات',
    'lang.ar': 'العربية', 'lang.en': 'الإنجليزية', 'lang.tr': 'التركية',
    'lv.native': 'اللغة الأم', 'lv.fluent': 'بطلاقة', 'lv.inter': 'متوسط',

    'c.k': 'تواصل',
    'c.h': 'قل لي ما الذي يجب أن يفعله.',
    'c.sub': 'بحث، أو منتج، أو شيء لا بدّ أن يعمل على عتاد حقيقي.',
    'c.email': 'البريد', 'c.phone': 'الهاتف', 'c.github': 'GitHub', 'c.linkedin': 'LinkedIn',
    'c.copy': 'نسخ', 'c.copied': 'تم النسخ',
    'foot.r': 'صُمّم وبُني من الصفر',
    'ui.lang': 'اللغة', 'ui.theme': 'المظهر', 'ui.menu': 'القائمة', 'ui.close': 'إغلاق'
  },

  /* ---------------------------------------------------------------- */

  tr: {
    'meta.title': 'Mohammed Saleh — Yapay Zekâ, Otonom ve Gömülü Sistemler',

    'nav.work': 'Çalışmalar', 'nav.system': 'Sistem', 'nav.stack': 'Teknolojiler',
    'nav.path': 'Deneyim', 'nav.contact': 'İletişim',

    'hero.role': 'Yapay Zekâ · Otonom Sistemler · Gömülü',
    'hero.loc': 'İstanbul, Türkiye',
    'hero.l1': 'Algılayan,',
    'hero.l2': 'karar veren,',
    'hero.l3': 'harekete geçen sistemler.',
    'hero.sub': 'Gerçek sinyaller üzerinde makine öğrenmesi — sensörden ve gömülü yazılımdan modele ve arayüze kadar. Demo değil, sahada çalışan sistemler.',
    'hero.scroll': 'Kaydır',
    'hero.avail': 'İşe açığım',

    'm.params': 'En büyük modelin parametresi',
    'm.latency': 'Uçtan uca çıkarım',
    'm.audio': 'Saat eğitim sesi',
    'm.years': 'Yıl sistem geliştirme',

    'sys.k': 'Sistem',
    'sys.h': 'Kurduğum her sistem aynı döngüyü işletir.',
    'sys.sub': 'Farklı sensörler, farklı aktüatörler, aynı dört aşama. İşin şekli bu.',
    'p.sense': 'Algıla',
    'p.sense.d': 'EMG elektrotları, bir mikrofon, bir kamera, bir basınç hattı. Ham, gürültülü ve düşünmeye fırsat bırakmayacak hızda.',
    'p.infer': 'Çıkarım',
    'p.infer.d': 'Hazır veri kümesiyle değil, gerçek kayıtlarla eğitilmiş bir model — jestler için CNN + LSTM, ses için Transformer, görü için evrişim.',
    'p.decide': 'Karar',
    'p.decide.d': 'Güven eşikleri, geri sekme filtreleri, yedek planlar. Yanlış hareket, hiç hareket etmemekten kötüdür; sistem çekimser kalabilir.',
    'p.act': 'Uygula',
    'p.act.d': 'Protez el kapanır, drone rotasını değiştirir, kilit açılır, bir ses başka dilde yanıt verir — gecikme bütçesi içinde.',

    'work.k': 'Seçilmiş çalışmalar',
    'work.h': 'Yedi sistem.',
    'work.sub': 'Araştırma, ürünler ve şu anda çalışan işler.',
    'f.all': 'Tümü', 'f.ai': 'Yapay zekâ', 'f.auto': 'Otonom', 'f.iot': 'Gömülü', 'f.full': 'Full-stack',

    'emg.t': 'EMG ile Jest Tanıma',
    'emg.o': 'Yapay Zekâ & Biyomekatronik Lab, YTÜ',
    'emg.d': 'Önkol kas sinyallerinden gerçek zamanlı el jesti tanıma; bir protez kolu ve bir quadcopter’ı sürüyor. CNN elektrot dizisindeki uzamsal yapıyı, LSTM ise jestin zamanla nasıl geliştiğini okuyor. Kendi kaydettiğimiz verilerle eğitildi, açık model ve veri kümesi olarak yayımlandı.',

    'noota.t': 'Noota — Sesli Çeviri',
    'noota.o': 'Bağımsız ürün',
    'noota.d': 'Bir dilde konuşun, başka bir dilde çıkın — ses yine sizin sesiniz. Çeviriyi özel bir Transformer yapıyor, klonlanmış ses profili konuşmacının tınısını taşıyor. LoRA ile ince ayar yapıldı.',

    'drone.t': 'Otonom Endüstriyel Drone',
    'drone.o': 'Yapay Zekâ & Otonom Sistemler Mühendisi',
    'drone.d': 'Çevresini okuyup pilotsuz karar veren bir drone. Bilgisayarlı görü hedefleri ve engelleri uçuş sırasında tespit ediyor; uçuş yığını bunu kontrol döngüsünün içinde rotaya çeviriyor.',

    'yshop.t': 'YSHOP — Ticaret Platformu',
    'yshop.o': 'Full-stack · Yapay zekâ',
    'yshop.d': 'E-ticaret, CRM, ERP ve teslimat tek sistemde. Öneriler kategori kurallarıyla değil vektör gömmeleri ve anlamsal aramayla çalışıyor; katalog üzerinde RAG yanıtları ve müşteri, mağaza ve yönetim panelleri arasında canlı kurye takibi var.',

    'marin.t': 'IOTROCOP Marin — Yat Kontrolü',
    'marin.o': 'Mimariden arayüze',
    'marin.d': 'Bir yat için uçtan uca otomasyon: karttaki gömülü yazılım, aradaki broker ve hepsini tek bir nesne gibi hissettiren bir iOS uygulaması. Zincirin tamamı — donanım, arka uç ve arayüz.',

    'smarthome.t': 'Akıllı Ev Kontrolcüsü',
    'smarthome.o': 'Gömülü + cihaz üstü ML',
    'smarthome.d': 'Tanımanın başka birinin veri merkezinde değil, cihazda çalıştığı ev otomasyonu. Gerçek kayıtlarla eğitilmiş yüz ve ses modelleri, donanım için STM32 yazılımı ve hepsinin önünde tek bir uygulama.',

    'minibus.t': 'MinibusCRM — Filo Platformu',
    'minibus.o': 'Teslim edildi · kullanımda',
    'minibus.d': 'Canlı konum, rota ve operasyon kayıtlarıyla filo yönetimi. Teknik olmayan kişilerce her gün kullanılmak üzere kuruldu; tasarımı teknolojiden çok bu belirledi.',

    'l.model': 'Model', 'l.dataset': 'Veri kümesi', 'l.code': 'Kod',
    'l.demo': 'Demo', 'l.demo2': 'İkinci demo', 'l.case': 'Vaka çalışması',
    's.channels': 'EMG kanalı', 's.inference': 'Çıkarım', 's.control': 'Kontrol',
    's.status': 'Durum', 's.scope': 'Kapsam', 's.ml': 'ML çalışıyor',

    'stack.k': 'Teknolojiler',
    'stack.h': 'Kullandıklarım.',
    'sk.ai': 'Yapay Zekâ & Makine Öğrenmesi', 'sk.auto': 'Otonom Sistemler',
    'sk.embed': 'Gömülü & IoT', 'sk.cloud': 'Arka Uç & Bulut',
    'sk.mobile': 'Mobil', 'sk.web': 'Web',

    'exp.k': 'Deneyim',
    'exp.h': 'İşin yapıldığı yerler.',
    't.full': 'Tam zamanlı', 't.part': 'Yarı zamanlı',
    'ytu.t': 'Yapay Zekâ & Gömülü Sistemler Araştırmacısı',
    'e.ytu.1': 'Protez kontrolü için EMG’den jest tanıma',
    'e.ytu.2': 'Açık model ve veri kümesi yayımlandı',
    'e.ytu.3': 'Aynı sinyal hattından drone kontrolü',
    'iotrocop.t': 'Yazılım Geliştirici — YZ, IoT & Otonom Sistemler',
    'e.iot.1': 'ESP32 ve STM32 üzerinde gerçek zamanlı akıllı ev sistemleri',
    'e.iot.2': 'Uzaktan izleme ve kontrol için Flutter uygulamaları',
    'e.iot.3': 'Gerçek veriyle eğitilmiş yüz ve ses tanıma modelleri',
    'mutlaq.t': 'IoT & Makine Öğrenmesi Araştırmacısı',
    'e.mut.1': 'Sensör akışları üzerinde uygulamalı ML',
    'e.mut.2': 'Cihazlar ve arkalarındaki servislerin entegrasyonu',
    'lab.t': 'iOS & Flutter Geliştirici — Gömülü',
    'e.lab.1': 'STM32 ve ESP8266 ile biyogüvenlik kabini kontrolü',
    'e.lab.2': 'Çevrimdışı da çalışan Flutter uygulamaları ve siteler',
    'e.lab.3': 'Flask ve Node.js ile uçtan uca servisler',
    'okatan.t': 'iOS & Flutter Geliştirici — Akıllı Ev IoT',
    'e.oka.1': 'SwiftUI ile yerel iOS ve Flutter ile çoklu platform',
    'e.oka.2': 'Yüz tanıma, sesle kontrol ve ev izleme',
    'e.oka.3': 'Bulut senkronizasyonlu RFID / NFC erişim',

    'edu.k': 'Eğitim',
    'edu.d': 'Yazılım Geliştirme Lisans',
    'edu.o': 'İstanbul Aydın Üniversitesi',
    'edu.g': 'GPA 3.5',
    'lang.k': 'Diller',
    'lang.ar': 'Arapça', 'lang.en': 'İngilizce', 'lang.tr': 'Türkçe',
    'lv.native': 'Anadil', 'lv.fluent': 'Akıcı', 'lv.inter': 'Orta',

    'c.k': 'İletişim',
    'c.h': 'Ne yapması gerektiğini söyleyin.',
    'c.sub': 'Araştırma, bir ürün ya da gerçek donanımda çalışması gereken bir şey.',
    'c.email': 'E-posta', 'c.phone': 'Telefon', 'c.github': 'GitHub', 'c.linkedin': 'LinkedIn',
    'c.copy': 'Kopyala', 'c.copied': 'Kopyalandı',
    'foot.r': 'Sıfırdan tasarlandı ve kodlandı',
    'ui.lang': 'Dil', 'ui.theme': 'Tema', 'ui.menu': 'Menü', 'ui.close': 'Kapat'
  }
};

/* language proficiency, rendered as meters */
export const LANG_LEVELS = [
  { key: 'lang.ar', lv: 'lv.native', v: 100 },
  { key: 'lang.en', lv: 'lv.fluent', v: 88 },
  { key: 'lang.tr', lv: 'lv.inter',  v: 62 }
];
