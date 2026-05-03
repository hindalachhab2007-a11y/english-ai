/* ═══════════════════════════════════════════
   EnglishAI — main.js
   Toute l'interactivité du site
═══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   1. NAV — scroll + burger menu
══════════════════════════════════════════ */
const nav       = document.getElementById('nav');
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('active');
});

// Fermer le menu en cliquant sur un lien
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('active');
  });
});


/* ══════════════════════════════════════════
   2. REVEAL — Intersection Observer
══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════════
   3. CHAT DÉMO — animation automatique
══════════════════════════════════════════ */
const chatDemo = document.getElementById('chatDemo');

const chatSequence = [
  { role: 'ai',   text: 'Hello! 👋 I am your AI English teacher. How can I help you today?' },
  { role: 'user', text: 'I want to improve my speaking.' },
  { role: 'ai',   text: 'Great choice! Let\'s start with a simple conversation. Tell me about your day.' },
  { role: 'user', text: 'Yesterday I go to the market and buyed apples.' },
  {
    role: 'correction',
    text: '✏️ Correction : "Yesterday I **went** to the market and **bought** apples."\n→ "go" → "went" (past irregular)\n→ "buyed" → "bought" (past irregular)'
  },
  { role: 'ai',   text: 'Perfect try! You used past tense — just remember these irregular verbs. Keep going! 💪' },
];

let chatIdx = 0;

function appendChatMessage(msg) {
  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<span></span><span></span><span></span>';

  if (msg.role === 'ai' || msg.role === 'correction') {
    chatDemo.appendChild(typing);
    chatDemo.scrollTop = chatDemo.scrollHeight;
  }

  const delay = (msg.role === 'user') ? 0 : 1100;

  setTimeout(() => {
    if (typing.parentNode) typing.remove();

    const el = document.createElement('div');
    if (msg.role === 'correction') {
      el.className = 'chat-msg chat-msg--correction';
      el.style.whiteSpace = 'pre-line';
    } else {
      el.className = `chat-msg chat-msg--${msg.role}`;
    }
    el.textContent = msg.text;
    chatDemo.appendChild(el);
    chatDemo.scrollTop = chatDemo.scrollHeight;
  }, delay);
}

function runChatDemo() {
  if (!chatDemo) return;
  chatDemo.innerHTML = '';
  chatIdx = 0;

  function nextMsg() {
    if (chatIdx >= chatSequence.length) {
      // Redémarre après une pause
      setTimeout(runChatDemo, 4000);
      return;
    }
    const msg = chatSequence[chatIdx++];
    const pause = (msg.role === 'user') ? 600 : 400;
    setTimeout(() => {
      appendChatMessage(msg);
      nextMsg();
    }, pause + (msg.role !== 'user' ? 1200 : 0));
  }
  nextMsg();
}

// Lancer après 1s pour laisser la page se charger
setTimeout(runChatDemo, 1000);


/* ══════════════════════════════════════════
   4. SIMULATIONS DE CONVERSATION
══════════════════════════════════════════ */
const simModal    = document.getElementById('simModal');
const closeModal  = document.getElementById('closeModal');
const modalTitle  = document.getElementById('modalTitle');
const modalPrompt = document.getElementById('modalPrompt');
const copyPrompt  = document.getElementById('copyPrompt');

