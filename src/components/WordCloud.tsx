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
  'a','o','e','é','de','da','do','em','um','uma','os','as','para','por','com','no','na','dos','das','ao','à','pelo','pela','se','que','ou','mas','quando','já','só','mais','não','também','muito','vai','vou','vc','q','n','aqui','lá','sim','então','bem','como','ela','ele','eu','tu','nós','esse','essa','isso','está','ser','ter','fazer','pode','vamos','foi','são','tem','tinha','https','www','com','br','http','mídia','oculta','grupo','usando','link','entrou','saiu','mudou','adicionou','removeu','criou','mensagem','apagada','editada'
]);

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
  
  // Escala de tamanho mais variada e suave
  const scale = (c: number) => {
    if (max === min) return 28;
    const t = (c - min) / (max - min);
    return Math.round(18 + t * 56); // 18px a 74px
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
      'hsl(var(--primary))',
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--accent))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];
    // Palavras mais frequentes têm cores primárias
    const idx = Math.floor(t * (colors.length - 1));
    return colors[Math.min(idx, colors.length - 1)];
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
      <div className="relative min-h-[550px] p-6 overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-background/50">
        <div className="absolute inset-0 flex flex-wrap justify-center items-center content-center gap-2 p-6">
          {shuffledWords.map(({ word, count }, index) => (
            <span
              key={word}
              title={`${count} ocorrências`}
              className="select-none transition-all duration-300 hover:scale-110 hover:z-10 cursor-default inline-flex leading-tight"
              style={{ 
                fontSize: `${scale(count)}px`, 
                color: getColor(count),
                transform: `rotate(${getRotation(index, count)}deg)`,
                fontWeight: count > (max + min) / 2 ? 700 : 600,
                opacity: 0.88 + (count / max) * 0.12,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                padding: '2px 4px',
                margin: '1px',
                lineHeight: 1.1,
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
