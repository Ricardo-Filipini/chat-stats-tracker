export interface Message {
  date: Date;
  sender: string;
  content: string;
}

export interface MessageStats {
  totalMessages: number;
  messagesPerDay: { [date: string]: number };
  messagesPerPerson: { [sender: string]: number };
  messagesPerHour: { [hour: number]: string[] };
  dailyRecordPerPerson: { [sender: string]: { date: string; count: number } };
  hourlyRecordPerPerson: { [sender: string]: { date: string; hour: number; count: number } };
  busiestDay: { date: string; count: number; topics: string[] };
}

const phoneToName: { [phone: string]: string } = {
  "+55 61 8647-3050": ".",
  "+55 31 9760-5138": "Denise",
  "+55 61 9614-8055": "HF",
  "+55 85 8655-2580": "Luana Batista",
  "+55 85 8708-1036": "Thiago Tomaz",
  "+55 61 8153-8083": ". .",
  "+55 21 97552-1916": "~ 🥶🧿",
  "+55 71 8768-4336": "AD",
  "+55 61 8160-3232": "Aldo",
  "+55 61 8628-3622": "Alex Saraiva",
  "+55 28 99962-9906": "Alimentech Consultoria",
  "+55 61 9177-6614": "ALISON",
  "+55 61 8310-9744": "Amadeus",
  "+55 61 8282-2558": "Amélia O.",
  "+55 21 99876-1988": "Ana Carolina Damasceno",
  "+55 11 98704-6338": "Anderson",
  "+55 21 97273-9560": "André",
  "+55 21 98847-1138": "André Coletti",
  "+55 61 9855-9740": "Antonio Lucas",
  "+55 12 99147-4611": "Arthur",
  "+55 81 9870-3588": "Artur Aquino",
  "+55 61 9696-0557": "Bernardo",
  "+55 15 99779-5279": "Bleider Santos",
  "+55 71 8767-9811": "Bruna",
  "+55 61 9922-2608": "Bruno",
  "+55 61 9642-7855": "Bruno de Castro",
  "+55 21 99267-6368": "Caio Brandão",
  "+55 85 9700-8704": "Ciro Teixeira",
  "+55 85 8878-1450": "Clara",
  "+55 21 98145-7144": "Daniel Schneider",
  "+55 61 9124-5056": "Danilo",
  "+55 82 9906-0147": "Danilo Fernandes",
  "+55 22 99716-5042": "Davi Martins",
  "+55 73 8898-4589": "David Bezerra",
  "+55 51 8170-7617": "Denis",
  "+55 21 98665-1530": "Diego Maia",
  "+55 61 8289-2627": "Edmar Fagundes Jr",
  "+55 41 8709-1144": "Edson Perroni",
  "+55 51 9718-7218": "Eduardo F",
  "+55 31 9138-3427": "Ercilio Moreira",
  "+55 86 9917-8138": "euclydesmelo",
  "+55 62 8646-2030": "Fabiano Oliveira",
  "+55 61 9801-8703": "Fabio Tepedino",
  "+55 61 9246-2987": "Fabrício Marques",
  "+55 61 8185-8383": "Felipe Carolino",
  "+55 81 9667-7744": "Felipe Freire",
  "+55 51 9866-8060": "Felipe Gomes",
  "+55 27 99226-7517": "Fernando",
  "+55 85 9762-0513": "Fernando FV",
  "+55 27 99945-4687": "fernando joar",
  "+55 27 99825-2609": "Filipe Nalon",
  "+55 21 99765-7445": "Fonseca",
  "+55 31 9917-8654": "Frederico Augusto",
  "+55 98 9135-8810": "Gabriel Alves Ribeiro",
  "+55 61 8355-3654": "Gabriel Bocorny",
  "+55 32 9989-2092": "Gabriel Dilly",
  "+55 61 8130-5040": "Gabriel Tibúrcio",
  "+55 31 9777-4953": "gabriela",
  "+55 61 9565-7199": "Galdencio",
  "+55 31 8809-6030": "Genesis Campos",
  "+55 71 8952-4723": "Gleidson",
  "+55 12 99699-1348": "Guilherme de Sousa",
  "+55 21 99711-1390": "Guilherme Freitas",
  "+55 61 9825-2536": "Guilherme Villote",
  "+55 61 8210-8464": "Gustavo",
  "+55 14 98122-9393": "Gustavo Parra",
  "+55 41 9687-6886": "Henrique Felix",
  "+55 31 9955-6217": "Henrique Rocha",
  "+55 51 8400-1885": "Henrique Schneider",
  "+55 11 97622-2347": "Henrique Vinhais",
  "+55 61 9135-6590": "Hiago Gomes",
  "+55 31 9779-7381": "Hugo",
  "+55 21 99553-6256": "Isadora Bonitz",
  "+55 31 9332-3481": "Ivan Cruz",
  "+55 41 9117-8964": "Jacqueline Karla Alves",
  "+55 61 8278-7853": "Jailson",
  "+55 27 99511-2881": "Jairo Guimarães",
  "+55 61 8564-1572": "Janaelson",
  "+55 61 9690-6118": "Jefferson",
  "+55 61 8508-3003": "Jéssica",
  "+55 31 8984-0020": "João H V Stoppa",
  "+55 14 98106-2771": "João Marcos",
  "+55 62 8191-6067": "João Paulo Lima Gomes",
  "+55 18 99749-1856": "João Pedro Sussel",
  "+55 82 8123-5130": "Jose Augusto Silva",
  "+55 61 9667-7866": "Joshua",
  "+55 11 98361-4511": "Leonardo",
  "+55 62 9216-1412": "Leonardo Mendes",
  "+55 32 8419-7980": "Leonardo Reis",
  "+55 61 9977-9965": "Letícia",
  "+55 61 9609-9990": "Lígia Louzada",
  "+55 81 9998-0883": "Luana Coelho",
  "+55 61 9999-9027": "Lucas",
  "+55 61 9555-0292": "Lucas Andrade",
  "+55 81 9468-9228": "Lucas Araújo",
  "+55 81 9242-0726": "Lucas Melo",
  "+55 81 9322-2267": "Lucas Rufino",
  "+55 31 8499-8343": "Luciana",
  "+55 51 9947-0068": "Marcelo",
  "+55 21 99002-1033": "Marcelo",
  "+55 11 99464-6488": "Marcelo Avila",
  "+55 31 9355-5152": "Marcelo Mascarenhas",
  "+55 31 8718-9665": "Marco",
  "+55 27 99844-8868": "Marco Antonio Oliari",
  "+55 38 9117-7149": "Marcos Andrade",
  "+55 61 8177-3098": "Marcos Figueiredo",
  "+55 61 8261-5887": "Marcus Vinicius",
  "+55 61 9977-8407": "Maria Luísa",
  "+55 61 9905-1219": "Maria Luísa",
  "+55 21 99438-7711": "Matheus",
  "+55 19 99388-2896": "Matheus",
  "+55 21 98738-5218": "Matheus",
  "+55 11 95500-2579": "MP",
  "+55 19 98447-4974": "Natan",
  "+55 14 99633-6130": "Nathan",
  "+55 47 9609-4861": "Nestor Wendt",
  "+55 61 9271-8458": "Orlando Resende",
  "+55 31 9353-3185": "Paolo Lorran",
  "+55 75 9176-9881": "Patrick Borges",
  "+55 61 8604-4134": "Pedro",
  "+55 61 9353-6367": "Pedro Brussi",
  "+55 75 9152-5676": "Plinio Passos",
  "+55 84 8748-3128": "PS",
  "+55 81 8896-9076": "R",
  "+55 11 98487-8090": "Rafa ~",
  "+55 91 8706-3910": "Rafael",
  "+55 65 8170-7732": "Rafael Cardoso",
  "+55 61 9154-8457": "Rafael PL",
  "+55 61 9922-1144": "Rodrigo Figueiredo",
  "+55 19 99287-2534": "Rodrigo Fonseca",
  "+55 21 98219-7986": "Ryan",
  "+55 61 8187-5075": "Sandra",
  "+55 71 9958-0897": "Sergio",
  "+55 31 9731-9999": "Sérgio Tirso",
  "+55 35 8708-2628": "Talles",
  "+55 61 9262-0976": "Tayná Fischer",
  "+55 61 9254-0202": "Thais Crhistine",
  "+55 61 8182-5854": "Thiago",
  "+55 85 8860-8819": "Thiago Fiche",
  "+55 46 9924-1518": "Thiago Melara Adames",
  "+55 85 9747-0385": "Thomas",
  "+55 21 98863-4575": "Tiago Ferreira",
  "+55 61 9190-1101": "Tiago.tsc",
  "+55 81 9838-7682": "Ubiracy Junior",
  "+55 81 9528-7509": "Ubiracy Junior",
  "+55 85 9982-0634": "Vagner",
  "+55 27 98138-5395": "Vi.",
  "+55 81 9999-6265": "Victor Bruno",
  "+55 84 9940-9216": "Victor Costa Medeiros",
  "+55 61 9108-2968": "Vinícius Coelho",
  "+55 33 9147-7850": "Vinicius Mendes",
  "+55 71 9910-4115": "Vinicius Ribeiro",
  "+55 21 97351-6112": "Wil",
  "+55 19 98130-7838": "Willian",
  "+55 61 8241-7231": "Wladmir",
  "+55 11 96266-5954": "Yago",
  "+55 12 98105-9334": "Yuri Torres",
  "+55 79 8833-3057": "Yvson",
  "+55 51 9936-8965": "Desconhecido",
  "+55 81 9277-8832": "Desconhecido",
  "+55 61 8218-1850": "Rafael",
  "+55 61 8282-4115": "Rafael L.",
};

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function getNameFromPhone(phone: string): string {
  const normalized = `+${normalizePhone(phone)}`;
  for (const [key, value] of Object.entries(phoneToName)) {
    if (normalizePhone(key) === normalizePhone(phone)) {
      return value;
    }
  }
  return phone;
}

