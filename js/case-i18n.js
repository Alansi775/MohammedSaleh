/* ==================================================================
   CASE STUDY — copy, in three languages

   Kept apart from the site dictionary because it is long-form prose
   that only this page loads. The language choice is shared with the
   rest of the site through the same localStorage key, so switching
   here and going back does not reset you.
================================================================== */

export const C = {

  en: {
    'c.title':'Reading an answer sheet from a phone camera — Mohammed Saleh',
    'c.back':'Work', 'c.label':'Case study',
    'c.kick':'Computer vision · 2026',
    'c.h':'Reading an answer sheet from a phone camera.',
    'c.lede':'A Turkish mock-exam platform scores paper answer sheets from a photograph. The alternative in that market is a dedicated optical mark reader costing thousands. The goal was to reach its accuracy with a camera most students already own.',

    'c.f1k':'Result',     'c.f1v':'86 correct · 0 wrong · 2 refused',
    'c.f2k':'Reference',  'c.f2v':'The commercial scanner’s own output',
    'c.f3k':'Role',       'c.f3v':'Mobile, backend and the vision pipeline',
    'c.f4k':'Built with', 'c.f4v':'OpenCV · ONNX · NestJS · SwiftUI · Flutter',

    'c.pd1':'photo', 'c.pd2':'16 thresholds, in parallel', 'c.pd3':'majority vote',
    'c.pd4':'graph \u2192 rows, columns', 'c.pd5':'answers',
    'c.s1':'The problem',
    'c.s1p1':'A student fills in a paper optical form. They photograph it with a phone, or a school scans a stack of them into a PDF. The system has to read two things off that image — who the sheet belongs to, and what they answered — and turn it into a score.',
    'c.s1p2':'A purpose-built OMR scanner solves this by removing the hard part: controlled light, a fixed transport, a sheet that cannot be rotated. A phone gives you none of that. It gives you glare across half the page, a sheet at an angle, a sheet upside down, shadows from the hand holding it, and a resolution that varies with how close the student stood.',
    'c.s1pull':'The bar was not “does it mostly work”. The bar was the output of the machine it was replacing, on the same sheets.',

    'c.s2':'Why it was hard',
    'c.s2p1':'Every individual step has a textbook answer. Thresholding turns a photo into black and white. Hough circles find the bubbles. The difficulty is that each textbook answer has a parameter, and no single value of that parameter survives the range of photographs real students send.',
    'c.s2p2':'A threshold that reads a bubble correctly in flat light merges two bubbles under glare. A radius that finds every circle on a close photograph finds printed decorations on a distant one. Tune for one page and you lose another.',
    'c.s2p3':'So the pipeline does not try to pick the right parameter. It runs many, and treats each one as a witness.',

    'c.s3':'The approach: gather evidence, then decide',
    'c.s3p1':'Circles are detected under <strong>sixteen thresholding strategies in parallel</strong>. Each produces its own set of candidate circles. They are merged by majority vote, and the radii trimmed to the agreed range — a circle that only one strategy saw is noise; a circle fourteen of them saw is a bubble.',
    'c.s3p2':'The surviving circles are then assembled into a <strong>graph</strong>: neighbours by distance and alignment, which yields the columns and rows of the form without anyone having told the system what the form looks like. A reader walks that graph and turns it into answers.',
    'c.s3cap':'No single strategy and no single image scale is trusted. Sixteen are run, and the circles they agree on are the ones that survive.',
    'c.s3ask':'Stack',
    'c.s3as':'NestJS and TypeScript in strict mode, PostgreSQL through Prisma, BullMQ and Redis for the queues. Image work in OpenCV and sharp, with scanned PDFs rasterised at 200 DPI. A small model reads rows, trained in PyTorch and exported to ONNX so it runs inside the backend rather than behind a second service to deploy and keep alive.',

    'c.demo':'Watch it run',
    'c.s3b':'What the capture actually has to do',
    'c.s3bp1':'The hardest case is the ordinary one: a white sheet on a white desk. There is no contrast to find an edge with, and edge detection is how most scanners locate the page at all. The app finds the sheet from the structure printed on it rather than from its border \u2014 the bubbles themselves describe where the page is.',
    'c.s3bp2':'Once located, the page is rectified. The student holds the phone at whatever angle is comfortable; the frame is corrected to square before a single answer is read, so the grid the reader walks is the grid the form was printed on. Identity, answers and the score come back in the same pass.',
    'c.s4':'Orientation: rank the evidence',
    'c.s4p1':'A sheet arrives in an unknown orientation, and getting it wrong means reading every answer in the wrong place. Rather than guess from the image, the system ranks what it can prove about identity:',
    'c.s4r3':'An ID that passes its checksum <em>and</em> matches a student on the school’s roll.',
    'c.s4r2':'An ID that passes its checksum, matching nobody on file.',
    'c.s4r1':'A name that matches.',
    'c.s4r0':'Nothing legible.',
    'c.s4p2':'Above that sits a second source: <strong>layout consensus across the upload.</strong> A single page cannot tell you much, but a batch of a hundred from the same form can. The mean offset between the digit block and the letter block, measured across every page, describes that form’s shape — and any page whose offset is inverted is upside down, including the pages that carry no identity evidence of their own.',
    'c.s4p3':'One page is a guess. A hundred pages of the same form is a measurement.',

    'c.s5':'A feature removed because the number said so',
    'c.s5p1':'The answer reader originally tried a 180° rotation when a first pass looked poor. It is an obvious thing to do, and it was wrong.',
    'c.s5p2':'An upside-down read of an answer grid comes back looking <em>formally</em> valid — the right number of rows, one mark per row, nothing to flag — while being entirely fabricated. And because it looks valid, it gets saved.',
    'c.s5th':'Half-turn retry in the answer reader', 'c.s5ta':'Accuracy', 'c.s5tf':'Fabricated answers',
    'c.s5on':'Allowed', 'c.s5off':'Refused', 'c.s5base':'baseline',
    'c.s5p3':'So it was removed, and the problem solved with information the camera path already had: <strong>the student is signed in.</strong> We know whose sheet it should be before we read a single bubble. The half-turn is attempted on the identity field alone, and accepted only if it names that same student.',
    'c.s5p4':'When it does, the student is asked to retake the photo the right way up — rather than being told, by a system that cannot actually tell, that they photographed somebody else’s paper.',
    'c.s5pull':'A rotation that produces a plausible wrong answer is worse than one that produces no answer. Only the identity field is safe to rotate, because it is the only field that can disprove itself.',

    'c.s6':'Finding the booklet box nobody labelled',
    'c.s6p1':'Exams ship in variants — booklet A, booklet B — with the same questions in a different order. Grade a sheet against the wrong key and every answer is wrong. The original approach inferred the variant from the answers: score the sheet against every key, take the highest net, and send ties to a human.',
    'c.s6p2':'The sheet states its variant in a small box. The difficulty is that <strong>one page cannot tell that box apart from any other printed pair of circles</strong> — and there are many.',
    'c.s6p3':'A hundred pages can, because of one thing that separates the booklet box from every decorative pair on the form: <strong>people mark it.</strong> So the system nominates the pair of circles in which exactly one circle is filled on the greatest number of pages — and then projects that position back onto each page’s own detected circles, because a scanner shifts a sheet by more than the width of a bubble.',
    'c.s6cap':'Frequency alone would nominate a printed decoration. The signal is not that the pair appears often — it is that exactly one of its two circles is marked, page after page.',
    'c.s6d1':'many pages of the same form', 'c.s6d2':'decoration',
    'c.s6d3':'exactly one filled, on most pages', 'c.s6d4':'booklet = B',
    'c.s6p4':'The box does not override the answers. <strong>120 questions is a stronger measurement than one box</strong>, so the answers stay the judge; the box decides ties only. When the two disagree, the sheet is flagged for a reviewer rather than silently regraded. And it costs nothing to compute: the reader already hands over every circle it found.',

    'c.s7':'The measurement',
    'c.s7p1':'Booklet detection, scored against the commercial scanner’s own output on the same 88 pages:',
    'c.s7a':'Correct', 'c.s7b':'Wrong', 'c.s7c':'Refused',
    'c.s7p2':'The two refusals were boxes the students had left blank. There was nothing to read, and the system said so instead of inventing an answer — which is the behaviour you want from it.',
    'c.s7pull':'Zero wrong matters more than 86 right. A system that refuses when it cannot see is one a school can trust; a system that guesses is one that has to be checked, which is the job it was bought to remove.',

    'c.s8':'What I got wrong',
    'c.s8p0':'Both of these were caught before delivery. Both were measurement errors, not code errors.',
    'c.s8h1':'A number that seemed to refute the design',
    'c.s8p1':'The first run of booklet detection returned <span class="mono">58 correct, 35 wrong</span>. The obvious reading was that students mis-mark the box about 36% of the time, and that reading the box was therefore a bad idea.',
    'c.s8p2':'It was an alignment bug in the evaluation. Page number is not row number in the ground-truth file: the numbering drifts every time a page is skipped for not matching. Against the correct mapping, the same run was <span class="mono">86 correct, 0 wrong</span>.',
    'c.s8l1':'Before you accept a number that refutes your design, check that you are comparing the right rows. A result that convenient to misread deserves a second look at the harness, not just the hypothesis.',
    'c.s8h2':'Frequency is not evidence',
    'c.s8p3':'The first version of booklet detection nominated the <em>most frequent</em> pair of circles. It confidently picked a printed decoration that appears on every page and that nobody ever marks — and refused all 88 sheets.',
    'c.s8l2':'Repetition is not a signal. Use is. The thing that distinguishes a form field from an ornament is that a human reaches for it.',

    'c.s9':'How the work was run',
    'c.s9a':'Every threshold and design decision is backed by a number measured on real sheets, compared against the golden reference — the commercial device’s own output.',
    'c.s9b':'Changes go through an issue, then a separate pull request, then CI running a matrix of accuracy tests for the reader. <span class="mono">main</span> is protected.',
    'c.s9c':'Decisions are written down in an architecture decision log — <strong>including the rejected ones, with their measurements</strong>, so nobody spends a week rediscovering that the half-turn retry costs 1.6 points.',
    'c.s9nk':'Note on privacy',
    'c.s9n':'No student names, identity numbers or sheet images appear in this write-up or in any of the figures. Every diagram here is drawn, not captured.',

    'c.all':'All work', 'c.touch':'Get in touch'
  },

  /* ---------------------------------------------------------------- */

  ar: {
    'c.title':'قراءة ورقة الإجابة من كاميرا الجوال — محمد صالح',
    'c.back':'الأعمال', 'c.label':'دراسة حالة',
    'c.kick':'رؤية حاسوبية · ٢٠٢٦',
    'c.h':'قراءة ورقة الإجابة من كاميرا الجوال.',
    'c.lede':'منصة اختبارات تجريبية تركية تصحّح أوراق الإجابة الورقية من صورة. البديل في ذلك السوق قارئ أوبتك مخصّص يكلّف آلاف الدولارات. والهدف كان بلوغ دقته بكاميرا يملكها أغلب الطلاب أصلاً.',

    'c.f1k':'النتيجة',   'c.f1v':'٨٦ صحيحة · ٠ خاطئة · ٢ مرفوضة',
    'c.f2k':'المرجع',    'c.f2v':'مخرجات الجهاز التجاري نفسه',
    'c.f3k':'الدور',     'c.f3v':'الجوال والخادم ومسار الرؤية',
    'c.f4k':'بُني بـ',   'c.f4v':'OpenCV · ONNX · NestJS · SwiftUI · Flutter',

    'c.pd1':'صورة', 'c.pd2':'١٦ عتبة بالتوازي', 'c.pd3':'تصويت الأغلبية',
    'c.pd4':'شبكة ← صفوف وأعمدة', 'c.pd5':'الإجابات',
    'c.s1':'المشكلة',
    'c.s1p1':'الطالب يملأ نموذج أوبتك ورقياً، ثم يصوّره بالجوال، أو تمسح المدرسة رزمة منها في ملف PDF. على النظام أن يقرأ شيئين من تلك الصورة — لمن الورقة، وبماذا أجاب — ويحوّلهما إلى درجة.',
    'c.s1p2':'الجهاز المخصّص يحلّ هذا بإزالة الجزء الصعب: إضاءة مضبوطة، ونقل ثابت، وورقة لا يمكن أن تنقلب. الجوال لا يعطيك شيئاً من ذلك. يعطيك لمعة على نصف الصفحة، وورقة مائلة، وورقة مقلوبة، وظلّ اليد الممسكة بها، ودقّة تتغيّر بحسب قرب الطالب.',
    'c.s1pull':'المعيار لم يكن «هل يعمل غالباً». المعيار كان مخرجات الجهاز الذي يحلّ محلّه، على الأوراق نفسها.',

    'c.s2':'لماذا كانت صعبة',
    'c.s2p1':'كل خطوة بمفردها لها جواب في الكتب. التعتيم يحوّل الصورة إلى أبيض وأسود. ودوائر Hough تجد الفقاعات. الصعوبة أن كل جواب كتابي له معامل، ولا قيمة واحدة لذلك المعامل تصمد أمام مدى الصور التي يرسلها الطلاب فعلاً.',
    'c.s2p2':'العتبة التي تقرأ الدائرة في ضوء مستوٍ تدمج دائرتين تحت اللمعة. ونصف القطر الذي يجد كل دائرة في صورة قريبة يجد زخارف مطبوعة في صورة بعيدة. تضبطها لصفحة فتخسر أخرى.',
    'c.s2p3':'لذا لا يحاول المسار اختيار المعامل الصحيح. يشغّل كثيراً منها، ويعامل كلاً منها كشاهد.',

    'c.s3':'المقاربة: اجمع الأدلة، ثم قرّر',
    'c.s3p1':'تُكشف الدوائر بـ<strong>ست عشرة استراتيجية تعتيم بالتوازي</strong>. كل واحدة تنتج مجموعتها من الدوائر المرشّحة. تُدمج بتصويت الأغلبية، وتُقلَّم أنصاف الأقطار إلى المدى المتّفق عليه — فالدائرة التي رأتها استراتيجية واحدة ضجيج، والتي رأتها أربع عشرة فقاعة.',
    'c.s3p2':'ثم تُبنى الدوائر الباقية في <strong>شبكة</strong>: جيران بالمسافة والمحاذاة، فتنتج أعمدة النموذج وصفوفه دون أن يخبر أحدٌ النظامَ كيف يبدو النموذج. ويمشي القارئ على الشبكة فيحوّلها إلى إجابات.',
    'c.s3cap':'لا استراتيجية واحدة ولا مقياس صورة واحد موثوق. ست عشرة تعمل، وتبقى الدوائر التي تتفق عليها.',
    'c.s3ask':'التقنيات',
    'c.s3as':'NestJS وTypeScript في الوضع الصارم، وPostgreSQL عبر Prisma، وBullMQ وRedis للطوابير. معالجة الصور بـOpenCV وsharp، وملفات PDF الممسوحة تُحوَّل عند ٢٠٠ نقطة في البوصة. نموذج صغير يقرأ الصفوف، مدرَّب بـPyTorch ومصدَّر إلى ONNX ليعمل داخل الخادم بدل خدمة ثانية تُنشر وتُبقى حيّة.',

    'c.demo':'شاهده يعمل',
    'c.s3b':'ما الذي يجب أن يفعله التصوير فعلاً',
    'c.s3bp1':'أصعب حالة هي العادية: ورقة بيضاء على مكتب أبيض. لا تباين يُستخرج منه حدّ، وكشف الحواف هو ما تعتمد عليه أغلب الماسحات لتحديد الصفحة أساساً. التطبيق يجد الورقة من البنية المطبوعة عليها لا من إطارها — الفقاعات نفسها تصف أين الصفحة.',
    'c.s3bp2':'وبعد تحديدها، تُقوَّم الصفحة. الطالب يمسك الجوال بأي زاوية مريحة؛ والإطار يُصحَّح إلى الاستقامة قبل قراءة إجابة واحدة، فتكون الشبكة التي يمشي عليها القارئ هي الشبكة التي طُبع عليها النموذج. الهوية والإجابات والدرجة تعود في المرور نفسه.',
    'c.s4':'الاتجاه: رتّب الأدلة',
    'c.s4p1':'تصل الورقة باتجاه مجهول، وأي خطأ فيه يعني قراءة كل إجابة في غير موضعها. وبدل التخمين من الصورة، يرتّب النظام ما يستطيع إثباته عن الهوية:',
    'c.s4r3':'رقم هوية يجتاز خانة التحقّق <em>ويطابق</em> طالباً في سجل المدرسة.',
    'c.s4r2':'رقم هوية يجتاز خانة التحقّق ولا يطابق أحداً في السجل.',
    'c.s4r1':'اسم يطابق.',
    'c.s4r0':'لا شيء مقروء.',
    'c.s4p2':'وفوق ذلك مصدر ثانٍ: <strong>إجماع تخطيطي عبر الرفعة.</strong> صفحة واحدة لا تخبرك كثيراً، لكن دفعة من مئة صفحة للنموذج نفسه تستطيع. متوسط الإزاحة بين كتلة الأرقام وكتلة الحروف، مقيساً عبر كل صفحة، يصف شكل ذلك النموذج — وكل صفحة انعكست إزاحتها فهي مقلوبة، بما فيها الصفحات التي لا تحمل دليل هوية خاصاً بها.',
    'c.s4p3':'صفحة واحدة تخمين. مئة صفحة من النموذج نفسه قياس.',

    'c.s5':'ميزة حُذفت لأن الرقم قال ذلك',
    'c.s5p1':'كان قارئ الإجابات يجرّب تدويراً بمقدار ١٨٠° حين تبدو المحاولة الأولى ضعيفة. وهو أمر بديهي أن تفعله، وكان خاطئاً.',
    'c.s5p2':'القراءة المقلوبة لشبكة الإجابات ترجع <em>صالحة شكلاً</em> — العدد الصحيح من الصفوف، وعلامة واحدة في كل صف، ولا شيء يُرفع — بينما هي مُختلقة بالكامل. ولأنها تبدو صالحة، تُحفظ.',
    'c.s5th':'إعادة المحاولة بلفّة نصفية في قارئ الإجابات', 'c.s5ta':'الدقة', 'c.s5tf':'إجابات ملفّقة',
    'c.s5on':'مسموحة', 'c.s5off':'مرفوضة', 'c.s5base':'الأساس',
    'c.s5p3':'فحُذفت، وحُلّت المشكلة بمعلومة كانت متاحة لمسار الكاميرا أصلاً: <strong>الطالب مسجّل دخول.</strong> نعرف لمن ينبغي أن تكون الورقة قبل أن نقرأ فقاعة واحدة. تُجرَّب اللفّة النصفية على حقل الهوية وحده، ولا تُقبل إلا إذا سمّت الطالب نفسه.',
    'c.s5p4':'وحين تفعل، يُطلب من الطالب إعادة التصوير معتدلاً — بدل أن يُقال له، من نظام لا يستطيع الجزم فعلاً، إنه صوّر ورقة غيره.',
    'c.s5pull':'تدوير ينتج جواباً خاطئاً معقولاً أسوأ من تدوير لا ينتج جواباً. حقل الهوية وحده آمن للتدوير، لأنه الحقل الوحيد القادر على تكذيب نفسه.',

    'c.s6':'العثور على مربّع الكتيّب الذي لم يسمّه أحد',
    'c.s6p1':'تأتي الاختبارات في نسخ — كتيّب أ، كتيّب ب — بالأسئلة نفسها بترتيب مختلف. صحّح ورقة بالمفتاح الخطأ فكل إجابة خاطئة. والمقاربة الأصلية كانت تستنتج النسخة من الإجابات: تُصحَّح الورقة بكل مفتاح، ويفوز أعلى صافٍ، وتُحوَّل حالات التعادل إلى إنسان.',
    'c.s6p2':'الورقة تذكر نسختها في مربّع صغير. والصعوبة أن <strong>صفحة واحدة لا تميّز ذلك المربّع عن أي زوج دوائر مطبوع آخر</strong> — وهي كثيرة.',
    'c.s6p3':'مئة صفحة تستطيع، بسبب شيء واحد يفصل مربّع الكتيّب عن كل زوج زخرفي في النموذج: <strong>الناس يعلّمونه.</strong> فيرشّح النظام زوج الدوائر الذي تُملأ فيه دائرة واحدة بالضبط في أكبر عدد من الصفحات — ثم يُسقط ذلك الموضع على دوائر كل صفحة المكتشفة بنفسها، لأن الماسح يزحلق الورقة أكثر من عرض فقاعة.',
    'c.s6cap':'التكرار وحده كان سيرشّح زخرفة مطبوعة. الإشارة ليست أن الزوج يظهر كثيراً — بل أن واحدة بالضبط من دائرتيه معلَّمة، صفحةً بعد صفحة.',
    'c.s6d1':'صفحات كثيرة من النموذج نفسه', 'c.s6d2':'زخرفة',
    'c.s6d3':'واحدة بالضبط ممتلئة، في أغلب الصفحات', 'c.s6d4':'الكتيّب = ب',
    'c.s6p4':'المربّع لا يتجاوز الإجابات. <strong>١٢٠ سؤالاً قياس أقوى من مربّع واحد</strong>، فتبقى الإجابات هي الحَكَم؛ والمربّع يحسم التعادل فقط. وعند التناقض تُرفع الورقة لمراجع بدل أن يُعاد تصحيحها بصمت. ولا يكلّف حسابه شيئاً: القارئ يسلّم أصلاً كل دائرة وجدها.',

    'c.s7':'القياس',
    'c.s7p1':'كشف الكتيّب، مقيساً على مخرجات الجهاز التجاري نفسه على الـ٨٨ صفحة ذاتها:',
    'c.s7a':'صحيحة', 'c.s7b':'خاطئة', 'c.s7c':'مرفوضة',
    'c.s7p2':'المرفوضتان كانتا مربّعين تركهما الطالبان فارغين. لم يكن هناك ما يُقرأ، فقال النظام ذلك بدل أن يخترع جواباً — وهو السلوك الذي تريده منه.',
    'c.s7pull':'صفر خاطئة أهم من ٨٦ صحيحة. النظام الذي يمتنع حين لا يرى هو ما تثق به مدرسة؛ والنظام الذي يخمّن هو ما يجب أن يُراجَع، وتلك هي المهمة التي اشتُري ليزيلها.',

    'c.s8':'ما أخطأت فيه',
    'c.s8p0':'كلاهما أُمسك قبل التسليم. وكلاهما خطأ قياس، لا خطأ شيفرة.',
    'c.s8h1':'رقم بدا أنه يدحض التصميم',
    'c.s8p1':'أعاد أول تشغيل لكشف الكتيّب <span class="mono">٥٨ صحيحة، ٣٥ خاطئة</span>. والقراءة البديهية أن الطلاب يخطئون في تعليم المربّع بنحو ٣٦٪، وأن قراءة المربّع فكرة سيئة إذن.',
    'c.s8p2':'كان خطأ محاذاة في التقييم. رقم الصفحة ليس رقم السطر في ملف الحقيقة: الترقيم يزحف كلما تُخطّيت صفحة لعدم المطابقة. وبالخريطة الصحيحة، كان التشغيل نفسه <span class="mono">٨٦ صحيحة، ٠ خاطئة</span>.',
    'c.s8l1':'قبل أن تقبل رقماً يدحض تصميمك، تحقّق أنك تقارن الصفوف الصحيحة. نتيجة سهلة إساءة القراءة إلى هذا الحد تستحق نظرة ثانية في أداة القياس، لا في الفرضية وحدها.',
    'c.s8h2':'التكرار ليس دليلاً',
    'c.s8p3':'رشّحت النسخة الأولى من كشف الكتيّب زوج الدوائر <em>الأكثر تكراراً</em>. فاختارت بثقة زخرفة مطبوعة تظهر في كل صفحة ولا يعلّمها أحد أبداً — ورفضت الـ٨٨ ورقة كلها.',
    'c.s8l2':'التكرار ليس إشارة. الاستعمال هو الإشارة. ما يميّز حقلاً في نموذج عن زخرفة هو أن إنساناً يمدّ يده إليه.',

    'c.s9':'كيف أُديرَ العمل',
    'c.s9a':'كل قرار عتبة وتصميم مسنود برقم مقيس على أوراق حقيقية، مقارَن بالمرجع الذهبي — مخرجات الجهاز التجاري نفسه.',
    'c.s9b':'التغييرات تمرّ عبر issue، ثم طلب سحب مستقل، ثم تكامل مستمر يشغّل مصفوفة اختبارات دقة للقارئ. و<span class="mono">main</span> محمي.',
    'c.s9c':'القرارات مكتوبة في سجل قرارات معماري — <strong>بما فيها المرفوضة، مع قياساتها</strong>، حتى لا يقضي أحد أسبوعاً ليكتشف من جديد أن اللفّة النصفية تكلّف ١.٦ نقطة.',
    'c.s9nk':'ملاحظة عن الخصوصية',
    'c.s9n':'لا تظهر أسماء طلاب ولا أرقام هوية ولا صور أوراق في هذا النص ولا في أي من الرسوم. وكل رسم هنا مرسوم، لا ملتقَط.',

    'c.all':'كل الأعمال', 'c.touch':'تواصل'
  },

  /* ---------------------------------------------------------------- */

  tr: {
    'c.title':'Telefon kamerasından cevap kâğıdı okumak — Mohammed Saleh',
    'c.back':'Çalışmalar', 'c.label':'Vaka çalışması',
    'c.kick':'Bilgisayarlı görü · 2026',
    'c.h':'Telefon kamerasından cevap kâğıdı okumak.',
    'c.lede':'Bir Türk deneme sınavı platformu, kâğıt cevap formlarını bir fotoğraftan puanlıyor. Bu pazardaki alternatif, binlerce dolarlık özel bir optik okuyucu. Hedef, çoğu öğrencinin zaten sahip olduğu bir kamerayla aynı doğruluğa ulaşmaktı.',

    'c.f1k':'Sonuç',      'c.f1v':'86 doğru · 0 yanlış · 2 reddedilen',
    'c.f2k':'Referans',   'c.f2v':'Ticari tarayıcının kendi çıktısı',
    'c.f3k':'Rol',        'c.f3v':'Mobil, backend ve görü hattı',
    'c.f4k':'Kullanılan', 'c.f4v':'OpenCV · ONNX · NestJS · SwiftUI · Flutter',

    'c.pd1':'foto\u011fraf', 'c.pd2':'16 e\u015fik, paralel', 'c.pd3':'\u00e7o\u011funluk oyu',
    'c.pd4':'graf \u2192 sat\u0131r, s\u00fctun', 'c.pd5':'cevaplar',
    'c.s1':'Problem',
    'c.s1p1':'Öğrenci kâğıt optik formu dolduruyor. Telefonla fotoğraflıyor ya da okul bir desteyi PDF olarak tarıyor. Sistemin o görüntüden iki şeyi okuması gerekiyor — kâğıt kime ait ve ne cevaplamış — ve bunu bir puana çevirmesi.',
    'c.s1p2':'Özel bir optik okuyucu, zor kısmı ortadan kaldırarak çözüyor: kontrollü ışık, sabit taşıma, döndürülemeyen bir kâğıt. Telefon bunların hiçbirini vermiyor. Sayfanın yarısında parlama, eğik bir kâğıt, ters bir kâğıt, onu tutan elin gölgesi ve öğrencinin ne kadar yaklaştığına göre değişen bir çözünürlük veriyor.',
    'c.s1pull':'Ölçüt “çoğunlukla çalışıyor mu” değildi. Ölçüt, yerini aldığı makinenin aynı kâğıtlardaki çıktısıydı.',

    'c.s2':'Neden zordu',
    'c.s2p1':'Her adımın ders kitabında bir karşılığı var. Eşikleme fotoğrafı siyah-beyaza çeviriyor. Hough daireleri baloncukları buluyor. Zorluk şu: her kitap cevabının bir parametresi var ve o parametrenin tek bir değeri, gerçek öğrencilerin gönderdiği fotoğraf çeşitliliğini kaldırmıyor.',
    'c.s2p2':'Düz ışıkta baloncuğu doğru okuyan eşik, parlamada iki baloncuğu birleştiriyor. Yakın bir fotoğrafta her daireyi bulan yarıçap, uzak bir fotoğrafta basılı süslemeleri buluyor. Bir sayfaya göre ayarlıyorsun, bir diğerini kaybediyorsun.',
    'c.s2p3':'Bu yüzden hat, doğru parametreyi seçmeye çalışmıyor. Çoğunu çalıştırıyor ve her birini bir tanık sayıyor.',

    'c.s3':'Yaklaşım: önce kanıt topla, sonra karar ver',
    'c.s3p1':'Daireler <strong>paralel çalışan on altı eşikleme stratejisiyle</strong> tespit ediliyor. Her biri kendi aday daire kümesini üretiyor. Çoğunluk oyuyla birleştiriliyor ve yarıçaplar uzlaşılan aralığa buduruluyor — yalnızca bir stratejinin gördüğü daire gürültüdür; on dördünün gördüğü bir baloncuktur.',
    'c.s3p2':'Ayakta kalan daireler sonra bir <strong>grafa</strong> dönüştürülüyor: mesafe ve hizaya göre komşular; bu da forma dair kimse sisteme bir şey anlatmadan sütunları ve satırları veriyor. Bir okuyucu o grafta yürüyüp cevaplara çeviriyor.',
    'c.s3cap':'Tek bir stratejiye ve tek bir görüntü ölçeğine güvenilmiyor. On altısı çalışıyor ve üzerinde uzlaştıkları daireler kalıyor.',
    'c.s3ask':'Teknolojiler',
    'c.s3as':'Katı kipte NestJS ve TypeScript, Prisma üzerinden PostgreSQL, kuyruklar için BullMQ ve Redis. Görüntü işleri OpenCV ve sharp ile; taranan PDF’ler 200 DPI’de rasterleniyor. Satırları okuyan küçük bir model PyTorch ile eğitilip ONNX’e aktarıldı; böylece dağıtılacak ve ayakta tutulacak ikinci bir servis yerine backend içinde çalışıyor.',

    'c.demo':'\u00c7al\u0131\u015f\u0131rken izle',
    'c.s3b':'Yakalaman\u0131n ger\u00e7ekte yapmas\u0131 gereken',
    'c.s3bp1':'En zor durum s\u0131radan olan: beyaz masada beyaz k\u00e2\u011f\u0131t. Kenar bulmak i\u00e7in kar\u015f\u0131tl\u0131k yok ve \u00e7o\u011fu tarayc\u0131 sayfay\u0131 zaten kenar tespitiyle buluyor. Uygulama k\u00e2\u011f\u0131d\u0131 s\u0131n\u0131r\u0131ndan de\u011fil, \u00fczerine bas\u0131lm\u0131\u015f yap\u0131dan buluyor \u2014 sayfan\u0131n nerede oldu\u011funu dairelerin kendisi tarif ediyor.',
    'c.s3bp2':'Bulunduktan sonra sayfa d\u00fczeltiliyor. \u00d6\u011frenci telefonu rahat etti\u011fi a\u00e7\u0131da tutuyor; kare, tek bir cevap okunmadan \u00f6nce dik hale getiriliyor, b\u00f6ylece okuyucunun y\u00fcr\u00fcd\u00fc\u011f\u00fc \u0131zgara formun bas\u0131ld\u0131\u011f\u0131 \u0131zgara oluyor. Kimlik, cevaplar ve puan ayn\u0131 ge\u00e7i\u015fte d\u00f6n\u00fcyor.',
    'c.s4':'Yön: kanıtı sırala',
    'c.s4p1':'Kâğıt bilinmeyen bir yönde geliyor ve bunu yanlış bilmek her cevabı yanlış yerde okumak demek. Görüntüden tahmin etmek yerine sistem, kimlik hakkında kanıtlayabildiklerini sıralıyor:',
    'c.s4r3':'Sağlama toplamını geçen <em>ve</em> okul listesindeki bir öğrenciyle eşleşen bir kimlik.',
    'c.s4r2':'Sağlama toplamını geçen ama kayıtta kimseyle eşleşmeyen bir kimlik.',
    'c.s4r1':'Eşleşen bir ad.',
    'c.s4r0':'Okunabilir hiçbir şey yok.',
    'c.s4p2':'Bunun üstünde ikinci bir kaynak var: <strong>yükleme genelinde yerleşim uzlaşısı.</strong> Tek bir sayfa çok şey söylemez ama aynı formdan yüz sayfalık bir deste söyler. Rakam bloğuyla harf bloğu arasındaki ortalama kayma, her sayfada ölçüldüğünde o formun şeklini tanımlar — ve kayması ters olan her sayfa ters dönmüştür; kendine ait kimlik kanıtı taşımayanlar dahil.',
    'c.s4p3':'Bir sayfa tahmindir. Aynı formdan yüz sayfa ölçümdür.',

    'c.s5':'Sayı öyle dediği için kaldırılan bir özellik',
    'c.s5p1':'Cevap okuyucu, ilk geçiş kötü göründüğünde 180° döndürmeyi deniyordu. Yapılacak bariz şey gibi duruyor ve yanlıştı.',
    'c.s5p2':'Cevap ızgarasının ters okunuşu <em>biçimsel olarak</em> geçerli dönüyor — doğru satır sayısı, satır başına tek işaret, bayrak kaldıracak hiçbir şey yok — ama tamamen uydurma. Geçerli göründüğü için de kaydediliyor.',
    'c.s5th':'Cevap okuyucuda yarım tur denemesi', 'c.s5ta':'Doğruluk', 'c.s5tf':'Uydurma cevaplar',
    'c.s5on':'İzinli', 'c.s5off':'Reddedildi', 'c.s5base':'temel',
    'c.s5p3':'Bu yüzden kaldırıldı ve sorun, kamera yolunun zaten sahip olduğu bir bilgiyle çözüldü: <strong>öğrenci oturum açmış durumda.</strong> Tek bir baloncuğu okumadan önce kâğıdın kime ait olması gerektiğini biliyoruz. Yarım tur yalnızca kimlik alanında deneniyor ve ancak aynı öğrenciyi adlandırırsa kabul ediliyor.',
    'c.s5p4':'Adlandırdığında, öğrenciden fotoğrafı düz çekmesi isteniyor — aslında bilemeyecek bir sistem tarafından başkasının kâğıdını çektiği söylenmek yerine.',
    'c.s5pull':'Makul ama yanlış bir cevap üreten döndürme, hiç cevap üretmeyenden kötüdür. Yalnızca kimlik alanını döndürmek güvenlidir, çünkü kendini çürütebilen tek alan odur.',

    'c.s6':'Kimsenin etiketlemediği kitapçık kutusunu bulmak',
    'c.s6p1':'Sınavlar varyantlarla geliyor — kitapçık A, kitapçık B — aynı sorular farklı sırayla. Bir kâğıdı yanlış anahtara göre değerlendirirsen her cevap yanlış olur. Özgün yaklaşım varyantı cevaplardan çıkarıyordu: kâğıdı her anahtara göre puanla, en yüksek neti al, berabere kalanları bir insana gönder.',
    'c.s6p2':'Kâğıt, varyantını küçük bir kutuda belirtiyor. Zorluk şu: <strong>tek bir sayfa o kutuyu başka herhangi bir basılı daire çiftinden ayıramaz</strong> — ve çok sayıda var.',
    'c.s6p3':'Yüz sayfa ayırabilir; çünkü kitapçık kutusunu formdaki her süsleme çiftinden ayıran tek bir şey var: <strong>insanlar onu işaretler.</strong> Sistem, en çok sayfada tam olarak bir dairesi dolu olan çifti aday gösteriyor — sonra o konumu her sayfanın kendi tespit edilmiş dairelerine yansıtıyor, çünkü bir tarayıcı kâğıdı bir baloncuk genişliğinden fazla kaydırır.',
    'c.s6cap':'Yalnızca sıklık, basılı bir süslemeyi aday gösterirdi. Sinyal, çiftin sık görünmesi değil — iki dairesinden tam olarak birinin, sayfa sayfa, işaretlenmiş olması.',
    'c.s6d1':'aynı formdan birçok sayfa', 'c.s6d2':'süsleme',
    'c.s6d3':'çoğu sayfada tam olarak biri dolu', 'c.s6d4':'kitapçık = B',
    'c.s6p4':'Kutu cevapları geçersiz kılmıyor. <strong>120 soru, tek bir kutudan daha güçlü bir ölçümdür</strong>; bu yüzden hakem cevaplar kalıyor, kutu yalnızca beraberliği bozuyor. İkisi çeliştiğinde kâğıt sessizce yeniden değerlendirilmek yerine bir denetçiye işaretleniyor. Hesaplaması da bedava: okuyucu bulduğu her daireyi zaten teslim ediyor.',

    'c.s7':'Ölçüm',
    'c.s7p1':'Kitapçık tespiti, aynı 88 sayfada ticari tarayıcının kendi çıktısına göre puanlandı:',
    'c.s7a':'Doğru', 'c.s7b':'Yanlış', 'c.s7c':'Reddedilen',
    'c.s7p2':'İki reddedilen, öğrencilerin boş bıraktığı kutulardı. Okunacak bir şey yoktu ve sistem bir cevap uydurmak yerine bunu söyledi — ondan istenen davranış da bu.',
    'c.s7pull':'Sıfır yanlış, 86 doğrudan daha önemli. Göremediğinde reddeden bir sisteme bir okul güvenebilir; tahmin eden bir sistem kontrol edilmek zorundadır ki bu da onun ortadan kaldırmak için satın alındığı iştir.',

    'c.s8':'Neyi yanlış yaptım',
    'c.s8p0':'İkisi de teslimden önce yakalandı. İkisi de kod hatası değil, ölçüm hatasıydı.',
    'c.s8h1':'Tasarımı çürütüyor gibi görünen bir sayı',
    'c.s8p1':'Kitapçık tespitinin ilk koşusu <span class="mono">58 doğru, 35 yanlış</span> döndürdü. Bariz okuma, öğrencilerin kutuyu yaklaşık %36 oranında yanlış işaretlediği ve dolayısıyla kutuyu okumanın kötü bir fikir olduğuydu.',
    'c.s8p2':'Değerlendirmedeki bir hizalama hatasıydı. Doğruluk dosyasında sayfa numarası satır numarası değildir: eşleşmediği için atlanan her sayfadan sonra numaralandırma kayar. Doğru eşlemeye göre aynı koşu <span class="mono">86 doğru, 0 yanlış</span>tı.',
    'c.s8l1':'Tasarımınızı çürüten bir sayıyı kabul etmeden önce doğru satırları karşılaştırdığınızı doğrulayın. Yanlış okunmaya bu kadar elverişli bir sonuç, yalnızca hipoteze değil, düzeneğe de ikinci bir bakışı hak eder.',
    'c.s8h2':'Sıklık kanıt değildir',
    'c.s8p3':'Kitapçık tespitinin ilk sürümü <em>en sık görülen</em> daire çiftini aday gösterdi. Her sayfada görünen ve kimsenin işaretlemediği basılı bir süslemeyi kendinden emin biçimde seçti — ve 88 kâğıdın tamamını reddetti.',
    'c.s8l2':'Tekrar bir sinyal değildir. Kullanım sinyaldir. Bir form alanını süslemeden ayıran şey, bir insanın ona uzanmasıdır.',

    'c.s9':'İş nasıl yürütüldü',
    'c.s9a':'Her eşik ve tasarım kararı, gerçek kâğıtlarda ölçülmüş bir sayıya dayanıyor ve altın referansla — ticari cihazın kendi çıktısıyla — karşılaştırılıyor.',
    'c.s9b':'Değişiklikler bir issue, ardından ayrı bir pull request, ardından okuyucu için doğruluk testleri matrisi çalıştıran CI üzerinden geçiyor. <span class="mono">main</span> korumalı.',
    'c.s9c':'Kararlar bir mimari karar günlüğüne yazılıyor — <strong>ölçümleriyle birlikte reddedilenler dahil</strong>; böylece kimse yarım tur denemesinin 1,6 puana mal olduğunu yeniden keşfetmek için bir hafta harcamıyor.',
    'c.s9nk':'Gizlilik notu',
    'c.s9n':'Bu yazıda ve şekillerin hiçbirinde öğrenci adı, kimlik numarası veya kâğıt görüntüsü yer almıyor. Buradaki her diyagram çizilmiştir, yakalanmamıştır.',

    'c.all':'Tüm çalışmalar', 'c.touch':'İletişime geç'
  }
};
