import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const GENRES = {
  "CCM / Worship": {
    icon: "✝️", color: "#f0c040",
    subgenres: ["Modern Worship", "Hymn Reimagined", "Gospel Pop", "Acoustic Worship", "Anthemic Praise", "Contemplative"],
    moods: ["Reverent", "Joyful", "Intimate", "Triumphant", "Reflective", "Peaceful", "Passionate"],
    instruments: ["Acoustic Guitar", "Piano", "Pads/Synth Strings", "Electric Guitar (Ambient)", "Drums", "Bass Guitar", "Choir", "Organ"],
    tempos: ["Slow Ballad (60-72)", "Mid-Tempo (80-100)", "Upbeat (110-130)", "Driving (130-150)"],
    references: ["Elevation Worship", "Phil Wickham", "Brandon Lake", "Bethel Music", "Chris Tomlin", "Hillsong", "Maverick City", "Kari Jobe"],
    tips: "Suno loves dynamic builds. 'Anthemic' or 'intimate' set intensity. Specify [Build] before final chorus for epic payoff.",
  },
  "Pop": {
    icon: "🎤", color: "#ff69b4",
    subgenres: ["Synth Pop", "Indie Pop", "Dance Pop", "Bedroom Pop", "Electropop", "Pop Rock", "Hyperpop", "Art Pop"],
    moods: ["Euphoric", "Melancholic", "Dreamy", "Confident", "Nostalgic", "Playful", "Bittersweet"],
    instruments: ["Synths", "808 Bass", "Claps/Snaps", "Electric Guitar", "Piano", "Vocal Chops", "Strings", "Arps"],
    tempos: ["Slow (70-85)", "Mid (90-110)", "Upbeat (115-128)", "High Energy (130-145)"],
    references: ["The Weeknd", "Dua Lipa", "Harry Styles", "Olivia Rodrigo", "Billie Eilish", "Charli XCX", "Troye Sivan"],
    tips: "Catchy hooks > complexity. 'Radio-ready' or 'lo-fi bedroom' sets production direction. Specify 'earworm chorus'.",
  },
  "Hip Hop / Rap": {
    icon: "🎙️", color: "#ff4444",
    subgenres: ["Trap", "Boom Bap", "Lo-Fi Hip Hop", "Drill", "Conscious Rap", "Melodic Rap", "Phonk-Rap", "Cloud Rap"],
    moods: ["Hard", "Chill", "Dark", "Flexing", "Introspective", "Energetic", "Menacing"],
    instruments: ["808s", "Hi-Hats (Trap)", "Piano Loops", "Synth Leads", "Vocal Ad-Libs", "Sub Bass", "Distorted Bass"],
    tempos: ["Slow (65-80)", "Mid (85-100)", "Trap (130-150)", "Drill (138-145)"],
    references: ["Drake", "Kendrick Lamar", "Travis Scott", "J. Cole", "21 Savage", "Metro Boomin", "Playboi Carti"],
    tips: "Add 'instrumental' for beats only. 'Punchy 808s' or 'melodic'. Drill = sliding 808s + dark piano.",
  },
  "R&B / Soul": {
    icon: "💜", color: "#9b59b6",
    subgenres: ["Neo Soul", "Alternative R&B", "Classic Soul", "PBR&B", "Quiet Storm", "Funk-Soul"],
    moods: ["Sensual", "Smooth", "Vulnerable", "Groovy", "Late Night", "Warm", "Sultry"],
    instruments: ["Rhodes Piano", "Bass Guitar", "Pads", "Muted Guitar", "Horns", "Finger Snaps", "Strings"],
    tempos: ["Slow Jam (55-70)", "Mid-Groove (75-95)", "Uptempo (100-115)"],
    references: ["Frank Ocean", "SZA", "Daniel Caesar", "H.E.R.", "Giveon", "Summer Walker", "Steve Lacy"],
    tips: "'Falsetto' and 'breathy' are powerful modifiers. 'Vinyl warmth' adds texture. Suno excels at R&B vocals.",
  },
  "Country": {
    icon: "🤠", color: "#d4a057",
    subgenres: ["Modern Country", "Country Pop", "Outlaw Country", "Bluegrass", "Country Rock", "Americana", "Red Dirt"],
    moods: ["Heartfelt", "Rowdy", "Nostalgic", "Bittersweet", "Uplifting", "Storytelling", "Gritty"],
    instruments: ["Acoustic Guitar", "Steel Guitar", "Fiddle", "Banjo", "Dobro", "Mandolin", "Bass", "Harmonica"],
    tempos: ["Ballad (60-75)", "Mid (85-105)", "Upbeat (110-130)", "Fast (135-160)"],
    references: ["Morgan Wallen", "Chris Stapleton", "Luke Combs", "Zach Bryan", "Lainey Wilson", "Tyler Childers"],
    tips: "Storytelling lyrics perform best. Specify 'twang' level. 'Dusty production' or 'Nashville polished'.",
  },
  "Rock": {
    icon: "🎸", color: "#e74c3c",
    subgenres: ["Alternative Rock", "Indie Rock", "Classic Rock", "Post-Punk", "Punk", "Hard Rock", "Grunge", "Shoegaze"],
    moods: ["Aggressive", "Anthemic", "Brooding", "Raw", "Euphoric", "Rebellious", "Dreamy"],
    instruments: ["Distorted Guitar", "Bass Guitar", "Drums (Driving)", "Clean Guitar", "Organ", "Power Chords", "Feedback"],
    tempos: ["Slow Burn (70-85)", "Mid (90-110)", "Driving (115-135)", "Fast Punk (150-180)"],
    references: ["Foo Fighters", "Arctic Monkeys", "Nirvana", "The Strokes", "Radiohead", "Green Day", "Tame Impala"],
    tips: "Quiet verse → loud chorus dynamics. 'Wall of sound' or 'garage lo-fi' sets production. 'Guitar solo' works.",
  },
  "Electronic / EDM": {
    icon: "🎛️", color: "#00d4ff",
    subgenres: ["House", "Techno", "Future Bass", "Dubstep", "Trance", "Ambient", "Drum & Bass", "Synthwave"],
    moods: ["Euphoric", "Dark", "Hypnotic", "Chill", "Intense", "Dreamy", "Industrial"],
    instruments: ["Synth Leads", "Sub Bass", "Arps", "Pads", "Risers/FX", "Sidechain Kick", "Vocal Chops", "Acid 303"],
    tempos: ["Ambient (80-100)", "House (120-128)", "Trance (130-140)", "DnB (170-180)", "Dubstep (140 half-time)"],
    references: ["Calvin Harris", "Flume", "Skrillex", "Tiësto", "Deadmau5", "Odesza", "Fred Again.."],
    tips: "'Build → drop' structure is key. 'Sidechain pumping' adds movement. Specify [Drop] tag for impact.",
  },
  "Jazz": {
    icon: "🎷", color: "#f39c12",
    subgenres: ["Smooth Jazz", "Bebop", "Jazz Fusion", "Neo Jazz", "Acid Jazz", "Vocal Jazz", "Cool Jazz"],
    moods: ["Sophisticated", "Smoky", "Upbeat Swing", "Contemplative", "Groovy", "Nocturnal"],
    instruments: ["Saxophone", "Upright Bass", "Piano/Keys", "Brushed Drums", "Trumpet", "Vibraphone", "Clarinet"],
    tempos: ["Ballad (55-70)", "Medium Swing (100-130)", "Uptempo (140-180)"],
    references: ["Kamasi Washington", "Robert Glasper", "Norah Jones", "Chet Baker", "Tom Misch", "Alfa Mist"],
    tips: "'Swing feel' or 'straight eighths'. 'Improvised solo section' triggers interesting generation.",
  },
  "Latin": {
    icon: "💃", color: "#ff6b35",
    subgenres: ["Reggaeton", "Latin Pop", "Bachata", "Salsa", "Cumbia", "Bossa Nova", "Latin Trap"],
    moods: ["Fiery", "Romantic", "Party", "Sensual", "Nostalgic", "Festive", "Sultry"],
    instruments: ["Congas", "Bongos", "Nylon Guitar", "Brass", "Timbales", "808s", "Piano Montuno", "Güiro"],
    tempos: ["Slow (70-85)", "Reggaeton (90-100)", "Mid (105-120)", "Salsa (160-200)"],
    references: ["Bad Bunny", "J Balvin", "Rosalía", "Shakira", "Daddy Yankee", "Karol G", "Peso Pluma"],
    tips: "Dembow rhythm = reggaeton. Specify language (Spanish/English/bilingual). 'Perreo' for club energy.",
  },
  "Lo-Fi / Chill": {
    icon: "🌙", color: "#7eb8da",
    subgenres: ["Lo-Fi Hip Hop", "Chillhop", "Chillwave", "Ambient Pop", "Study Beats", "Jazz Hop"],
    moods: ["Relaxed", "Cozy", "Rainy Day", "Nostalgic", "Dreamy", "Melancholic", "Peaceful"],
    instruments: ["Detuned Piano", "Vinyl Crackle", "Muted Bass", "Jazz Guitar", "Soft Pads", "Rain SFX", "Tape Hiss"],
    tempos: ["Slow (60-75)", "Chill (80-90)", "Mid (90-100)"],
    references: ["Nujabes", "Jinsang", "Tomppabeats", "Idealism", "Quickly Quickly"],
    tips: "'Vinyl crackle' + 'tape hiss' for authentic lo-fi. 'Instrumental' for beat-only. 'Rainy window' sets scene.",
  },
  "K-Pop": {
    icon: "🇰🇷", color: "#e84393",
    subgenres: ["K-Pop (Boy Group)", "K-Pop (Girl Group)", "K-R&B", "K-Indie", "K-Hip Hop", "K-Ballad"],
    moods: ["Powerful", "Cute", "Dark", "Euphoric", "Emotional", "Fierce", "Dreamy"],
    instruments: ["Synths", "808s", "Brass Stabs", "Strings", "EDM Drops", "Vocal Layers", "Guitar Riffs"],
    tempos: ["Ballad (60-80)", "Mid (90-110)", "Dance (115-130)", "High Energy (130-150)"],
    references: ["BTS", "BLACKPINK", "NewJeans", "Stray Kids", "aespa", "IU", "(G)I-DLE"],
    tips: "K-Pop = genre-switching within one song. Specify 'rap verse + sung chorus'. 'Knife choreography energy'.",
  },
  "Afrobeats": {
    icon: "🌍", color: "#27ae60",
    subgenres: ["Afrobeats", "Amapiano", "Afro-Fusion", "Afro-Pop", "Highlife", "Afro-House"],
    moods: ["Vibrant", "Groovy", "Romantic", "Party", "Laid-back", "Joyful"],
    instruments: ["Log Drums", "Shakers", "Guitar (Clean)", "Synth Pads", "Talking Drum", "Bass Guitar", "Percussion"],
    tempos: ["Slow (80-95)", "Mid Groove (100-115)", "Amapiano (110-120)", "Upbeat (120-135)"],
    references: ["Burna Boy", "Wizkid", "Tems", "Rema", "Davido", "Ayra Starr", "CKay"],
    tips: "'Amapiano' = log drums + deep bass + piano stabs. 'Afro-fusion' blends Western pop. Specify language.",
  },
  "Reggae / Dancehall": {
    icon: "🇯🇲", color: "#2ecc71",
    subgenres: ["Roots Reggae", "Dancehall", "Dub", "Ska", "Lovers Rock", "Modern Dancehall"],
    moods: ["Irie", "Rebellious", "Romantic", "Celebratory", "Conscious", "Dark"],
    instruments: ["Skank Guitar", "Bass (Heavy)", "Organ Bubble", "Horns", "Dub Echo", "Nyabinghi Drums", "Riddim"],
    tempos: ["Dub (65-80)", "Roots (80-95)", "Dancehall (95-110)", "Ska (130-160)"],
    references: ["Bob Marley", "Sean Paul", "Shaggy", "Protoje", "Koffee", "Popcaan"],
    tips: "'One-drop' rhythm = classic reggae. 'Dub delays' for spacey mix. 'Riddim' for dancehall beat.",
  },
  "Metal": {
    icon: "🤘", color: "#95a5a6",
    subgenres: ["Heavy Metal", "Metalcore", "Death Metal", "Prog Metal", "Nu-Metal", "Doom Metal", "Black Metal", "Djent"],
    moods: ["Brutal", "Epic", "Dark", "Chaotic", "Melancholic", "Aggressive", "Atmospheric"],
    instruments: ["Distorted Guitar (Drop Tuning)", "Double Bass Drums", "Bass Guitar", "Screaming Vocals", "Blast Beats", "Orchestral Layers"],
    tempos: ["Doom (50-70)", "Mid (90-120)", "Thrash (130-170)", "Blast (180-220+)"],
    references: ["Metallica", "Gojira", "Architects", "Bring Me The Horizon", "Deftones", "Meshuggah", "Spiritbox"],
    tips: "'Breakdown' triggers heavy section. Specify 'clean vocals + screams'. 'Djent' = polyrhythmic chugs.",
  },
  "Classical / Cinematic": {
    icon: "🎻", color: "#8e44ad",
    subgenres: ["Orchestral", "Cinematic Epic", "Neo-Classical", "Chamber Music", "Piano Solo", "Film Score", "Trailer Music"],
    moods: ["Majestic", "Haunting", "Triumphant", "Melancholic", "Tense", "Serene", "Adventurous"],
    instruments: ["Full Orchestra", "Strings", "Piano", "French Horn", "Timpani", "Choir", "Harp", "Woodwinds"],
    tempos: ["Adagio (55-70)", "Andante (75-95)", "Allegro (110-140)", "Presto (150-180)"],
    references: ["Hans Zimmer", "John Williams", "Ludovico Einaudi", "Max Richter", "Ólafur Arnalds", "Two Steps From Hell"],
    tips: "'Epic trailer' for massive percussion + brass. 'Solo piano, minimalist' for intimate. 'Crescendo to fortissimo'.",
  },
  "Phonk": {
    icon: "👹", color: "#c0392b",
    subgenres: ["Drift Phonk", "Brazilian Phonk", "House Phonk", "Phonk Rap", "Dark Phonk"],
    moods: ["Aggressive", "Dark", "Hypnotic", "Distorted", "Menacing", "Energetic"],
    instruments: ["Cowbell", "Distorted 808", "Memphis Samples", "Chopped Vocals", "Synth Stabs", "Reverb Claps"],
    tempos: ["Slow Phonk (80-100)", "Mid (110-130)", "Drift (130-150)", "Brazilian (150-170)"],
    references: ["Kordhell", "DVRST", "Freddie Dredd", "Pharmacist", "PlayaPhonk"],
    tips: "'Cowbell' is essential. 'Memphis vocal chops' + 'distorted 808 bass'. 'Drift edit' for TikTok energy.",
  },
};

