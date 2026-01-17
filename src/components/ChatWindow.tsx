import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import type { Chat } from './ChatList';

export interface Message {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
  sender?: string;
}

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function ChatWindow({ chat, messages, messageInput, onMessageInputChange, onSendMessage }: ChatWindowProps) {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Выберите чат для начала</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {chat.isGroup ? <Icon name="Users" size={18} /> : chat.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{chat.name}</p>
            <p className="text-xs text-muted-foreground">
              {chat.online ? 'онлайн' : 'был(а) недавно'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="Phone" size={20} />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Icon name="Video" size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Icon name="Ban" size={16} className="mr-2" />
                Заблокировать
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="Edit" size={16} className="mr-2" />
                Переименовать
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="Trash2" size={16} className="mr-2" />
                Очистить чат
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-2xl ${
                  msg.isMine
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
              >
                {msg.sender && (
                  <p className="text-xs font-medium text-primary mb-1">{msg.sender}</p>
                )}
                <p className="break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full flex-shrink-0">
            <Icon name="Paperclip" size={20} />
          </Button>

          <Input
            placeholder="Сообщение..."
            value={messageInput}
            onChange={(e) => onMessageInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            className="flex-1"
          />

          <Button size="icon" variant="ghost" className="rounded-full flex-shrink-0">
            <Icon name="Smile" size={20} />
          </Button>

          <Button size="icon" variant="ghost" className="rounded-full flex-shrink-0">
            <Icon name="Mic" size={20} />
          </Button>

          <Button
            size="icon"
            className="rounded-full flex-shrink-0"
            onClick={onSendMessage}
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
