import { Card } from '@/components/ui/card';
import { Smile } from 'lucide-react';

interface FunnyMoment {
  sender: string;
  content: string;
  date: Date;
}

interface FunnyMomentsProps {
  moments: FunnyMoment[];
}

export function FunnyMoments({ moments }: FunnyMomentsProps) {
  return (
    <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Smile className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Momentos Engraçados do Grupo
        </h3>
      </div>
      <div className="space-y-4">
        {moments.map((moment, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-primary">{moment.sender}</p>
              <p className="text-xs text-muted-foreground">
                {moment.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <p className="text-sm text-foreground/90">{moment.content}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
