"use strict";

/* ==========================================================
   TYPING MASTER – GALAXY EDITION by Alejandra I. Torrez Huanca
   ========================================================== */

const $ = id => document.getElementById(id);
const rand = n => Math.floor(Math.random() * n);
const pick = arr => arr[rand(arr.length)];
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const make = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
};
const keyLabel = c => (c === " " ? "ESPACIO" : c.toUpperCase());
const fmtNum = n => Number(n).toLocaleString("es");
const fmtTime = ms => {
  const s = Math.round(ms / 1000);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

function wrapPhrase(text, maxLen = 30) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (!cur.length) { cur = w; continue; }
    if ((cur + " " + w).length <= maxLen) cur += " " + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

const App = { active: false };

/* ==========================================================
   DATOS CORREGIDOS (Sin acentos ni caracteres especiales)
   ========================================================== */
const WORDS = {
  facil: [
    // Originales (limpias)
    "sol","luna","mar","tierra","cielo","estrella","nube","luz","fuego","viento","rayo","polvo","orbita","cometa","marte","venus","brillo","noche","dia","vuelo","nave","astro","gas","hielo","eco","atomo","polo","tiempo","rumbo","salto","norte","calor","frio","cohete","radio","luces","aire","anillo","mundo","signo",
    // 50 palabras nuevas (limpias, sin acentos)
    "marea","roca","crater","meteoro","espacio","galaxia","planeta","satelite","fase","eclipse","sombra","destello","fulgor","onda","metal","alba","ocaso","viaje","eje","giro","fuerza","masa","peso","vacio","eter","cometa","orbita","nebulosa","estelar","cosmos","luz","rayo","onda","polvo","gas","hielo","roca","metal","fuego","cielo","noche","dia","alba","ocaso","rumbo","viaje","nave","vuelo","salto","polo","eje","giro","fuerza","masa","peso","vacio"
  ],
  medio: [
    // Originales (limpias)
    "galaxia","planeta","universo","telescopio","asteroide","gravedad","meteorito","satelite","eclipse","nebulosa","astronauta","constelacion","atmosfera","supernova","radiacion","mercurio","jupiter","saturno","neptuno","plutonio","propulsion","laboratorio","exploracion","astronomia","trayectoria","velocidad","cinturon","estacion","expedicion","aterrizaje","combustible","magnetismo","hidrogeno","helio","luminosidad","orbital","espacial","cosmonauta","observatorio","aceleracion",
    // 50 palabras nuevas (limpias, sin acentos)
    "agujero","negro","supermasivo","horizonte","sucesos","singularidad","cuasar","pulsar","magnetar","neutrones","gravitacional","relatividad","espaciotiempo","expansion","materia","oscura","energia","foton","particula","antimateria","chorro","disco","acrecion","colision","fusion","estallido","llamarada","corona","fotosfera","cromosfera","mancha","fulguracion","plasma","ionosfera","magnetosfera","aurora","boreal","meteoroide","kuiper","oort","exoplaneta","habitable","biosfera","galaxia","planeta","universo","telescopio","asteroide","gravedad","meteorito"
  ],
  avanzado: [
    // Oraciones nuevas (limpias, sin acentos ni comillas)
    "estudiar el universo revela la historia mas antigua",
    "las estrellas guardan secretos del origen de la vida",
    "conocer la naturaleza nos ubica en el cosmos",
    "la curiosidad cientifica genera grandes descubrimientos",
    "el cielo nocturno muestra el pasado universal",
    "explorar el espacio ensena a cuidar la tierra",
    "la ciencia invita a observar y preguntar",
    "comprender la naturaleza es comprender la vida",
    "cada hallazgo amplia el conocimiento humano",
    "el universo es inmenso pero comprensible",
    "las supernovas pueden brillar mas que galaxias",
    "los brotes gamma son explosiones muy poderosas",
    "un brote gamma libera energia colosal en segundos",
    "las estrellas de neutrones giran rapidisimo",
    "los pulsares emiten haces como faros cosmicos",
    "los magnetares tienen campos magneticos extremos",
    "las sacudidas estelares generan destellos gamma",
    "un destello puede alterar la atmosfera terrestre",
    "fusionar estrellas de neutrones crea objetos exoticos",
    "las ondas gravitacionales son vibraciones del espacio",
    "la gravedad puede amplificar luz lejana",
    "los planetas vagabundos no orbitan estrellas",
    "la microlente revela planetas invisibles",
    "la nebulosa del cangrejo es resto supernova",
    "magnetares jovenes pueden impulsar supernovas brillantes",
    "los agujeros negros emiten chorros energeticos",
    "galaxias activas albergan agujeros negros gigantes",
    "las llamaradas solares afectan comunicaciones terrestres",
    "las auroras nacen de particulas solares",
    "las estrellas de neutrones son extremadamente densas",
    "los agujeros negros tienen gravedad implacable",
    "ni la luz escapa del horizonte de sucesos",
    "los agujeros supermasivos contienen millones de soles",
    "sagitario a es el nucleo de la via lactea",
    "la materia caida forma discos brillantes",
    "los chorros relativistas alcanzan velocidad casi luminica",
    "fusionar agujeros negros genera ondas gravitacionales",
    "el tiempo se ralentiza cerca de agujeros negros",
    "estudiar el universo es leer historia antigua",
    "las estrellas guardan secretos de la vida",
    "conocer la naturaleza nos ubica en el cosmos",
    "la curiosidad convierte preguntas en descubrimientos",
    "el cielo nocturno muestra el pasado universal",
    "explorar el espacio ensena a cuidar la tierra",
    "la ciencia invita a observar y preguntar",
    "las leyes naturales sustentan la vida",
    "cada hallazgo amplia el conocimiento humano",
    "el universo es inmenso pero comprensible"
  ]
};

const EXTRA_WORDS = ["ala","alas","asa","asas","sal","sala","salsa","falda","lado","dado","alfa","fajas","jalas","jaja","nana","gala","galas","hada","algas","halla","hallas","salga","gafas","dagas"];
const WORD_BANK = [...new Set([...WORDS.facil, ...WORDS.medio, ...EXTRA_WORDS])];

const MODES = {
  facil:    { name: "FACIL",      label: "Facil",      time: 60, mult: 1 },
  medio:    { name: "INTERMEDIO", label: "Intermedio", time: 60, mult: 2 },
  avanzado: { name: "AVANZADO",   label: "Avanzado",   time: 90, mult: 3 }
};

const FINGERS = {
  lp: { name: "menique izquierdo", color: "#ff8787" },
  lr: { name: "anular izquierdo",  color: "#ffa94d" },
  lm: { name: "medio izquierdo",   color: "#ffe066" },
  li: { name: "indice izquierdo",  color: "#69db7c" },
  th: { name: "pulgar",            color: "#ced4da" },
  ri: { name: "indice derecho",    color: "#3bc9db" },
  rm: { name: "medio derecho",     color: "#4dabf7" },
  rr: { name: "anular derecho",    color: "#9775fa" },
  rp: { name: "menique derecho",   color: "#f783ac" }
};
const FINGER_KEYS = {
  lp: "1qaz", lr: "2wsx", lm: "3edc", li: "45rtfgvb",
  ri: "67yuhjnm", rm: "8ik,", rr: "9ol.", rp: "0pñ-", th: " "
};
const KEY_FINGER = {};
Object.entries(FINGER_KEYS).forEach(([f, keys]) => [...keys].forEach(k => (KEY_FINGER[k] = f)));

const KB_ROWS = [
  [..."1234567890"],
  [..."qwertyuiop"],
  [..."asdfghjklñ"],
  [..."zxcvbnm,.-"]
];

const LESSONS = [
  { name: "Luna",     icon: "🌙", title: "Fila base", newKeys: "asdfjklñ", desc: "Coloca los dedos sobre A S D F (mano izquierda) y J K L Ñ (mano derecha). Los indices descansan en F y J, que tienen una marquita. Los pulgares quedan sobre la barra espaciadora." },
  { name: "Mercurio", icon: "🟤", title: "Indices en accion", newKeys: "gh", desc: "La G la pulsa el indice izquierdo y la H el indice derecho. Despues de cada pulsacion, el dedo regresa a la fila base." },
  { name: "Venus",    icon: "🟡", title: "Fila superior (1)", newKeys: "eiru", desc: "Sube sin mover la mano: E con el medio izquierdo, R con el indice izquierdo, U con el indice derecho e I con el medio derecho." },
  { name: "Marte",    icon: "🔴", title: "Fila superior (2)", newKeys: "woty", desc: "W con el anular izquierdo, T con el indice izquierdo, Y con el indice derecho y O con el anular derecho." },
  { name: "Jupiter",  icon: "🟠", title: "Meniques arriba", newKeys: "qp", desc: "Q la pulsa el menique izquierdo y P el menique derecho. Estira el dedo sin levantar la palma de la mano." },
  { name: "Saturno",  icon: "🪐", title: "Fila inferior izquierda", newKeys: "zxcvb", desc: "Z con el menique, X con el anular, C con el medio, V y B con el indice izquierdo. Baja el dedo y vuelve a la fila base." },
  { name: "Urano",    icon: "🔵", title: "Fila inferior derecha", newKeys: "nm,.", desc: "N y M con el indice derecho, la coma con el medio derecho y el punto con el anular derecho." },
  { name: "Neptuno",  icon: "🌀", title: "Frases del cosmos", newKeys: "", phrases: true, desc: "Ultima etapa del viaje: frases completas con todas las letras. Usa cada dedo en su tecla y no mires el teclado." }
];
LESSONS.reduce((acc, L) => { acc += L.newKeys; L.keys = acc; return acc; }, "");

const TUTOR_LINES = 5;
const TUTOR_PASS = 85;

const Store = {
  prefix: "tm_galaxy_",
  get(key, fallback) {
    try {
      const v = localStorage.getItem(this.prefix + key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
};

const Records = {
  get: level => Store.get(level, null),
  set: (level, v) => Store.set(level, v),
  refresh() {
    let top = 0;
    Object.keys(MODES).forEach(l => {
      const b = this.get(l);
      $("rec-" + l).textContent = b ? "🏆 Record: " + fmtNum(b.score) : "Sin record aun";
      if (b && b.score > top) top = b.score;
    });
    $("rec-tutor").textContent = `🎓 ${Tutor.completed()}/${LESSONS.length} lecciones`;
    $("bestStart").textContent = top ? "🏆 Mejor puntuacion guardada: " + fmtNum(top) : "";
  }
};

const Sound = {
  muted: false,
  ctx: null,
  beep(freq, dur = .08, type = "sine", vol = .06) {
    if (this.muted) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol;
      o.connect(g); g.connect(this.ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(.0001, this.ctx.currentTime + dur);
      o.stop(this.ctx.currentTime + dur);
    } catch (e) { }
  },
  melody(freqs, gap = 120) {
    freqs.forEach((f, i) => setTimeout(() => this.beep(f, .18, "sine", .08), i * gap));
  },
  toggle() {
    this.muted = !this.muted;
    $("muteBtn").textContent = this.muted ? "🔇" : "🔊";
  }
};

const UI = {
  current: "s-start",
  show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
    this.current = id;
  }
};

const Board = {
  from: "s-start",
  highlight: "",
  all() {
    const u = Store.get("users", {});
    return u && typeof u === "object" ? u : {};
  },
  cleanName(n) { return String(n).trim().replace(/\s+/g, " ").slice(0, 16); },
  add(name, { score, mode, wpm, acc }) {
    const users = this.all();
    const key = name.toLowerCase();
    const u = users[key] || { name, total: 0, games: 0, best: 0, bestWpm: 0, bestAcc: 0 };
    u.name = name;
    u.total += score;
    u.games += 1;
    u.best = Math.max(u.best, score);
    u.bestWpm = Math.max(u.bestWpm, wpm);
    u.bestAcc = Math.max(u.bestAcc, acc);
    u.lastMode = mode;
    u.last = Date.now();
    users[key] = u;
    Store.set("users", users);
    return u;
  },
  sorted() {
    return Object.values(this.all())
      .sort((a, b) => b.total - a.total || b.best - a.best || a.name.localeCompare(b.name));
  },
  open() {
    this.from = UI.current;
    this.render();
    UI.show("s-board");
  },
  render() {
    const body = $("boardBody");
    body.innerHTML = "";
    const list = this.sorted();
    $("boardEmpty").hidden = list.length > 0;
    $("boardWrap").hidden = list.length === 0;
    list.forEach((u, i) => {
      const tr = make("tr", u.name.toLowerCase() === this.highlight ? "me" : "");
      tr.append(
        make("td", "", ["🥇", "🥈", "🥉"][i] || String(i + 1)),
        make("td", "name", u.name),
        make("td", "pts", fmtNum(u.total)),
        make("td", "", String(u.games)),
        make("td", "", fmtNum(u.best)),
        make("td", "", String(u.bestWpm))
      );
      body.append(tr);
    });
  },
  clear() {
    if (!confirm("Borrar todo el ranking? Esta accion no se puede deshacer.")) return;
    Store.set("users", {});
    this.highlight = "";
    this.render();
  }
};

const Results = {
  payload: null,
  saved: false,
  show(cfg) {
    $("endTitle").textContent = cfg.title;
    $("endRank").textContent = cfg.rank || "";
    $("rNew").hidden = !cfg.isRecord;
    $("endNote").textContent = cfg.note || "";

    const grid = $("endGrid");
    grid.innerHTML = "";
    cfg.stats.forEach(s => {
      const d = make("div", "res");
      d.append(make("b", "", s.v), make("span", "", s.l));
      grid.append(d);
    });

    const box = $("endActions");
    box.innerHTML = "";
    cfg.actions.forEach(a => {
      const b = make("button", a.sec ? "sec" : "", a.label);
      b.onclick = a.fn;
      box.append(b);
    });

    this.payload = cfg.payload;
    this.saved = false;
    $("nameInp").value = Store.get("lastName", "");
    $("nameInp").disabled = false;
    $("btnSave").disabled = false;
    $("saveMsg").textContent = "";
    UI.show("s-end");

    setTimeout(() => {
      if (UI.current === "s-end" && !this.saved) $("nameInp").focus();
    }, 900);
  },
  save() {
    if (this.saved || !this.payload) return;
    const name = Board.cleanName($("nameInp").value);
    if (!name) {
      $("saveMsg").textContent = "Escribe tu nombre para guardar tu puntaje.";
      $("nameInp").focus();
      return;
    }
    const u = Board.add(name, this.payload);
    Store.set("lastName", name);
    Board.highlight = name.toLowerCase();
    this.saved = true;
    $("nameInp").disabled = true;
    $("btnSave").disabled = true;
    $("saveMsg").textContent = `✅ Guardado! ${u.name} acumula ${fmtNum(u.total)} puntos en ${u.games} partida(s).`;
    Sound.melody([660, 880]);
    Records.refresh();
  }
};

const Classic = {
  level: "facil", target: "", queue: [], running: false,
  timerId: null, startTs: 0, timeLeft: 0, prevLen: 0, s: null,
  init() {
    $("inp").addEventListener("input", () => this.onInput());
    $("inp").addEventListener("keydown", e => this.onKey(e));
  },
  start(level) {
    this.level = level;
    const c = MODES[level];
    this.s = { score: 0, okChars: 0, typedTotal: 0, typedOk: 0, wordsOk: 0, skipped: 0, combo: 0, bestCombo: 0 };
    this.queue = [];
    this.timeLeft = c.time;
    $("vTime").textContent = c.time;
    $("vScore").textContent = 0;
    $("vWpm").textContent = 0;
    $("vAcc").textContent = "100%";
    $("stTime").classList.remove("low");
    $("bar").style.width = "100%";
    $("combo").textContent = "";
    UI.show("s-game");
    this.next();
    $("inp").focus();
    this.running = true;
    App.active = true;
    this.startTs = Date.now();
    clearInterval(this.timerId);
    this.timerId = setInterval(() => this.tick(), 250);
  },
  next() {
    if (!this.queue.length) this.queue = shuffle(WORDS[this.level].slice());
    this.target = this.queue.pop();
    this.prevLen = 0;
    $("inp").value = "";
    this.render("");
  },
  render(val) {
    const box = $("target");
    box.innerHTML = "";
    
    let splitIdx = -1;
    if (this.target.length > 20) {
      let mid = Math.floor(this.target.length / 2);
      for (let offset = 0; offset < 10; offset++) {
        if (this.target[mid - offset] === " ") { splitIdx = mid - offset; break; }
        if (this.target[mid + offset] === " ") { splitIdx = mid + offset; break; }
      }
    }

    const line1 = make("div", "line");
    const line2 = make("div", "line");

    [...this.target].forEach((ch, i) => {
      let cls = "pend";
      if (i < val.length) cls = val[i] === this.target[i] ? "ok" : "bad";
      else if (i === val.length) cls = "pend cur";
      
      const span = make("span", cls, ch);
      
      if (splitIdx !== -1 && i > splitIdx) {
        line2.append(span);
      } else {
        line1.append(span);
      }
    });

    box.append(line1);
    if (line2.hasChildNodes()) box.append(line2);
  },
  elapsedMin() { return Math.max((Date.now() - this.startTs) / 60000, 1 / 600); },
  wpm() { return Math.round((this.s.okChars / 5) / this.elapsedMin()); },
  acc() { return this.s.typedTotal ? Math.round(this.s.typedOk / this.s.typedTotal * 100) : 100; },
  tick() {
    const c = MODES[this.level];
    const left = Math.max(0, c.time - (Date.now() - this.startTs) / 1000);
    const sec = Math.ceil(left);
    if (sec !== this.timeLeft) {
      this.timeLeft = sec;
      $("vTime").textContent = sec;
      if (sec <= 10) {
        $("stTime").classList.add("low");
        if (sec > 0) Sound.beep(440, .05, "square", .03);
      }
    }
    $("bar").style.width = (left / c.time * 100) + "%";
    $("vWpm").textContent = this.wpm();
    if (left <= 0) this.end();
  },
  popup(txt, color) {
    const p = make("div", "pop", txt);
    if (color) p.style.color = color;
    p.style.left = (30 + Math.random() * 40) + "%";
    p.style.top = "30%";
    $("arena").append(p);
    setTimeout(() => p.remove(), 1000);
  },
  flash(cls) {
    const a = $("arena");
    a.classList.remove("hit", "miss");
    void a.offsetWidth;
    a.classList.add(cls);
  },
  onInput() {
    if (!this.running) return;
    const v = $("inp").value, s = this.s;
    if (v.length > this.prevLen) {
      for (let i = this.prevLen; i < v.length; i++) {
        s.typedTotal++;
        if (v[i] === this.target[i]) s.typedOk++;
      }
      const good = v[v.length - 1] === this.target[v.length - 1];
      Sound.beep(good ? 700 : 200, .04, "triangle", .04);
    }
    this.prevLen = v.length;
    this.render(v);
    $("vAcc").textContent = this.acc() + "%";
    if (v === this.target || v === this.target + " ") this.success();
  },
  success() {
    const s = this.s, m = MODES[this.level].mult;
    s.combo++;
    s.bestCombo = Math.max(s.bestCombo, s.combo);
    const pts = this.target.length * 10 * m + Math.min(s.combo, 10) * 5 * m;
    s.score += pts;
    s.wordsOk++;
    s.okChars += this.target.length + 1;
    $("vScore").textContent = s.score;
    $("combo").textContent = s.combo >= 3 ? "🔥 x" + s.combo : "";
    this.popup("+" + pts);
    this.flash("hit");
    Sound.beep(880, .12, "sine", .07);
    this.next();
  },
  onKey(e) {
    if (!this.running) return;
    if (e.key === "Enter") {
      e.preventDefault();
      this.s.skipped++;
      this.s.combo = 0;
      $("combo").textContent = "";
      this.popup("saltada", "#ff5d7a");
      this.flash("miss");
      Sound.beep(150, .15, "sawtooth", .05);
      this.next();
    } else if (e.key === "Escape") {
      this.end();
    }
  },
  rank(w, a) {
    const v = w * (a / 100);
    if (v >= 60) return "🌟 COMANDANTE GALACTICO";
    if (v >= 40) return "🚀 PILOTO ESTELAR";
    if (v >= 25) return "🛰️ ASTRONAUTA";
    if (v >= 12) return "🌙 CADETE ESPACIAL";
    return "☄️ ASPIRANTE";
  },
  end() {
    if (!this.running) return;
    this.running = false;
    App.active = false;
    clearInterval(this.timerId);
    const s = this.s, level = this.level, c = MODES[level];
    const min = Math.min((Date.now() - this.startTs) / 60000, c.time / 60);
    const wpm = Math.round((s.okChars / 5) / Math.max(min, 1 / 600));
    const acc = this.acc();
    const prev = Records.get(level);
    const isRecord = s.score > 0 && (!prev || s.score > prev.score);
    if (isRecord) Records.set(level, { score: s.score, wpm, acc, date: new Date().toLocaleDateString("es-BO") });
    const best = Records.get(level);
    Sound[isRecord ? "melody" : "beep"](...(isRecord ? [[523, 659, 784, 1047]] : [300, .3, "sine", .06]));
    Records.refresh();
    Results.show({
      title: "MISION COMPLETADA",
      rank: this.rank(wpm, acc),
      isRecord,
      stats: [
        { v: fmtNum(s.score), l: "PUNTUACION" }, { v: wpm, l: "PPM" }, { v: acc + "%", l: "PRECISION" },
        { v: s.wordsOk, l: "PALABRAS OK" }, { v: s.skipped, l: "SALTADAS" }, { v: s.bestCombo, l: "MEJOR RACHA" }
      ],
      note: best ? `Record ${c.name}: ${fmtNum(best.score)} pts · ${best.wpm} PPM · ${best.acc}% (${best.date})` : "",
      payload: { score: s.score, mode: c.label, wpm, acc },
      actions: [
        { label: "JUGAR DE NUEVO", fn: () => this.start(level) },
        { label: "CAMBIAR NIVEL", sec: true, fn: () => { Records.refresh(); UI.show("s-level"); } }
      ]
    });
  }
};

const Kb = {
  keys: {}, nextKey: null,
  build() {
    const kb = $("kb");
    kb.innerHTML = "";
    KB_ROWS.forEach((row, i) => {
      const r = make("div", "krow r" + i);
      row.forEach(ch => {
        const k = make("div", "key", ch.toUpperCase());
        k.style.setProperty("--c", FINGERS[KEY_FINGER[ch]].color);
        if (ch === "f" || ch === "j") k.classList.add("bump");
        this.keys[ch] = k;
        r.append(k);
      });
      kb.append(r);
    });
    const sr = make("div", "krow r4");
    const sp = make("div", "key space", "ESPACIO");
    sp.style.setProperty("--c", FINGERS.th.color);
    this.keys[" "] = sp;
    sr.append(sp);
    kb.append(sr);
  },
  buildHands() {
    const F = [["lp",70,56,"A"],["lr",120,80,"S"],["lm",170,92,"D"],["li",220,80,"F"],["ri",420,80,"J"],["rm",470,92,"K"],["rr",520,80,"L"],["rp",570,56,"Ñ"]];
    const col = f => `style="--c:${FINGERS[f].color}"`;
    let s = "";
    F.forEach(([f, x, h]) => {
      s += `<rect class="fg" data-f="${f}" x="${x - 20}" y="${140 - h}" width="40" height="${h + 30}" rx="20" ${col(f)}/>`;
    });
    s += `<rect class="fg" data-f="th" x="248" y="118" width="40" height="76" rx="20" transform="rotate(26 268 190)" ${col("th")}/>`;
    s += `<rect class="fg" data-f="th" x="352" y="118" width="40" height="76" rx="20" transform="rotate(-26 372 190)" ${col("th")}/>`;
    s += `<rect class="palm" x="44" y="124" width="224" height="78" rx="30"/>`;
    s += `<rect class="palm" x="372" y="124" width="224" height="78" rx="30"/>`;
    F.forEach(([f, x, h, l]) => {
      s += `<text class="fl" data-f="${f}" x="${x}" y="${140 - h + 26}">${l}</text>`;
    });
    s += `<text class="hl" x="156" y="220">MANO IZQUIERDA</text><text class="hl" x="484" y="220">MANO DERECHA</text>`;
    $("hands").innerHTML = s;
  },
  setActiveFinger(f) {
    document.querySelectorAll("#hands [data-f]").forEach(n => n.classList.toggle("active", !!f && n.dataset.f === f));
  },
  setNext(ch) {
    if (this.nextKey) this.nextKey.classList.remove("next");
    this.nextKey = ch ? this.keys[ch] || null : null;
    if (this.nextKey) this.nextKey.classList.add("next");
    this.setActiveFinger(ch ? KEY_FINGER[ch] : null);
  },
  setNewKeys(chars) {
    Object.values(this.keys).forEach(k => k.classList.remove("newkey"));
    [...chars].forEach(c => this.keys[c] && this.keys[c].classList.add("newkey"));
  },
  flash(ch, cls) {
    const k = this.keys[ch];
    if (!k) return;
    k.classList.remove(cls);
    void k.offsetWidth;
    k.classList.add(cls);
    setTimeout(() => k.classList.remove(cls), 280);
  },
  clear() { this.setNext(null); this.setNewKeys(""); }
};

const Tutor = {
  idx: 0, phase: "idle", lines: [], line: 0, pos: 0,
  correct: 0, errors: 0, errMap: {}, t0: 0, totalChars: 0,

  progress() {
    const p = Store.get("tutor", null);
    return p && Array.isArray(p.stars) ? p : { stars: [] };
  },
  stars(i) { return this.progress().stars[i] || 0; },
  unlocked(i) { return i === 0 || this.stars(i - 1) > 0; },
  completed() {
    let n = 0;
    while (n < LESSONS.length && this.stars(n) > 0) n++;
    return n;
  },
  saveStars(i, st) {
    const p = this.progress();
    p.stars[i] = Math.max(p.stars[i] || 0, st);
    for (let k = 0; k < LESSONS.length; k++) p.stars[k] = p.stars[k] || 0;
    Store.set("tutor", p);
  },
  init() {
    document.addEventListener("keydown", e => this.onKey(e));
    $("btnTutorStart").onclick = () => this.begin();
    $("btnTutorExit").onclick = () => this.exit();
  },
  openMap() {
    this.phase = "idle";
    App.active = false;
    Kb.clear();
    this.renderMap();
    UI.show("s-map");
  },
  renderMap() {
    const box = $("lessons");
    box.innerHTML = "";
    LESSONS.forEach((L, i) => {
      const open = this.unlocked(i), st = this.stars(i);
      const card = make("div", "lesson" + (open ? "" : " locked") + (st ? " done" : ""));
      card.append(
        make("div", "ico", open ? L.icon : "🔒"),
        make("h3", "", `${i + 1}. ${L.name}`),
        make("small", "", L.title),
        make("div", "stars", "★".repeat(st) + "☆".repeat(3 - st))
      );
      if (open) card.onclick = () => this.openLesson(i);
      box.append(card);
    });
    const done = this.completed();
    const pct = done / LESSONS.length * 100;
    $("journeyFill").style.width = pct + "%";
    $("journeyRocket").style.left = pct + "%";
    $("journeyText").textContent = done >= LESSONS.length
      ? "🌌 Has recorrido todo el sistema solar!"
      : `Destino actual: ${LESSONS[done].name} · ${done} de ${LESSONS.length} completados`;
  },
  pseudo(L) {
    const letters = [...L.keys].filter(c => /[a-zñ]/.test(c));
    const n = 2 + rand(3);
    let g = "";
    for (let i = 0; i < n; i++) {
      const src = L.newKeys && Math.random() < .55 ? L.newKeys : L.keys;
      let c = src[rand(src.length)];
      if (i === 0 && ",.".includes(c)) c = pick(letters);
      g += c;
    }
    return g;
  },
  buildLines(L) {
    if (L.phrases) {
      const phrases = shuffle(WORDS.avanzado.slice()).slice(0, TUTOR_LINES);
      return phrases.map(p => {
        const lines = wrapPhrase(p, 30);
        return lines.join(" ");
      });
    }
    const pool    = WORD_BANK.filter(w => [...w].every(c => L.keys.includes(c)));
    const poolNew = L.newKeys ? pool.filter(w => [...w].some(c => L.newKeys.includes(c))) : pool;
    const lines = [];
    let lastWord = "";
    for (let i = 0; i < TUTOR_LINES; i++) {
      const parts = [];
      let len = 0;
      while (len < 28) {
        let w;
        if (poolNew.length >= 4 && Math.random() < .45) w = pick(poolNew);
        else if (pool.length  >= 6 && Math.random() < .2) w = pick(pool);
        else w = this.pseudo(L);
        if (w === lastWord) {
          w = this.pseudo(L);
          if (w === lastWord) continue;
        }
        lastWord = w;
        if (len + w.length + (parts.length ? 1 : 0) > 30) break;
        parts.push(w);
        len += w.length + (parts.length > 1 ? 1 : 0);
      }
      if (parts.length < 2) parts.push(this.pseudo(L));
      lines.push(parts.join(" "));
    }
    return lines;
  },
  openLesson(i) {
    this.idx = i;
    const L = LESSONS[i];
    this.phase = "intro";
    App.active = false;
    $("tIntroTitle").textContent = `${L.icon} Leccion ${i + 1} · ${L.name}: ${L.title}`;
    $("tIntroDesc").textContent = L.desc;
    const chips = $("tIntroKeys");
    chips.innerHTML = "";
    [...L.newKeys].forEach(c => {
      const ch = make("span", "chip", c.toUpperCase());
      ch.style.setProperty("--c", FINGERS[KEY_FINGER[c]].color);
      chips.append(ch);
    });
    $("tIntro").hidden = false;
    $("tPlay").hidden = true;
    $("tLine").textContent = `0/${TUTOR_LINES}`;
    $("tAcc").textContent = "100%";
    $("tErr").textContent = "0";
    $("tWpm").textContent = "0";
    $("tBar").style.width = "0%";
    Kb.setNext(null);
    Kb.setNewKeys(L.newKeys);
    UI.show("s-tutor");
    $("btnTutorStart").focus();
  },
  begin() {
    if (this.phase !== "intro") return;
    const L = LESSONS[this.idx];
    this.phase = "play";
    this.lines = this.buildLines(L);
    this.totalChars = this.lines.reduce((a, l) => a + l.length, 0);
    this.line = 0; this.pos = 0; this.correct = 0; this.errors = 0; this.errMap = {}; this.t0 = 0;
    $("tIntro").hidden = true;
    $("tPlay").hidden = false;
    if (document.activeElement) document.activeElement.blur();
    App.active = true;
    this.render();
    this.setTip();
  },
  wantChar() { return this.lines[this.line][this.pos]; },
  accuracy() {
    const t = this.correct + this.errors;
    return t ? Math.round(this.correct / t * 100) : 100;
  },
  wpm() {
    if (!this.t0) return 0;
    const min = Math.max((performance.now() - this.t0) / 60000, 1 / 600);
    return Math.round((this.correct / 5) / min);
  },
  render() {
    const text = this.lines[this.line];
    const box = $("tLineText");
    box.innerHTML = "";
    [...text].forEach((ch, i) => {
      const cls = i < this.pos ? "ok" : i === this.pos ? "pend cur" : "pend";
      const sp = make("span", cls, ch === " " ? "␣" : ch);
      if (ch === " ") sp.classList.add("sp");
      box.append(sp);
    });
    const nxt = this.lines[this.line + 1];
    $("tNext").textContent = nxt ? "Siguiente linea: " + nxt : "Ultima linea 🏁";
    const done = this.lines.slice(0, this.line).reduce((a, l) => a + l.length, 0) + this.pos;
    $("tBar").style.width = (done / this.totalChars * 100) + "%";
    $("tLine").textContent = `${this.line + 1}/${this.lines.length}`;
    $("tAcc").textContent = this.accuracy() + "%";
    $("tErr").textContent = this.errors;
    $("tWpm").textContent = this.wpm();
    Kb.setNext(this.wantChar());
  },
  setTip(errMsg) {
    const tip = $("tTip");
    tip.classList.toggle("bad", !!errMsg);
    if (errMsg) { tip.textContent = errMsg; return; }
    const c = this.wantChar();
    const f = FINGERS[KEY_FINGER[c]];
    tip.textContent = c === " " ? "Siguiente: ESPACIO -> usa cualquier pulgar" : `Siguiente: ${keyLabel(c)} -> ${f.name}`;
  },
  onKey(e) {
    if (UI.current !== "s-tutor") return;
    if (e.key === "Escape") { this.exit(); return; }
    if (this.phase === "intro") {
      if (e.key === "Enter") { e.preventDefault(); this.begin(); }
      return;
    }
    if (this.phase !== "play") return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length !== 1) return;
    e.preventDefault();
    const k = e.key.toLowerCase();
    const want = this.wantChar();
    if (!this.t0) this.t0 = performance.now();
    if (k === want) this.hit(want);
    else this.miss(k, want);
  },
  hit(want) {
    this.correct++;
    Kb.flash(want, "hit");
    Sound.beep(700, .04, "triangle", .04);
    this.pos++;
    if (this.pos >= this.lines[this.line].length) {
      this.line++;
      this.pos = 0;
      if (this.line >= this.lines.length) { this.finish(); return; }
      Sound.beep(880, .1, "sine", .06);
    }
    this.render();
    this.setTip();
  },
  miss(k, want) {
    this.errors++;
    this.errMap[want] = (this.errMap[want] || 0) + 1;
    Kb.flash(k, "wrong");
    Sound.beep(180, .12, "sawtooth", .05);
    const cur = $("tLineText").children[this.pos];
    if (cur) { cur.classList.remove("shake"); void cur.offsetWidth; cur.classList.add("shake"); }
    const wantF = FINGERS[KEY_FINGER[want]].name;
    const gotKey = KEY_FINGER[k];
    const got = gotKey ? ` (tecla del ${FINGERS[gotKey].name})` : "";
    $("tAcc").textContent = this.accuracy() + "%";
    $("tErr").textContent = this.errors;
    this.setTip(`✖ Pulsaste "${keyLabel(k)}"${got}. Debes pulsar "${keyLabel(want)}" con el ${wantF}.`);
  },
  finish() {
    this.phase = "done";
    App.active = false;
    Kb.clear();
    const L = LESSONS[this.idx], i = this.idx;
    const ms = performance.now() - this.t0;
    const wpm = Math.round((this.correct / 5) / Math.max(ms / 60000, 1 / 600));
    const acc = this.accuracy();
    const pass = acc >= TUTOR_PASS;
    const st = !pass ? 0 : acc >= 97 ? 3 : acc >= 92 ? 2 : 1;
    const score = Math.max(0, this.correct * 10 - this.errors * 5) + st * 150;
    const hadNext = this.unlocked(i + 1);
    if (pass) this.saveStars(i, st);
    const nextNow = pass && i + 1 < LESSONS.length;
    const weak = Object.entries(this.errMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, n]) => `${keyLabel(c)} (${n})`).join(", ");
    let note = weak ? `Teclas a reforzar: ${weak}.` : "Ninguna tecla fallida, precision perfecta!";
    if (!pass) note += ` Necesitas ${TUTOR_PASS}% de precision para avanzar al siguiente destino.`;
    else if (nextNow && !hadNext) note += ` 🔓 Nuevo destino desbloqueado: ${LESSONS[i + 1].name}!`;
    else if (pass && i + 1 >= LESSONS.length) note += " 🌌 Completaste todo el viaje por el sistema solar!";
    const ranks = ["☄️ SIGUE PRACTICANDO", "🛰️ APROBADO", "🚀 MUY BIEN", "🌟 PERFECTO"];
    const actions = [];
    if (nextNow) actions.push({ label: "SIGUIENTE LECCION", fn: () => this.openLesson(i + 1) });
    actions.push({ label: "REPETIR", sec: nextNow, fn: () => this.openLesson(i) });
    actions.push({ label: "MAPA", sec: true, fn: () => { Records.refresh(); this.openMap(); } });
    Sound[pass ? "melody" : "beep"](...(pass ? [[523, 659, 784]] : [300, .3, "sine", .06]));
    Results.show({
      title: pass ? "LECCION COMPLETADA" : "CASI LO LOGRAS",
      rank: `${L.icon} ${L.name} · ${ranks[st]}`,
      isRecord: false,
      stats: [
        { v: fmtNum(score), l: "PUNTUACION" }, { v: wpm, l: "PPM" }, { v: acc + "%", l: "PRECISION" },
        { v: this.errors, l: "ERRORES" }, { v: "★".repeat(st) + "☆".repeat(3 - st), l: "ESTRELLAS" }, { v: fmtTime(ms), l: "TIEMPO" }
      ],
      note,
      payload: { score, mode: `Tutor · ${L.name}`, wpm, acc },
      actions
    });
  },
  exit() {
    if (this.phase === "idle") return;
    this.openMap();
  }
};

