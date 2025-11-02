// React UMD build - flashcards in a single visible card.
(function(){
  const { useState, useEffect, useRef } = React;

  const CARDS = [
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
    { word: "player", sentence: "He is a soccer player.", emoji: "⚽" }
  ];

  const spell = (word) => word.toUpperCase().split("").join(" · ");
  const slug = (word) => (word || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  function chooseExtension(){
    const audio = document.createElement("audio");
    if (audio.canPlayType("audio/mpeg")) return "mp3";
    if (audio.canPlayType("audio/mp4")) return "m4a";
    return "wav";
  }

  const EXT = chooseExtension();

  function Flashcard({ word, sentence, emoji }){
    const audioRef = useRef(null);
    const [src, setSrc] = useState("");

    useEffect(() => {
      if (!word) return;
      const nextSrc = `audio/${slug(word)}.${EXT}`;
      setSrc(nextSrc);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = nextSrc;
        audioRef.current.load();
      }
    }, [word]);

    const play = async () => {
      if (!audioRef.current) return;
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (err) {
        alert("No se pudo reproducir el audio. Revisa los permisos del navegador.");
      }
    };

    const onError = () => {
      alert(`No se encontró el archivo de audio para "${word}".\nAsegúrate de colocar ${slug(word)}.${EXT} en la carpeta /audio.`);
    };

    return React.createElement(
      "div",
      { className: "card", role: "group", "aria-label": `Flashcard ${word}` },
      React.createElement("div", { className: "emoji", "aria-hidden": true }, emoji),
      React.createElement("div", { className: "word" }, word),
      React.createElement("div", { className: "sentence" }, sentence),
      React.createElement("div", { className: "spelling" }, spell(word)),
      React.createElement(
        "button",
        { type: "button", className: "audio-btn", onClick: play, "aria-label": `Reproducir audio de ${word}` },
        "🔊 Escuchar"
      ),
      React.createElement("div", { className: "audio-path" }, `Archivo: ${src || "(sin audio)"}`),
      React.createElement("audio", { ref: audioRef, preload: "auto", onError: onError })
    );
  }

  function App(){
    const [index, setIndex] = useState(0);
    const total = CARDS.length;
    const current = CARDS[index] || CARDS[0];

    useEffect(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        :root { color-scheme: light dark; }
        body { margin: 0; font-family: "Inter", "Segoe UI", system-ui, sans-serif; background: #f8fafc; color: #0f172a; }
        .app { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 32px; }
        .card { width: min(420px, 90vw); background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12); padding: 32px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
        .emoji { font-size: 96px; }
        .word { font-size: 36px; font-weight: 800; letter-spacing: 0.02em; }
        .sentence { font-size: 20px; opacity: 0.85; }
        .spelling { font-size: 22px; font-weight: 700; letter-spacing: 0.35em; }
        .audio-btn { appearance: none; border: 1px solid #cbd5f5; background: #edf2ff; color: #1d4ed8; padding: 10px 18px; border-radius: 9999px; font-weight: 600; cursor: pointer; }
        .audio-btn:hover { background: #dbeafe; }
        .audio-path { font-size: 12px; opacity: 0.75; }
        .nav { display: flex; gap: 12px; }
        .nav button { appearance: none; border: 1px solid #cbd5f5; background: #ffffff; padding: 8px 14px; border-radius: 12px; font-weight: 600; cursor: pointer; }
        .nav button:hover { background: #f1f5f9; }
        .index { margin-top: 12px; font-size: 14px; opacity: 0.7; }
      `;
      document.head.appendChild(style);
      return () => { document.head.removeChild(style); };
    }, []);

    return React.createElement(
      "div",
      { className: "app" },
      React.createElement(
        "div",
        { className: "nav" },
        React.createElement(
          "button",
          { type: "button", onClick: () => setIndex((prev) => (prev - 1 + total) % total) },
          "⟵ Anterior"
        ),
        React.createElement(
          "button",
          { type: "button", onClick: () => setIndex((prev) => (prev + 1) % total) },
          "Siguiente ⟶"
        )
      ),
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Flashcard, current),
        React.createElement("div", { className: "index" }, `${index + 1} / ${total}`)
      )
    );
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
