import { useState, useMemo, useEffect } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { RankingCard } from '@/components/RankingCard';
import { HourlyChart } from '@/components/HourlyChart';
import { DailyChart } from '@/components/DailyChart';
import { BusiestDay } from '@/components/BusiestDay';
import { FunnyMoments } from '@/components/FunnyMoments';
import { DateFilter } from '@/components/DateFilter';
import { UserFilter } from '@/components/UserFilter';
import { WordCloud } from '@/components/WordCloud';
import { parseWhatsAppChat, calculateStats, extractFunnyMoments, Message } from '@/utils/whatsappParser';
import { MessageSquare, Users, Clock, TrendingUp } from 'lucide-react';

const Index = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'all' | 'currentMonth'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  useEffect(() => {
    Promise.all([
      fetch('/Conversa.txt').then(res => res.text()),
      fetch('/Conversa2.txt').then(res => res.text()).catch(() => '')
    ])
      .then(([content1, content2]) => {
        setFileContent(content1 + '\n' + content2);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar arquivos:', error);
        setIsLoading(false);
      });
  }, []);

  const filterMessages = (messages: Message[]): Message[] => {
    let filtered = messages;
    
    // Filter by date
    if (dateFilter === 'currentMonth') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      filtered = filtered.filter(msg => {
        const msgMonth = msg.date.getMonth();
        const msgYear = msg.date.getFullYear();
        return msgMonth === currentMonth && msgYear === currentYear;
      });
    }
    
    // Filter by user
    if (userFilter !== 'all') {
      filtered = filtered.filter(msg => msg.sender === userFilter);
    }
    
    return filtered;
  };

  const allMessages = useMemo(() => {
    if (!fileContent) return [];
    return parseWhatsAppChat(fileContent);
  }, [fileContent]);

  const availableUsers = useMemo(() => {
    const users = new Set<string>();
    allMessages.forEach(msg => users.add(msg.sender));
    return Array.from(users).sort();
  }, [allMessages]);

  const stats = useMemo(() => {
    if (!fileContent) return null;
    const filteredMessages = filterMessages(allMessages);
    return {
      messages: filteredMessages,
      stats: calculateStats(filteredMessages),
      funnyMoments: extractFunnyMoments(filteredMessages),
    };
  }, [fileContent, dateFilter, userFilter, allMessages]);

  // Períodos disponíveis para a Nuvem de Palavras
  const wordPeriods = useMemo(() => {
    const msgs = stats?.messages ?? [];
    const set = new Set<string>();
    msgs.forEach((m) => {
      const y = m.date.getFullYear();
      const mm = String(m.date.getMonth() + 1).padStart(2, '0');
      const dd = String(m.date.getDate()).padStart(2, '0');
      const key = dateFilter === 'all' ? `${y}-${mm}` : `${y}-${mm}-${dd}`;
      set.add(key);
    });
    return Array.from(set).sort();
  }, [stats, dateFilter]);

  const [wordRange, setWordRange] = useState<[number, number]>([0, 0]);
  const [wordDayRange, setWordDayRange] = useState<[number, number]>([0, 0]);
  
  useEffect(() => {
    const maxIndex = Math.max(0, wordPeriods.length - 1);
    setWordRange([0, maxIndex]);
    setWordDayRange([0, maxIndex]);
  }, [wordPeriods.length, dateFilter, userFilter]);

  const mostActiveRanking = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.stats.messagesPerPerson)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count], idx) => ({
        position: idx + 1,
        name,
        value: count,
      }));
  }, [stats]);

  const dailyRecordRanking = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.stats.dailyRecordPerPerson)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10)
      .map(([name, record], idx) => ({
        position: idx + 1,
        name,
        value: record.count,
        subtitle: record.date.split('-').reverse().join('/'),
      }));
  }, [stats]);

  const hourlyRecordRanking = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.stats.hourlyRecordPerPerson)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10)
      .map(([name, record], idx) => ({
        position: idx + 1,
        name,
        value: record.count,
        subtitle: `${record.date.split('-').reverse().join('/')} às ${record.hour}h`,
      }));
  }, [stats]);

  const hourlyChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.stats.messagesPerHour).map(([hour, days]) => ({
      hour: `${hour}h`,
      messages: days.length > 0 ? Math.round(days.length / Object.keys(stats.stats.messagesPerDay).length) : 0,
    }));
  }, [stats]);

  const dailyChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.stats.messagesPerDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, count]) => {
        const [y, m, d] = date.split('-');
        return {
          date: `${d}/${m}`,
          messages: count,
        };
      });
  }, [stats]);

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Analisando mensagens...</p>
        </div>
      </div>
    );
  }

  const uniqueParticipants = Object.keys(stats.stats.messagesPerPerson).length;
  const avgMessagesPerDay = Math.round(stats.stats.totalMessages / Object.keys(stats.stats.messagesPerDay).length);
  const totalDays = Object.keys(stats.stats.messagesPerDay).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent animate-pulse">
            WhatsApp Group Analytics
          </h1>
          <p className="text-xl text-muted-foreground">
            Análise completa das conversas do grupo
          </p>
        </header>

        <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <DateFilter 
            onFilterChange={setDateFilter}
            currentFilter={dateFilter}
            periods={wordPeriods}
            range={wordRange}
            onRangeChange={setWordRange}
          />
          <UserFilter 
            users={availableUsers}
            onFilterChange={setUserFilter}
            currentFilter={userFilter}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Mensagens"
            value={stats.stats.totalMessages.toLocaleString()}
            icon={<MessageSquare className="w-8 h-8" />}
          />
          <StatsCard
            title="Participantes Ativos"
            value={uniqueParticipants}
            icon={<Users className="w-8 h-8" />}
          />
          <StatsCard
            title="Média por Dia"
            value={avgMessagesPerDay.toLocaleString()}
            icon={<TrendingUp className="w-8 h-8" />}
          />
          <StatsCard
            title="Dias de Conversa"
            value={totalDays}
            icon={<Clock className="w-8 h-8" />}
          />
        </div>

        <div className="mb-8">
          <BusiestDay
            date={stats.stats.busiestDay.date}
            count={stats.stats.busiestDay.count}
            topics={stats.stats.busiestDay.topics}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RankingCard
            title="🏆 Mais Ativos"
            items={mostActiveRanking}
          />
          <RankingCard
            title="📅 Recorde Diário"
            items={dailyRecordRanking}
          />
          <RankingCard
            title="⏰ Recorde Horário"
            items={hourlyRecordRanking}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HourlyChart data={hourlyChartData} />
          <DailyChart data={dailyChartData} />
        </div>

        <div className="mb-8">
          <FunnyMoments moments={stats.funnyMoments} />
        </div>

        <div className="mb-8">
          <WordCloud 
            messages={stats.messages} 
            filterType={dateFilter} 
            periods={wordPeriods} 
            range={wordRange}
            dayRange={wordDayRange}
            onDayRangeChange={setWordDayRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