const scenarioData = {
  hotel: {
    title: '🏨 Simulation — Réservation d\'hôtel',
    prompt: `Act as a hotel receptionist at a 4-star hotel in London. I am a French-speaking tourist practicing my English. 

Rules:
- Speak only in English
- After each of my replies, correct any grammar or vocabulary mistakes in a [CORRECTION] block
- Use natural, professional hotel vocabulary
- Guide me through: checking in, asking about amenities, requesting a room upgrade, and checking out

Start the simulation by greeting me as I walk into the hotel lobby.`
  },
  restaurant: {
    title: '🍽️ Simulation — Au restaurant',
    prompt: `Act as a friendly waiter in an upscale New York restaurant. I am a French speaker practicing English.

Rules:
- Speak only in English
- After each of my replies, add a [CORRECTION] block pointing out any errors
- Introduce the menu, take my order, suggest dishes, and handle special requests
- Use natural restaurant vocabulary (specials, dietary restrictions, bill, tip, etc.)

Start by welcoming me to the restaurant and presenting the evening specials.`
  },
  interview: {
    title: '💼 Simulation — Entretien d\'embauche',
    prompt: `Act as a senior HR manager interviewing me for a Marketing Manager position at an international tech company. I am practicing my professional English.

Rules:
- Conduct the interview entirely in English
- After each of my answers, add a [FEEDBACK] block with:
  1. Grammar corrections
  2. Vocabulary improvements (more professional alternatives)
  3. Structure tips (was my answer clear and structured?)
- Ask classic interview questions: tell me about yourself, strengths/weaknesses, situational questions

Start the interview formally.`
  },
  airport: {
    title: '✈️ Simulation — À l\'aéroport',
    prompt: `Act as different airport staff members (check-in agent, security officer, gate agent) at Heathrow Airport. I am a French traveler practicing English.

Rules:
- Each interaction should be realistic and use authentic airport vocabulary
- After each of my replies, add a [CORRECTION] block for grammar and vocabulary
- Cover: check-in, baggage drop, security screening, gate announcements, boarding

Start at the check-in counter.`
  },
  doctor: {
    title: '🏥 Simulation — Chez le médecin',
    prompt: `Act as a general practitioner (GP) in a British clinic. I am a French patient practicing medical English.

Rules:
- Speak clearly and professionally in English
- After each of my replies, provide a [CORRECTION] block for any language errors
- Help me practice describing symptoms, understanding diagnoses, and asking about treatments
- Use common medical vocabulary (symptoms, prescriptions, follow-up, etc.)

Start the consultation by calling me into your office.`
  },
  shopping: {
    title: '🛍️ Simulation — Shopping',
    prompt: `Act as a helpful shop assistant in a clothing store in London. I am a French tourist practicing English.

Rules:
- Use natural, friendly British English
- After each of my responses, add a [CORRECTION] block with grammar and vocabulary tips
- Help me practice: asking for sizes, comparing items, asking about prices, making a purchase, and returning an item

Start by greeting me as I enter the store.`
  }
};

document.querySelectorAll('.scenario-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.scenario-card');
    const key  = card.dataset.scenario;
    const data = scenarioData[key];
    modalTitle.textContent  = data.title;
    modalPrompt.textContent = data.prompt;
    simModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

closeModal.addEventListener('click', closeSimModal);
simModal.addEventListener('click', e => { if (e.target === simModal) closeSimModal(); });

function closeSimModal() {
  simModal.classList.remove('open');
  document.body.style.overflow = '';
}

copyPrompt.addEventListener('click', () => {
  navigator.clipboard.writeText(modalPrompt.textContent).then(() => showToast('✓ Prompt copié !'));
});


/* ══════════════════════════════════════════
   5. GRAMMAIRE — correction simulée
══════════════════════════════════════════ */
const correctBtn    = document.getElementById('correctBtn');
const grammarInput  = document.getElementById('grammarInput');
const grammarOutput = document.getElementById('grammarOutput');
const levelSelect   = document.getElementById('levelSelect');
const genExercise   = document.getElementById('genExercise');
const exerciseBox   = document.getElementById('exerciseBox');
const exerciseContent = document.getElementById('exerciseContent');
const exLevelSpan   = document.getElementById('exLevel');

// Corrections simulées
const correctionExamples = [
  {
    original: 'Yesterday I go to the market',
    fixed:    'Yesterday I went to the market',
    explain:  '→ Utilisez le passé simple "went" (irrégulier de "go") pour une action terminée hier.'
  },
  {
    original: 'buyed apples',
    fixed:    'bought apples',
    explain:  '→ "buy" est irrégulier : buy → bought (pas de "-ed").'
  },
  {
    original: 'He don\'t like coffee',
    fixed:    'He doesn\'t like coffee',
    explain:  '→ À la 3e personne du singulier (he/she/it), utilisez "doesn\'t" au lieu de "don\'t".'
  },
  {
    original: 'I am agree with you',
    fixed:    'I agree with you',
    explain:  '→ "Agree" est un verbe d\'état, il s\'utilise sans "am/is/are".'
  },
  {
    original: 'She is more taller than him',
    fixed:    'She is taller than him',
    explain:  '→ N\'utilisez pas "more" avec les adjectifs courts qui prennent déjà "-er".'
  },
];

