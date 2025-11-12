import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface DateFilterProps {
  onFilterChange: (filterType: 'all' | 'currentMonth') => void;
  currentFilter: 'all' | 'currentMonth';
  periods?: string[]; // 'YYYY-MM' (all) ou 'YYYY-MM-DD' (currentMonth)
  range?: [number, number];
  onRangeChange?: (range: [number, number]) => void;
}

export const DateFilter = ({ onFilterChange, currentFilter, periods = [], range = [0, 0], onRangeChange }: DateFilterProps) => {
  const formatPeriod = (p: string) => {
    if (!p) return '';
    if (currentFilter === 'all') {
      const [y, m] = p.split('-');
      return `${m}/${y}`;
    }
    const [y, m, d] = p.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex flex-col gap-3 bg-card p-4 rounded-lg border border-border w-full">
      <div className="flex items-center gap-4">
        <Calendar className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">Período:</span>
        <div className="flex gap-2">
          <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('all')}
          >
            Todos
          </Button>
          <Button
            variant={currentFilter === 'currentMonth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('currentMonth')}
          >
            Mês Atual
          </Button>
        </div>
      </div>

      {periods.length > 1 && onRangeChange && (
        <div className="px-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{formatPeriod(periods[Math.max(0, range[0])])}</span>
            <span>{formatPeriod(periods[Math.min(range[1], periods.length - 1)])}</span>
          </div>
          <Slider
            min={0}
            max={Math.max(1, periods.length - 1)}
            step={1}
            value={[Math.max(0, range[0]), Math.min(range[1], periods.length - 1)]}
            onValueChange={(v) => onRangeChange([v[0], v[1]])}
          />
        </div>
      )}
    </div>
  );
};
