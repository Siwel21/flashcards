import React, { useEffect, useRef, useState } from "react";

/**
 * Flashcards – 1st Grade Spelling (No deps)
 *
 * Versión con botón de audio en el lado del deletreo.
 * Reproduce un archivo localizado en la carpeta "/audio" con el mismo nombre
 * que la palabra (por ejemplo: happy -> /audio/happy.mp3). Se incluyen
 * fuentes alternativas (.mp3, .wav, .m4a) por compatibilidad.
 *
 * Características:
 * - Una tarjeta a la vez en pantalla (Anterior/Siguiente).
 * - Botón 🔊 en el reverso para reproducir el audio de la palabra.
 * - Al imprimir: UNA tarjeta por página tamaño carta (letter), todas en orden.
 * - Cada tarjeta: emoji (dibujo), palabra, frase y deletreo por letras.
 */

// ===== DATASET completo (100 palabras) =====
const SEED = [
  { word: "happy", sentence: "My mom is always happy.", emoji: "😊" },
  { word: "sad", sentence: "She feels sad today.", emoji: "😢" },
  { word: "boy", sentence: "That boy is my friend.", emoji: "🧒" },
  { word: "girl", sentence: "That girl is my cousin.", emoji: "👧" },
  { word: "adult", sentence: "My grandfather is an adult.", emoji: "🧓" },
  { word: "child", sentence: "The child plays outside.", emoji: "🧒" },
  { word: "student", sentence: "I'm the best student at Thi.", emoji: "🎓" },
  { word: "teacher", sentence: "My teacher is the best.", emoji: "👩‍🏫" },
  { word: "one", sentence: "My brother will be one soon.", emoji: "1️⃣" },
  { word: "two", sentence: "I eat two apples.", emoji: "2️⃣" },
  { word: "three", sentence: "Those three are my friends.", emoji: "3️⃣" },
  { word: "four", sentence: "Mariana has four pets.", emoji: "4️⃣" },
  { word: "five", sentence: "She has five pencils.", emoji: "5️⃣" },
  { word: "six", sentence: "Six kids are playing.", emoji: "6️⃣" },
  { word: "seven", sentence: "There are seven books.", emoji: "7️⃣" },
  { word: "eight", sentence: "Eight cats sleep.", emoji: "8️⃣" },
  { word: "nine", sentence: "Nine flowers are pink.", emoji: "9️⃣" },
  { word: "ten", sentence: "Ten stars shine.", emoji: "🔟" },
  { word: "short", sentence: "The boy is short.", emoji: "📏" },
  { word: "tall", sentence: "The girl is tall.", emoji: "📐" },
  { word: "book", sentence: "I love to read.", emoji: "📚" },
  { word: "nervous", sentence: "He is nervous today.", emoji: "😬" },
  { word: "music", sentence: "Mr Luis is my music teacher.", emoji: "🎵" },
  { word: "art", sentence: "My art teacher is Ms Michelle.", emoji: "🎨" },
  { word: "sport", sentence: "Soccer is a sport.", emoji: "⚽" },
  { word: "name", sentence: "My name is Ana.", emoji: "🪪" },
  { word: "family", sentence: "I love my family.", emoji: "👨‍👩‍👧‍👦" },
  { word: "is", sentence: "The cat is small.", emoji: "🐈" },
  { word: "are", sentence: "The dogs are big.", emoji: "🐶" },
  { word: "that", sentence: "That is my bag.", emoji: "👜" },
  { word: "you", sentence: "You are nice.", emoji: "🫵" },
  { word: "he", sentence: "He is my friend.", emoji: "👦" },
  { word: "she", sentence: "She is my sister.", emoji: "👧" },
  { word: "it", sentence: "It is a ball.", emoji: "⚽" },
  { word: "help", sentence: "Can you help me?", emoji: "🆘" },
  { word: "table", sentence: "The table is big.", emoji: "🛋️" },
  { word: "chair", sentence: "Sit on the chair.", emoji: "🪑" },
  { word: "pencil", sentence: "I need a pencil.", emoji: "✏️" },
  { word: "eraser", sentence: "The eraser is pink.", emoji: "🧽" },
  { word: "crayons", sentence: "I have crayons.", emoji: "🖍️" },
  { word: "ruler", sentence: "The ruler is long.", emoji: "📏" },
  { word: "colors", sentence: "I like colors.", emoji: "🎨" },
  { word: "green", sentence: "The grass is green.", emoji: "🟩" },
  { word: "red", sentence: "The apple is red.", emoji: "🟥" },
  { word: "blue", sentence: "The sky is blue.", emoji: "🟦" },
  { word: "yellow", sentence: "The sun is yellow.", emoji: "🟨" },
  { word: "orange", sentence: "The orange is sweet.", emoji: "🟧" },
  { word: "purple", sentence: "The flower is purple.", emoji: "🟪" },
  { word: "ball", sentence: "Kick the ball to me.", emoji: "⚽" },
  { word: "bike", sentence: "I ride my bike.", emoji: "🚲" },
  { word: "doll", sentence: "The doll is cute.", emoji: "🪆" },
  { word: "puzzle", sentence: "We make a puzzle.", emoji: "🧩" },
  { word: "scooter", sentence: "I have a new scooter.", emoji: "🛴" },
  { word: "truck", sentence: "The truck is big.", emoji: "🚚" },
  { word: "videos", sentence: "We watch videos.", emoji: "🎬" },
  { word: "games", sentence: "I play games.", emoji: "🎮" },
  { word: "teddy", sentence: "My teddy is soft.", emoji: "🧸" },
  { word: "bear", sentence: "The bear is brown.", emoji: "🐻" },
  { word: "big", sentence: "The box is big.", emoji: "📦" },
  { word: "small", sentence: "The toy is small.", emoji: "🧸" },
  { word: "soft", sentence: "The pillow is soft.", emoji: "🛏️" },
  { word: "new", sentence: "This is a new book.", emoji: "🆕" },
  { word: "cute", sentence: "The dog is cute.", emoji: "🐶" },
  { word: "useful", sentence: "A map is useful.", emoji: "🗺️" },
  { word: "colorful", sentence: "The kite is colorful.", emoji: "🪁" },
  { word: "old", sentence: "That house is old.", emoji: "🏚️" },
  { word: "fun", sentence: "The party is fun.", emoji: "🥳" },
  { word: "nice", sentence: "She is nice.", emoji: "🙂" },
  { word: "house", sentence: "This is my house.", emoji: "🏠" },
  { word: "store", sentence: "We go to the store.", emoji: "🏬" },
  { word: "street", sentence: "The street is long.", emoji: "🛣️" },
  { word: "play", sentence: "Let's play a game.", emoji: "🎲" },
  { word: "sleep", sentence: "The baby will sleep.", emoji: "😴" },
  { word: "sit", sentence: "Please sit here.", emoji: "🪑" },
  { word: "eat", sentence: "We eat pizza.", emoji: "🍕" },
  { word: "read", sentence: "I can read.", emoji: "📖" },
  { word: "look", sentence: "Look at the dog.", emoji: "👀" },
  { word: "right", sentence: "Turn right please.", emoji: "➡️" },
  { word: "left", sentence: "Go left.", emoji: "⬅️" },
  { word: "next", sentence: "I sit next to you.", emoji: "👉" },
  { word: "across", sentence: "The park is across the street.", emoji: "🏞️" },
  { word: "near", sentence: "The store is near.", emoji: "📍" },
  { word: "far", sentence: "The school is far.", emoji: "🗺️" },
  { word: "bed", sentence: "The bed is soft.", emoji: "🛏️" },
  { word: "door", sentence: "Close the door.", emoji: "🚪" },
  { word: "sofa", sentence: "Sit on the sofa.", emoji: "🛋️" },
  { word: "mother", sentence: "My mother is kind.", emoji: "👩" },
  { word: "father", sentence: "My father cooks.", emoji: "👨" },
  { word: "sister", sentence: "I have one sister.", emoji: "👧" },
  { word: "brother", sentence: "My brother runs fast.", emoji: "👦" },
  { word: "baby", sentence: "The baby will sleep.", emoji: "👶" },
  { word: "uncle", sentence: "My uncle is tall.", emoji: "🧔" },
  { word: "cousin", sentence: "My cousin is funny.", emoji: "🧑" },
  { word: "ears", sentence: "I have two ears.", emoji: "👂" },
  { word: "eyes", sentence: "My eyes are brown.", emoji: "👀" },
  { word: "mouth", sentence: "Open your mouth.", emoji: "👄" },
  { word: "hair", sentence: "Her hair is long.", emoji: "💇‍♀️" },
  { word: "nose", sentence: "My nose is small.", emoji: "👃" },
  { word: "player", sentence: "He is a soccer player.", emoji: "⚽" },
];

