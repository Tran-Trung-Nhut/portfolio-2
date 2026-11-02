import { NeoAsisProps } from '@/shared/interfaces';
import { NeoMood } from '@/shared/types';

const C = {
  body: '#5AB4FF',
  shade: '#3B95E8',
  light: '#B3DEFF',
  line: '#16305A',
  backdrop: '#DCEEFF',
  belly: '#FFF2D6',
  bellyLine: '#EED6A4',
  horn: '#FFE7B0',
  mane: '#FFC94D',
  blush: '#FF8FAB',
  mouth: '#C73D5D',
  tongue: '#FF8DA2',
  glow: '#8B7CFF',
};

type Pose = 'wave' | 'chin' | 'orb' | 'cheer' | 'pray' | 'cross';

const BASE_FACE = {
  eyesOpen: true,
  happyEyes: false,
  lids: false,
  pupilX: 0,
  pupilY: 0,
  browLeft: 'M128 114 Q150 98 172 110',
  browRight: 'M272 114 Q250 98 228 110',
  mouth: 'M180 222 Q200 250 220 222 Q200 228 180 222 Z',
  tongue: true,
  tongueY: 231.5,
  tongueRx: 8,
  tongueRy: 3.5,
  fang: 'M187 224 L190.5 231 L194 225.5 Z',
  showFang: true,
  gemScale: 1,
  halo: false,
  sweat: false,
  pose: 'wave' as Pose,
  restArm: true,
};

type Face = typeof BASE_FACE;

const FACES: Record<NeoMood, Partial<Face>> = {
  greet: {},
  think: {
    pupilX: 4,
    pupilY: -8,
    browRight: 'M272 104 Q250 86 228 100',
    mouth: 'M188 229 Q200 225 212 231 Q200 231 188 229 Z',
    tongue: false,
    showFang: false,
    gemScale: 1.3,
    halo: true,
    pose: 'chin',
    restArm: false,
  },
  answer: {
    browLeft: 'M128 111 Q150 95 172 107',
    browRight: 'M272 111 Q250 95 228 107',
    mouth: 'M182 220 Q200 254 218 220 Q200 214 182 220 Z',
    tongueY: 233,
    tongueRx: 9,
    tongueRy: 4,
    fang: 'M185.5 219.6 L189 226.5 L192.5 218.4 Z',
    gemScale: 1.15,
    pose: 'orb',
  },
  happy: {
    eyesOpen: false,
    happyEyes: true,
    browLeft: 'M128 110 Q150 92 172 106',
    browRight: 'M272 110 Q250 92 228 106',
    mouth: 'M172 218 Q200 266 228 218 Q200 226 172 218 Z',
    tongueY: 236,
    tongueRx: 12,
    tongueRy: 5.5,
    fang: 'M181 220.5 L185 229 L189 222.6 Z',
    pose: 'cheer',
    restArm: false,
  },
  sorry: {
    pupilY: 5,
    browLeft: 'M128 116 Q152 112 172 100',
    browRight: 'M272 116 Q248 112 228 100',
    mouth: 'M186 236 Q200 222 214 236 Q200 230 186 236 Z',
    tongue: false,
    showFang: false,
    gemScale: 0.9,
    sweat: true,
    pose: 'pray',
    restArm: false,
  },
  smug: {
    lids: true,
    pupilX: 6,
    pupilY: 5,
    browLeft: 'M128 116 Q150 110 172 114',
    browRight: 'M272 102 Q250 86 228 98',
    mouth: 'M184 230 Q202 236 216 222 Q204 232 184 230 Z',
    tongue: false,
    showFang: false,
    gemScale: 0.95,
    pose: 'cross',
    restArm: false,
  },
};

const WHISKERS = {
  full: { d: 'M148 214 C116 208 92 222 82 244 C74 262 58 272 40 266 M252 214 C284 208 308 222 318 244 C326 262 342 272 360 266', tips: [[40, 266], [360, 266]] },
  avatar: { d: 'M150 214 C130 214 118 226 116 242 C114 254 108 262 98 264 M250 214 C270 214 282 226 284 242 C286 254 292 262 302 264', tips: [[98, 264], [302, 264]] },
};

