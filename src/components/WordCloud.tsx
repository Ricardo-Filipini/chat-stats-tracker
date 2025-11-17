import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMemo } from 'react';

export interface Message {
  date: Date;
  content: string;
}

interface WordCloudProps {
  messages: Message[];
  filterType: 'all' | 'currentMonth';
  periods: string[]; // canonical keys: YYYY-MM (all) or YYYY-MM-DD (currentMonth)
  range: [number, number];
  dayRange: [number, number];
  onDayRangeChange: (range: [number, number]) => void;
}

const STOP_WORDS = new Set([
  // Artigos, preposições, conjunções
  'a','o','e','é','de','da','do','em','um','uma','os','as','para','por','com','no','na','dos','das','ao','à','pelo','pela','se','que','ou','mas','quando','já','só','mais','não','também','nem','pra','pro','duma','dum','numa','num','nessa','nesse','desta','deste','desta','nesta','neste','aquela','aquele','aquilo',
  
  // Pronomes
  'eu','tu','ele','ela','nós','vós','eles','elas','me','te','lhe','nos','vos','lhes','meu','minha','meus','minhas','teu','tua','teus','tuas','seu','sua','seus','suas','nosso','nossa','nossos','nossas','vosso','vossa','vossos','vossas','esse','essa','esses','essas','isso','este','esta','estes','estas','isto','aquele','aquela','aqueles','aquelas','aquilo','você','vocês','vc','vcs',
  
  // Verbos comuns
  'ser','estar','ter','haver','fazer','ir','vir','dar','poder','dever','querer','saber','ver','dizer','falar','achar','pedir','deixar','pegar','colocar','ficar','passar','chegar','sair','entrar','voltar','levar','trazer','começar','acabar','parar','continuar','seguir','conseguir','tentar','precisar','gostar','adorar','amar','odiar','sentir','pensar','lembrar','esquecer','entender','conhecer','parecer','olhar','mostrar','usar','trabalhar','estudar','comprar','vender','comer','beber','dormir','acordar','abrir','fechar','subir','descer','correr','andar','sentar','levantar',
  
  // Formas verbais comuns
  'é','são','era','eram','será','serão','seja','sejam','foi','foram','sendo','sido','está','estão','estava','estavam','estará','estarão','esteja','estejam','esteve','estiveram','estando','estado','tem','têm','tinha','tinham','terá','terão','tenha','tenham','teve','tiveram','tendo','tido','há','havia','haviam','haverá','haverão','haja','hajam','houve','houveram','havendo','havido','faz','fazem','fazia','faziam','fará','farão','faça','façam','fez','fizeram','fazendo','feito','vai','vão','ia','iam','irá','irão','vá','vamos','indo','ido','vem','vêm','vinha','vinham','virá','virão','venha','venham','veio','vieram','vindo','vindo','dá','dão','dava','davam','dará','darão','dê','deem','deu','deram','dando','dado','pode','podem','podia','podiam','poderá','poderão','possa','possam','pôde','puderam','podendo','podido','deve','devem','devia','deviam','deverá','deverão','deva','devam','devendo','devido','quer','querem','queria','queriam','quererá','quererão','queira','queiram','quis','quiseram','querendo','querido','sabe','sabem','sabia','sabiam','saberá','saberão','saiba','saibam','soube','souberam','sabendo','sabido','vê','veem','via','viam','verá','verão','veja','vejam','viu','viram','vendo','visto','diz','dizem','dizia','diziam','dirá','dirão','diga','digam','disse','disseram','dizendo','dito','fala','falam','falava','falavam','falará','falarão','fale','falem','falou','falaram','falando','falado','acha','acham','achava','achavam','achará','acharão','ache','achem','achou','acharam','achando','achado','pede','pedem','pedia','pediam','pedirá','pedirão','peça','peçam','pediu','pediram','pedindo','pedido','deixa','deixam','deixava','deixavam','deixará','deixarão','deixe','deixem','deixou','deixaram','deixando','deixado','pega','pegam','pegava','pegavam','pegará','pegarão','pegue','peguem','pegou','pegaram','pegando','pegado','coloca','colocam','colocava','colocavam','colocará','colocarão','coloque','coloquem','colocou','colocaram','colocando','colocado','fica','ficam','ficava','ficavam','ficará','ficarão','fique','fiquem','ficou','ficaram','ficando','ficado','passa','passam','passava','passavam','passará','passarão','passe','passem','passou','passaram','passando','passado','chega','chegam','chegava','chegavam','chegará','chegarão','chegue','cheguem','chegou','chegaram','chegando','chegado','sai','saem','saía','saíam','sairá','sairão','saia','saiam','saiu','saíram','saindo','saído','entra','entram','entrava','entravam','entrará','entrarão','entre','entrem','entrou','entraram','entrando','entrado','volta','voltam','voltava','voltavam','voltará','voltarão','volte','voltem','voltou','voltaram','voltando','voltado',
  
  // Advérbios e palavras funcionais
  'muito','pouco','bem','mal','sempre','nunca','hoje','ontem','amanhã','agora','depois','antes','ainda','logo','cedo','tarde','aqui','aí','lá','ali','onde','longe','perto','dentro','fora','acima','abaixo','perto','junto','assim','só','apenas','talvez','quase','demais','bastante','meio','menos','melhor','pior','tanto','quanto','tão','sim','não','claro','certamente','realmente','verdadeiramente','totalmente','completamente',
  
  // Interrogativos e relativos
  'quem','qual','quais','quanto','quantos','quantas','como','onde','quando','porque','porquê','por que','porque',
  
  // Números e quantificadores
  'zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','cem','mil','milhão','primeiro','segundo','terceiro','último','algum','alguma','alguns','algumas','nenhum','nenhuma','todo','toda','todos','todas','outro','outra','outros','outras','mesmo','mesma','mesmos','mesmas','próprio','própria','vários','várias','certo','certa','pouco','pouca','poucos','poucas','muito','muita','muitos','muitas',
  
  // Palavras técnicas do WhatsApp
  'https','www','com','br','http','mídia','oculta','grupo','usando','link','entrou','saiu','mudou','adicionou','removeu','criou','mensagem','apagada','editada','anexo','imagem','vídeo','áudio','figurinha','contato','localização','documento',
  
  // Interjeições e expressões
  'ah','oh','oi','olá','tchau','obrigado','obrigada','desculpa','desculpe','parabéns','legal','nossa','cara','mano','tipo','né','então','enfim','aliás','inclusive','além','disso','porém','contudo','todavia','entretanto','portanto','logo','pois','senão',
  
  // Abreviações e gírias comuns
  'vc','vcs','tb','tbm','msg','blz','vlw','flw','tmj','slk','pq','oq','dps','hj','agr','msm','td','tá','tô','tava','tava','q','n','kk','kkk','rs','rsrs'
]);

