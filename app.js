// UMD-friendly version (no imports). Works on GitHub Pages with React/ReactDOM UMD scripts.
// FIX v3: Siempre muestra la ruta del audio bajo el botón. Manejo robusto de src y caché.
(function(){
  const { useState, useEffect, useRef } = React;

  // === DATA (puedes ampliar la lista) ===
  const SEED = [
    {
      word: "happy",
      sentence: "My mom is always happy.",
      emoji: "😊",
      gif: "https://media.giphy.com/media/yoJC2GnSClbPOkV0eA/giphy.gif",
    },
    {
      word: "sad",
      sentence: "She feels sad today.",
      emoji: "😢",
      gif: "https://media.giphy.com/media/l0MYu5w9TRoQE5YjK/giphy.gif",
    },
    {
      word: "boy",
      sentence: "That boy is my friend.",
      emoji: "🧒",
      gif: "https://media.giphy.com/media/10LKovKon8DENq/giphy.gif",
    },
    {
      word: "girl",
      sentence: "That girl is my cousin.",
      emoji: "👧",
      gif: "https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif",
    },
    {
      word: "player",
      sentence: "He is a soccer player.",
      emoji: "⚽",
      gif: "https://media.giphy.com/media/l0MYEwCiAkK3UjqQM/giphy.gif",
    },
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
    const { word, sentence, emoji, gif } = props;
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
        gif
          ? React.createElement('img', { className:'gif', src: gif, alt: `Animación relacionada con ${word}` })
          : React.createElement('div', { className:'emoji', 'aria-hidden':true }, emoji)
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
        .gif { width: 100%; max-width: 260px; border-radius: 12px; object-fit: cover; box-shadow: 0 6px 20px rgba(15,23,42,.15); }
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