export function parseWhatsAppChat(content: string): Message[] {
  const messages: Message[] = [];
  const lines = content.split('\n');
  
  // Padrões aceitos:
  // 1) 11/11/2025 06:48 - Nome: Mensagem
  // 2) [11/11/2025, 06:48] Nome: Mensagem
  const patternA = /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/;
  const patternB = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/;
  
  let currentMessage: Message | null = null;
  
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    let match = line.match(patternA);
    let format: 'A' | 'B' | null = null;

    if (match) {
      format = 'A';
    } else {
      const m2 = line.match(patternB);
      if (m2) {
        match = m2;
        format = 'B';
      }
    }
    
    if (match && format) {
      // Fecha mensagem anterior
      if (currentMessage) messages.push(currentMessage);

      const [, dateStr, timeStr, sender, content] = match;
      const [day, month, y] = dateStr.split('/').map(Number);
      const year = y < 100 ? 2000 + y : y;
      const [hour, minute, second = 0] = timeStr.split(':').map(Number);
      
      const date = new Date(year, month - 1, day, hour, minute, second || 0);

      currentMessage = {
        date,
        sender: getNameFromPhone(sender.trim()),
        content: content.trim(),
      };
    } else if (currentMessage) {
      // Continuação de mensagem multilinha
      currentMessage.content += '\n' + line;
    }
  }

  if (currentMessage) messages.push(currentMessage);

  return messages;
}

