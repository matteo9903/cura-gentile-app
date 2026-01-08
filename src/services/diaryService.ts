// ========================================
// Diary Service - Mock Data for Patient Diary
// ========================================

// Interfaces
export interface Farmaco {
  id: string;
  nome: string;
  principioAttivo: string;
  dosaggioMg: number; // Stored in mg
  unitaPerDose: number; // Displayed in units
  unitaFarmaco: string; // e.g. compressa, capsula, fiala
  orariAssunzione: string[];
  tipo: 'giornaliero' | 'ciclico';
  ciclo?: {
    giorniOn: number;
    giorniOff: number;
  };
  infoFarmaco: {
    posologia: string;
    modalitaAssunzione: string;
    manipolazione: string;
    immagine?: string;
    misureContraccettive: string;
    effettiCollaterali: string[];
    avvertenze: string;
  };
}

export interface AssunzioneGiornaliera {
  id: string;
  farmacoId: string;
  farmacoNome: string;
  dosaggio: number;
  unita: number;
  orario: string;
  data: string;
  stato: 'da_confermare' | 'confermata' | 'saltata';
  effettiCollaterali?: string;
  intensita?: 'bassa' | 'media' | 'alta';
  motivo?: string;
}

export interface GiornoCalendario {
  data: string;
  assunzioni: AssunzioneGiornaliera[];
  effettiCollaterali?: {
    id: string;
    descrizione: string;
    intensita: 'bassa' | 'media' | 'alta';
  }[];
}

export interface Questionario {
  id: string;
  titolo: string;
  descrizione: string;
  frequenza: string;
  stato: 'da_compilare' | 'compilato';
  domande: DomandaQuestionario[];
  dataCompilazione?: string;
}

export interface DomandaQuestionario {
  id: string;
  testo: string;
  tipo: 'scala' | 'testo' | 'scelta_multipla';
  opzioni?: string[];
  risposta?: string | number;
}

export interface CompilazioneQuestionario {
  id: string;
  questionarioId: string;
  titoloQuestionario: string;
  dataCompilazione: string;
  risposte: { domandaId: string; risposta: string | number }[];
}

export interface NotaAggiuntiva {
  id: string;
  data: string;
  contenuto: string;
}

export interface AltriFarmaci {
  id: string;
  nome: string;
  dosaggio: string;
}

export interface NoteStrutturate {
  altriFarmaci: AltriFarmaci[];
  domandeSpecialista: string;
}

export interface FAQ {
  id: string;
  domanda: string;
  risposta: string;
  categoria: string;
  immagine?: string;
  tipo: 'testo' | 'infografica';
}

export interface PianoTerapeutico {
  dataInizio: string;
  dataFine: string;
  durataTotale: number;
  farmaci: Farmaco[];
}