const ERAS = [
  "60s Psychedelic", "70s Disco / Funk", "80s Synth / New Wave", "90s Grunge / Britpop",
  "2000s Pop Punk / Crunk", "2010s EDM / Trap", "2020s Hyperpop / Bedroom", "Timeless / No Era",
];

const SUNO_TAGS = [
  "[Intro]", "[Verse]", "[Pre-Chorus]", "[Chorus]", "[Post-Chorus]", "[Bridge]",
  "[Outro]", "[Instrumental Break]", "[Guitar Solo]", "[Build]", "[Drop]",
  "[Breakdown]", "[Key Change]", "[Fade Out]", "[Spoken Word]", "[Ad-Libs]",
  "[Whispered]", "[Belted]", "[Rap Verse]", "[Hook]",
];

const STRUCTURES = [
  { label: "Standard", value: "[Intro]\n[Verse 1]\n[Chorus]\n[Verse 2]\n[Chorus]\n[Bridge]\n[Chorus]\n[Outro]" },
  { label: "Minimal", value: "[Verse 1]\n[Chorus]\n[Verse 2]\n[Chorus]" },
  { label: "Epic Build", value: "[Intro]\n[Verse 1]\n[Pre-Chorus]\n[Chorus]\n[Verse 2]\n[Pre-Chorus]\n[Chorus]\n[Bridge]\n[Key Change]\n[Final Chorus]\n[Outro]" },
  { label: "Verse-Heavy", value: "[Verse 1]\n[Verse 2]\n[Chorus]\n[Verse 3]\n[Chorus]" },
  { label: "Drop-Based", value: "[Intro]\n[Build]\n[Drop]\n[Verse]\n[Build]\n[Drop]\n[Breakdown]\n[Final Drop]\n[Outro]" },
  { label: "Rap Format", value: "[Intro]\n[Verse 1]\n[Hook]\n[Verse 2]\n[Hook]\n[Bridge/Rap Verse 3]\n[Hook]\n[Outro]" },
  { label: "Custom", value: "" },
];

