/* ==================================================================
   PCBAI CASE STUDY — copy, in three languages

   Same shape as case-i18n.js: long-form prose that only this page
   loads, sharing the site's language key so a reader who switched to
   Arabic on the portfolio lands here in Arabic.

   Every number here is measured. Nothing is rounded up, and nothing
   that was not verified against a confirmed label is stated as a
   result.
================================================================== */

export const C = {

  en: {
    'c.title':'An AOI station that finds the missing part — Mohammed Saleh',
    'c.back':'Work', 'c.label':'Case study',
    'c.kick':'Computer vision · Machine learning · 2026',
    'c.h':'An inspection station that finds the missing part.',
    'c.lede':'A machine photographs an assembled panel of circuit boards, finds every board on it by itself, and tells the operator exactly which component is missing or misplaced on which board — with no per-board programming beyond the design file. Deployed in production at an SMT factory in Istanbul.',
    'c.demo':'Watch it run',
    'c.demo2':'Second run',

    'c.f1k':'Detection',  'c.f1v':'40 / 40 confirmed missing parts · 0 false positives',
    'c.f2k':'Alignment',  'c.f2v':'0.10 mm, from 1–2.5 mm',
    'c.f3k':'Throughput', 'c.f3v':'58 s per panel, including camera motion',
    'c.f4k':'Status',     'c.f4v':'In production · sole engineer',

    'c.mk':'Measured',
    'c.m1v':'40 / 40', 'c.m1k':'engineer-confirmed missing components detected, 0 false positives against verified labels',
    'c.m2v':'10 / 10', 'c.m2k':'boards located automatically across multi-board panels, 0 false accepts',
    'c.m3v':'0.10 mm', 'c.m3k':'design-to-image alignment error, down from 1–2.5 mm',
    'c.m4v':'545',     'c.m4k':'per-part checks on a second board type: every real defect found, 0 false alarms on test boards',
    'c.m5v':'3 · 180', 'c.m5k':'board types supported, up to 180 components on a board',
    'c.m6v':'58 s',    'c.m6k':'per panel end to end, including camera motion',
    'c.m7v':'251',     'c.m7k':'automated tests',
    'c.m8v':'175+',    'c.m8k':'reviewed pull requests',

    /* 01 */
    'c.s1':'The problem',
    'c.s1p1':'A factory verifies thousands of components per shift. The commercial answer is an AOI machine that costs more than the line it sits on and needs hours of programming for every new board type — which is exactly the cost a small shop cannot carry.',
    'c.s1p2':'The target was blunt: put a board and its Pick & Place file in, get a defect list out. Nothing in between.',
    'c.s1pull':'A false PASS ships a broken board. A false FAIL costs an operator ten seconds. Those are not the same cost, so the system leans toward flagging — but every threshold is scaled to the photograph it came from, or the warnings stop being worth reading.',

    /* 02 */
    'c.s2':'Finding the boards, from the bottom up',
    'c.s2p1':'The obvious approach is to fit a grid: the panel holds four boards, so divide it in four. I measured four geometric splitting methods — autocorrelation, normalised cross-correlation, and two seam detectors — and all four failed on real panels before I chose anything else.',
    'c.s2p2':'They fail in the worst possible way. <strong>A shifted grid still fits its own model.</strong> Every internal check passes, the confidence is high, and the output is off by one board. Nothing in the system can tell.',
    'c.s2p3':'So the station does not assume a layout. It detects what is physically on the copper, and matches that point pattern against the placements in the design file with RANSAC. Every self-consistent match is one board, with its own homography — and because a homography is what comes out, the camera’s perspective is removed in the same step rather than corrected afterwards.',

    /* 03 */
    'c.s3':'Testing for the failure you cannot see',
    'c.s3p1':'A residual threshold answers the wrong question. It asks whether the fit is good, when the dangerous case is a wrong fit that is also good.',
    'c.s3p2':'So each accepted pose is deliberately pushed 3–5 mm in eight directions, and has to beat the best of those wrong poses. Measured: <strong>49 of 49 features matched at the true pose against 12 of 49 at the nearest wrong one</strong> — a fourfold margin. That is a direct test for silent misalignment, not a proxy for it.',
    'c.s3pull':'Three states, never two: OK, DEFECT, UNSURE. A part the system cannot settle goes to a person. It never goes to a silent pass.',

    /* 04 */
    'c.s4':'Thresholds that travel',
    'c.s4p1':'A fixed colour threshold passed a board on one machine and failed the same board on another. The difference was one pixel: 0.139 against 0.18. A number that depends on which computer you ran it on is not a measurement.',
    'c.s4p2':'It was replaced with a robust z-score computed within each board, so every part is judged against its own board’s lighting rather than against a constant. Real defects scored <strong>4.6 to 11.3</strong>; good parts stayed at <strong>2.7 or below</strong> — and both machines now return the same answer.',
    'c.s4p3':'Scoring on the single largest deviation was not enough either: glare on a connector reached 19 to 53 on perfectly good boards. Requiring the second-largest feature to agree separated them cleanly — worst good part 6.6, lowest real defect 7.4.',

    /* 05 */
    'c.s5':'Measuring honestly',
    'c.s5p1':'The train/test split is by physical board, not by photograph. That mattered: an early split let the same board appear on both sides, which quietly inflated every number until it was found and removed.',
    'c.s5p2':'Model selection uses balanced accuracy, because plain accuracy rewards a model that says everything is fine — one such model scored <strong>96.2%</strong> while being useless. And a training ratchet keeps the better model on the same held-out data, so a new run can never quietly make things worse.',
    'c.s5l1':'The lesson I keep: a number that cannot go down is not a measurement, it is a decoration.',

    /* 06 */
    'c.s6':'Knowing the physical limit',
    'c.s6p1':'Displacement detection kept missing small shifts, and the temptation was to tune the algorithm. I measured instead: position noise of <strong>0.78 mm</strong> at 10 px/mm, against defects of 1.5 mm. A signal-to-noise ratio of 1.9 to 1.',
    'c.s6p2':'No amount of tuning fixes that. It is a resolution problem, and it drove the move to close-up capture at 30 px/mm — 5.8 to 1 — rather than another month of parameters.',

    /* 07 */
    'c.s7':'The system',
    'c.s7a':'<strong>Vision.</strong> SIFT features with RANSAC homography, pad and body detection, per-part comparison against confirmed-good boards, and Lab colour analysis of component bodies.',
    'c.s7b':'<strong>Teach by example.</strong> A new board type is learned from a few good boards plus its Pick & Place file. Altium exports and placement-machine programs are both parsed, with encoding and units detected automatically.',
    'c.s7c':'<strong>Motion.</strong> The camera centres itself over each board on a stepper rail, calibrated optically at 0.146 px/step, with soft limits, closed-loop correction to 1 mm, and no lost steps.',
    'c.s7d':'<strong>Operator app.</strong> An English and Turkish touch interface on the station display. Findings are colour-coded — green for OK, orange for misplaced, red for missing — and drawn in the original image’s pixel space, so a marker stays exactly on its part at any zoom.',
    'c.s7e':'<strong>Deployment.</strong> A GPU server, a Raspberry Pi at the station, a networked camera, remote access, and automatic recovery after a power cut.',

    /* 08 */
    'c.s8':'What I got wrong',
    'c.s8p1':'The detector started reporting defects that were not in the labels. The first assumption was that it was wrong. Checked at full resolution, <strong>the defects were real and the human labels had missed them.</strong>',
    'c.s8p2':'That is a good result and a bad process: for a while, the ground truth was quietly worse than the thing being measured against it. Label provenance is tracked now, so an unverified label can never count as truth.',
    'c.s8l1':'Every number on this page is against confirmed labels only. The rest are observations, and they are kept apart.',

    /* 09 */
    'c.s9':'What is next',
    'c.s9a':'X/Y serpentine close-up scanning, for solder-joint and polarity inspection.',

    'c.all':'All work', 'c.touch':'Get in touch'
  },

  ar: {
    'c.title':'محطة فحص تعرف القطعة الناقصة — محمد صالح',
    'c.back':'الأعمال', 'c.label':'دراسة حالة',
    'c.kick':'رؤية حاسوبية · تعلّم آلي · 2026',
    'c.h':'محطة فحص تعرف القطعة الناقصة.',
    'c.lede':'آلة تصوّر لوحة فيها عدة بوردات مجمّعة، تلقى كل بوردة فيها بنفسها، وتقول للعامل أي قطعة ناقصة أو في غير مكانها، وفي أي بوردة بالضبط — بلا أي برمجة لكل بوردة غير ملف التصميم. تشتغل اليوم في مصنع لوحات إلكترونية في إسطنبول.',
    'c.demo':'شاهدها تشتغل',
    'c.demo2':'تشغيل آخر',

    'c.f1k':'الاكتشاف', 'c.f1v':'40 من 40 قطعة ناقصة مؤكَّدة · صفر إنذار كاذب',
    'c.f2k':'المطابقة', 'c.f2v':'0.10 ملم، بعد ما كانت 1 إلى 2.5',
    'c.f3k':'السرعة',   'c.f3v':'58 ثانية للوحة كاملة، مع حركة الكاميرا',
    'c.f4k':'الحالة',   'c.f4v':'تعمل في الإنتاج · المهندس الوحيد',

    'c.mk':'بالقياس',
    'c.m1v':'40 / 40', 'c.m1k':'قطعة ناقصة أكّدها مهندس اكتشفها النظام، وصفر إنذار كاذب مقابل أخطاء موثّقة',
    'c.m2v':'10 / 10', 'c.m2k':'بوردات حُدّد مكانها تلقائياً داخل لوحات متعدّدة، وصفر قبول خاطئ',
    'c.m3v':'0.10 ملم','c.m3k':'فرق المطابقة بين التصميم والصورة، بعد ما كان من 1 إلى 2.5 ملم',
    'c.m4v':'545',     'c.m4k':'فحص قطعة على نوع بوردة ثانٍ: كل عيب حقيقي وُجد، وصفر إنذار كاذب على بوردات الاختبار',
    'c.m5v':'3 · 180', 'c.m5k':'أنواع بوردات مدعومة، وحتى 180 قطعة في البوردة الواحدة',
    'c.m6v':'58 ثانية','c.m6k':'للوحة الواحدة من أولها لآخرها، مع حركة الكاميرا',
    'c.m7v':'251',     'c.m7k':'اختباراً آلياً',
    'c.m8v':'175+',    'c.m8k':'طلب دمج مراجَع',

    /* 01 */
    'c.s1':'المشكلة',
    'c.s1p1':'المصنع يفحص آلاف القطع في الوردية الواحدة. الحل الجاهز في السوق جهاز فحص بصري يكلّف أكثر من الخط اللي واقف عليه، ويحتاج ساعات برمجة لكل نوع بوردة جديد — وهذي بالضبط التكلفة اللي ورشة صغيرة ما تقدر عليها.',
    'c.s1p2':'الهدف كان واضحاً: تحط البوردة وملف التركيب حقها، يطلع لك جدول العيوب. ما في شيء بينهما.',
    'c.s1pull':'النجاح الكاذب يشحن بوردة خربانة. والرفض الكاذب يكلّف العامل عشر ثوانٍ. التكلفتان مش متساويتين، فالنظام يميل إلى الإنذار — لكن كل عتبة فيه تُحسب من الصورة نفسها، وإلا صارت الإنذارات ما تستاهل القراءة.',

    /* 02 */
    'c.s2':'نلقى البوردات من تحت لفوق',
    'c.s2p1':'الطريقة البديهية إنك تفرض شبكة: اللوحة فيها أربع بوردات، إذن قسّمها أربعة. قست أربع طرق هندسية للتقسيم — الارتباط الذاتي، والارتباط المتقاطع المعيّر، وكاشفَي خطوط الفصل — وكلها الأربع فشلت على لوحات حقيقية قبل ما أختار شيئاً ثانياً.',
    'c.s2p2':'وفشلها من أسوأ نوع. <strong>الشبكة المزاحة تظل مطابقة لنموذجها هي.</strong> كل الفحوص الداخلية تنجح، والثقة عالية، والنتيجة مزاحة بوردة كاملة. وما في شيء داخل النظام يقدر يكتشف ذلك.',
    'c.s2p3':'لذلك المحطة ما تفترض أي ترتيب. تكشف ما هو موجود فعلاً على النحاس، وتطابق هذي النقاط مع مواضع القطع في ملف التصميم بطريقة RANSAC. كل مطابقة متماسكة مع نفسها = بوردة واحدة، ولها تحويلها الخاص — ولأن الناتج تحويل مستوٍ، ميلان الكاميرا يختفي في نفس الخطوة بدل ما يُصحَّح بعدها.',

    /* 03 */
    'c.s3':'نختبر العطل الذي لا يُرى',
    'c.s3p1':'عتبة الخطأ المتبقّي تجاوب على السؤال الغلط. هي تسأل: هل المطابقة جيدة؟ والحالة الخطيرة هي مطابقة <em>خاطئة</em> وجيدة في نفس الوقت.',
    'c.s3p2':'فكل وضع مقبول يُزاح عمداً من 3 إلى 5 ملم في ثماني اتجاهات، ولازم يتفوّق على أفضل وضع خاطئ منها. والقياس: <strong>49 معلماً من 49 تطابقت في الوضع الصحيح، مقابل 12 من 49 في أقرب وضع خاطئ</strong> — أي أربعة أضعاف. هذا اختبار مباشر للانحراف الصامت، مش مؤشر غير مباشر عليه.',
    'c.s3pull':'ثلاث حالات، لا اثنتان: سليم، أو عيب، أو غير متأكّد. والقطعة اللي ما يقدر يحسمها تروح لإنسان. ما تروح أبداً إلى نجاح صامت.',

    /* 04 */
    'c.s4':'عتبات تنتقل مع الجهاز',
    'c.s4p1':'عتبة لون ثابتة نجّحت بوردة على جهاز ورسّبت نفس البوردة على جهاز ثانٍ. والفرق كان بكسل واحد: 0.139 مقابل 0.18. والرقم اللي يتغيّر حسب الكمبيوتر اللي شغّلته عليه مش قياساً.',
    'c.s4p2':'بدّلتها بدرجة معيارية صامدة تُحسب داخل كل بوردة، فكل قطعة تُحكم على ضوء بوردتها هي لا على ثابت. العيوب الحقيقية جاءت بين <strong>4.6 و11.3</strong>، والقطع السليمة بقيت عند <strong>2.7 أو أقل</strong> — والجهازان صارا يعطيان نفس الجواب.',
    'c.s4p3':'والاعتماد على أكبر انحراف وحده ما كفى: لمعة على موصّل وصلت من 19 إلى 53 على بوردات سليمة تماماً. فاشترطت أن يوافق ثاني أكبر معلم، فانفصلت الحالتان بوضوح — أسوأ قطعة سليمة 6.6، وأقل عيب حقيقي 7.4.',

    /* 05 */
    'c.s5':'قياس صادق',
    'c.s5p1':'تقسيم التدريب والاختبار صار حسب البوردة الفيزيائية، لا حسب الصورة. وهذا فرق مهم: تقسيم مبكّر سمح لنفس البوردة أن تظهر في الجهتين، فنفخ كل الأرقام بهدوء إلى أن اكتُشف وأُزيل.',
    'c.s5p2':'واختيار النموذج يعتمد الدقّة المتوازنة، لأن الدقّة العادية تكافئ نموذجاً يقول «كل شيء تمام» — نموذج كهذا سجّل <strong>96.2%</strong> وهو عديم الفائدة. وفيه سقّاطة تدريب تُبقي النموذج الأفضل على نفس البيانات المحجوزة، فما تقدر جولة جديدة تخرّب بصمت.',
    'c.s5l1':'الدرس اللي أحتفظ به: الرقم اللي ما يقدر ينزل مش قياساً، هو زينة.',

    /* 06 */
    'c.s6':'معرفة الحد الفيزيائي',
    'c.s6p1':'كشف الإزاحة كان يفوّت الإزاحات الصغيرة، والإغراء أن تضبط الخوارزمية أكثر. بدل ذلك قست: ضجيج موضع <strong>0.78 ملم</strong> عند 10 بكسل لكل ملم، مقابل عيوب حجمها 1.5 ملم. أي نسبة إشارة إلى ضجيج 1.9 إلى 1.',
    'c.s6p2':'ما في ضبط يصلح هذا. هي مشكلة دقّة تصوير، وهي اللي دفعت للانتقال إلى تصوير قريب عند 30 بكسل لكل ملم — 5.8 إلى 1 — بدل شهر آخر من تعديل المعاملات.',

    /* 07 */
    'c.s7':'النظام',
    'c.s7a':'<strong>الرؤية.</strong> معالم SIFT مع تحويل RANSAC، وكشف الوسائد وأجسام القطع، ومقارنة كل قطعة ببوردات سليمة مؤكَّدة، وتحليل لون أجسام القطع في فضاء Lab.',
    'c.s7b':'<strong>التعليم بالمثال.</strong> النوع الجديد يُتعلَّم من بضع بوردات سليمة ومن ملف التركيب حقه. يقرأ مخرجات Altium وبرامج ماكينات التركيب، ويكتشف الترميز والوحدات لوحده.',
    'c.s7c':'<strong>الحركة.</strong> الكاميرا تتوسّط كل بوردة على سكّة بمحرّك خطوي، معايَرة بصرياً عند 0.146 بكسل لكل خطوة، مع حدود برمجية، وتصحيح مغلق الحلقة حتى 1 ملم، وبلا أي خطوة ضائعة.',
    'c.s7d':'<strong>شاشة العامل.</strong> واجهة لمس بالإنجليزية والتركية على شاشة المحطة. النتائج ملوّنة — أخضر سليم، برتقالي في غير مكانه، أحمر ناقص — وتُرسم في فضاء بكسلات الصورة الأصلية، فالعلامة تبقى على قطعتها بالضبط مهما كبّرت.',
    'c.s7e':'<strong>التشغيل.</strong> خادم بكرت رسوميات، وراسبيري باي في المحطة، وكاميرا على الشبكة، ودخول عن بُعد، واستعادة تلقائية بعد انقطاع الكهرباء.',

    /* 08 */
    'c.s8':'أين أخطأت',
    'c.s8p1':'بدأ الكاشف يبلّغ عن عيوب مش موجودة في البيانات الموثّقة. وأول افتراض كان إنه غلطان. وبالفحص بالدقّة الكاملة تبيّن أن <strong>العيوب حقيقية، وأن التوثيق البشري هو اللي فاته.</strong>',
    'c.s8p2':'وهذي نتيجة حلوة وعملية سيئة: لفترة، كان المرجع اللي أقيس عليه أسوأ من الشيء اللي أقيسه. اليوم مصدر كل علامة متتبَّع، فما تقدر علامة غير مؤكَّدة أن تُحسب مرجعاً.',
    'c.s8l1':'كل رقم في هذي الصفحة مقابل علامات مؤكَّدة فقط. والباقي ملاحظات، ومفصولة عنها.',

    /* 09 */
    'c.s9':'الخطوة القادمة',
    'c.s9a':'مسح قريب متعرّج على المحورين، لفحص لحام الأرجل واتجاه القطع.',

    'c.all':'كل الأعمال', 'c.touch':'تواصل'
  },

  tr: {
    'c.title':'Eksik parçayı bulan bir muayene istasyonu — Mohammed Saleh',
    'c.back':'Çalışmalar', 'c.label':'Vaka çalışması',
    'c.kick':'Bilgisayarlı görü · Makine öğrenmesi · 2026',
    'c.h':'Eksik parçayı bulan bir muayene istasyonu.',
    'c.lede':'Makine, dizgisi yapılmış bir kart panelini fotoğraflıyor, üzerindeki her kartı kendisi buluyor ve operatöre hangi kartta hangi parçanın eksik ya da yanlış yerleştirilmiş olduğunu söylüyor — tasarım dosyası dışında kart başına hiçbir programlama olmadan. İstanbul’da bir SMT fabrikasında üretimde çalışıyor.',
    'c.demo':'Çalışırken izle',
    'c.demo2':'İkinci çekim',

    'c.f1k':'Tespit',    'c.f1v':'40 / 40 onaylı eksik parça · 0 yanlış alarm',
    'c.f2k':'Hizalama',  'c.f2v':'0,10 mm — eskiden 1–2,5 mm',
    'c.f3k':'Hız',       'c.f3v':'Panel başına 58 sn, kamera hareketi dahil',
    'c.f4k':'Durum',     'c.f4v':'Üretimde · tek mühendis',

    'c.mk':'Ölçüldü',
    'c.m1v':'40 / 40', 'c.m1k':'mühendis onaylı eksik parça tespit edildi, doğrulanmış etiketlere karşı 0 yanlış alarm',
    'c.m2v':'10 / 10', 'c.m2k':'çok kartlı panellerde kart otomatik olarak konumlandırıldı, 0 yanlış kabul',
    'c.m3v':'0,10 mm', 'c.m3k':'tasarım–görüntü hizalama hatası, eskiden 1–2,5 mm',
    'c.m4v':'545',     'c.m4k':'ikinci kart tipinde parça kontrolü: her gerçek kusur bulundu, test kartlarında 0 yanlış alarm',
    'c.m5v':'3 · 180', 'c.m5k':'desteklenen kart tipi, kart başına 180 parçaya kadar',
    'c.m6v':'58 sn',   'c.m6k':'panel başına uçtan uca, kamera hareketi dahil',
    'c.m7v':'251',     'c.m7k':'otomatik test',
    'c.m8v':'175+',    'c.m8k':'incelenmiş pull request',

    'c.s1':'Problem',
    'c.s1p1':'Bir fabrika vardiya başına binlerce parça doğruluyor. Ticari çözüm, üzerinde durduğu hattan pahalı ve her yeni kart tipi için saatlerce programlama isteyen bir AOI makinesi — küçük bir atölyenin kaldıramayacağı maliyet tam olarak bu.',
    'c.s1p2':'Hedef netti: kartı ve Pick & Place dosyasını koy, kusur listesini al. Arada başka bir şey yok.',
    'c.s1pull':'Yanlış bir GEÇTİ bozuk kartı sevk eder. Yanlış bir KALDI operatöre on saniyeye mal olur. Bu ikisi aynı maliyet değil; bu yüzden sistem uyarmaya meyilli — ama her eşik geldiği fotoğrafa göre ölçekleniyor, yoksa uyarılar okunmaya değmez olur.',

    'c.s2':'Kartları aşağıdan yukarı bulmak',
    'c.s2p1':'Akla ilk gelen bir ızgara oturtmak: panelde dört kart var, o hâlde dörde böl. Dört geometrik bölme yöntemini ölçtüm — otokorelasyon, normalize çapraz korelasyon ve iki dikiş bulucu — ve başka bir şey seçmeden önce dördü de gerçek panellerde başarısız oldu.',
    'c.s2p2':'Üstelik en kötü biçimde. <strong>Kaymış bir ızgara kendi modeline yine de uyar.</strong> Tüm iç kontroller geçer, güven yüksektir ve çıktı bir kart kaymıştır. Sistemin içinde bunu anlayabilecek hiçbir şey yoktur.',
    'c.s2p3':'Bu yüzden istasyon bir yerleşim varsaymıyor. Bakırın üzerinde fiziksel olarak ne varsa onu buluyor ve bu nokta desenini tasarım dosyasındaki yerleşimlerle RANSAC ile eşliyor. Kendi içinde tutarlı her eşleşme, kendi homografisi olan bir karttır — ve çıktı bir homografi olduğu için kameranın perspektifi sonradan düzeltilmek yerine aynı adımda kalkar.',

    'c.s3':'Görülemeyen arızayı test etmek',
    'c.s3p1':'Artık eşiği yanlış soruyu sorar. “Uyum iyi mi?” diye sorar; oysa tehlikeli durum, aynı zamanda iyi olan <em>yanlış</em> bir uyumdur.',
    'c.s3p2':'Bu yüzden kabul edilen her poz sekiz yönde 3–5 mm kasten itiliyor ve bu yanlış pozların en iyisini yenmek zorunda. Ölçüm: <strong>doğru pozda 49 özellikten 49’u, en yakın yanlış pozda 49’da 12</strong> — dört kat marj. Bu, sessiz hizasızlığın dolaylı bir göstergesi değil, doğrudan testi.',
    'c.s3pull':'İki değil, üç durum: TAMAM, KUSUR, EMİN DEĞİL. Sistemin karara bağlayamadığı parça bir insana gider. Asla sessiz bir geçişe gitmez.',

    'c.s4':'Makineden makineye taşınan eşikler',
    'c.s4p1':'Sabit bir renk eşiği bir makinede kartı geçirdi, aynı kartı başka makinede bıraktı. Fark tek pikseldi: 0,139’a karşı 0,18. Hangi bilgisayarda çalıştırdığınıza bağlı bir sayı ölçüm değildir.',
    'c.s4p2':'Yerine her kartın kendi içinde hesaplanan dayanıklı bir z-skoru geldi; böylece her parça bir sabite göre değil, kendi kartının ışığına göre değerlendiriliyor. Gerçek kusurlar <strong>4,6 ile 11,3</strong> arasında; sağlam parçalar <strong>2,7 ve altında</strong> kaldı — ve iki makine artık aynı yanıtı veriyor.',
    'c.s4p3':'Tek en büyük sapmaya bakmak da yetmedi: bir konnektördeki parlama, kusursuz kartlarda 19–53’e çıkıyordu. İkinci en büyük özelliğin de onaylamasını şart koşmak ikisini net ayırdı — en kötü sağlam parça 6,6, en düşük gerçek kusur 7,4.',

    'c.s5':'Dürüst ölçüm',
    'c.s5p1':'Eğitim/test ayrımı fotoğrafa göre değil, fiziksel karta göre. Bu önemliydi: erken bir ayrım aynı kartın iki tarafta da görünmesine izin verdi ve bulunup kaldırılana kadar bütün sayıları sessizce şişirdi.',
    'c.s5p2':'Model seçimi dengeli doğruluk kullanıyor, çünkü düz doğruluk “her şey yolunda” diyen bir modeli ödüllendirir — böyle bir model işe yaramazken <strong>%96,2</strong> aldı. Ayrıca bir eğitim kilidi, aynı ayrılmış veri üzerinde daha iyi modeli koruyor; yeni bir koşu işleri sessizce kötüleştiremiyor.',
    'c.s5l1':'Aklımda tuttuğum ders: düşemeyen bir sayı ölçüm değil, süstür.',

    'c.s6':'Fiziksel sınırı bilmek',
    'c.s6p1':'Kayma tespiti küçük kaymaları kaçırıyordu ve algoritmayı ayarlama isteği büyüktü. Bunun yerine ölçtüm: 10 px/mm’de <strong>0,78 mm</strong> konum gürültüsü, 1,5 mm’lik kusurlara karşı. Sinyal–gürültü oranı 1,9’a 1.',
    'c.s6p2':'Hiçbir ayar bunu düzeltmez. Bu bir çözünürlük problemi ve bir ay daha parametre denemek yerine 30 px/mm yakın çekime — 5,8’e 1 — geçişi doğuran da buydu.',

    'c.s7':'Sistem',
    'c.s7a':'<strong>Görü.</strong> RANSAC homografisiyle SIFT özellikleri, pad ve gövde tespiti, onaylı sağlam kartlara karşı parça bazlı karşılaştırma ve gövdelerin Lab renk analizi.',
    'c.s7b':'<strong>Örnekle öğretme.</strong> Yeni bir kart tipi, birkaç sağlam kart ve Pick & Place dosyasından öğreniliyor. Altium çıktıları ve dizgi makinesi programları ayrıştırılıyor; kodlama ve birimler otomatik tespit ediliyor.',
    'c.s7c':'<strong>Hareket.</strong> Kamera step motorlu ray üzerinde her kartın üzerine kendini ortalıyor; optik olarak 0,146 px/adım kalibre, yazılım limitleri, 1 mm’ye kapalı çevrim düzeltme ve kayıp adım yok.',
    'c.s7d':'<strong>Operatör arayüzü.</strong> İstasyon ekranında İngilizce ve Türkçe dokunmatik arayüz. Bulgular renk kodlu — yeşil tamam, turuncu yanlış yerleşmiş, kırmızı eksik — ve özgün görüntünün piksel uzayında çiziliyor, böylece işaret her yakınlaştırmada parçasının tam üzerinde kalıyor.',
    'c.s7e':'<strong>Kurulum.</strong> Bir GPU sunucu, istasyonda bir Raspberry Pi, ağa bağlı kamera, uzaktan erişim ve elektrik kesintisinden sonra otomatik toparlanma.',

    'c.s8':'Neyi yanlış yaptım',
    'c.s8p1':'Dedektör, etiketlerde olmayan kusurlar bildirmeye başladı. İlk varsayım onun yanıldığıydı. Tam çözünürlükte bakıldığında <strong>kusurlar gerçekti ve insan etiketleri onları kaçırmıştı.</strong>',
    'c.s8p2':'Bu iyi bir sonuç ama kötü bir süreç: bir süre, karşılaştırma yaptığım referans, ölçtüğüm şeyden sessizce daha kötüydü. Artık etiket kaynağı izleniyor; doğrulanmamış bir etiket asla gerçek sayılamıyor.',
    'c.s8l1':'Bu sayfadaki her sayı yalnızca onaylı etiketlere karşı. Geri kalanı gözlemdir ve ayrı tutulur.',

    'c.s9':'Sırada ne var',
    'c.s9a':'Lehim bağlantısı ve polarite muayenesi için X/Y yılankavi yakın çekim tarama.',

    'c.all':'Tüm çalışmalar', 'c.touch':'İletişime geç'
  }
};
