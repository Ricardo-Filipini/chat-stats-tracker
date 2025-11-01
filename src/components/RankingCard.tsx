import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingItem {
  position: number;
  name: string;
  value: number;
  subtitle?: string;
}

interface RankingCardProps {
  title: string;
  items: RankingItem[];
}

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="w-6 h-6 text-accent" />;
    case 2:
      return <Medal className="w-6 h-6 text-accent/70" />;
    case 3:
      return <Award className="w-6 h-6 text-accent/50" />;
    default:
      return null;
  }
};

export function RankingCard({ title, items }: RankingCardProps) {
  return (
    <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.position}
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center w-10">
              {getMedalIcon(item.position)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.name}</p>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{item.value}</p>
              <p className="text-xs text-muted-foreground">mensagens</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
