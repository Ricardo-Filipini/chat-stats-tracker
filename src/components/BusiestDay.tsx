import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';

interface BusiestDayProps {
  date: string;
  count: number;
  topics: string[];
}

export function BusiestDay({ date, count, topics }: BusiestDayProps) {
  // date está no formato YYYY-MM-DD, não usar new Date() para evitar problemas de timezone
  const [year, month, day] = date.split('-');
  const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const formattedDate = `${day} de ${monthNames[parseInt(month) - 1]} de ${year}`;

  return (
    <Card className="p-6 bg-gradient-primary border-primary/50 backdrop-blur-sm shadow-glow">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Calendar className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            Dia Mais Movimentado
            <TrendingUp className="w-5 h-5 text-accent" />
          </h3>
          <p className="text-2xl font-bold text-primary-foreground mb-2">{formattedDate}</p>
          <p className="text-lg text-primary-foreground/80 mb-4">{count} mensagens</p>
          
          {topics.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-primary-foreground/90 mb-2">Assuntos discutidos:</p>
              <ul className="space-y-2">
                {topics.slice(0, 3).map((topic, idx) => (
                  <li key={idx} className="text-sm text-primary-foreground/70 bg-primary/10 p-2 rounded">
                    "{topic.substring(0, 100)}..."
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