correctBtn.addEventListener('click', () => {
  const text = grammarInput.value.trim();
  if (!text) { showToast('⚠️ Entrez un texte à corriger'); return; }

  correctBtn.innerHTML = '<span class="spinner"></span>';
  correctBtn.disabled = true;

  setTimeout(() => {
    correctBtn.textContent = 'Corriger avec l\'IA ✦';
    correctBtn.disabled = false;

    const prompt = `
📋 Prompt à copier dans votre IA :\n
"Corrige le texte suivant en anglais pour un niveau ${levelSelect.value}.
Pour chaque erreur, indique :
1. La phrase originale (en rouge)
2. La version corrigée (en vert)
3. L'explication de la règle grammaticale en français
Texte : ${text}"
    `.trim();

    grammarOutput.innerHTML = '';

    // Afficher le prompt suggéré
    const promptBlock = document.createElement('div');
    promptBlock.style.cssText = 'background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:16px;font-size:0.8rem;color:var(--text-muted);white-space:pre-wrap;line-height:1.6;';
    promptBlock.textContent = prompt;
    grammarOutput.appendChild(promptBlock);

    // Exemple de corrections
    const heading = document.createElement('p');
    heading.style.cssText = 'font-size:0.78rem;color:var(--accent2);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;';
    heading.textContent = '✦ Exemple de corrections détectées :';
    grammarOutput.appendChild(heading);

    const nb = Math.floor(Math.random() * 2) + 2;
    const shuffled = [...correctionExamples].sort(() => 0.5 - Math.random()).slice(0, nb);

    shuffled.forEach(c => {
      const item = document.createElement('div');
      item.className = 'correction-item';
      item.innerHTML = `
        <div class="correction-item__original">✗ ${c.original}</div>
        <div class="correction-item__fixed">✓ ${c.fixed}</div>
        <div class="correction-item__explain">${c.explain}</div>
      `;
      grammarOutput.appendChild(item);
    });

    showToast('✓ Correction générée !');
  }, 1500);
});


/* ─ Générateur d'exercices ─ */
const exerciseBank = {
  A1: {
    type: 'Texte à trous — Verbe "to be"',
    instructions: 'Complétez avec : am / is / are',
    items: [
      'I ___ a student.',
      'She ___ from France.',
      'They ___ very happy today.',
      'The cat ___ on the table.',
      'We ___ learning English.',
    ]
  },
  A2: {
    type: 'Choix multiples — Present Simple vs Continuous',
    instructions: 'Choisissez la bonne forme verbale.',
    items: [
      'She (reads / is reading) a book right now.',
      'He (plays / is playing) football every Saturday.',
      'They (work / are working) on a project this week.',
      'I (don\'t like / am not liking) cold coffee.',
      'The sun (sets / is setting) in the west.',
    ]
  },
  B1: {
    type: 'Correction de phrases — Past Simple',
    instructions: 'Trouvez et corrigez l\'erreur dans chaque phrase.',
    items: [
      'She goed to the market yesterday.',
      'We didn\'t went to the party.',
      'He has called me last night.',
      'They buyed a new car last week.',
      'Did she found her keys?',
    ]
  },
  B2: {
    type: 'Réécriture — Voix passive',
    instructions: 'Transformez chaque phrase à la voix passive.',
    items: [
      'The chef prepares the meal every morning.',
      'Scientists discovered a new planet last year.',
      'They are building a new hospital in the city.',
      'Someone broke the window during the night.',
      'The company will launch the product next month.',
    ]
  },
  C1: {
    type: 'Reformulation — Registre soutenu',
    instructions: 'Reformulez chaque phrase dans un registre formel/académique.',
    items: [
      'The results were really good.',
      'We need to think about the environment more.',
      'Lots of people don\'t know about this issue.',
      'The new policy has made things better.',
      'We should look into this more carefully.',
    ]
  }
};

genExercise.addEventListener('click', () => {
  const level = levelSelect.value;
  const ex    = exerciseBank[level] || exerciseBank['B1'];

  exLevelSpan.textContent = level;
  exerciseContent.innerHTML = '';

  const typeEl = document.createElement('p');
  typeEl.style.cssText = 'font-size:0.82rem;color:var(--accent2);margin-bottom:4px;font-weight:600;';
  typeEl.textContent = ex.type;
  exerciseContent.appendChild(typeEl);

  const instrEl = document.createElement('p');
  instrEl.style.cssText = 'font-size:0.85rem;color:var(--text-muted);margin-bottom:18px;';
  instrEl.textContent = ex.instructions;
  exerciseContent.appendChild(instrEl);

  ex.items.forEach((item, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:0.88rem;';
    row.innerHTML = `
      <span style="color:var(--accent2);font-weight:700;flex-shrink:0;">${i + 1}.</span>
      <span>${item}</span>
    `;
    exerciseContent.appendChild(row);
  });

  exerciseBox.style.display = 'block';
  exerciseBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('✓ Exercice généré !');
});


