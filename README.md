## Barking Bravery

This project is a playful animated vignette built with Next.js and Tailwind CSS. A courageous dog barks at a lion, startling the big cat into a clumsy retreat. The entire scene runs client-side with Framer Motion powering the animations.

### 🛠️ Tech Stack
- Next.js App Router + TypeScript
- Tailwind CSS for rapid styling
- Framer Motion for timeline-driven animation

### 🚀 Run It Locally
```bash
npm install
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000) to watch the encounter. Use the “Replay the Bark” button to restart the sequence.

### 📂 Project Structure Highlights
- `src/app/page.tsx` renders the hero layout and headline.
- `src/components/DogLionScene.tsx` contains the interactive animation, SVG artwork, and timing logic.
- `src/app/globals.css` houses global styles and Tailwind setup.

### 🧪 Testing & Linting
```bash
npm run lint
```
Tailwind and Framer Motion do not require extra configuration beyond what ships in this repository.

### 📦 Deployment
The build is ready for hosting on Vercel. Run `npm run build` locally to ensure everything compiles cleanly, then deploy with `vercel deploy --prod` (token required).