const spell = (w) => w.toUpperCase().split("").join(" – ");
const fileStem = (w) => w.toLowerCase().replace(/[^a-z0-9_-]/g, "");

function Flashcard({ word, sentence, emoji }) {
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef(null);

  const play = async (e) => {
    e.stopPropagation(); // evita que se voltee al presionar el botón
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (err) {
      console.warn("Audio play error:", err);
      alert("No se pudo reproducir el audio. Verifica que exista el archivo en /audio y que tu navegador permita sonido.");
    }
  };

  return (
    <div
      className={`card ${flipped ? "is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      aria-label={`Flashcard for ${word}`}
    >
      <div className="card-face card-front">
        <div className="emoji" aria-hidden>{emoji}</div>
        <div className="word">{word}</div>
        <div className="hint">Toca para ver frase y deletreo</div>
      </div>
      <div className="card-face card-back">
        <div className="sentence">{sentence}</div>
        <div className="spelling">{spell(word)}</div>
        <button className="play-btn" onClick={play} aria-label={`Reproducir audio de ${word}`}>
          🔊 Escuchar
        </button>
        {/* Reproductor oculto con múltiples fuentes */}
        <audio ref={audioRef} preload="none">
          <source src={`audio/${fileStem(word)}.mp3`} type="audio/mpeg" />
          <source src={`audio/${fileStem(word)}.m4a`} type="audio/mp4" />
          <source src={`audio/${fileStem(word)}.wav`} type="audio/wav" />
        </audio>
        <div className="hint">Toca fuera del botón para regresar</div>
      </div>
    </div>
  );
}

function PrintCard({ word, sentence, emoji }) {
  return (
    <div className="print-card">
      <div className="print-inner">
        <div className="emoji large" aria-hidden>{emoji}</div>
        <div className="word large">{word}</div>
        <div className="sentence mid">{sentence}</div>
        <div className="spelling large">{spell(word)}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [cards] = useState(SEED);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Inyecta estilos una sola vez
    const style = document.createElement("style");
    style.innerHTML = `
      :root { color-scheme: light dark; }
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      .app { min-height: 100vh; background: linear-gradient(to bottom, #f8fafc, #ffffff); color: #0f172a; }
      .container { max-width: 920px; margin: 0 auto; padding: 24px; }
      .bar { display:flex; gap:8px; align-items:center; justify-content:space-between; margin-bottom: 16px; }
      .title { font-size: 20px; font-weight: 700; }
      .btns { display:flex; gap:8px; }
      button { appearance:none; border:1px solid #cbd5e1; background:#fff; padding:8px 12px; border-radius:10px; cursor:pointer; font-weight:600; }
      button:hover { background:#f8fafc; }
      .index { opacity:.65; font-size:12px; text-align:center; margin-top: 8px; }

      /* Flashcard 3D */
      .viewer { display:flex; justify-content:center; }
      .card { width: 360px; height: 460px; position:relative; perspective:1000px; }
      .card-face { position:absolute; inset:0; border-radius:16px; border:1px solid #e2e8f0; box-shadow: 0 8px 30px rgba(2,6,23,.1); display:grid; place-items:center; padding:24px; backface-visibility:hidden; background:#fff; text-align:center; }
      .card-front .emoji { font-size:64px; }
      .card-front .word { font-size:28px; font-weight:800; letter-spacing:.02em; }
      .hint { font-size:12px; opacity:.6; }
      .card-back { transform: rotateY(180deg); gap:12px; padding-top: 28px; }
      .sentence { font-size:18px; opacity:.85; }
      .spelling { font-size:20px; font-weight:800; letter-spacing:.25em; }
      .play-btn { margin-top: 6px; font-size:14px; display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:9999px; border:1px solid #cbd5e1; background:#f8fafc; }
      .play-btn:hover { background:#eef2f7; }
      .card.is-flipped .card-front { transform: rotateY(180deg); }
      .card.is-flipped .card-back { transform: rotateY(360deg); }

      /* Print layout */
      @media print {
        @page { size: letter portrait; margin: 0.5in; }
        .screen { display:none !important; }
        .print-stack { display:block !important; }
        .print-card { page-break-after: always; break-after: page; display:flex; min-height:100vh; align-items:center; justify-content:center; padding: 32px; }
        .print-inner { border:1px solid #e2e8f0; border-radius:16px; box-shadow: 0 4px 20px rgba(2,6,23,.08); padding: 40px; max-width: 720px; width: 100%; text-align:center; }
        .emoji.large { font-size: 120px; }
        .word.large { font-size: 56px; font-weight: 900; letter-spacing:.02em; margin-top: 8px; }
        .sentence.mid { font-size: 24px; opacity:.9; margin-top: 8px; }
        .spelling.large { font-size: 32px; font-weight: 900; letter-spacing: .35em; margin-top: 8px; }
      }
    `;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch { /* noop */ } };
  }, []);

  const current = cards[idx];

  return (
    <div className="app">
      {/* Pantalla */}
      <div className="screen">
        <div className="container">
          <div className="bar">
            <div className="title">Flashcards – 1st Grade Spelling</div>
            <div className="btns">
              <button onClick={() => setIdx((i) => (i - 1 + cards.length) % cards.length)}>⟵ Anterior</button>
              <button onClick={() => setIdx((i) => (i + 1) % cards.length)}>Siguiente ⟶</button>
              <button onClick={() => window.print()}>🖨️ Imprimir</button>
            </div>
          </div>
          <div className="viewer">
            <Flashcard {...current} />
          </div>
          <div className="index">{idx + 1} / {cards.length}</div>
        </div>
      </div>

      {/* Impresión: UNA por página */}
      <div className="print-stack" style={{ display: "none" }}>
        {cards.map((c, i) => (
          <PrintCard key={`p-${i}-${c.word}`} {...c} />
        ))}
      </div>
    </div>
  );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
}
