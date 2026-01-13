// Mock Patient Data Service - Carta d'Identità Farmacologica

export interface Paziente {
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  luogoNascita: string;
  indirizzo: string;
  telefono: string;
  email: string;
  peso: number;
  altezza: number;
  gruppoSanguigno: string;
}

export interface Caregiver {
  nome: string;
  cognome: string;
  relazione: string;
  telefono: string;
  email: string;
}

export interface Specialista {
  nome: string;
  cognome: string;
  specializzazione: string;
  ospedale: string;
  telefono: string;
  email: string;
}

export interface DiagnosiOncologica {
  tipo: string;
  datadiagnosi: string;
  stadio: string;
  istologia: string;
  note: string;
}

export interface Comorbidita {
  nome: string;
  annoInsorgenza: string;
  terapiaInCorso: string;
}

export interface Allergia {
  tipo: string;
  sostanza: string;
  reazione: string;
  gravita: "lieve" | "moderata" | "grave";
}

export interface TerapiaOncologica {
  farmaco: string;
  dosaggio: string;
  frequenza: string;
  somministrazione: "Orale" | "Endovena" | "Sottocute";
  dataInizio: string;
  dataFine?: string;
  note?: string;
}

export interface CartaIdentitaTerapeutica {
  versione: string;
  dataAggiornamento: string;
  paziente: Paziente;
  caregiver: Caregiver[];
  specialisti: Specialista[];
  diagnosiOncologica: DiagnosiOncologica;
  comorbidita: Comorbidita[];
  allergie: Allergia[];
  terapieOncologiche: TerapiaOncologica[];
  noteGenerali: string;
}

export const mockCartaTerapeutica: CartaIdentitaTerapeutica = {
  versione: "1.0",
  dataAggiornamento: "13-01-2025",
  paziente: {
    codiceFiscale: "RSSMRA75A01L736X",
    nome: "Mario",
    cognome: "Rossi",
    dataNascita: "01/01/1975",
    luogoNascita: "Venezia",
    indirizzo: "Via Roma 123, 35100 Padova (PD)",
    telefono: "+39 049 1234567",
    email: "mario.rossi@email.it",
    peso: 78,
    altezza: 175,
    gruppoSanguigno: "A+",
  },
  caregiver: [
    {
      nome: "Maria",
      cognome: "Rossi",
      relazione: "Moglie",
      telefono: "+39 049 7654321",
      email: "maria.rossi@email.it",
    },
    {
      nome: "Luca",
      cognome: "Rossi",
      relazione: "Figlio",
      telefono: "+39 340 1234567",
      email: "luca.rossi@email.it",
    },
  ],
  specialisti: [
    {
      nome: "Dr. Giuseppe",
      cognome: "Bianchi",
      specializzazione: "Oncologia Medica",
      ospedale: "IOV - Istituto Oncologico Veneto",
      telefono: "+39 049 821 2345",
      email: "g.bianchi@iov.it",
    },
    {
      nome: "Dr.ssa Anna",
      cognome: "Verdi",
      specializzazione: "Radioterapia",
      ospedale: "IOV - Istituto Oncologico Veneto",
      telefono: "+39 049 821 3456",
      email: "a.verdi@iov.it",
    },
    {
      nome: "Dr. Marco",
      cognome: "Neri",
      specializzazione: "Chirurgia Oncologica",
      ospedale: "Azienda Ospedaliera di Padova",
      telefono: "+39 049 821 4567",
      email: "m.neri@aopd.it",
    },
  ],
  diagnosiOncologica: {
    tipo: "Carcinoma polmonare non a piccole cellule (NSCLC)",
    datadiagnosi: "15/06/2024",
    stadio: "IIIA",
    istologia: "Adenocarcinoma",
    note: "Mutazione EGFR positiva (esone 19 delezione)",
  },
  comorbidita: [
    {
      nome: "Ipertensione arteriosa",
      annoInsorgenza: "2018",
      terapiaInCorso: "Ramipril 5mg/die",
    },
    {
      nome: "Diabete mellito tipo 2",
      annoInsorgenza: "2020",
      terapiaInCorso: "Metformina 1000mg x2/die",
    },
    {
      nome: "Dislipidemia",
      annoInsorgenza: "2019",
      terapiaInCorso: "Atorvastatina 20mg/die",
    },
  ],
  allergie: [
    {
      tipo: "Farmaco",
      sostanza: "Penicillina",
      reazione: "Orticaria, edema",
      gravita: "moderata",
    },
    {
      tipo: "Alimento",
      sostanza: "Crostacei",
      reazione: "Prurito, gonfiore labbra",
      gravita: "lieve",
    },
  ],
  terapieOncologiche: [
    {
      farmaco: "Osimertinib",
      dosaggio: "80mg",
      frequenza: "1 volta al giorno",
      somministrazione: "Orale",
      dataInizio: "01/07/2024",
      note: "Terapia target anti-EGFR",
    },
    {
      farmaco: "Pembrolizumab",
      dosaggio: "200mg",
      frequenza: "Ogni 3 settimane",
      somministrazione: "Endovena",
      dataInizio: "15/08/2024",
      note: "Somministrazione in day hospital",
    },
  ],
  noteGenerali:
    "Paziente in buone condizioni generali. Performance Status ECOG 1. Monitoraggio periodico con TC torace ogni 3 mesi. Prossimo controllo previsto: 15/04/2025.",
};

export const patientService = {
  getCartaTerapeutica: async (): Promise<CartaIdentitaTerapeutica> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCartaTerapeutica;
  },
};