/* ══════════════════════════════════════════
   6. VOCABULAIRE — thèmes
══════════════════════════════════════════ */
const vocabData = {
  marketing: [
    { en: 'Brand awareness',   phonetic: '/brænd əˈweənɪs/',       fr: 'Notoriété de marque',  example: '"We need to increase our brand awareness in Europe."' },
    { en: 'Target audience',   phonetic: '/ˈtɑːɡɪt ˈɔːdiəns/',    fr: 'Public cible',         example: '"Our target audience is millennials aged 25-35."' },
    { en: 'Call to action',    phonetic: '/kɔːl tuː ˈækʃən/',      fr: 'Appel à l\'action',    example: '"Add a clear call to action at the end of your email."' },
    { en: 'Market share',      phonetic: '/ˈmɑːkɪt ʃeə/',          fr: 'Part de marché',       example: '"They gained 15% market share last quarter."' },
    { en: 'Lead generation',   phonetic: '/liːd ˌdʒenəˈreɪʃən/',  fr: 'Génération de leads',  example: '"Our lead generation campaign was very successful."' },
    { en: 'Conversion rate',   phonetic: '/kənˈvɜːʃən reɪt/',      fr: 'Taux de conversion',   example: '"We improved the conversion rate from 2% to 5%."' },
  ],
  voyage: [
    { en: 'Check-in',          phonetic: '/ˈtʃek ɪn/',             fr: 'Enregistrement',       example: '"Online check-in opens 24 hours before departure."' },
    { en: 'Carry-on luggage',  phonetic: '/ˈkæri ɒn ˈlʌɡɪdʒ/',    fr: 'Bagage cabine',        example: '"Your carry-on luggage must fit in the overhead bin."' },
    { en: 'Departure lounge',  phonetic: '/dɪˈpɑːtʃə laʊndʒ/',    fr: 'Salle d\'embarquement',example: '"Please proceed to the departure lounge."' },
    { en: 'Layover',           phonetic: '/ˈleɪˌoʊvər/',           fr: 'Escale',               example: '"We have a 3-hour layover in Dubai."' },
    { en: 'Boarding pass',     phonetic: '/ˈbɔːdɪŋ pɑːs/',         fr: 'Carte d\'embarquement',example: '"Please have your boarding pass ready."' },
    { en: 'Jet lag',           phonetic: '/ˈdʒet læɡ/',            fr: 'Décalage horaire',     example: '"I always suffer from jet lag on long-haul flights."' },
  ],
  cuisine: [
    { en: 'Simmer',            phonetic: '/ˈsɪmər/',               fr: 'Mijoter',              example: '"Let the soup simmer for 20 minutes on low heat."' },
    { en: 'Whisk',             phonetic: '/wɪsk/',                  fr: 'Fouetter',             example: '"Whisk the eggs until they become frothy."' },
    { en: 'Marinate',          phonetic: '/ˈmærɪneɪt/',            fr: 'Mariner',              example: '"Marinate the chicken for at least 2 hours."' },
    { en: 'Sauté',             phonetic: '/ˈsoʊteɪ/',              fr: 'Faire sauter',         example: '"Sauté the onions in olive oil until golden."' },
    { en: 'Drizzle',           phonetic: '/ˈdrɪzəl/',              fr: 'Arroser d\'un filet',  example: '"Drizzle some olive oil over the salad."' },
    { en: 'Season to taste',   phonetic: '/ˈsiːzən tuː teɪst/',    fr: 'Assaisonner selon goût',example: '"Season to taste with salt and pepper."' },
  ],
  tech: [
    { en: 'Deploy',            phonetic: '/dɪˈplɔɪ/',              fr: 'Déployer',             example: '"We will deploy the new version on Friday."' },
    { en: 'Bandwidth',         phonetic: '/ˈbændwɪdθ/',            fr: 'Bande passante',       example: '"We don\'t have the bandwidth for this project right now."' },
    { en: 'Agile',             phonetic: '/ˈædʒaɪl/',              fr: 'Méthode agile',        example: '"Our team works in agile sprints."' },
    { en: 'Scalable',          phonetic: '/ˈskeɪləbəl/',           fr: 'Évolutif',             example: '"We need a scalable infrastructure."' },
    { en: 'Debugging',         phonetic: '/diːˈbʌɡɪŋ/',            fr: 'Débogage',             example: '"I spent all morning debugging this feature."' },
    { en: 'Repository',        phonetic: '/rɪˈpɒzɪtəri/',          fr: 'Dépôt (code)',         example: '"Please push your changes to the repository."' },
  ],
  sante: [
    { en: 'Prescription',      phonetic: '/prɪˈskrɪpʃən/',         fr: 'Ordonnance',           example: '"I need a prescription for this medication."' },
    { en: 'Symptoms',          phonetic: '/ˈsɪmptəmz/',            fr: 'Symptômes',            example: '"What are your symptoms?"' },
    { en: 'Follow-up',         phonetic: '/ˈfɒloʊ ʌp/',            fr: 'Suivi médical',        example: '"Schedule a follow-up appointment in two weeks."' },
    { en: 'Blood pressure',    phonetic: '/blʌd ˈpreʃər/',         fr: 'Tension artérielle',   example: '"Your blood pressure is slightly high."' },
    { en: 'Allergic reaction', phonetic: '/əˈlɜːdʒɪk rɪˈækʃən/', fr: 'Réaction allergique',  example: '"Are you having an allergic reaction?"' },
    { en: 'Dosage',            phonetic: '/ˈdoʊsɪdʒ/',             fr: 'Posologie / Dosage',   example: '"Take this dosage twice a day after meals."' },
  ],
  finance: [
    { en: 'Return on Investment', phonetic: '/rɪˈtɜːn ɒn ɪnˈvestmənt/', fr: 'Retour sur investissement', example: '"The ROI on this campaign was 300%."' },
    { en: 'Cash flow',         phonetic: '/kæʃ floʊ/',             fr: 'Flux de trésorerie',   example: '"Positive cash flow is essential for growth."' },
    { en: 'Equity',            phonetic: '/ˈekwɪti/',              fr: 'Capitaux propres',     example: '"They sold 20% equity to investors."' },
    { en: 'Dividend',          phonetic: '/ˈdɪvɪdend/',            fr: 'Dividende',            example: '"The company announced a quarterly dividend."' },
    { en: 'Overhead costs',    phonetic: '/ˈoʊvərhed kɒsts/',      fr: 'Frais généraux',       example: '"We need to reduce our overhead costs."' },
    { en: 'Break-even point',  phonetic: '/breɪk ˈiːvən pɔɪnt/',  fr: 'Seuil de rentabilité', example: '"We will reach the break-even point by Q3."' },
  ]
};