const VOCAL_STYLES = ["Male", "Female", "Duet (Male + Female)", "Choir/Group", "Falsetto", "Raspy/Gritty", "Breathy/Soft", "Powerful Belt", "Whisper", "Spoken Word", "Screaming/Harsh", "Autotune", "No Vocals (Instrumental)"];
const PRODUCTION_STYLES = ["Polished / Radio-Ready", "Raw / Lo-Fi", "Cinematic / Epic", "Stripped / Acoustic", "Vintage / Analog Warmth", "Futuristic / Experimental", "Live Band Feel", "Heavily Processed / Glitchy", "Minimalist / Sparse"];

const ENERGY_LEVELS = [
  { label: "Calm → Calm", curve: [2, 2, 3, 2, 2] },
  { label: "Calm → Build → Peak", curve: [2, 3, 5, 7, 9] },
  { label: "Steady Mid", curve: [5, 5, 5, 5, 5] },
  { label: "Explosive Start", curve: [9, 7, 4, 6, 8] },
  { label: "Roller Coaster", curve: [3, 8, 4, 9, 6] },
  { label: "Slow Burn → Explosion", curve: [1, 2, 3, 5, 10] },
];

const PRESETS = [
  { name: "Worship Ballad", genre: "CCM / Worship", subgenre: "Acoustic Worship", moods: ["Intimate", "Reflective"], tempo: "Slow Ballad (60-72)", vocal: "Male", production: "Stripped / Acoustic", instruments: ["Acoustic Guitar", "Piano", "Pads/Synth Strings"], energy: 0 },
  { name: "Trap Banger", genre: "Hip Hop / Rap", subgenre: "Trap", moods: ["Hard", "Energetic"], tempo: "Trap (130-150)", vocal: "No Vocals (Instrumental)", production: "Polished / Radio-Ready", instruments: ["808s", "Hi-Hats (Trap)", "Synth Leads"], energy: 3 },
  { name: "Chill Study Beat", genre: "Lo-Fi / Chill", subgenre: "Lo-Fi Hip Hop", moods: ["Relaxed", "Cozy"], tempo: "Chill (80-90)", vocal: "No Vocals (Instrumental)", production: "Raw / Lo-Fi", instruments: ["Detuned Piano", "Vinyl Crackle", "Jazz Guitar", "Tape Hiss"], energy: 0 },
  { name: "Anthemic Worship", genre: "CCM / Worship", subgenre: "Anthemic Praise", moods: ["Triumphant", "Joyful"], tempo: "Upbeat (110-130)", vocal: "Choir/Group", production: "Cinematic / Epic", instruments: ["Electric Guitar (Ambient)", "Drums", "Pads/Synth Strings", "Choir"], energy: 5 },
  { name: "Bedroom Pop", genre: "Pop", subgenre: "Bedroom Pop", moods: ["Dreamy", "Melancholic"], tempo: "Mid (90-110)", vocal: "Breathy/Soft", production: "Raw / Lo-Fi", instruments: ["Synths", "Electric Guitar", "Vocal Chops"], energy: 1 },
  { name: "Cinematic Trailer", genre: "Classical / Cinematic", subgenre: "Trailer Music", moods: ["Majestic", "Tense"], tempo: "Allegro (110-140)", vocal: "Choir/Group", production: "Cinematic / Epic", instruments: ["Full Orchestra", "Timpani", "Choir", "French Horn"], energy: 5 },
  { name: "Phonk Drift", genre: "Phonk", subgenre: "Drift Phonk", moods: ["Aggressive", "Dark"], tempo: "Drift (130-150)", vocal: "No Vocals (Instrumental)", production: "Heavily Processed / Glitchy", instruments: ["Cowbell", "Distorted 808", "Chopped Vocals"], energy: 4 },
  { name: "Neo Soul Groove", genre: "R&B / Soul", subgenre: "Neo Soul", moods: ["Groovy", "Warm"], tempo: "Mid-Groove (75-95)", vocal: "Female", production: "Vintage / Analog Warmth", instruments: ["Rhodes Piano", "Bass Guitar", "Horns"], energy: 2 },
  { name: "K-Pop Dance", genre: "K-Pop", subgenre: "K-Pop (Girl Group)", moods: ["Fierce", "Powerful"], tempo: "Dance (115-130)", vocal: "Female", production: "Polished / Radio-Ready", instruments: ["Synths", "808s", "Brass Stabs", "EDM Drops"], energy: 4 },
];

