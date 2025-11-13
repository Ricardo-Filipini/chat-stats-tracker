import { Card } from '@/components/ui/card';
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
}

const STOP_WORDS = new Set([
  'a','o','e','é','de','da','do','em','um','uma','os','as','para','por','com','no','na','dos','das','ao','à','pelo','pela','se','que','ou','mas','quando','já','só','mais','não','também','muito','vai','vou','vc','q','n','aqui','lá','sim','então','bem','como','ela','ele','eu','tu','nós','esse','essa','isso','está','ser','ter','fazer','pode','vamos','foi','são','tem','tinha','https','www','com','br','http','mídia','oculta','grupo','usando','link','entrou','saiu','mudou','adicionou','removeu','criou','mensagem','apagada'
]);

export function WordCloud({ messages, filterType, periods, range }: WordCloudProps) {
  const { words, label } = useMemo(() => {
    if (!messages.length || !periods.length) return { words: [], label: '' };

    const [start, end] = range;
    const selected = new Set(periods.slice(Math.max(0, start), Math.min(end, periods.length - 1) + 1));

    const filtered = messages.filter((m) => {
      const y = m.date.getFullYear();
      const mm = String(m.date.getMonth() + 1).padStart(2, '0');
      const dd = String(m.date.getDate()).padStart(2, '0');
      const key = filterType === 'all' ? `${y}-${mm}` : `${y}-${mm}-${dd}`;
      return selected.has(key);
    });

    const counts = new Map<string, number>();
    filtered.forEach((msg) => {
      const clean = msg.content
        .toLowerCase()
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/[^\wÀ-ÿ\s]/g, ' ')
        .trim();
      const tokens = clean.split(/\s+/);
      tokens.forEach((t) => {
        if (t.length >= 4 && !STOP_WORDS.has(t)) {
          counts.set(t, (counts.get(t) || 0) + 1);
        }
      });
    });

    const list = Array.from(counts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 60);

    // Label do período
    const first = periods[Math.max(0, start)];
    const last = periods[Math.min(end, periods.length - 1)];
    const fmt = (p: string) => {
      if (filterType === 'all') {
        const [yy, mm] = p.split('-');
        return `${mm}/${yy}`;
      }
      const [yy, mm, dd] = p.split('-');
      return `${dd}/${mm}/${yy}`;
    };

    return { words: list, label: start === end ? fmt(first) : `${fmt(first)} – ${fmt(last)}` };
  }, [messages, periods, range, filterType]);

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
  
  // Escala de tamanho mais variada
  const scale = (c: number) => {
    if (max === min) return 24;
    const t = (c - min) / (max - min);
    return Math.round(16 + t * 48); // 16px a 64px
  };

  // Embaralha palavras para misturar grandes e pequenas
  const shuffledWords = useMemo(() => {
    const sorted = [...words];
    // Embaralha mantendo alguma estrutura
    for (let i = sorted.length - 1; i > 0; i -= 2) {
      const j = Math.floor(Math.random() * (i + 1));
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    }
    return sorted;
  }, [words]);

  // Rotações mais variadas incluindo horizontal (0°)
  const getRotation = (index: number, count: number) => {
    const angles = [0, 0, 0, -90, -90, -45, 45]; // mais palavras horizontais
    const baseAngle = angles[index % angles.length];
    // Palavras maiores ficam mais horizontais
    return count > (max + min) / 2 ? 0 : baseAngle;
  };

  const getColor = (count: number) => {
    const t = (count - min) / (max - min);
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
      'hsl(var(--primary))',
      'hsl(var(--accent))',
    ];
    // Palavras mais frequentes têm cores mais vibrantes
    const idx = Math.floor(t * (colors.length - 1));
    return colors[idx];
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">Nuvem de Palavras</h3>
        <p className="text-sm text-muted-foreground">Período: <span className="text-foreground font-medium">{label}</span></p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[400px] p-4">
        {shuffledWords.map(({ word, count }, index) => (
          <span
            key={word}
            title={`${count} ocorrências`}
            className="select-none transition-all duration-300 hover:scale-110 hover:z-10 cursor-default inline-block leading-none"
            style={{ 
              fontSize: `${scale(count)}px`, 
              color: getColor(count),
              transform: `rotate(${getRotation(index, count)}deg)`,
              fontWeight: count > (max + min) / 2 ? 700 : 500,
              opacity: 0.8 + (count / max) * 0.2,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              padding: '2px 4px',
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </Card>
  );
}
