/* ==================================================================
   CONTENT
   Everything the page renders. One file to edit, no markup to touch.
================================================================== */

export const LINKS = {
  github:   'https://github.com/Alansi775',
  linkedin: 'https://linkedin.com/in/mohamed-saleh-a2a496276',
  youtube:  'https://www.youtube.com/@mohamedsaleh-77',
  x:        'https://x.com/alansi775',
  email:    'mohamedalezzi6@gmail.com',
  phone:    '+905392554609'
};

/* The numbers are the fastest way to say what the work actually is.
   Every one of them comes from a shipped system. */
export const METRICS = [
  { value: 1.8,  unit: 'B',  decimals: 1, key: 'm.params' },
  { value: 320,  unit: 'ms', decimals: 0, key: 'm.latency' },
  { value: 480,  unit: 'h',  decimals: 0, key: 'm.audio' },
  { value: 5,    unit: '+',  decimals: 0, key: 'm.years' }
];

/* The pipeline every one of his systems shares. This is the spine of
   the scroll scene: a signal is sensed, inferred on, and acted upon. */
export const PIPELINE = [
  { id: 'sense',   num: '01', key: 'p.sense'  },
  { id: 'infer',   num: '02', key: 'p.infer'  },
  { id: 'decide',  num: '03', key: 'p.decide' },
  { id: 'act',     num: '04', key: 'p.act'    }
];

/* ---------------------------------------------------------------- */

const shots = (prefix, n, from = 0) =>
  Array.from({ length: n }, (_, i) => `assets/${prefix}${i + from}.png`);

export const PROJECTS = [
  {
    id: 'pcbai',
    span: 6,
    year: '2026',
    cat: 'ai',
    orientation: 'wide',
    media: [],
    links: [
      { k: 'l.demo',  url: 'https://youtube.com/shorts/JvQUW6NvBrA' },
      { k: 'l.demo2', url: 'https://youtube.com/shorts/vMxfmSaS2uY' },
      { k: 'l.case',  url: 'case/pcbai.html' }
    ],
    stack: ['OpenCV', 'SIFT + RANSAC', 'scikit-learn', 'Flask', 'Raspberry Pi', 'Stepper control'],
    stat: { v: '40/40', k: 's.pcb' }
  },
  {
    id: 'omr',
    span: 6,
    year: '2026',
    cat: 'ai',
    orientation: 'wide',
    media: [],
    links: [
      { k: 'l.demo', url: 'https://youtube.com/shorts/8I-LCh83mcI' },
      { k: 'l.case', url: 'case/omr.html' },
      { k: 'l.site', url: 'https://msgdeneme.com' }
    ],
    stack: ['OpenCV', 'ONNX', 'NestJS', 'SwiftUI', 'Flutter', 'PostgreSQL'],
    stat: { v: '86/0', k: 's.omr' }
  },
  {
    id: 'emg',
    span: 6,
    year: '2026',
    cat: 'ai',
    orientation: 'wide',
    media: [],
    links: [
      { k: 'l.model',   url: 'https://huggingface.co/malansi/EMG-Gesture-Recognition' },
      { k: 'l.dataset', url: 'https://huggingface.co/datasets/malansi/EMG-Gesture-Dataset' },
      { k: 'l.code',    url: 'https://github.com/AI-Biomechatornics-Lab/Controlling-Prosthetic-Arm-AI-Module' }
    ],
    stack: ['CNN + LSTM', 'PyTorch', 'Myo EMG', 'Jetson', 'ROS'],
    stat: { v: '8', k: 's.channels' }
  },
  {
    id: 'noota',
    span: 3,
    year: '2025',
    cat: 'ai',
    orientation: 'portrait',
    media: shots('', 15),
    links: [
      { k: 'l.demo', url: 'https://youtu.be/37KYB2-55Kk' }
    ],
    stack: ['Transformer', 'Voice cloning', 'LoRA r16/a32', 'Flutter', 'Flask'],
    stat: { v: '320ms', k: 's.inference' }
  },
  {
    id: 'drone',
    span: 3,
    year: '2025',
    cat: 'auto',
    orientation: 'wide',
    media: [],
    links: [
      { k: 'l.demo',  url: 'https://youtu.be/5tWGJeg-cWQ' },
      { k: 'l.demo2', url: 'https://youtu.be/PXxgTgSYX7Y' }
    ],
    stack: ['Orange Cube · PX4', 'MAVSDK', 'Jetson Xavier', 'Arducam', 'Here4 RTK GNSS', 'Fibre-optic CAN', 'OpenCV', 'ROS'],
    stat: { v: '6DOF', k: 's.control' }
  },
  {
    id: 'yshop',
    span: 6,
    year: '2025',
    cat: 'full',
    orientation: 'wide',
    media: shots('y-shop-screen', 24),
    links: [
      { k: 'l.case',  url: 'https://slender-forsythia-e75.notion.site/YSHOP-E-Commerce-APP-172883fb9e358081adb7d402501eac5f' },
      { k: 'l.demo',  url: 'https://youtu.be/PNgwfYJ0n6g' }
    ],
    stack: ['Vector embeddings', 'Semantic search', 'RAG', 'Node.js', 'Flutter'],
    stat: { v: 'live', k: 's.status' }
  },
  {
    id: 'marin',
    span: 3,
    year: '2025',
    cat: 'iot',
    orientation: 'portrait',
    media: shots('marin', 15),
    links: [
      { k: 'l.case', url: 'https://slender-forsythia-e75.notion.site/IOTROCOP-Marin-240883fb9e35803ca422c3cb6dab7bf9' }
    ],
    stack: ['STM32', 'ESP32', 'MQTT', 'SwiftUI', 'Firebase'],
    stat: { v: 'E2E', k: 's.scope' }
  },
  {
    id: 'smarthome',
    span: 3,
    year: '2024',
    cat: 'iot',
    orientation: 'wide',
    media: [],
    links: [
      { k: 'l.demo', url: 'https://youtu.be/kYjXQ3d8Pcg' }
    ],
    stack: ['STM32', 'Face recognition', 'Voice control', 'RFID / NFC', 'Flutter'],
    stat: { v: 'on-device', k: 's.ml' }
  },
  {
    id: 'minibus',
    span: 6,
    year: '2025',
    cat: 'full',
    orientation: 'wide',
    media: [],
    links: [],
    stack: ['Fleet telemetry', 'Live maps', 'Node.js', 'PostgreSQL'],
    stat: { v: 'shipped', k: 's.status' }
  }
];

