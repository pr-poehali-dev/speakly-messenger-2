import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export interface Chat {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  isGroup?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ChatList({ chats, selectedChat, onChatSelect, searchQuery, onSearchChange }: ChatListProps) {
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-96 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Чаты</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Icon name="Plus" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Новый чат</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Button className="w-full justify-start gap-3" variant="outline">
                  <Icon name="Users" size={20} />
                  Создать группу
                </Button>
                <Button className="w-full justify-start gap-3" variant="outline">
                  <Icon name="Radio" size={20} />
                  Создать канал
                </Button>
                <Separator />
                <div className="space-y-2">
                  <Label>Найти друзей</Label>
                  <Input placeholder="Введите username" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-secondary transition-colors ${
                selectedChat?.id === chat.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {chat.isGroup ? <Icon name="Users" size={20} /> : chat.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>

              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium truncate">{chat.name}</p>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>

              {chat.unread > 0 && (
                <Badge className="rounded-full min-w-6 h-6 flex items-center justify-center">
                  {chat.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
