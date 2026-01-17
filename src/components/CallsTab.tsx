import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Call {
  id: string;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo: boolean;
  time: string;
  duration?: string;
}

const mockCalls: Call[] = [
  { id: '1', name: 'Алексей Петров', avatar: '', type: 'incoming', isVideo: true, time: '14:30', duration: '12:34' },
  { id: '2', name: 'Мария Иванова', avatar: '', type: 'outgoing', isVideo: false, time: '12:15', duration: '05:21' },
  { id: '3', name: 'Рабочая группа', avatar: '', type: 'missed', isVideo: true, time: 'Вчера' },
  { id: '4', name: 'Сергей Волков', avatar: '', type: 'incoming', isVideo: false, time: '2 дня назад', duration: '01:45' },
];

export default function CallsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [incomingCall, setIncomingCall] = useState<{ name: string; isVideo: boolean } | null>(null);

  const filteredCalls = mockCalls.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (name: string, isVideo: boolean) => {
    setIncomingCall({ name, isVideo });
    setTimeout(() => setIncomingCall(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Звонки</h1>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Icon name="Plus" size={20} />
            </Button>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 pb-4 flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            Все
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Пропущенные
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-colors"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={call.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {call.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{call.name}</p>
                  {call.type === 'missed' && (
                    <Badge variant="destructive" className="text-xs">Пропущен</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon
                    name={call.type === 'incoming' ? 'PhoneIncoming' : call.type === 'outgoing' ? 'PhoneOutgoing' : 'PhoneMissed'}
                    size={14}
                    className={call.type === 'missed' ? 'text-destructive' : ''}
                  />
                  <span>{call.time}</span>
                  {call.duration && <span>• {call.duration}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => handleCall(call.name, false)}
                >
                  <Icon name="Phone" size={20} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => handleCall(call.name, true)}
                >
                  <Icon name="Video" size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!incomingCall} onOpenChange={() => setIncomingCall(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Входящий звонок</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {incomingCall?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-xl font-bold mb-2">{incomingCall?.name}</p>
            <p className="text-sm text-muted-foreground mb-6">
              {incomingCall?.isVideo ? 'Видеозвонок' : 'Голосовой звонок'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={() => setIncomingCall(null)}
              >
                <Icon name="PhoneOff" size={24} />
              </Button>
              <Button
                size="lg"
                className="rounded-full w-16 h-16"
                onClick={() => setIncomingCall(null)}
              >
                <Icon name="Phone" size={24} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