const Arm = ({ d, thin }: { d: string; thin?: boolean }) => (
  <>
    <path d={d} fill="none" stroke={C.line} strokeWidth={thin ? 30 : 32} strokeLinecap="round" />
    <path d={d} fill="none" stroke={C.body} strokeWidth={thin ? 20 : 22} strokeLinecap="round" />
  </>
);

const Paw = ({ cx, cy, r, thin }: { cx: number; cy: number; r: number; thin?: boolean }) => (
  <circle cx={cx} cy={cy} r={r} fill={C.body} stroke={C.line} strokeWidth={thin ? 4.5 : 5} />
);

const Thumb = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <circle cx={cx} cy={cy} r={r} fill={C.body} stroke={C.line} strokeWidth="3.5" />
);

const Sparkle = ({ d }: { d: string }) => <path d={d} fill={C.glow} />;

const Orb = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke={C.line} strokeWidth="4.5" />
);

const Head = ({ f, whiskers }: { f: Face; whiskers: keyof typeof WHISKERS }) => (
  <>
    <path d="M100 118 Q56 112 38 140 Q60 142 66 152 Q34 168 32 200 Q54 192 68 200 Q48 222 56 250 Q82 232 116 244 Z" fill={C.mane} stroke={C.line} strokeWidth="5" strokeLinejoin="round" />
    <path d="M300 118 Q344 112 362 140 Q340 142 334 152 Q366 168 368 200 Q346 192 332 200 Q352 222 344 250 Q318 232 284 244 Z" fill={C.mane} stroke={C.line} strokeWidth="5" strokeLinejoin="round" />
    <path d="M176 74 Q178 44 198 32 Q194 50 204 56 Q212 40 230 40 Q218 56 226 74 Z" fill={C.mane} stroke={C.line} strokeWidth="5" strokeLinejoin="round" />
    <path d="M158 86 Q142 58 126 26 M140 56 Q122 48 104 52 M242 86 Q258 58 274 26 M260 56 Q278 48 296 52" fill="none" stroke={C.line} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M158 86 Q142 58 126 26 M140 56 Q122 48 104 52 M242 86 Q258 58 274 26 M260 56 Q278 48 296 52" fill="none" stroke={C.horn} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    {[[126, 26], [104, 52], [274, 26], [296, 52]].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" fill={C.glow} stroke={C.line} strokeWidth="3" />
    ))}

    <path d="M200 64 C286 64 322 114 322 170 C322 232 272 264 200 264 C128 264 78 232 78 170 C78 114 114 64 200 64 Z" fill={C.body} stroke={C.line} strokeWidth="5" />
    <ellipse cx="138" cy="100" rx="22" ry="11" transform="rotate(-28 138 100)" fill="#FFFFFF" opacity="0.4" />
    <ellipse cx="200" cy="212" rx="56" ry="32" fill={C.light} />
    <ellipse cx="184" cy="198" rx="5" ry="4" fill={C.line} />
    <ellipse cx="216" cy="198" rx="5" ry="4" fill={C.line} />

    {f.halo && (
      <>
        <circle cx="200" cy="104" r="21" fill={C.glow} opacity="0.2" />
        <circle cx="200" cy="104" r="21" fill="none" stroke={C.glow} strokeWidth="3" />
      </>
    )}
    <g transform={`translate(200 104) scale(${f.gemScale}) translate(-200 -104)`}>
      <path d="M200 90 Q202.8 101.2 214 104 Q202.8 106.8 200 118 Q197.2 106.8 186 104 Q197.2 101.2 200 90 Z" fill={C.glow} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
    </g>

    {f.eyesOpen && (
      <>
        <ellipse cx="152" cy="156" rx="30" ry="34" fill="#FFFFFF" stroke={C.line} strokeWidth="5" />
        <ellipse cx="248" cy="156" rx="30" ry="34" fill="#FFFFFF" stroke={C.line} strokeWidth="5" />
        <g transform={`translate(${f.pupilX} ${f.pupilY})`}>
          <ellipse cx="157" cy="161" rx="20" ry="24" fill={C.line} />
          <circle cx="150" cy="151" r="8" fill="#FFFFFF" />
          <circle cx="164" cy="172" r="3.5" fill="#FFFFFF" />
          <ellipse cx="243" cy="161" rx="20" ry="24" fill={C.line} />
          <circle cx="236" cy="151" r="8" fill="#FFFFFF" />
          <circle cx="250" cy="172" r="3.5" fill="#FFFFFF" />
        </g>
      </>
    )}
    {f.lids && (
      <>
        <path d="M118 153 A34 38 0 0 1 186 153 Q152 161 118 153 Z" fill={C.body} />
        <path d="M214 153 A34 38 0 0 1 282 153 Q248 161 214 153 Z" fill={C.body} />
        <path d="M120 153.5 Q152 160.5 184 153.5 M216 153.5 Q248 160.5 280 153.5" fill="none" stroke={C.line} strokeWidth="5" strokeLinecap="round" />
      </>
    )}
    {f.happyEyes && (
      <path d="M126 160 Q152 136 178 160 M222 160 Q248 136 274 160" fill="none" stroke={C.line} strokeWidth="6.5" strokeLinecap="round" />
    )}

    <path d={`${f.browLeft} ${f.browRight}`} fill="none" stroke={C.line} strokeWidth="13" strokeLinecap="round" />
    <path d={`${f.browLeft} ${f.browRight}`} fill="none" stroke={C.mane} strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="116" cy="196" rx="16" ry="9" fill={C.blush} opacity="0.75" />
    <ellipse cx="284" cy="196" rx="16" ry="9" fill={C.blush} opacity="0.75" />
    <path d={f.mouth} fill={C.mouth} stroke={C.line} strokeWidth="4.5" strokeLinejoin="round" />
    {f.tongue && <ellipse cx="200" cy={f.tongueY} rx={f.tongueRx} ry={f.tongueRy} fill={C.tongue} />}
    {f.showFang && <path d={f.fang} fill="#FFFFFF" stroke={C.line} strokeWidth="2.5" strokeLinejoin="round" />}

    <path d={WHISKERS[whiskers].d} fill="none" stroke={C.line} strokeWidth="8" strokeLinecap="round" />
    <path d={WHISKERS[whiskers].d} fill="none" stroke={C.mane} strokeWidth="4" strokeLinecap="round" />
    {WHISKERS[whiskers].tips.map(([cx, cy]) => (
      <circle key={cx} cx={cx} cy={cy} r="5.5" fill={C.glow} stroke={C.line} strokeWidth="2.5" />
    ))}
    {f.sweat && (
      <path d="M296 116 Q306 132 302 140 Q296 146 290 140 Q286 132 296 116 Z" fill="#D6F0FF" stroke={C.line} strokeWidth="3.5" strokeLinejoin="round" />
    )}
  </>
);