const vocabGrid   = document.getElementById('vocabGrid');
const themeTags   = document.querySelectorAll('.theme-tag');

function renderVocab(theme) {
  const words = vocabData[theme] || [];
  vocabGrid.innerHTML = '';
  words.forEach(w => {
    const el = document.createElement('div');
    el.className = 'vocab-item';
    el.innerHTML = `
      <div class="vocab-item__en">${w.en}</div>
      <div class="vocab-item__phonetic">${w.phonetic}</div>
      <div class="vocab-item__fr">${w.fr}</div>
      <div class="vocab-item__example">${w.example}</div>
    `;
    vocabGrid.appendChild(el);
  });
}

themeTags.forEach(tag => {
  tag.addEventListener('click', () => {
    themeTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    renderVocab(tag.dataset.theme);
  });
});

// Chargement initial
renderVocab('marketing');


/* ── Outil phonétique (simulé) ── */
const phoneticBtn    = document.getElementById('phoneticBtn');
const phoneticInput  = document.getElementById('phoneticInput');
const phoneticResult = document.getElementById('phoneticResult');

// Dictionnaire phonétique étendu
const phoneticDict = {
  'i': '/aɪ/', 'would': '/wʊd/', 'like': '/laɪk/', 'to': '/tuː/',
  'schedule': '/ˈʃedjuːl/', 'a': '/ə/', 'meeting': '/ˈmiːtɪŋ/',
  'the': '/ðə/', 'is': '/ɪz/', 'are': '/ɑː/', 'have': '/hæv/',
  'has': '/hæz/', 'do': '/duː/', 'does': '/dʌz/', 'with': '/wɪð/',
  'this': '/ðɪs/', 'that': '/ðæt/', 'what': '/wɒt/', 'where': '/weər/',
  'when': '/wen/', 'why': '/waɪ/', 'how': '/haʊ/', 'who': '/huː/',
  'very': '/ˈveri/', 'really': '/ˈrɪəli/', 'actually': '/ˈæktʃuəli/',
  'english': '/ˈɪŋɡlɪʃ/', 'learn': '/lɜːn/', 'speak': '/spiːk/',
  'practice': '/ˈpræktɪs/', 'understand': '/ˌʌndəˈstænd/',
  'pronunciation': '/prəˌnʌnsiˈeɪʃən/', 'vocabulary': '/vəˈkæbjʊləri/',
  'grammar': '/ˈɡræmər/', 'fluent': '/ˈfluːənt/', 'accent': '/ˈæksənt/',
  'hello': '/həˈloʊ/', 'please': '/pliːz/', 'thank': '/θæŋk/',
  'you': '/juː/', 'good': '/ɡʊd/', 'morning': '/ˈmɔːnɪŋ/',
};