const Starfield = {
  cv: null, cx: null, stars: [],
  planets: [
    { x: .12, y: .2,  r: 34, c: "#ff4fd8" },
    { x: .88, y: .78, r: 52, c: "#4df3ff" },
    { x: .8,  y: .15, r: 18, c: "#ffd84d" }
  ],
  init() {
    this.cv = $("stars");
    this.cx = this.cv.getContext("2d");
    addEventListener("resize", () => this.resize());
    this.resize();
    this.loop();
  },
  resize() {
    const cv = this.cv;
    cv.width = innerWidth;
    cv.height = innerHeight;
    const n = Math.min(220, Math.floor(innerWidth * innerHeight / 6000));
    this.stars = Array.from({ length: n }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      z: Math.random() * 2 + .3, t: Math.random() * 6
    }));
  },
  loop() {
    this.draw();
    requestAnimationFrame(() => this.loop());
  },
  draw() {
    const { cv, cx } = this;
    cx.clearRect(0, 0, cv.width, cv.height);
    const g = cx.createRadialGradient(cv.width / 2, cv.height / 2, 0, cv.width / 2, cv.height / 2, Math.max(cv.width, cv.height) * .7);
    g.addColorStop(0, "#160b3a");
    g.addColorStop(1, "#05030f");
    cx.fillStyle = g;
    cx.fillRect(0, 0, cv.width, cv.height);
    this.planets.forEach(p => {
      const px = p.x * cv.width, py = p.y * cv.height;
      const pg = cx.createRadialGradient(px - p.r * .3, py - p.r * .3, 2, px, py, p.r);
      pg.addColorStop(0, p.c);
      pg.addColorStop(1, "rgba(5,3,15,.9)");
      cx.globalAlpha = .55;
      cx.fillStyle = pg;
      cx.beginPath();
      cx.arc(px, py, p.r, 0, 7);
      cx.fill();
      cx.globalAlpha = 1;
    });
    const boost = App.active ? 3 : 1;
    this.stars.forEach(s => {
      s.x -= s.z * .25 * boost;
      s.t += .03;
      if (s.x < 0) { s.x = cv.width; s.y = Math.random() * cv.height; }
      cx.globalAlpha = .5 + .5 * Math.sin(s.t);
      cx.fillStyle = "#fff";
      cx.fillRect(s.x, s.y, s.z, s.z);
    });
    cx.globalAlpha = 1;
  }
};

function init() {
  Kb.build();
  Kb.buildHands();
  Classic.init();
  Tutor.init();
  Starfield.init();

  $("btnPlay").onclick = () => { Records.refresh(); UI.show("s-level"); };
  $("btnBack").onclick = () => UI.show("s-start");
  $("btnMapBack").onclick = () => { Records.refresh(); UI.show("s-level"); };
  document.querySelectorAll(".lvl").forEach(el => {
    el.onclick = () => (el.dataset.l === "tutor" ? Tutor.openMap() : Classic.start(el.dataset.l));
  });

  $("btnBoardStart").onclick = () => Board.open();
  $("btnEndBoard").onclick = () => Board.open();
  $("btnBoardBack").onclick = () => UI.show(Board.from);
  $("btnBoardClear").onclick = () => Board.clear();

  $("btnSave").onclick = () => Results.save();
  $("nameInp").addEventListener("keydown", e => { if (e.key === "Enter") Results.save(); });
  $("muteBtn").onclick = () => Sound.toggle();
  document.addEventListener("click", () => { if (Classic.running) $("inp").focus(); });
  Records.refresh();
}

init();