const FullBody = ({ f }: { f: Face }) => (
  <svg viewBox="8 0 400 420" aria-hidden="true" focusable="false">
    <ellipse cx="236" cy="397" rx="130" ry="11" fill={C.line} opacity="0.12" />
    <path d="M292 356 Q298 336 306 332 Q310 346 312 360 Z" fill={C.mane} stroke={C.line} strokeWidth="4" strokeLinejoin="round" />
    <path d="M326 356 Q336 338 344 336 Q344 350 342 362 Z" fill={C.mane} stroke={C.line} strokeWidth="4" strokeLinejoin="round" />
    <path d="M246 350 C290 384 344 384 362 338" fill="none" stroke={C.line} strokeWidth="35" strokeLinecap="round" />
    <path d="M352 350 C342 328 350 308 364 296 C362 310 372 312 376 302 C380 314 390 312 394 302 C398 324 386 344 372 352 Z" fill={C.mane} stroke={C.line} strokeWidth="5" strokeLinejoin="round" />
    <path d="M246 350 C290 384 344 384 362 338" fill="none" stroke={C.body} strokeWidth="25" strokeLinecap="round" />
    <ellipse cx="200" cy="308" rx="80" ry="68" fill={C.body} stroke={C.line} strokeWidth="5" />
    <ellipse cx="200" cy="320" rx="50" ry="45" fill={C.belly} />
    <path d="M164 306 Q200 316 236 306 M158 330 Q200 341 242 330 M170 352 Q200 361 230 352" fill="none" stroke={C.bellyLine} strokeWidth="3.5" strokeLinecap="round" />
    <ellipse cx="200" cy="268" rx="58" ry="14" fill={C.shade} opacity="0.55" />
    <ellipse cx="164" cy="374" rx="28" ry="16" fill={C.body} stroke={C.line} strokeWidth="5" />
    <ellipse cx="236" cy="374" rx="28" ry="16" fill={C.body} stroke={C.line} strokeWidth="5" />
    {[152, 164, 176, 224, 236, 248].map((cx) => (
      <circle key={cx} cx={cx} cy={cx === 164 || cx === 236 ? 384 : 381} r="4" fill={C.horn} stroke={C.line} strokeWidth="2" />
    ))}

    <Head f={f} whiskers="full" />

    {f.restArm && (
      <>
        <Arm d="M136 290 Q114 306 112 330" />
        <Paw cx={112} cy={336} r={15} />
      </>
    )}
    {f.pose === 'wave' && (
      <>
        <Arm d="M264 290 Q310 284 322 238" />
        <circle cx="311" cy="234" r="6.5" fill={C.body} stroke={C.line} strokeWidth="4" />
        <Paw cx={326} cy={222} r={16} />
        <path d="M350 206 Q358 220 352 236" fill="none" stroke={C.line} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </>
    )}
    {f.pose === 'chin' && (
      <>
        <Arm d="M266 292 Q244 320 200 318" />
        <Paw cx={194} cy={316} r={14} />
        <Arm d="M134 292 Q150 290 164 282" />
        <ellipse cx="184" cy="252" rx="5.5" ry="11" transform="rotate(12 184 252)" fill={C.body} stroke={C.line} strokeWidth="3.5" />
        <Paw cx={176} cy={272} r={15} />
      </>
    )}
    {f.pose === 'orb' && (
      <>
        <circle cx="330" cy="282" r="28" fill={C.glow} opacity="0.2" />
        <Arm d="M266 292 Q300 318 316 314" />
        <Thumb cx={311} cy={303} r={6} />
        <Paw cx={322} cy={316} r={15} />
        <Orb cx={330} cy={282} r={17} />
        <Sparkle d="M330 272 Q332.2 279.8 340 282 Q332.2 284.2 330 292 Q327.8 284.2 320 282 Q327.8 279.8 330 272 Z" />
        <Sparkle d="M352 230 Q353.3 234.7 358 236 Q353.3 237.3 352 242 Q350.7 237.3 346 236 Q350.7 234.7 352 230 Z" />
      </>
    )}
    {f.pose === 'cheer' && (
      <>
        <Arm d="M136 290 Q92 280 78 230 M264 290 Q308 280 322 230" />
        <Paw cx={74} cy={216} r={15} />
        <Paw cx={326} cy={216} r={15} />
        <Sparkle d="M46 178 Q47.6 184.4 54 186 Q47.6 187.6 46 194 Q44.4 187.6 38 186 Q44.4 184.4 46 178 Z" />
        <Sparkle d="M354 178 Q355.6 184.4 362 186 Q355.6 187.6 354 194 Q352.4 187.6 346 186 Q352.4 184.4 354 178 Z" />
      </>
    )}
    {f.pose === 'pray' && (
      <>
        <Arm d="M136 292 Q160 300 186 290 M264 292 Q240 300 214 290" />
        <ellipse cx="193" cy="280" rx="11" ry="18" fill={C.body} stroke={C.line} strokeWidth="4.5" />
        <ellipse cx="207" cy="280" rx="11" ry="18" fill={C.body} stroke={C.line} strokeWidth="4.5" />
      </>
    )}
    {f.pose === 'cross' && (
      <>
        <Arm d="M266 300 Q208 332 156 312" />
        <Paw cx={150} cy={308} r={14} />
        <Arm d="M134 292 Q194 318 248 300" />
        <Paw cx={252} cy={298} r={14} />
      </>
    )}
  </svg>
);