export function calculateStats(messages: Message[]): MessageStats {
  const stats: MessageStats = {
    totalMessages: messages.length,
    messagesPerDay: {},
    messagesPerPerson: {},
    messagesPerHour: {},
    dailyRecordPerPerson: {},
    hourlyRecordPerPerson: {},
    busiestDay: { date: '', count: 0, topics: [] },
  };

  // Initialize hours
  for (let i = 0; i < 24; i++) {
    stats.messagesPerHour[i] = [];
  }

  const dailyMessages: { [date: string]: { count: number; byPerson: { [person: string]: number }; messages: Message[] } } = {};

  messages.forEach((msg) => {
    const year = msg.date.getFullYear();
    const month = String(msg.date.getMonth() + 1).padStart(2, '0');
    const day = String(msg.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`; // Usa data local, não UTC
    const hour = msg.date.getHours();
    
    // Debug: log algumas mensagens de nov/2025
    if (year === 2025 && month === '11' && (day === '10' || day === '11' || day === '12')) {
      console.log(`Mensagem: ${dateStr} ${hour}:${msg.date.getMinutes()} - ${msg.sender}: ${msg.content.substring(0, 30)}`);
    }

    // Messages per person
    stats.messagesPerPerson[msg.sender] = (stats.messagesPerPerson[msg.sender] || 0) + 1;

    // Messages per day
    stats.messagesPerDay[dateStr] = (stats.messagesPerDay[dateStr] || 0) + 1;

    // Messages per hour
    stats.messagesPerHour[hour].push(dateStr);

    // Daily tracking
    if (!dailyMessages[dateStr]) {
      dailyMessages[dateStr] = { count: 0, byPerson: {}, messages: [] };
    }
    dailyMessages[dateStr].count++;
    dailyMessages[dateStr].byPerson[msg.sender] = (dailyMessages[dateStr].byPerson[msg.sender] || 0) + 1;
    dailyMessages[dateStr].messages.push(msg);
  });

  // Daily records per person
  Object.entries(dailyMessages).forEach(([date, data]) => {
    Object.entries(data.byPerson).forEach(([person, count]) => {
      if (!stats.dailyRecordPerPerson[person] || count > stats.dailyRecordPerPerson[person].count) {
        stats.dailyRecordPerPerson[person] = { date, count };
      }
    });
  });

  // Hourly records per person
  const hourlyCount: { [key: string]: { [person: string]: number } } = {};
  
  messages.forEach((msg) => {
    const y = msg.date.getFullYear();
    const m = String(msg.date.getMonth() + 1).padStart(2, '0');
    const d = String(msg.date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`; // data local
    const hour = msg.date.getHours();
    const key = `${dateStr}-${hour}`;
    
    if (!hourlyCount[key]) hourlyCount[key] = {};
    hourlyCount[key][msg.sender] = (hourlyCount[key][msg.sender] || 0) + 1;
  });

  Object.entries(hourlyCount).forEach(([hourKey, persons]) => {
    Object.entries(persons).forEach(([person, count]) => {
      if (!stats.hourlyRecordPerPerson[person] || count > stats.hourlyRecordPerPerson[person].count) {
        const [d, h] = hourKey.split('-');
        stats.hourlyRecordPerPerson[person] = { date: d, hour: parseInt(h, 10), count };
      }
    });
  });

  // Busiest day with topics
  let busiestDate = '';
  let maxCount = 0;
  Object.entries(stats.messagesPerDay).forEach(([date, count]) => {
    if (count > maxCount) {
      maxCount = count;
      busiestDate = date;
    }
  });

  if (busiestDate && dailyMessages[busiestDate]) {
    const topics = dailyMessages[busiestDate].messages
      .map(m => m.content)
      .filter(c => c.length > 20 && c.length < 200)
      .slice(0, 5);
    
    stats.busiestDay = { date: busiestDate, count: maxCount, topics };
  }

  return stats;
}

export function extractFunnyMoments(messages: Message[]): Array<{ sender: string; content: string; date: Date }> {
  const keywords = ['kkk', 'haha', 'rsrs', 'lol', '😂', '🤣', '😆', 'mano', 'cara', 'hilário', 'engraçado'];
  
  return messages
    .filter(msg => 
      keywords.some(kw => msg.content.toLowerCase().includes(kw)) && 
      msg.content.length > 30 && 
      msg.content.length < 300
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
}
