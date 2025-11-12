import { Card } from '@/components/ui/card';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Message {
  date: Date;
  content: string;
}

interface RaceChartProps {
  messages: Message[];
  filterType: 'all' | 'currentMonth';
}

// Palavras comuns a serem ignoradas
const STOP_WORDS = new Set([
  'a', 'o', 'e', 'é', 'de', 'da', 'do', 'em', 'um', 'uma', 'os', 'as', 'para', 'por', 'com',
  'no', 'na', 'dos', 'das', 'ao', 'à', 'pelo', 'pela', 'se', 'que', 'ou', 'mas', 'quando',
  'já', 'só', 'mais', 'não', 'também', 'muito', 'vai', 'vou', 'vc', 'q', 'n', 'aqui', 'lá',
  'sim', 'então', 'bem', 'como', 'ela', 'ele', 'eu', 'tu', 'nós', 'esse', 'essa', 'isso',
  'está', 'ser', 'ter', 'fazer', 'pode', 'vai', 'vamos', 'foi', 'são', 'tem', 'tinha',
  'https', 'www', 'com', 'br', 'http', 'mídia', 'oculta', 'grupo', 'usando', 'link',
  'entrou', 'saiu', 'mudou', 'adicionou', 'removeu', 'criou', 'mensagem', 'apagada'
]);

function extractTopWords(messages: Message[], topN: number = 15): { word: string; count: number }[] {
  const wordCounts = new Map<string, number>();

  messages.forEach(msg => {
    // Remove links, emojis e caracteres especiais, mantém apenas palavras
    const cleanContent = msg.content
      .toLowerCase()
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/[^\wÀ-ÿ\s]/g, ' ') // Remove caracteres especiais exceto letras e acentos
      .trim();

    const words = cleanContent.split(/\s+/);
    
    words.forEach(word => {
      // Ignora palavras muito curtas ou stop words
      if (word.length >= 4 && !STOP_WORDS.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    });
  });

  // Converte para array e ordena por contagem
  return Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

function groupMessagesByPeriod(
  messages: Message[],
  filterType: 'all' | 'currentMonth'
): { [period: string]: Message[] } {
  const groups: { [period: string]: Message[] } = {};

  messages.forEach(msg => {
    let key: string;
    
    if (filterType === 'all') {
      // Agrupa por mês (YYYY-MM)
      const year = msg.date.getFullYear();
      const month = String(msg.date.getMonth() + 1).padStart(2, '0');
      key = `${year}-${month}`;
    } else {
      // Agrupa por dia (YYYY-MM-DD)
      key = msg.date.toISOString().split('T')[0];
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(msg);
  });

  return groups;
}

export function RaceChart({ messages, filterType }: RaceChartProps) {
  const chartData = useMemo<{ data: { word: string; count: number }[]; periodLabel: string; totalPeriods: number } | null>(() => {
    const periods = groupMessagesByPeriod(messages, filterType);
    const allPeriods = Object.keys(periods).sort();
    
    if (allPeriods.length === 0) return null;

    // Para cada período, pega as top 10 palavras
    const periodData = allPeriods.map(period => {
      const topWords = extractTopWords(periods[period], 10);
      return {
        period,
        words: topWords
      };
    });

    // Pega o último período para exibir
    const latestPeriod = periodData[periodData.length - 1];
    
    if (!latestPeriod) return null;

    // Formata o período para exibição
    let periodLabel = '';
    if (filterType === 'all') {
      const [year, month] = latestPeriod.period.split('-');
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      periodLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
    } else {
      const [year, month, day] = latestPeriod.period.split('-');
      periodLabel = `${day}/${month}/${year}`;
    }

    return {
      data: latestPeriod.words,
      periodLabel,
      totalPeriods: allPeriods.length
    };
  }, [messages, filterType]);

  if (!chartData || chartData.data.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
          Palavras Mais Usadas
        </h3>
        <p className="text-muted-foreground">Sem dados suficientes para exibir.</p>
      </Card>
    );
  }

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 bg-gradient-accent bg-clip-text text-transparent">
          Palavras Mais Usadas
        </h3>
        <p className="text-sm text-muted-foreground">
          {filterType === 'all' ? 'Último mês: ' : 'Último dia: '}
          <span className="font-semibold text-foreground">{chartData.periodLabel}</span>
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData.data} layout="vertical" margin={{ left: 80, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            type="number"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            type="category"
            dataKey="word"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
            formatter={(value: number) => [`${value} vezes`, 'Frequência']}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
