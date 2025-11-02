// UMD-friendly version (no imports). Works on GitHub Pages with React/ReactDOM UMD scripts.
// FIX v3: Siempre muestra la ruta del audio bajo el botón. Manejo robusto de src y caché.
(function(){
  const { useState, useEffect, useRef } = React;

  // === DATA (puedes ampliar la lista) ===
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
    { word: "aunt", sentence: "My aunt is funny.", emoji: "👩" },
    { word: "cousin", sentence: "My cousin is funny.", emoji: "🧑" },
    { word: "ears", sentence: "I have two ears.", emoji: "👂" },
    { word: "eyes", sentence: "My eyes are brown.", emoji: "👀" },
    { word: "mouth", sentence: "Open your mouth.", emoji: "👄" },
    { word: "hair", sentence: "Her hair is long.", emoji: "💇‍♀️" },
    { word: "nose", sentence: "My nose is small.", emoji: "👃" },
    { word: "player", sentence: "He is a soccer player.", emoji: "⚽" },
  ];

  const spell = (w) => w.toUpperCase().split("").join(" – ");
  const stem = (w) => (w || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");

  // Elegir extensión priorizando MP3
  function pickExtension(){
    const a = document.createElement('audio');
    if (a.canPlayType('audio/mpeg')) return "mp3";
    if (a.canPlayType('audio/mp4')) return "m4a";
    return "wav";
  }
  const EXT = pickExtension();

  function Flashcard(props){
    const { word, sentence, emoji } = props;
    const audioRef = useRef(null);
    const [src, setSrc] = useState("");

    // Construye URL con cache-busting (evita que repita el primer audio por caché)
    function urlFor(w){
      const s = stem(w);
      const ver = Date.now(); // único por render
      return `audio/${s}.${EXT}?v=${ver}`;
    }

    // Cuando cambia la palabra, actualiza el src real del <audio>
    useEffect(() => {
      const u = urlFor(word);
      setSrc(u);
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.src = u;
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      console.log("[Audio] set src:", u);
    }, [word]);

    function onErrorAudio(e){
      const el = e.currentTarget;
      const failing = el.currentSrc || src;
      console.error("[Audio] error para", word, "URL:", failing);
      alert(
        'No se pudo cargar el audio de "' + word + '".\n\n' +
        'Revisa que exista el archivo:\n' +
        failing.replace(/\?v=\d+$/, "") + '\n\n' +
        'Recuerda: nombre en minúsculas y dentro de /audio.\n' +
        'Ejemplo: audio/' + stem(word) + '.' + EXT
      );
    }

    const play = async (e) => {
      e.stopPropagation();
      try {
        if (!audioRef.current) return;
        // Reinicia para repetir desde el inicio
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (err) {
        console.warn("[Audio] play error:", err);
        alert("No se pudo reproducir el audio. Verifica permisos de sonido del navegador.");
      }
    };

    // Texto visible (sin toggle) con la ruta (sin el dominio)
    const visiblePath = (src || "").replace(location.origin, "");

    return React.createElement(
      'div',
      { className: 'card single', role:'group', 'aria-label':`Flashcard for ${word}` },
      React.createElement('div', { className:'media-area' },
        React.createElement('div', { className:'emoji', 'aria-hidden':true }, emoji)
      ),
      React.createElement('div', { className:'word' }, word),
      React.createElement('div', { className:'sentence' }, sentence),
      React.createElement('div', { className:'spelling' }, spell(word)),
      React.createElement('button', { className:'play-btn', onClick: play, 'aria-label':`Reproducir audio de ${word}` }, '🔊 Escuchar'),
      React.createElement('div', { className:'audiorow' },
        React.createElement('span', { className:'audiorow-label' }, 'Audio actual: '),
        React.createElement('code', null, visiblePath.replace(/\?v=\d+$/, ""))
      ),
      React.createElement('audio', { ref: audioRef, preload:'auto', onError: onErrorAudio })
    );
  }

  function PrintCard(props){
    const { word, sentence, emoji } = props;
    return React.createElement('div', { className:'print-card' },
      React.createElement('div', { className:'print-inner' },
        React.createElement('div', { className:'emoji large', 'aria-hidden':true }, emoji),
        React.createElement('div', { className:'word large' }, word),
        React.createElement('div', { className:'sentence mid' }, sentence),
        React.createElement('div', { className:'spelling large' }, spell(word))
      )
    );
  }

  function App(){
    const [cards] = useState(SEED);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
      const style = document.createElement('style');
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

        .viewer { display:flex; justify-content:center; padding: 12px 0; }
        .card.single { width: min(90vw, 420px); border-radius:16px; border:1px solid #e2e8f0; box-shadow: 0 8px 30px rgba(2,6,23,.1); background:#fff; padding:28px 24px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px; }
        .media-area { width: 100%; display:flex; justify-content:center; }
        .emoji { font-size: 80px; }
        .word { font-size:32px; font-weight:800; letter-spacing:.02em; }
        .sentence { font-size:18px; opacity:.85; }
        .spelling { font-size:20px; font-weight:800; letter-spacing:.25em; }
        .play-btn { font-size:14px; display:inline-flex; align-items:center; gap:8px; padding:10px 16px; border-radius:9999px; border:1px solid #cbd5e1; background:#f8fafc; }
        .play-btn:hover { background:#eef2f7; }
        .audiorow { font-size: 12px; opacity: .8; }
        .audiorow code { font-size: 12px; }

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
      return () => { try { document.head.removeChild(style); } catch(e){} };
    }, []);

    const current = cards[idx] || cards[0];

    return React.createElement('div', { className:'app' },
      React.createElement('div', { className:'screen' },
        React.createElement('div', { className:'container' },
          React.createElement('div', { className:'bar' },
            React.createElement('div', { className:'title' }, 'Flashcards – 1st Grade Spelling'),
            React.createElement('div', { className:'btns' },
              React.createElement('button', { onClick: () => setIdx(i => (i - 1 + cards.length) % cards.length) }, '⟵ Anterior'),
              React.createElement('button', { onClick: () => setIdx(i => (i + 1) % cards.length) }, 'Siguiente ⟶'),
              React.createElement('button', { onClick: () => window.print() }, '🖨️ Imprimir')
            )
          ),
          React.createElement('div', { className:'viewer' }, React.createElement(Flashcard, current)),
          React.createElement('div', { className:'index' }, `${idx + 1} / ${cards.length}`)
        )
      ),
      React.createElement('div', { className:'print-stack', style: { display:'none' } },
        (current ? [current] : []).map((c, i) => React.createElement(PrintCard, { ...c, key: `p-${i}-${c.word}` }))
      )
    );
  }

  // Mount
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
})();