# 🎚️ Suno Prompt Builder v2

Build Suno-ready music prompts like a top AI producer. 16 genres, 9 presets, lyrics editor with Suno section tags, energy curves, save/load, and more.

## Features

- **16 Genres**: CCM/Worship, Pop, Hip Hop, R&B, Country, Rock, EDM, Jazz, Latin, Lo-Fi, K-Pop, Afrobeats, Reggae, Metal, Classical/Cinematic, Phonk
- **Dual Output**: Separate Style Prompt + Lyrics block matching Suno's input fields
- **Lyrics Editor**: One-click Suno tag insertion (`[Verse]`, `[Chorus]`, `[Drop]`, `[Build]`, etc.)
- **9 Quick-Start Presets**: Worship Ballad, Trap Banger, Chill Study Beat, and more
- **🎲 Surprise Me**: Random coherent genre combos for inspiration
- **💾 Save/Load**: Persist favorite prompts in localStorage
- **Energy Curves**: Visual energy arc selector
- **Era Tags**: 60s through 2020s decade flavoring
- **Negative Prompts**: Exclude unwanted elements
- **Character Counter**: Warns when exceeding Suno's limits

## Deploy

### Netlify (recommended)
1. Push to GitHub
2. Connect repo in Netlify
3. It auto-detects the `netlify.toml` — done

### Local Dev
```bash
npm install
npm run dev
```

## Tech Stack
- React 18 + Vite
- Zero external UI libraries
- Pure CSS (no Tailwind)

## License
MIT
