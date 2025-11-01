import { useState, useMemo } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { StatsCard } from '@/components/StatsCard';
import { RankingCard } from '@/components/RankingCard';
import { HourlyChart } from '@/components/HourlyChart';
import { DailyChart } from '@/components/DailyChart';
import { BusiestDay } from '@/components/BusiestDay';
import { FunnyMoments } from '@/components/FunnyMoments';
import { parseWhatsAppChat, calculateStats, extractFunnyMoments } from '@/utils/whatsappParser';
import { MessageSquare, Users, Clock, TrendingUp } from 'lucide-react';

const Index = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!fileContent) return null;
    const messages = parseWhatsAppChat(fileContent);
    return {
      messages,
      stats: calculateStats(messages),
      funnyMoments: extractFunnyMoments(messages),
    };
  }, [fileContent]);

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
        subtitle: new Date(record.date).toLocaleDateString('pt-BR'),
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
        subtitle: `${new Date(record.date).toLocaleDateString('pt-BR')} às ${record.hour}h`,
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
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-30)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        messages: count,
      }));
  }, [stats]);

  if (!fileContent) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              WhatsApp Group Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Descubra os segredos do seu grupo
            </p>
          </div>
          <FileUpload onFileLoad={setFileContent} />
        </div>
      </div>
    );
  }

  if (!stats) {
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
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent animate-pulse">
            WhatsApp Group Analytics
          </h1>
          <p className="text-xl text-muted-foreground">
            Análise completa das conversas do grupo
          </p>
        </header>

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
      </div>
    </div>
  );
};

export default Index;
