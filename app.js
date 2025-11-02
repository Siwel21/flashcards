// UMD-friendly version (no imports). Works on GitHub Pages with React/ReactDOM UMD scripts.
// FIX v2: robust audio switching + cache-busting + clear error logging per word.
(function(){
  const { useState, useEffect, useRef } = React;

  // === DATA (short subset for demo; extend as needed) ===
  const SEED = [
    { word: "happy", sentence: "My mom is always happy.", emoji: "😊" },
    { word: "sad", sentence: "She feels sad today.", emoji: "😢" },
    { word: "boy", sentence: "That boy is my friend.", emoji: "🧒" },
    { word: "girl", sentence: "That girl is my cousin.", emoji: "👧" },
    { word: "player", sentence: "He is a soccer player.", emoji: "⚽" },
  ];

  const spell = (w) => w.toUpperCase().split("").join(" – ");
  const stem = (w) => (w || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");

  // Prefer mp3; fallbacks if not supported
  function pickExtension(){
    const a = document.createElement('audio');
    if (a.canPlayType('audio/mpeg')) return "mp3";
    if (a.canPlayType('audio/mp4')) return "m4a";
    return "wav";
  }
  const EXT = pickExtension();

  function Flashcard(props){
    const { word, sentence, emoji, debug } = props;
    const [flipped, setFlipped] = useState(false);
    const audioRef = useRef(null);
    const [src, setSrc] = useState("");

    // Build URL with cache-busting (prevents stale cache serving old file)
    function urlFor(w){
      const s = stem(w);
      const ver = Date.now(); // unique per render; enough to force fresh request
      return `audio/${s}.${EXT}?v=${ver}`;
    }

    // Update audio on word change
    useEffect(() => {
      const u = urlFor(word);
      setSrc(u);
      if (!audioRef.current) return;
      // Assign src directly
      audioRef.current.src = u;
      audioRef.current.load();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Debug
      console.log("[Flashcard] Set audio src:", u);
    }, [word]);

    function onErrorAudio(e){
      const el = e.currentTarget;
      // Show exact failing URL
      const failing = el.currentSrc || src;
      console.error("[Flashcard] Audio error for:", word, "URL:", failing);
      alert("No se pudo cargar el audio de \"" + word + "\".\n\nRevisa que exista el archivo:\n" +
            failing.replace(/\?v=\d+$/, "") + "\n\n" +
            "Recuerda: nombre en minúsculas y en la carpeta /audio del repo.\n" +
            "Ejemplo: audio/" + stem(word) + "." + EXT);
    }

    const play = async (e) => {
      e.stopPropagation();
      try {
        if (!audioRef.current) return;
        // Siempre reinicia al inicio para repetición clara
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (err) {
        console.warn("Audio play error:", err);
        alert("No se pudo reproducir el audio. Verifica permisos de sonido del navegador.");
      }
    };

    return React.createElement(
      'div',
      { className: `card ${flipped ? 'is-flipped' : ''}`, onClick: () => setFlipped(f => !f), role:'button', 'aria-label':`Flashcard for ${word}` },
      React.createElement('div', { className:'card-face card-front' },
        React.createElement('div', { className:'emoji', 'aria-hidden':true }, emoji),
        React.createElement('div', { className:'word' }, word),
        React.createElement('div', { className:'hint' }, 'Toca para ver frase y deletreo')
      ),
      React.createElement('div', { className:'card-face card-back' },
        React.createElement('div', { className:'sentence' }, sentence),
        React.createElement('div', { className:'spelling' }, spell(word)),
        React.createElement('button', { className:'play-btn', onClick: play, 'aria-label':`Reproducir audio de ${word}` }, '🔊 Escuchar'),
        React.createElement('audio', { ref: audioRef, preload:'auto', onError: onErrorAudio }),
        debug ? React.createElement('div', { className: 'debug' }, "Audio: ", (src || "").replace(location.origin, "")) : null,
        React.createElement('div', { className:'hint' }, 'Toca fuera del botón para regresar')
      )
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
    const [debug, setDebug] = useState(false);

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
        .toggle { font-size:12px; display:flex; align-items:center; gap:6px; }
        .index { opacity:.65; font-size:12px; text-align:center; margin-top: 8px; }

        .viewer { display:flex; justify-content:center; }
        .card { width: 360px; height: 480px; position:relative; perspective:1000px; }
        .card-face { position:absolute; inset:0; border-radius:16px; border:1px solid #e2e8f0; box-shadow: 0 8px 30px rgba(2,6,23,.1); display:grid; place-items:center; padding:24px; backface-visibility:hidden; background:#fff; text-align:center; }
        .card-front .emoji { font-size:64px; }
        .card-front .word { font-size:28px; font-weight:800; letter-spacing:.02em; }
        .hint { font-size:12px; opacity:.6; }
        .card-back { transform: rotateY(180deg); gap:12px; padding-top: 20px; }
        .sentence { font-size:18px; opacity:.85; }
        .spelling { font-size:20px; font-weight:800; letter-spacing:.25em; }
        .play-btn { margin-top: 6px; font-size:14px; display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:9999px; border:1px solid #cbd5e1; background:#f8fafc; }
        .play-btn:hover { background:#eef2f7; }
        .debug { font-size: 11px; opacity: .7; margin-top: 6px; }
        .card.is-flipped .card-front { transform: rotateY(180deg); }
        .card.is-flipped .card-back { transform: rotateY(360deg); }

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
          React.createElement('div', { className:'toggle' },
            React.createElement('input', { type:'checkbox', id:'dbg', checked:debug, onChange:(e)=>setDebug(e.target.checked) }),
            React.createElement('label', { htmlFor:'dbg' }, 'Mostrar ruta del audio (debug)')
          ),
          React.createElement('div', { className:'viewer' }, React.createElement(Flashcard, { ...current, debug })),
          React.createElement('div', { className:'index' }, `${idx + 1} / ${cards.length}`)
        )
      ),
      React.createElement('div', { className:'print-stack', style: { display:'none' } },
        cards.map((c, i) => React.createElement(PrintCard, { ...c, key: `p-${i}-${c.word}` }))
      )
    );
  }

  // Mount
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
})();