const Avatar = ({ f }: { f: Face }) => (
  <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
    <circle cx="200" cy="200" r="172" fill={C.backdrop} />
    <path d="M130.2 357.2 A80 68 0 1 1 269.8 357.2 A172 172 0 0 1 130.2 357.2 Z" fill={C.body} />
    <path d="M130.2 357.2 A80 68 0 1 1 269.8 357.2" fill="none" stroke={C.line} strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="200" cy="334" rx="48" ry="34" fill={C.belly} />
    <path d="M166 322 Q200 331 234 322 M162 344 Q200 354 238 344" fill="none" stroke={C.bellyLine} strokeWidth="3.5" strokeLinecap="round" />
    <ellipse cx="200" cy="284" rx="58" ry="14" fill={C.shade} opacity="0.55" />

    <g transform="translate(0 16)">
      <Head f={f} whiskers="avatar" />
    </g>

    {f.pose === 'wave' && (
      <>
        <Arm thin d="M262 308 Q308 300 322 248" />
        <Thumb cx={311} cy={242} r={6} />
        <Paw thin cx={326} cy={232} r={16} />
        <path d="M350 216 Q358 230 352 246" fill="none" stroke={C.line} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </>
    )}
    {f.pose === 'chin' && (
      <>
        <Arm thin d="M138 312 Q150 304 166 296" />
        <ellipse cx="182" cy="270" rx="5.5" ry="11" transform="rotate(12 182 270)" fill={C.body} stroke={C.line} strokeWidth="3.5" />
        <Paw thin cx={174} cy={290} r={15} />
      </>
    )}
    {f.pose === 'orb' && (
      <>
        <circle cx="76" cy="262" r="25" fill={C.glow} opacity="0.2" />
        <Arm thin d="M138 312 Q106 318 90 304" />
        <Thumb cx={96} cy={291} r={6} />
        <Paw thin cx={84} cy={300} r={15} />
        <Orb cx={76} cy={262} r={16} />
        <Sparkle d="M76 253 Q78 260 85 262 Q78 264 76 271 Q74 264 67 262 Q74 260 76 253 Z" />
        <Sparkle d="M50 230 Q51.3 234.7 56 236 Q51.3 237.3 50 242 Q48.7 237.3 44 236 Q48.7 234.7 50 230 Z" />
      </>
    )}
    {f.pose === 'cheer' && (
      <>
        <Arm thin d="M136 308 Q92 300 78 242 M264 308 Q308 300 322 242" />
        <Paw thin cx={74} cy={226} r={15} />
        <Paw thin cx={326} cy={226} r={15} />
      </>
    )}
    {f.pose === 'pray' && (
      <>
        <Arm thin d="M138 312 Q160 318 186 306 M262 312 Q240 318 214 306" />
        <ellipse cx="193" cy="294" rx="11" ry="18" fill={C.body} stroke={C.line} strokeWidth="4.5" />
        <ellipse cx="207" cy="294" rx="11" ry="18" fill={C.body} stroke={C.line} strokeWidth="4.5" />
      </>
    )}
    {f.pose === 'cross' && (
      <>
        <Arm thin d="M262 316 Q208 346 158 326" />
        <Paw thin cx={152} cy={322} r={14} />
        <Arm thin d="M138 306 Q194 330 246 314" />
        <Paw thin cx={250} cy={312} r={14} />
      </>
    )}
  </svg>
);

const NeoAsis = ({ mood, variant = 'full' }: NeoAsisProps) => {
  const face = { ...BASE_FACE, ...FACES[mood] };
  return variant === 'avatar' ? <Avatar f={face} /> : <FullBody f={face} />;
};

export default NeoAsis;
