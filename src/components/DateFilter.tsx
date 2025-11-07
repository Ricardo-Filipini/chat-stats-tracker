import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  onFilterChange: (filterType: 'all' | 'currentMonth') => void;
  currentFilter: 'all' | 'currentMonth';
}

export const DateFilter = ({ onFilterChange, currentFilter }: DateFilterProps) => {
  return (
    <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
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
  );
};