// Função para verificar se uma palavra parece ser um verbo conjugado
const isLikelyVerb = (word: string): boolean => {
  // Gerúndios
  if (word.endsWith('ando') || word.endsWith('endo') || word.endsWith('indo')) return true;
  
  // Particípios
  if (word.endsWith('ado') || word.endsWith('ido')) return true;
  
  // Infinitivos
  if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) return true;
  
  // Conjugações comuns de presente
  if (word.endsWith('amos') || word.endsWith('emos') || word.endsWith('imos')) return true;
  if (word.endsWith('ava') || word.endsWith('ia')) return true;
  
  // Advérbios em -mente
  if (word.endsWith('mente')) return true;
  
  return false;
};

export function WordCloud({ messages, filterType, periods, range, dayRange, onDayRangeChange }: WordCloudProps) {
  const { words, label, availableDays } = useMemo(() => {
    if (!messages.length || !periods.length) return { words: [], label: '' };

    const [start, end] = range;
    const selected = new Set(periods.slice(Math.max(0, start), Math.min(end, periods.length - 1) + 1));

    // Get all days in the selected range
    const daysInRange: string[] = [];
    const filteredByRange = messages.filter((m) => {
      const y = m.date.getFullYear();
      const mm = String(m.date.getMonth() + 1).padStart(2, '0');
      const dd = String(m.date.getDate()).padStart(2, '0');
      const key = filterType === 'all' ? `${y}-${mm}` : `${y}-${mm}-${dd}`;
      if (selected.has(key)) {
        const dayKey = `${y}-${mm}-${dd}`;
        if (!daysInRange.includes(dayKey)) {
          daysInRange.push(dayKey);
        }
        return true;
      }
      return false;
    });

    // Filter by day range if available
    const [startDay, endDay] = dayRange;
    const selectedDays = daysInRange.slice(
      Math.max(0, startDay), 
      Math.min(endDay + 1, daysInRange.length)
    );
    const selectedDaysSet = new Set(selectedDays);
    
    const filtered = daysInRange.length > 0 
      ? filteredByRange.filter((m) => {
          const y = m.date.getFullYear();
          const mm = String(m.date.getMonth() + 1).padStart(2, '0');
          const dd = String(m.date.getDate()).padStart(2, '0');
          return selectedDaysSet.has(`${y}-${mm}-${dd}`);
        })
      : filteredByRange;

    const counts = new Map<string, number>();
    filtered.forEach((msg) => {
      const clean = msg.content
        .toLowerCase()
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/[^\wÀ-ÿ\s]/g, ' ')
        .trim();
      const tokens = clean.split(/\s+/);
      tokens.forEach((t) => {
        if (t.length >= 4 && !STOP_WORDS.has(t) && !isLikelyVerb(t)) {
          counts.set(t, (counts.get(t) || 0) + 1);
        }
      });
    });

    const list = Array.from(counts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 150);

    // Label do período
    const dayLabel = daysInRange.length > 0 && selectedDays.length > 0 ? (() => {
      if (selectedDays.length === 1) {
        const [yy, mm, dd] = selectedDays[0].split('-');
        return `${dd}/${mm}/${yy}`;
      } else {
        const [yy1, mm1, dd1] = selectedDays[0].split('-');
        const [yy2, mm2, dd2] = selectedDays[selectedDays.length - 1].split('-');
        return `${dd1}/${mm1}/${yy1} - ${dd2}/${mm2}/${yy2}`;
      }
    })() : '';

    return { words: list, label: dayLabel, availableDays: daysInRange };
  }, [messages, periods, range, filterType, dayRange]);

  if (!words.length) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-2 bg-gradient-accent bg-clip-text text-transparent">Nuvem de Palavras</h3>
        <p className="text-muted-foreground">Sem dados para o período selecionado.</p>
      </Card>
    );
  }

  const max = Math.max(...words.map((w) => w.count));
  const min = Math.min(...words.map((w) => w.count));
  
  // Escala de tamanho mais agressiva e proporcional à frequência
  const scale = (c: number) => {
    if (max === min) return 20;
    const t = (c - min) / (max - min);
    // Escala exponencial para maior variação
    const exp = Math.pow(t, 0.8);
    return Math.round(12 + exp * 60); // 12px a 72px (maior variação)
  };

  // Embaralha palavras completamente para misturar grandes e pequenas
  const shuffledWords = useMemo(() => {
    const sorted = [...words];
    // Fisher-Yates shuffle para embaralhamento completo
    for (let i = sorted.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    }
    return sorted;
  }, [words]);

  // Rotações variadas para melhor encaixe
  const getRotation = (index: number) => {
    // 60% horizontal, 40% vertical para melhor compactação
    const angles = [0, 0, 0, 0, 0, 0, 90, 90, 90, 90];
    return angles[index % angles.length];
  };

  const getColor = (index: number, count: number) => {
    // Paleta de cores vibrantes e variadas
    const colors = [
      'hsl(var(--primary))',        // Roxo
      'hsl(var(--accent))',          // Ciano
      'hsl(var(--chart-1))',         // Laranja
      'hsl(var(--chart-2))',         // Verde
      'hsl(var(--chart-4))',         // Amarelo
      'hsl(var(--chart-5))',         // Coral
      'hsl(var(--chart-3))',         // Azul escuro
      'hsl(var(--primary-glow))',    // Roxo claro
      'hsl(var(--accent-glow))',     // Ciano claro
      'hsl(280 80% 65%)',            // Magenta
      'hsl(340 75% 60%)',            // Rosa
      'hsl(160 70% 50%)',            // Verde água
      'hsl(45 85% 60%)',             // Dourado
      'hsl(200 75% 55%)',            // Azul céu
    ];
    
    // Distribui cores de forma variada, priorizando cores mais vibrantes para palavras mais frequentes
    const t = (count - min) / (max - min);
    const colorIndex = (index * 7 + Math.floor(t * 3)) % colors.length;
    return colors[colorIndex];
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">Nuvem de Palavras</h3>
        <p className="text-sm text-muted-foreground">Dia: <span className="text-foreground font-medium">{label}</span></p>
      </div>
      {availableDays.length > 1 && (
        <div className="mb-4 px-2">
          <Slider
            value={dayRange}
            onValueChange={(values) => onDayRangeChange(values as [number, number])}
            min={0}
            max={availableDays.length - 1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{availableDays[dayRange[0]]?.split('-').reverse().join('/')}</span>
            <span>{availableDays[dayRange[1]]?.split('-').reverse().join('/')}</span>
          </div>
        </div>
      )}
      <div className="relative min-h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-background/50 flex items-center justify-center p-6">
        <div className="flex flex-wrap justify-center items-center content-center gap-0 leading-tight max-w-full" style={{ lineHeight: 0.95 }}>
          {shuffledWords.map(({ word, count }, index) => (
            <span
              key={word}
              title={`${count} ocorrências`}
              className="select-none transition-all duration-300 hover:scale-110 hover:z-10 cursor-default inline-block whitespace-nowrap"
              style={{ 
                fontSize: `${scale(count)}px`, 
                color: getColor(index, count),
                transform: `rotate(${getRotation(index)}deg)`,
                fontWeight: count > (max + min) / 2 ? 800 : 600,
                opacity: 0.92,
                textShadow: '2px 2px 4px rgba(0,0,0,0.25)',
                padding: '2px 6px',
                margin: '0px 1px',
                lineHeight: 0.9,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