phoneticBtn.addEventListener('click', () => {
  const text = phoneticInput.value.trim();
  if (!text) { showToast('⚠️ Entrez une phrase'); return; }

  const words = text.toLowerCase().replace(/[.,!?]/g, '').split(' ');
  const transcription = words.map(w => phoneticDict[w] || `/${w}/`).join(' ');

  phoneticResult.innerHTML = `
    <span style="color:var(--text-muted);font-size:0.75rem;margin-right:10px;">IPA :</span>
    <span>${transcription}</span>
  `;
  showToast('✓ Transcription générée !');
});

phoneticInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') phoneticBtn.click();
});


/* ══════════════════════════════════════════
   7. ESPACE ENSEIGNANTS — prompts
══════════════════════════════════════════ */
const toolModal      = document.getElementById('toolModal');
const closeToolModal = document.getElementById('closeToolModal');
const toolModalTitle = document.getElementById('toolModalTitle');
const toolModalPrompt= document.getElementById('toolModalPrompt');
const copyToolPrompt = document.getElementById('copyToolPrompt');

const teacherPrompts = {
  lesson: {
    title: '📚 Prompt — Plan de cours complet',
    prompt: `Create a complete English lesson plan for [LEVEL: A1/A2/B1/B2/C1] students on the topic: [TOPIC].

Structure:
1. LESSON OBJECTIVES (3 clear, measurable goals)
2. WARM-UP (5-10 min) — an engaging activity to introduce the topic
3. VOCABULARY (10 min) — 8-10 key words/expressions with definitions and examples
4. GRAMMAR FOCUS (15 min) — main grammar point with explanation and examples
5. PRACTICE ACTIVITIES (20 min) — 2-3 communicative activities
6. PRODUCTION TASK (10 min) — free practice (speaking or writing)
7. WRAP-UP & HOMEWORK — summary + 1 homework assignment
8. ASSESSMENT CRITERIA — how to evaluate students

Format each section clearly with timing and teacher instructions.`
  },
  worksheet: {
    title: '📝 Prompt — Fiche de travail',
    prompt: `Create a complete student worksheet for a [LEVEL] English class on the topic: [TOPIC].

Include the following exercise types:
1. VOCABULARY — Gap-fill exercise (10 sentences with missing words from a word bank)
2. GRAMMAR — Multiple choice exercise (8 questions testing the target grammar)
3. READING — A short text (150-200 words) followed by 5 comprehension questions
4. WRITING TASK — A guided writing activity (give a clear prompt and model answer structure)
5. BONUS — One creative challenge for fast finishers

Use clear instructions for each section. Provide an ANSWER KEY at the end.
Target level: [LEVEL]
Topic: [TOPIC]`
  },
  quiz: {
    title: '🎯 Prompt — Quiz interactif',
    prompt: `Create an interactive English quiz on [TOPIC] for [LEVEL] students.

Generate exactly 10 questions with the following format:

For each question:
- Question number and clear question text
- 4 answer options (A, B, C, D)
- The correct answer clearly marked
- A brief explanation of WHY that answer is correct (in simple English or French)

Question types to mix:
- Grammar (3 questions)
- Vocabulary (3 questions)
- Reading comprehension mini-text (2 questions)
- Functional language / real-life situations (2 questions)

Difficulty: [LEVEL]
Topic: [TOPIC]`
  },
  youtube: {
    title: '🎬 Prompt — Questions sur vidéo YouTube',
    prompt: `I will paste a YouTube video transcript below. Using this transcript, create a complete pedagogical package for [LEVEL] English learners:

1. PRE-WATCHING VOCABULARY (8 key terms from the video with definitions)
2. WHILE-WATCHING QUESTIONS (5 questions to answer during viewing)
3. COMPREHENSION QUESTIONS (8 questions to check understanding after watching)
4. DISCUSSION QUESTIONS (4 open-ended questions to spark conversation)
5. LANGUAGE FOCUS — Pick 3 interesting expressions/phrases from the transcript and explain their meaning and usage
6. FOLLOW-UP ACTIVITY — A short writing or speaking task related to the video topic

[PASTE TRANSCRIPT HERE]`
  }
};