export const FILTERS = ['all', 'ai', 'auto', 'iot', 'full'];

/* ---------------------------------------------------------------- */

export const SKILLS = [
  { num: '01', key: 'sk.ai',    items: ['PyTorch', 'TensorFlow', 'Transformers', 'LLMs & RAG', 'Computer Vision', 'Speech & Voice', 'Vector Databases', 'On-Device ML'] },
  { num: '02', key: 'sk.auto',  items: ['PX4 / Pixhawk', 'MAVSDK', 'ROS', 'NVIDIA Jetson', 'Autonomous Navigation', 'Obstacle Avoidance'] },
  { num: '03', key: 'sk.embed', items: ['STM32', 'ESP32 / ESP8266', 'Raspberry Pi', 'UART / MQTT', 'RFID / NFC', 'Real-Time Systems'] },
  { num: '04', key: 'sk.cloud', items: ['Node.js', 'Flask', 'Firebase', 'AWS', 'PostgreSQL', 'REST APIs'] },
  { num: '05', key: 'sk.mobile',items: ['Swift & SwiftUI', 'Flutter', 'Kotlin', 'State Management'] },
  { num: '06', key: 'sk.web',   items: ['JavaScript', 'React', 'HTML & CSS', 'Responsive Systems'] }
];

export const EXPERIENCE = [
  {
    id: 'msgone', org: 'MSG One', range: '2026 — Present', type: 't.full',
    bullets: ['e.msg.1', 'e.msg.2', 'e.msg.3', 'e.msg.4', 'e.msg.5', 'e.msg.6']
  },
  {
    id: 'emgchal', org: 'EEG/EMG Foundation Challenge 2026 · Track 04', range: 'Oct — Nov 2026', type: 't.team',
    bullets: ['e.chal.1', 'e.chal.2', 'e.chal.3', 'e.chal.4', 'e.chal.5']
  },
  {
    id: 'ytu', org: 'YTÜ Yıldız Teknopark', range: '2026 — Present', type: 't.part',
    bullets: ['e.ytu.1', 'e.ytu.2', 'e.ytu.3']
  },
  {
    id: 'iotrocop', org: 'IOTROCOP Technology', range: '2024 — Present', type: 't.full',
    bullets: ['e.iot.1', 'e.iot.2', 'e.iot.3']
  },
  {
    id: 'mutlaq', org: 'Al Mutlaq United', range: '2024 — 2026', type: 't.part',
    bullets: ['e.mut.1', 'e.mut.2']
  },
  {
    id: 'lab', org: 'Labcihazlari.com', range: '2024 — 2026', type: 't.part',
    bullets: ['e.lab.1', 'e.lab.2', 'e.lab.3']
  },
  {
    id: 'okatan', org: 'OKATAN SAĞLIK ARGE', range: '2024 — 2025', type: 't.part',
    bullets: ['e.oka.1', 'e.oka.2', 'e.oka.3']
  }
];