const CHAR_LIMIT = 200;
const LYRICS_LIMIT = 3000;

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function Chip({ label, selected, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: "999px", cursor: "pointer", transition: "all 0.15s ease",
      border: selected ? `2px solid ${color || "var(--ac)"}` : "1px solid var(--bd)",
      background: selected ? `${color || "var(--ac)"}18` : "var(--s1)",
      color: selected ? (color || "var(--ac)") : "var(--t2)",
      fontSize: 12, fontWeight: selected ? 700 : 500, fontFamily: "var(--mono)",
      lineHeight: "18px", whiteSpace: "nowrap",
    }}>
      {label}
    </button>
  );
}

function Sec({ title, number, sub, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{
          background: "var(--ac)", color: "#000", fontWeight: 900, fontSize: 10,
          width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--mono)", flexShrink: 0,
        }}>{number}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "var(--head)" }}>{title}</span>
        {sub && <span style={{ fontSize: 11, color: "var(--t3)", fontFamily: "var(--mono)" }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

function ChipWrap({ children }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{children}</div>;
}

function EnergyCurve({ curve, color }) {
  const w = 200, h = 48, pad = 4;
  const pts = curve.map((v, i) => {
    const x = pad + (i / (curve.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v / 10) * (h - pad * 2));
    return `${x},${y}`;
  });
  const area = `${pad},${h - pad} ${pts.join(" ")} ${w - pad},${h - pad}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 200, height: 48 }}>
      <defs>
        <linearGradient id={`eg${curve.join("")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#eg${curve.join("")})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {curve.map((v, i) => {
        const x = pad + (i / (curve.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v / 10) * (h - pad * 2));
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

function CharCount({ current, max, label }) {
  const pct = current / max;
  const col = pct > 0.9 ? "#ff4444" : pct > 0.7 ? "#ffaa00" : "var(--t3)";
  return (
    <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: col, textAlign: "right", marginTop: 4 }}>
      {label}: {current}/{max}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function SunoV2() {
  const [genre, setGenre] = useState(null);
  const [subgenre, setSubgenre] = useState(null);
  const [moods, setMoods] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [tempo, setTempo] = useState(null);
  const [structure, setStructure] = useState(STRUCTURES[0]);
  const [customStructure, setCustomStructure] = useState("");
  const [vocalStyle, setVocalStyle] = useState(null);
  const [productionStyle, setProductionStyle] = useState(null);
  const [references, setReferences] = useState([]);
  const [customNotes, setCustomNotes] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [negatives, setNegatives] = useState("");
  const [era, setEra] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [tab, setTab] = useState("style"); // style | lyrics | output
  const [saved, setSaved] = useState([]);
  const [copiedStyle, setCopiedStyle] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const outRef = useRef(null);

  // Load saved prompts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("suno-saved");
      if (stored) setSaved(JSON.parse(stored));
    } catch {}
  }, []);

  const saveCurrent = () => {
    const name = songTitle || `Prompt ${saved.length + 1}`;
    const entry = { name, genre, subgenre, moods, instruments, tempo, structure: structure.label, vocalStyle, productionStyle, references, customNotes, negatives, era, energy, lyrics, songTitle, ts: Date.now() };
    const next = [...saved, entry];
    setSaved(next);
    try { localStorage.setItem("suno-saved", JSON.stringify(next)); } catch {}
  };

  const loadSaved = (s) => {
    setGenre(s.genre); setSubgenre(s.subgenre); setMoods(s.moods); setInstruments(s.instruments);
    setTempo(s.tempo); setVocalStyle(s.vocalStyle); setProductionStyle(s.productionStyle);
    setReferences(s.references); setCustomNotes(s.customNotes); setNegatives(s.negatives || "");
    setEra(s.era || null); setEnergy(s.energy ?? null); setLyrics(s.lyrics || ""); setSongTitle(s.songTitle || "");
    const st = STRUCTURES.find(x => x.label === s.structure) || STRUCTURES[0];
    setStructure(st);
  };

  const deleteSaved = (idx) => {
    const next = saved.filter((_, i) => i !== idx);
    setSaved(next);
    try { localStorage.setItem("suno-saved", JSON.stringify(next)); } catch {}
  };

  const toggle = (arr, setArr, val) => setArr(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val]);

  const loadPreset = (p) => {
    setGenre(p.genre); setSubgenre(p.subgenre); setMoods(p.moods); setTempo(p.tempo);
    setVocalStyle(p.vocal); setProductionStyle(p.production); setInstruments(p.instruments);
    setEnergy(p.energy); setReferences([]); setNegatives(""); setEra(null); setCustomNotes("");
    setLyrics(""); setSongTitle(p.name); setStructure(STRUCTURES[0]); setShowPresets(false);
  };

  const randomize = () => {
    const gKeys = Object.keys(GENRES);
    const g = gKeys[Math.floor(Math.random() * gKeys.length)];
    const gd = GENRES[g];
    const pick = (a, n = 1) => { const s = [...a].sort(() => Math.random() - 0.5); return n === 1 ? s[0] : s.slice(0, n); };
    setGenre(g); setSubgenre(pick(gd.subgenres));
    setMoods(pick(gd.moods, 1 + Math.floor(Math.random() * 2)));
    setTempo(pick(gd.tempos)); setInstruments(pick(gd.instruments, 2 + Math.floor(Math.random() * 3)));
    setVocalStyle(pick(VOCAL_STYLES)); setProductionStyle(pick(PRODUCTION_STYLES));
    setReferences(pick(gd.references, 1 + Math.floor(Math.random() * 2)));
    setEra(pick(ERAS)); setEnergy(Math.floor(Math.random() * ENERGY_LEVELS.length));
    setNegatives(""); setCustomNotes(""); setLyrics(""); setSongTitle("");
    setStructure(STRUCTURES[Math.floor(Math.random() * (STRUCTURES.length - 1))]);
  };

  const handleReset = () => {
    setGenre(null); setSubgenre(null); setMoods([]); setInstruments([]); setTempo(null);
    setStructure(STRUCTURES[0]); setCustomStructure(""); setVocalStyle(null);
    setProductionStyle(null); setReferences([]); setCustomNotes(""); setSongTitle("");
    setNegatives(""); setEra(null); setEnergy(null); setLyrics("");
  };

  useEffect(() => {
    setSubgenre(null); setMoods([]); setInstruments([]); setTempo(null); setReferences([]);
  }, [genre]);

  const genreData = genre ? GENRES[genre] : null;
  const gc = genreData?.color || "var(--ac)";

  const buildStylePrompt = () => {
    if (!genre) return "";
    const p = [];
    p.push(subgenre || genre);
    if (moods.length) p.push(moods.join(", "));
    if (era && era !== "Timeless / No Era") p.push(era);
    if (vocalStyle && vocalStyle !== "No Vocals (Instrumental)") p.push(`${vocalStyle} vocals`);
    if (vocalStyle === "No Vocals (Instrumental)") p.push("Instrumental");
    if (productionStyle) p.push(productionStyle);
    if (tempo) p.push(tempo.replace(/\(.*\)/, "").trim());
    if (instruments.length) p.push(instruments.join(", "));
    if (references.length) p.push(`inspired by ${references.join(", ")}`);
    if (energy !== null) {
      const e = ENERGY_LEVELS[energy];
      if (e) p.push(`Energy: ${e.label}`);
    }
    if (negatives) p.push(`Exclude: ${negatives}`);
    if (customNotes) p.push(customNotes);
    return p.join(", ");
  };

  const buildLyricsBlock = () => {
    if (!lyrics.trim()) {
      const structVal = structure.label === "Custom" ? customStructure : structure.value;
      return structVal || "";
    }
    return lyrics;
  };

  const stylePrompt = buildStylePrompt();
  const lyricsBlock = buildLyricsBlock();

  const insertTag = (tag) => {
    setLyrics(prev => {
      const add = prev ? `\n${tag}\n` : `${tag}\n`;
      return prev + add;
    });
  };

  const insertStructure = () => {
    const structVal = structure.label === "Custom" ? customStructure : structure.value;
    if (structVal) {
      setLyrics(prev => prev ? prev + "\n\n" + structVal : structVal);
    }
  };

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--bd)",
    background: "var(--s1)", color: "var(--t1)", fontSize: 13, fontFamily: "var(--mono)", outline: "none",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        :root {
          --bg: #07070a; --s0: #0d0d12; --s1: #131319; --s2: #1b1b24;
          --bd: #262633; --t1: #e8e8f0; --t2: #8888a2; --t3: #55556a;
          --ac: #a6ff00; --ac2: rgba(166,255,0,0.08); --ac3: #3a5500;
          --red: #ff4466; --head: 'Outfit', sans-serif; --mono: 'IBM Plex Mono', monospace;
        }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--s0); }
        ::-webkit-scrollbar-thumb { background: var(--bd); border-radius: 3px; }
        textarea:focus, input:focus { border-color: var(--ac) !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fadein { animation: fadeIn 0.3s ease forwards; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--t1)", fontFamily: "var(--head)", padding: "20px 14px", maxWidth: 740, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 20, padding: "16px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ac2)", border: "1px solid var(--ac3)", borderRadius: 999, padding: "4px 14px", marginBottom: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ac)", boxShadow: "0 0 8px var(--ac)" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--ac)", letterSpacing: "0.2em", fontFamily: "var(--mono)", textTransform: "uppercase" }}>SUNO PROMPT BUILDER V2</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 6px" }}>
            Produce Like a Pro
          </h1>
          <p style={{ color: "var(--t2)", fontSize: 13, maxWidth: 420, margin: "0 auto" }}>
            Build Suno-ready style prompts + lyrics with genre-specific precision. Save your favorites.
          </p>
        </div>

        {/* ── TOP ACTIONS ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={() => setShowPresets(!showPresets)} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid var(--bd)", background: "var(--s1)",
            color: "var(--t1)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--mono)",
          }}>⚡ Presets</button>
          <button onClick={randomize} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid var(--bd)", background: "var(--s1)",
            color: "var(--t1)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--mono)",
          }}>🎲 Surprise Me</button>
          <button onClick={handleReset} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid var(--bd)", background: "var(--s1)",
            color: "var(--t2)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--mono)",
          }}>↺ Reset All</button>
          {genre && <button onClick={saveCurrent} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid var(--ac3)", background: "var(--ac2)",
            color: "var(--ac)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--mono)", marginLeft: "auto",
          }}>💾 Save Prompt</button>}
        </div>

        {/* ── PRESETS / SAVED ── */}
        {showPresets && (
          <div className="fadein" style={{ background: "var(--s0)", border: "1px solid var(--bd)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ac)", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--mono)" }}>QUICK START PRESETS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: saved.length ? 14 : 0 }}>
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => loadPreset(p)} style={{
                  padding: "6px 12px", borderRadius: 6, border: "1px solid var(--bd)", background: "var(--s1)",
                  color: "var(--t1)", fontSize: 11, cursor: "pointer", fontFamily: "var(--mono)", fontWeight: 500,
                }}>
                  {GENRES[p.genre]?.icon} {p.name}
                </button>
              ))}
            </div>
            {saved.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t2)", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "var(--mono)" }}>YOUR SAVED PROMPTS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {saved.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => { loadSaved(s); setShowPresets(false); }} style={{
                        flex: 1, padding: "6px 12px", borderRadius: 6, border: "1px solid var(--bd)", background: "var(--s1)",
                        color: "var(--t1)", fontSize: 11, cursor: "pointer", fontFamily: "var(--mono)", textAlign: "left",
                      }}>
                        {GENRES[s.genre]?.icon} {s.name} <span style={{ color: "var(--t3)", marginLeft: 6 }}>{s.genre}</span>
                      </button>
                      <button onClick={() => deleteSaved(i)} style={{
                        padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent",
                        color: "var(--red)", fontSize: 12, cursor: "pointer",
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TABS ── */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--bd)", marginBottom: 20 }}>
          {[["style", "🎚️ Style Builder"], ["lyrics", "✍️ Lyrics"], ["output", "📋 Output"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: "10px 0", background: "transparent", border: "none", cursor: "pointer",
              color: tab === key ? "var(--ac)" : "var(--t3)", fontSize: 12, fontWeight: 700, fontFamily: "var(--mono)",
              borderBottom: tab === key ? "2px solid var(--ac)" : "2px solid transparent", transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        {/* ═══════ STYLE TAB ═══════ */}
        {tab === "style" && (
          <div className="fadein">
            <Sec title="Genre" number="1">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))", gap: 6 }}>
                {Object.entries(GENRES).map(([name, data]) => (
                  <button key={name} onClick={() => setGenre(name)} style={{
                    padding: "10px 6px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s", textAlign: "center",
                    border: genre === name ? `2px solid ${data.color}` : "1px solid var(--bd)",
                    background: genre === name ? `${data.color}15` : "var(--s1)",
                    color: genre === name ? data.color : "var(--t1)",
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{data.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--mono)", lineHeight: 1.2 }}>{name}</div>
                  </button>
                ))}
              </div>
            </Sec>

            {genreData && (
              <div className="fadein">
                <div style={{
                  background: `${gc}10`, border: `1px solid ${gc}30`, borderRadius: 8,
                  padding: "8px 12px", marginBottom: 18, fontSize: 11, color: gc, fontFamily: "var(--mono)",
                }}>
                  💡 {genreData.tips}
                </div>

                <Sec title="Subgenre" number="2">
                  <ChipWrap>
                    {genreData.subgenres.map(s => <Chip key={s} label={s} selected={subgenre === s} onClick={() => setSubgenre(subgenre === s ? null : s)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Mood" number="3" sub="pick 1-3">
                  <ChipWrap>
                    {genreData.moods.map(m => <Chip key={m} label={m} selected={moods.includes(m)} onClick={() => toggle(moods, setMoods, m)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Tempo" number="4">
                  <ChipWrap>
                    {genreData.tempos.map(t => <Chip key={t} label={t} selected={tempo === t} onClick={() => setTempo(tempo === t ? null : t)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Era / Decade" number="5">
                  <ChipWrap>
                    {ERAS.map(e => <Chip key={e} label={e} selected={era === e} onClick={() => setEra(era === e ? null : e)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Vocal Style" number="6">
                  <ChipWrap>
                    {VOCAL_STYLES.map(v => <Chip key={v} label={v} selected={vocalStyle === v} onClick={() => setVocalStyle(vocalStyle === v ? null : v)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Production Style" number="7">
                  <ChipWrap>
                    {PRODUCTION_STYLES.map(p => <Chip key={p} label={p} selected={productionStyle === p} onClick={() => setProductionStyle(productionStyle === p ? null : p)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Instruments" number="8">
                  <ChipWrap>
                    {genreData.instruments.map(i => <Chip key={i} label={i} selected={instruments.includes(i)} onClick={() => toggle(instruments, setInstruments, i)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Energy Curve" number="9">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 6 }}>
                    {ENERGY_LEVELS.map((e, i) => (
                      <button key={i} onClick={() => setEnergy(energy === i ? null : i)} style={{
                        padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                        border: energy === i ? `2px solid ${gc}` : "1px solid var(--bd)",
                        background: energy === i ? `${gc}12` : "var(--s1)", transition: "all 0.15s",
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: energy === i ? gc : "var(--t2)", fontFamily: "var(--mono)", marginBottom: 4 }}>{e.label}</div>
                        <EnergyCurve curve={e.curve} color={energy === i ? gc : "var(--t3)"} />
                      </button>
                    ))}
                  </div>
                </Sec>

                <Sec title="Artist References" number="10">
                  <ChipWrap>
                    {genreData.references.map(r => <Chip key={r} label={r} selected={references.includes(r)} onClick={() => toggle(references, setReferences, r)} color={gc} />)}
                  </ChipWrap>
                </Sec>

                <Sec title="Song Structure" number="11">
                  <ChipWrap>
                    {STRUCTURES.map(s => <Chip key={s.label} label={s.label} selected={structure.label === s.label} onClick={() => setStructure(s)} color={gc} />)}
                  </ChipWrap>
                  {structure.label === "Custom" && (
                    <textarea value={customStructure} onChange={e => setCustomStructure(e.target.value)} rows={3}
                      placeholder="e.g. [Intro]&#10;[Verse 1]&#10;[Hook]&#10;[Verse 2]&#10;[Hook]&#10;[Outro]"
                      style={{ ...inputStyle, marginTop: 8, resize: "vertical" }} />
                  )}
                </Sec>

                <Sec title="Exclude / Negative" number="12" sub="what to avoid">
                  <input value={negatives} onChange={e => setNegatives(e.target.value)}
                    placeholder="e.g. autotune, heavy bass, screaming" style={inputStyle} />
                </Sec>

                <Sec title="Extra Notes & Title" number="13">
                  <input value={songTitle} onChange={e => setSongTitle(e.target.value)} placeholder="Song title (optional)" style={{ ...inputStyle, marginBottom: 6 }} />
                  <textarea value={customNotes} onChange={e => setCustomNotes(e.target.value)} rows={2}
                    placeholder="Extra production notes, lyrical themes, vibes..." style={{ ...inputStyle, resize: "vertical" }} />
                </Sec>
              </div>
            )}
          </div>
        )}

        {/* ═══════ LYRICS TAB ═══════ */}
        {tab === "lyrics" && (
          <div className="fadein">
            <div style={{ fontSize: 12, color: "var(--t2)", marginBottom: 12, fontFamily: "var(--mono)" }}>
              Write lyrics with Suno section tags. Click tags to insert them at the cursor.
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "var(--mono)" }}>INSERT SUNO TAGS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {SUNO_TAGS.map(t => (
                  <button key={t} onClick={() => insertTag(t)} style={{
                    padding: "3px 8px", borderRadius: 4, border: "1px solid var(--bd)", background: "var(--s1)",
                    color: "var(--ac)", fontSize: 10, cursor: "pointer", fontFamily: "var(--mono)", fontWeight: 600,
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {structure.value && (
              <button onClick={insertStructure} style={{
                padding: "6px 12px", borderRadius: 6, border: "1px solid var(--ac3)", background: "var(--ac2)",
                color: "var(--ac)", fontSize: 11, cursor: "pointer", fontFamily: "var(--mono)", fontWeight: 600, marginBottom: 10,
              }}>📐 Insert "{structure.label}" Structure Template</button>
            )}

            <textarea
              value={lyrics} onChange={e => setLyrics(e.target.value)}
              rows={18}
              placeholder={"[Verse 1]\nWrite your lyrics here...\n\n[Chorus]\nThe hook goes here...\n\n[Verse 2]\nKeep going...\n\n[Bridge]\nSwitch it up...\n\n[Chorus]\nBring it home..."}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, fontSize: 13 }}
            />
            <CharCount current={lyrics.length} max={LYRICS_LIMIT} label="Lyrics" />
          </div>
        )}

        {/* ═══════ OUTPUT TAB ═══════ */}
        {tab === "output" && (
          <div className="fadein" ref={outRef}>
            {!genre ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--t3)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎚️</div>
                <div style={{ fontSize: 13, fontFamily: "var(--mono)" }}>Select a genre in the Style tab to generate your prompt.</div>
              </div>
            ) : (
              <>
                {/* Style Prompt */}
                <div style={{ background: "var(--s0)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: gc, letterSpacing: "0.12em", fontFamily: "var(--mono)", textTransform: "uppercase" }}>
                        STYLE / GENRE PROMPT
                      </span>
                      <span style={{ fontSize: 10, color: "var(--t3)", marginLeft: 8, fontFamily: "var(--mono)" }}>
                        → Paste into Suno's "Style of Music" field
                      </span>
                    </div>
                    <button onClick={() => copy(stylePrompt, setCopiedStyle)} style={{
                      padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 11,
                      background: copiedStyle ? "#22cc44" : gc, color: "#000", transition: "background 0.2s", fontFamily: "var(--mono)",
                    }}>{copiedStyle ? "✓ Copied" : "Copy"}</button>
                  </div>
                  <pre style={{
                    whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontSize: 13, lineHeight: 1.7,
                    color: "var(--t1)", fontFamily: "var(--mono)", padding: "10px 12px", background: "var(--s1)",
                    borderRadius: 6, border: "1px solid var(--bd)",
                  }}>
                    {stylePrompt || "Select options to build..."}
                  </pre>
                  <CharCount current={stylePrompt.length} max={CHAR_LIMIT} label="Style prompt" />
                  {stylePrompt.length > CHAR_LIMIT && (
                    <div style={{ fontSize: 10, color: "var(--red)", fontFamily: "var(--mono)", marginTop: 2 }}>
                      ⚠️ Over Suno's ~200 char style limit. Trim instruments/references.
                    </div>
                  )}
                </div>

                {/* Lyrics Block */}
                <div style={{ background: "var(--s0)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: gc, letterSpacing: "0.12em", fontFamily: "var(--mono)", textTransform: "uppercase" }}>
                        LYRICS / STRUCTURE
                      </span>
                      <span style={{ fontSize: 10, color: "var(--t3)", marginLeft: 8, fontFamily: "var(--mono)" }}>
                        → Paste into Suno's "Lyrics" field
                      </span>
                    </div>
                    <button onClick={() => copy(lyricsBlock, setCopiedLyrics)} style={{
                      padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 11,
                      background: copiedLyrics ? "#22cc44" : gc, color: "#000", transition: "background 0.2s", fontFamily: "var(--mono)",
                    }}>{copiedLyrics ? "✓ Copied" : "Copy"}</button>
                  </div>
                  <pre style={{
                    whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontSize: 13, lineHeight: 1.7,
                    color: "var(--t1)", fontFamily: "var(--mono)", padding: "10px 12px", background: "var(--s1)",
                    borderRadius: 6, border: "1px solid var(--bd)", maxHeight: 300, overflowY: "auto",
                  }}>
                    {lyricsBlock || "(No lyrics — Suno will auto-generate based on style)"}
                  </pre>
                  {lyrics && <CharCount current={lyrics.length} max={LYRICS_LIMIT} label="Lyrics" />}
                </div>

                {/* Song title if set */}
                {songTitle && (
                  <div style={{ fontSize: 12, color: "var(--t2)", fontFamily: "var(--mono)", textAlign: "center", marginBottom: 8 }}>
                    🎵 Title: <strong style={{ color: "var(--t1)" }}>{songTitle}</strong> — enter this in Suno's title field
                  </div>
                )}

                {/* Combo prompt for custom mode */}
                <div style={{ background: "var(--s0)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", letterSpacing: "0.12em", fontFamily: "var(--mono)", marginBottom: 8, textTransform: "uppercase" }}>
                    FULL COMBINED PROMPT (for Custom Mode)
                  </div>
                  <pre style={{
                    whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontSize: 12, lineHeight: 1.6,
                    color: "var(--t2)", fontFamily: "var(--mono)", padding: "10px 12px", background: "var(--s1)",
                    borderRadius: 6, border: "1px solid var(--bd)", maxHeight: 250, overflowY: "auto",
                  }}>
                    {`Style: ${stylePrompt}\n\n${lyricsBlock ? `Lyrics:\n${lyricsBlock}` : "(Auto-generate lyrics)"}`}
                  </pre>
                  <div style={{ textAlign: "right", marginTop: 6 }}>
                    <button onClick={() => copy(`Style: ${stylePrompt}\n\n${lyricsBlock ? `Lyrics:\n${lyricsBlock}` : "(Auto-generate lyrics)"}`, setCopiedStyle)} style={{
                      padding: "5px 12px", borderRadius: 6, border: "1px solid var(--bd)", cursor: "pointer",
                      background: "var(--s1)", color: "var(--t2)", fontSize: 11, fontFamily: "var(--mono)",
                    }}>Copy All</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px 0 8px", fontSize: 10, color: "var(--t3)", fontFamily: "var(--mono)" }}>
          Built for Ai · {Object.keys(GENRES).length} genres · {PRESETS.length} presets · ∞ possibilities
        </div>
      </div>
    </>
  );
}