// Mock Data
const mockFarmaci: Farmaco[] = [
  {
    id: 'farmaco-a',
    nome: 'Capecitabina',
    principioAttivo: 'Capecitabina',
    dosaggioMg: 500,
    unitaPerDose: 2,
    unitaFarmaco: 'compressa',
    orariAssunzione: ['08:00', '20:00'],
    tipo: 'giornaliero',
    infoFarmaco: {
      posologia: 'Assumere 2 compresse (500mg ciascuna) due volte al giorno, a distanza di circa 12 ore.',
      modalitaAssunzione: 'Le compresse devono essere assunte entro 30 minuti dalla fine del pasto, con un bicchiere d\'acqua. Non masticare, non frantumare.',
      manipolazione: 'Non dividere o frantumare le compresse. In caso di contatto con la pelle, lavare immediatamente con acqua e sapone.',
      misureContraccettive: 'Durante il trattamento e per almeno 6 mesi dopo l\'ultima dose, utilizzare metodi contraccettivi efficaci. Il farmaco può causare danni al feto. Informare immediatamente il medico in caso di gravidanza sospetta o confermata.',
      effettiCollaterali: [
        'Sindrome mano-piede (arrossamento, gonfiore, dolore)',
        'Nausea e vomito',
        'Diarrea',
        'Stomatite',
        'Affaticamento'
      ],
      avvertenze: 'Evitare l\'esposizione prolungata al sole. Utilizzare creme idratanti per prevenire la sindrome mano-piede. Contattare il medico in caso di febbre superiore a 38°C.'
    }
  },
  {
    id: 'farmaco-b',
    nome: 'Lapatinib',
    principioAttivo: 'Lapatinib ditosylate',
    dosaggioMg: 250,
    unitaPerDose: 1,
    unitaFarmaco: 'compressa',
    orariAssunzione: ['15:00'],
    tipo: 'ciclico',
    ciclo: {
      giorniOn: 4,
      giorniOff: 3
    },
    infoFarmaco: {
      posologia: 'Assumere 1 compressa (250mg) una volta al giorno per 4 giorni consecutivi, seguiti da 3 giorni di pausa.',
      modalitaAssunzione: 'Assumere a stomaco vuoto, almeno 1 ora prima o dopo i pasti. Non assumere con pompelmo o succo di pompelmo.',
      manipolazione: 'Le compresse non devono essere divise o frantumate. Conservare a temperatura ambiente, lontano da luce e umidità.',
      misureContraccettive: 'È necessario utilizzare metodi contraccettivi efficaci durante tutto il trattamento e per almeno 5 giorni dopo l\'ultima dose. Il farmaco può ridurre l\'efficacia dei contraccettivi ormonali.',
      effettiCollaterali: [
        'Diarrea',
        'Eruzione cutanea',
        'Nausea',
        'Affaticamento',
        'Problemi epatici'
      ],
      avvertenze: 'Monitorare regolarmente la funzionalità epatica. Evitare interazioni con farmaci che influenzano il CYP3A4. Segnalare immediatamente sintomi di problemi cardiaci.'
    }
  }
];

const oggi = new Date();
const dataInizio = new Date(oggi);
dataInizio.setDate(oggi.getDate() - 5); // Started 5 days ago

const dataFine = new Date(dataInizio);
dataFine.setDate(dataInizio.getDate() + 27); // 28 days total

const mockPianoTerapeutico: PianoTerapeutico = {
  dataInizio: dataInizio.toISOString().split('T')[0],
  dataFine: dataFine.toISOString().split('T')[0],
  durataTotale: 28,
  farmaci: mockFarmaci
};

const mockEffettiCollateraliCalendario: Record<number, { id: string; descrizione: string; intensita: 'bassa' | 'media' | 'alta'; }[]> = {
  1: [
    { id: 'eff-1', descrizione: 'Nausea leggera durata tutta la mattina, migliorata dopo il pranzo.', intensita: 'bassa' }
  ],
  3: [
    { id: 'eff-2', descrizione: 'Arrossamento alle mani con lieve bruciore.', intensita: 'media' }
  ],
  4: [
    { id: 'eff-3', descrizione: 'Diarrea episodica con crampi addominali.', intensita: 'alta' }
  ]
};

// Generate calendar days
function generateCalendario(): GiornoCalendario[] {
  const giorni: GiornoCalendario[] = [];
  const start = new Date(mockPianoTerapeutico.dataInizio);
  
  for (let i = 0; i < 28; i++) {
    const data = new Date(start);
    data.setDate(start.getDate() + i);
    const dataStr = data.toISOString().split('T')[0];
    
    const assunzioni: AssunzioneGiornaliera[] = [];
    
    // Drug A - daily, twice a day
    mockFarmaci[0].orariAssunzione.forEach((orario, idx) => {
      const isPast = data < oggi || (data.toDateString() === oggi.toDateString() && parseInt(orario) < oggi.getHours());
      const leaveUnmarked = isPast && i < 5 && Math.random() < 0.25;
      const statoAssunzione = leaveUnmarked
        ? 'da_confermare'
        : (isPast && i < 5 ? (Math.random() > 0.2 ? 'confermata' : 'saltata') : 'da_confermare');
      assunzioni.push({
        id: `${dataStr}-a-${idx}`,
        farmacoId: 'farmaco-a',
        farmacoNome: mockFarmaci[0].nome,
        dosaggio: mockFarmaci[0].dosaggioMg,
        unita: mockFarmaci[0].unitaPerDose,
        orario,
        data: dataStr,
        stato: statoAssunzione
      });
    });
    
    // Drug B - cyclic (4 on / 3 off)
    const cycleDay = i % 7;
    if (cycleDay < 4) {
      const orario = mockFarmaci[1].orariAssunzione[0];
      const isPast = data < oggi || (data.toDateString() === oggi.toDateString() && parseInt(orario) < oggi.getHours());
      const leaveUnmarked = isPast && i < 5 && Math.random() < 0.2;
      const statoAssunzione = leaveUnmarked
        ? 'da_confermare'
        : (isPast && i < 5 ? (Math.random() > 0.3 ? 'confermata' : 'saltata') : 'da_confermare');
      assunzioni.push({
        id: `${dataStr}-b-0`,
        farmacoId: 'farmaco-b',
        farmacoNome: mockFarmaci[1].nome,
        dosaggio: mockFarmaci[1].dosaggioMg,
        unita: mockFarmaci[1].unitaPerDose,
        orario,
        data: dataStr,
        stato: statoAssunzione
      });
    }
    
    const effettiDelGiorno = data < oggi ? mockEffettiCollateraliCalendario[i] : undefined;
    giorni.push({ data: dataStr, assunzioni, effettiCollaterali: effettiDelGiorno });
  }
  
  return giorni;
}