document.querySelectorAll('.tool-prompt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key  = btn.dataset.tool;
    const data = teacherPrompts[key];
    toolModalTitle.textContent  = data.title;
    toolModalPrompt.textContent = data.prompt;
    toolModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

closeToolModal.addEventListener('click', () => {
  toolModal.classList.remove('open');
  document.body.style.overflow = '';
});
toolModal.addEventListener('click', e => {
  if (e.target === toolModal) {
    toolModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

copyToolPrompt.addEventListener('click', () => {
  navigator.clipboard.writeText(toolModalPrompt.textContent).then(() => showToast('✓ Prompt copié !'));
});


/* ══════════════════════════════════════════
   8. PLAN D'ÉTUDE PERSONNALISÉ
══════════════════════════════════════════ */
const generatePlan = document.getElementById('generatePlan');
const planResult   = document.getElementById('planResult');
const planLevel    = document.getElementById('planLevel');
const planGoal     = document.getElementById('planGoal');
const planTime     = document.getElementById('planTime');
const planWeakness = document.getElementById('planWeakness');

const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const activitiesByGoal = {
  'Conversations du quotidien': [
    ['Simulation de conversation (café, shopping)', 'Flashcards vocabulaire quotidien', 'Écoute active (podcast 5 min)'],
    ['Rôle-play : se présenter en anglais', 'Révision Anki — mots vus lundi', 'Dictée de mots courants'],
    ['Pratique vocale — décrire votre journée', 'Grammaire : present simple vs continuous', '5 phrases à mémoriser'],
    ['Simulation : téléphone en anglais', 'Flashcards expressions idiomatiques', 'Écriture : e-mail informel'],
    ['Prononciation — 10 mots difficiles', 'Quiz vocabulaire de la semaine', 'Conversation libre avec l\'IA'],
    ['Visionnage d\'une série (sous-titres EN)', 'Révision globale semaine', 'Objectif bonus : mini-journal en anglais'],
    ['Repos ou révision légère Anki', '', ''],
  ],
  'Anglais professionnel': [
    ['Vocabulaire professionnel — 10 mots', 'Simulation : présentation de projet', 'E-mail formel : demande de réunion'],
    ['Grammaire : conditionnels (If I were…)', 'Révision flashcards business', 'Pratique : répondre à un e-mail pro'],
    ['Simulation : entretien d\'embauche', 'Expressions for meetings (I\'d like to suggest…)', 'Correction de texte professionnel'],
    ['Vocabulaire RH & management', 'Rédaction : compte-rendu de réunion', 'Prononciation termes techniques'],
    ['Simulation : négociation commerciale', 'Quiz vocabulary business semaine', 'Présentation orale 2 minutes'],
    ['Podcast business en anglais (20 min)', 'Révision semaine + objectifs suivante', 'Écriture : LinkedIn post en anglais'],
    ['Repos ou Anki léger', '', ''],
  ],
  'Préparation examen (IELTS/TOEFL)': [
    ['Reading — 1 passage + questions', 'Vocabulaire académique (10 mots)', 'Grammaire : passive voice'],
    ['Listening — exercice officiel 20 min', 'Writing Task 1 — décrire un graphique', 'Révision Anki'],
    ['Speaking Part 1 — questions personnelles', 'Reading — skimming & scanning', 'Grammaire : relative clauses'],
    ['Writing Task 2 — essai argumentatif', 'Vocabulaire — synonymes avancés', 'Simulation interview IELTS'],
    ['Test blanc complet (2h)', 'Correction avec l\'IA', 'Analyse des erreurs'],
    ['Podcast académique TED Talk + résumé', 'Révision flashcards semaine', 'Practice speaking fluency'],
    ['Repos actif — lecture anglaise', '', ''],
  ],
  'Voyage': [
    ['Vocabulaire aéroport & transports', 'Simulation : enregistrement hôtel', 'Prononciation nombres & prix'],
    ['Simulation : au restaurant', 'Expressions pour demander son chemin', 'Flashcards pays & nationalités'],
    ['Grammaire : questions WH- (Where/How much…)', 'Simulation : urgence médicale', 'Vocabulaire shopping'],
    ['Simulation : visite touristique guidée', 'Expressions pour se plaindre poliment', 'Révision Anki vocab voyage'],
    ['Jeu de rôle : situations imprévues', 'Quiz vocabulaire semaine', 'Listening : annonces aéroport'],
    ['Série ou film en VO avec sous-titres', 'Révision globale', 'Planifier vrai voyage en anglais'],
    ['Repos ou révision légère', '', ''],
  ],
  'Grammaire & écrit': [
    ['Théorie : temps verbaux — présent', 'Exercices texte à trous (présent)', 'Correction de 5 phrases'],
    ['Théorie : past simple vs present perfect', 'Quiz grammaire (10 questions)', 'Flashcards règles grammaticales'],
    ['Rédaction : paragraphe descriptif', 'Correction avec l\'IA', 'Grammaire : articles (a/an/the)'],
    ['Théorie : conditionnels', 'Exercices conditionnels', 'Réécriture : améliorer un texte'],
    ['Ponctuation & connecteurs logiques', 'Rédaction : e-mail formel', 'Quiz semaine complet'],
    ['Correction stylistique d\'un texte long', 'Révision Anki règles', 'Production libre : histoire courte'],
    ['Repos ou lecture anglaise', '', ''],
  ],
};

generatePlan.addEventListener('click', () => {
  const level    = planLevel.value;
  const goal     = planGoal.value;
  const time     = planTime.value;
  const weakness = planWeakness.value.trim();

  generatePlan.innerHTML = '<span class="spinner"></span> Génération…';
  generatePlan.disabled  = true;

  setTimeout(() => {
    generatePlan.textContent = 'Générer mon plan ✦';
    generatePlan.disabled    = false;

    const activities = activitiesByGoal[goal] || activitiesByGoal['Conversations du quotidien'];

    let html = `<div class="week-plan">`;
    html += `<p style="font-size:0.78rem;color:var(--accent2);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;">
      ✦ Plan personnalisé — ${level} · ${goal} · ${time}/jour
    </p>`;

    if (weakness) {
      html += `<div style="background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:0.82rem;color:var(--text-muted);">
        🎯 Focus points faibles : <strong style="color:var(--text)">${weakness}</strong>
      </div>`;
    }

    weekDays.forEach((day, i) => {
      const tasks = activities[i] || [];
      const isRest = day === 'Dimanche';

      html += `<div class="day-row">
        <div class="day-row__header">
          <span class="day-row__name">${isRest ? '😴 ' : ''}${day}</span>
          <span class="day-row__time">${isRest ? 'Repos' : time}</span>
        </div>
        <div class="day-row__tasks">`;

      if (isRest) {
        html += `Repos ou révision légère avec Anki (10 min max)`;
      } else {
        tasks.filter(Boolean).forEach((t, ti) => {
          html += `<span style="color:var(--accent2);margin-right:6px;">${ti + 1}.</span>${t}<br/>`;
        });
      }

      html += `</div></div>`;
    });

    html += `</div>`;

    // Bouton copier le plan
    html += `<div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn btn--primary" id="copyPlan">📋 Copier le plan</button>
      <button class="btn btn--ghost" id="generateAnki">🃏 Générer prompt Anki</button>
    </div>`;

    planResult.innerHTML = html;
    planResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✓ Plan généré avec succès !');

    // Copier le plan
    document.getElementById('copyPlan').addEventListener('click', () => {
      const text = `Plan d'étude anglais — ${level} · ${goal} · ${time}/jour\n\n` +
        weekDays.map((day, i) => {
          const tasks = (activitiesByGoal[goal] || [])[i] || [];
          return `${day} :\n${tasks.filter(Boolean).map((t, ti) => `  ${ti + 1}. ${t}`).join('\n')}`;
        }).join('\n\n');
      navigator.clipboard.writeText(text).then(() => showToast('✓ Plan copié !'));
    });

    // Prompt Anki
    document.getElementById('generateAnki').addEventListener('click', () => {
      const ankiPrompt = `Generate 20 Anki flashcards for an English learner at ${level} level focusing on: ${goal}.
${weakness ? `Special focus on: ${weakness}` : ''}

Format each card as:
FRONT: [English word or expression]
BACK: [French translation + IPA phonetics + example sentence]

Make the cards suitable for spaced repetition review. Include a mix of vocabulary, grammar rules, and useful expressions.`;

      navigator.clipboard.writeText(ankiPrompt).then(() => showToast('✓ Prompt Anki copié !'));
    });

  }, 1800);
});


/* ══════════════════════════════════════════
   9. TOAST NOTIFICATION
══════════════════════════════════════════ */
function showToast(message, duration = 2500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}


/* ══════════════════════════════════════════
   10. ACTIVE NAV LINK — scroll spy
══════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--text)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => spyObserver.observe(s));


/* ══════════════════════════════════════════
   11. KEYBOARD SHORTCUTS
══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    simModal.classList.remove('open');
    toolModal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

console.log('%c EnglishAI 🚀 ', 'background:#6c63ff;color:#fff;font-size:16px;padding:6px 12px;border-radius:4px;font-weight:bold;');
console.log('%c Bienvenue sur EnglishAI — apprenez l\'anglais avec l\'IA ! ', 'color:#00e5ff;font-size:12px;');
