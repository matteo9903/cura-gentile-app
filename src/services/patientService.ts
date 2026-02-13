// Mock Patient Data Service - Carta d'Identità Farmacologica

export interface Paziente {
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataNascita: Date;
  indirizzo: string;
  telefono: string;
  peso: number;
  altezza: number;
  tesseraSanitaria: string;
}

export interface Caregiver {
  nome: string;
  cognome: string;
  telefono: string;
}

export interface Specialista {
  type: string;
  telefono: string;
}

export interface TerapiaOncologica {
  farmaco: string;
  somministrazione: string[];
  note: string;
}

export interface CartaIdentitaTerapeutica {
  dataAggiornamento: string;
  paziente: Paziente;
  caregiver: Caregiver[];
  specialisti: Specialista[];
  emergenza: EmergencyContact[];
  diagnosiOncologica: string;
  comorbidita: string[];
  allergie: string[];
  terapieOncologiche: TerapiaOncologica[];
}

export interface EmergencyContact {
  ente: string;
  telefono: string
}

export const mockCartaTerapeutica: CartaIdentitaTerapeutica = {
  dataAggiornamento: "13-01-2025",
  paziente: {
    codiceFiscale: "RSSMRA75A01L736X",
    nome: "Mario",
    cognome: "Rossi",
    dataNascita: new Date("1975-01-01"),
    indirizzo: "Via Roma 123, 35100 Padova (PD)",
    telefono: "+39 049 1234567",
    peso: 78,
    altezza: 175,
    tesseraSanitaria: "80012345678901234567"
  },
  caregiver: [
    {
      nome: "Maria",
      cognome: "Rossi",
      telefono: "+39 049 7654321",
    },
    {
      nome: "Luca",
      cognome: "Rossi",
      telefono: "+39 340 1234567",
    },
  ],
  specialisti: [
    {
      type: "Per urgenze",
      telefono: "+39 049 821 2345",
    },
  ],
  emergenza: [
    {
      ente: "Soccorso Pubblico",
      telefono: "113",
    },
    {
      ente: "N.U.E.",
      telefono: "112",
    },
    {
      ente: "Emergenza Sanitaria",
      telefono: "118",
    },
    {
      ente: "Guardia Medica",
      telefono: "116117",
    }
  ],
  diagnosiOncologica: "Carcinoma polmonare non a piccole cellule (NSCLC)",
  comorbidita: [
    'Ipertensione arteriosa',
    'Diabete mellito tipo 2'
  ],
  allergie: [
    'Penicillina',
    'Crostacei'
  ],
  terapieOncologiche: [
    {
      farmaco: "Osimertinib",
      somministrazione: ["orale", "endovena"],
      note: "Terapia target anti-EGFR",
    },
    {
      farmaco: "Pembrolizumab",
      somministrazione: ["endovena"],
      note: "Somministrazione in day hospital",
    },
  ],
};

export const patientService = {
  getCartaTerapeutica: async (): Promise<CartaIdentitaTerapeutica> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCartaTerapeutica;
  },
};
