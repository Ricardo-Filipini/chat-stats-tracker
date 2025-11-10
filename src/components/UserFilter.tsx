import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from 'lucide-react';

interface UserFilterProps {
  users: string[];
  onFilterChange: (user: string) => void;
  currentFilter: string;
}

export const UserFilter = ({ users, onFilterChange, currentFilter }: UserFilterProps) => {
  return (
    <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
      <User className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium">Usuário:</span>
      <Select value={currentFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todos os usuários" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="all">Todos os usuários</SelectItem>
          {users.map((user) => (
            <SelectItem key={user} value={user}>
              {user}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