const mockQuestionari: Questionario[] = [
  {
    id: 'q1',
    titolo: 'Qualità della Vita',
    descrizione: 'Valutazione del benessere generale e della qualità della vita durante il trattamento',
    frequenza: '3 mesi',
    stato: 'da_compilare',
    domande: [
      { id: 'd1', testo: 'Come valuta il suo stato di salute generale nell\'ultima settimana?', tipo: 'scala' },
      { id: 'd2', testo: 'Ha avuto difficoltà nello svolgere le attività quotidiane?', tipo: 'scelta_multipla', opzioni: ['Mai', 'Raramente', 'A volte', 'Spesso', 'Sempre'] },
      { id: 'd3', testo: 'Come descriverebbe il suo livello di energia?', tipo: 'scala' },
      { id: 'd4', testo: 'Ha avuto problemi di sonno?', tipo: 'scelta_multipla', opzioni: ['Mai', 'Raramente', 'A volte', 'Spesso', 'Sempre'] },
      { id: 'd5', testo: 'Note aggiuntive sulla sua qualità di vita:', tipo: 'testo' }
    ]
  },
  {
    id: 'q2',
    titolo: 'Effetti Collaterali',
    descrizione: 'Monitoraggio degli effetti collaterali della terapia oncologica',
    frequenza: '1 mese',
    stato: 'da_compilare',
    domande: [
      { id: 'd1', testo: 'Ha sperimentato nausea nell\'ultima settimana?', tipo: 'scala' },
      { id: 'd2', testo: 'Ha avuto episodi di vomito?', tipo: 'scelta_multipla', opzioni: ['Mai', '1-2 volte', '3-5 volte', 'Più di 5 volte'] },
      { id: 'd3', testo: 'Ha notato cambiamenti nella pelle (arrossamenti, secchezza)?', tipo: 'scelta_multipla', opzioni: ['No', 'Lievi', 'Moderati', 'Gravi'] },
      { id: 'd4', testo: 'Descriva altri effetti collaterali riscontrati:', tipo: 'testo' }
    ]
  },
  {
    id: 'q3',
    titolo: 'Stato Emotivo',
    descrizione: 'Valutazione del benessere psicologico e supporto emotivo',
    frequenza: '6 mesi',
    stato: 'compilato',
    dataCompilazione: new Date(oggi.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    domande: [
      { id: 'd1', testo: 'Come si sente emotivamente in questo periodo?', tipo: 'scala' },
      { id: 'd2', testo: 'Ha avuto momenti di ansia o preoccupazione?', tipo: 'scelta_multipla', opzioni: ['Mai', 'Raramente', 'A volte', 'Spesso', 'Sempre'] },
      { id: 'd3', testo: 'Si sente supportato dalla famiglia e dagli amici?', tipo: 'scala' }
    ]
  }
];

const mockCompilazioniPrecedenti: CompilazioneQuestionario[] = [
  {
    id: 'comp1',
    questionarioId: 'q3',
    titoloQuestionario: 'Stato Emotivo',
    dataCompilazione: new Date(oggi.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    risposte: [
      { domandaId: 'd1', risposta: 7 },
      { domandaId: 'd2', risposta: 'A volte' },
      { domandaId: 'd3', risposta: 9 }
    ]
  },
  {
    id: 'comp2',
    questionarioId: 'q1',
    titoloQuestionario: 'Qualità della Vita',
    dataCompilazione: new Date(oggi.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    risposte: [
      { domandaId: 'd1', risposta: 6 },
      { domandaId: 'd2', risposta: 'Raramente' },
      { domandaId: 'd3', risposta: 5 },
      { domandaId: 'd4', risposta: 'A volte' },
      { domandaId: 'd5', risposta: 'Mi sento abbastanza bene nonostante il trattamento.' }
    ]
  }
];

const mockNote: NotaAggiuntiva[] = [
  {
    id: 'nota1',
    data: new Date(oggi.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contenuto: 'Leggero mal di testa nel pomeriggio, risolto con riposo.'
  }
];

// Structured notes
let noteStrutturate: NoteStrutturate = {
  altriFarmaci: [
    { id: 'af1', nome: 'Paracetamolo', dosaggio: '500mg al bisogno' }
  ],
  domandeSpecialista: ''
};

// FAQ Pool
const mockFAQPool: FAQ[] = [
  {
    id: 'faq1',
    domanda: 'Cosa devo fare se dimentico di prendere una dose?',
    risposta: 'Se dimentica una dose, la prenda non appena se ne ricorda, a meno che non sia quasi ora della dose successiva. In tal caso, salti la dose dimenticata e continui con l\'orario normale. Non prenda mai una dose doppia.',
    categoria: 'Assunzione',
    tipo: 'testo'
  },
  {
    id: 'faq2',
    domanda: 'Posso assumere altri farmaci durante la terapia?',
    risposta: 'Prima di assumere qualsiasi altro farmaco, anche da banco o integratori, consulti sempre il suo oncologo o farmacista. Alcune interazioni potrebbero essere pericolose.',
    categoria: 'Interazioni',
    tipo: 'testo'
  },
  {
    id: 'faq3',
    domanda: 'Quali effetti collaterali devo segnalare immediatamente?',
    risposta: 'Contatti immediatamente il medico in caso di: febbre superiore a 38°C, sanguinamento insolito, difficoltà respiratorie, dolore toracico, o qualsiasi sintomo grave o inaspettato.',
    categoria: 'Effetti collaterali',
    tipo: 'testo'
  },
  {
    id: 'faq4',
    domanda: 'Come conservo i farmaci?',
    risposta: 'Conservi i farmaci a temperatura ambiente, lontano da luce diretta e umidità. Tenga i farmaci fuori dalla portata dei bambini. Verifichi sempre la data di scadenza.',
    categoria: 'Conservazione',
    tipo: 'testo'
  },
  {
    id: 'faq5',
    domanda: 'Cosa fare in caso di nausea?',
    risposta: 'In caso di nausea, può essere utile mangiare piccoli pasti frequenti, evitare cibi grassi o piccanti, e bere liquidi a piccoli sorsi. Se la nausea persiste, contatti il suo medico.',
    categoria: 'Effetti collaterali',
    tipo: 'testo',
    immagine: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400'
  },
  {
    id: 'faq6',
    domanda: 'Come gestire la stanchezza?',
    risposta: 'La stanchezza è un effetto comune. Pianifichi le attività nei momenti di maggiore energia, faccia pause regolari e non esiti a chiedere aiuto. Un\'attività fisica leggera può aiutare.',
    categoria: 'Benessere',
    tipo: 'infografica',
    immagine: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
  },
  {
    id: 'faq7',
    domanda: 'Alimentazione durante la terapia',
    risposta: 'Mantenere una dieta equilibrata è importante. Preferisca cibi freschi, frutta e verdura. Eviti alcol e limiti i cibi processati. Beva almeno 2 litri di acqua al giorno.',
    categoria: 'Alimentazione',
    tipo: 'infografica',
    immagine: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400'
  },
  {
    id: 'faq8',
    domanda: 'Quando chiamare il medico?',
    risposta: 'Chiami subito il medico se: febbre >38°C, difficoltà respiratorie, sanguinamento anomalo, forte dolore, sintomi neurologici, reazioni allergiche gravi.',
    categoria: 'Emergenze',
    tipo: 'testo'
  }
];

// State for mutable data
let calendario = generateCalendario();
let note = [...mockNote];
let questionari = [...mockQuestionari];
let compilazioni = [...mockCompilazioniPrecedenti];

// Service
export const diaryService = {
  // Piano Terapeutico
  getPianoTerapeutico: async (): Promise<PianoTerapeutico> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPianoTerapeutico;
  },

  // Assunzioni di oggi
  getAssunzioniOggi: async (): Promise<AssunzioneGiornaliera[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const oggiStr = oggi.toISOString().split('T')[0];
    const giorno = calendario.find(g => g.data === oggiStr);
    return giorno?.assunzioni || [];
  },

  // Conferma assunzione with optional side effects
  confermaAssunzione: async (id: string, effettiCollaterali?: string, intensita?: 'bassa' | 'media' | 'alta'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    calendario = calendario.map(giorno => ({
      ...giorno,
      assunzioni: giorno.assunzioni.map(a => 
        a.id === id ? { ...a, stato: 'confermata' as const, effettiCollaterali, intensita } : a
      )
    }));
  },

  // Salta assunzione con effetti collaterali e motivo
  saltaAssunzione: async (id: string, effettiCollaterali: string, intensita: 'bassa' | 'media' | 'alta', motivo?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    calendario = calendario.map(giorno => ({
      ...giorno,
      assunzioni: giorno.assunzioni.map(a => 
        a.id === id ? { ...a, stato: 'saltata' as const, effettiCollaterali, intensita, motivo } : a
      )
    }));
  },

  // Calendario completo
  getCalendario: async (): Promise<GiornoCalendario[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return calendario;
  },

  // Questionari
  getQuestionari: async (): Promise<Questionario[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return questionari;
  },

  // Compila questionario
  compilaQuestionario: async (questionarioId: string, risposte: { domandaId: string; risposta: string | number }[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const q = questionari.find(q => q.id === questionarioId);
    if (q) {
      q.stato = 'compilato';
      q.dataCompilazione = oggi.toISOString().split('T')[0];
      
      compilazioni.push({
        id: `comp-${Date.now()}`,
        questionarioId,
        titoloQuestionario: q.titolo,
        dataCompilazione: oggi.toISOString().split('T')[0],
        risposte
      });
    }
  },

  // Compilazioni precedenti
  getCompilazioniPrecedenti: async (): Promise<CompilazioneQuestionario[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return compilazioni;
  },

  // Note aggiuntive (legacy)
  getNote: async (): Promise<NotaAggiuntiva[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return note;
  },

  // Note strutturate
  getNoteStrutturate: async (): Promise<NoteStrutturate> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return noteStrutturate;
  },

  // Aggiungi farmaco aggiuntivo
  aggiungiFarmacoAggiuntivo: async (nome: string, dosaggio: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    noteStrutturate.altriFarmaci.push({
      id: `af-${Date.now()}`,
      nome,
      dosaggio
    });
  },

  // Rimuovi farmaco aggiuntivo
  rimuoviFarmacoAggiuntivo: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    noteStrutturate.altriFarmaci = noteStrutturate.altriFarmaci.filter(f => f.id !== id);
  },

  // Aggiorna domande specialista
  aggiornaDomandeSpecialista: async (domande: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    noteStrutturate.domandeSpecialista = domande;
  },

  // Aggiungi nota (legacy)
  aggiungiNota: async (contenuto: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    note.push({
      id: `nota-${Date.now()}`,
      data: oggi.toISOString().split('T')[0],
      contenuto
    });
  },

  // FAQ - Get highlighted FAQs (random selection)
  getHighlightedFAQ: async (): Promise<FAQ[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Shuffle and take first 5-6
    const shuffled = [...mockFAQPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  },

  // FAQ - Get all FAQs
  getAllFAQ: async (): Promise<FAQ[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockFAQPool;
  },

  // Legacy FAQ
  getFAQ: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockFAQPool.map(f => ({ domanda: f.domanda, risposta: f.risposta }));
  }
};

export default diaryService;
