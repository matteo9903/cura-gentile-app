// Mock Chat Service - Chatbot Iris

export interface ChatMessage {
  id: string;
  content: string;
  role: "assistant" | "user";
  timestamp: Date;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    content: "Ciao! Sono Iris, la tua assistente virtuale dell'IOV. Come posso aiutarti oggi?",
    role: "assistant",
    timestamp: new Date(Date.now() - 3600000),
  },
];

const OLDER_MESSAGES: ChatMessage[] = [
  {
    id: "old-5",
    content: "Ricorda di portare con te la Carta d'Identità Farmacologica ad ogni visita medica.",
    role: "assistant",
    timestamp: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "old-4",
    content: "Grazie per l'informazione!",
    role: "user",
    timestamp: new Date(Date.now() - 86400000 * 3 + 60000),
  },
  {
    id: "old-3",
    content: "Come posso prepararmi per la chemioterapia?",
    role: "user",
    timestamp: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "old-2",
    content: "Ecco alcuni consigli per prepararti alla chemioterapia:\n\n• Riposa bene la notte prima\n• Fai un pasto leggero qualche ora prima\n• Indossa abiti comodi\n• Porta qualcosa per intrattenerti\n• Bevi molta acqua",
    role: "assistant",
    timestamp: new Date(Date.now() - 86400000 * 2 + 60000),
  },
  {
    id: "old-1",
    content: "Quali sono gli effetti collaterali più comuni?",
    role: "user",
    timestamp: new Date(Date.now() - 86400000),
  },
];

const ASSISTANT_RESPONSES = [
  "Capisco la tua domanda. Posso suggerirti di contattare il tuo medico oncologo per una risposta più precisa.",
  "Grazie per avermi contattato. L'IOV è sempre a disposizione per supportarti nel tuo percorso di cura.",
  "È importante seguire sempre le indicazioni del tuo team medico. Hai altre domande?",
  "Posso aiutarti a trovare informazioni sui tuoi farmaci nella Carta d'Identità Farmacologica.",
  "Ricorda che puoi sempre consultare la sezione 'Istruzioni per lo Specialista' nella tua Carta d'Identità.",
  "Se hai effetti collaterali preoccupanti, ti consiglio di contattare subito il tuo medico.",
];

let messageIdCounter = 100;

export const chatService = {
  getInitialMessages: async (): Promise<ChatMessage[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...INITIAL_MESSAGES];
  },

  loadOlderMessages: async (): Promise<ChatMessage[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...OLDER_MESSAGES];
  },

  sendMessage: async (content: string): Promise<ChatMessage> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const randomResponse =
      ASSISTANT_RESPONSES[Math.floor(Math.random() * ASSISTANT_RESPONSES.length)];

    return {
      id: `msg-${++messageIdCounter}`,
      content: randomResponse,
      role: "assistant",
      timestamp: new Date(),
    };
  },

  getChatbotInfo: () => ({
    nome: "Iris",
    descrizione: "Assistente Virtuale IOV",
    funzionalita: [
      {
        titolo: "Informazioni sui Farmaci",
        descrizione:
          "Posso fornirti informazioni sui tuoi farmaci oncologici, inclusi dosaggi e possibili effetti collaterali.",
      },
      {
        titolo: "Promemoria Appuntamenti",
        descrizione:
          "Ti ricordo i tuoi appuntamenti medici e ti aiuto a prepararti per le visite.",
      },
      {
        titolo: "Supporto Emotivo",
        descrizione:
          "Sono qui per ascoltarti e fornirti supporto durante il tuo percorso di cura.",
      },
      {
        titolo: "FAQ e Risorse",
        descrizione:
          "Posso rispondere alle domande frequenti e indirizzarti verso risorse utili.",
      },
      {
        titolo: "Contatti di Emergenza",
        descrizione:
          "Ti fornisco rapidamente i contatti del tuo team medico in caso di necessità.",
      },
    ],
    disclaimer:
      "Le informazioni fornite da Iris sono a scopo informativo e non sostituiscono il parere medico. Per qualsiasi dubbio sulla tua salute, contatta sempre il tuo medico.",
  }),
};
