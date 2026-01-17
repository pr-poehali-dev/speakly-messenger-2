import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Chat {
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

interface Message {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
  sender?: string;
}

const mockChats: Chat[] = [
  { id: '1', name: 'Алексей Петров', username: '@alexpetr', avatar: '', lastMessage: 'Привет! Как дела?', time: '14:23', unread: 2, online: true },
  { id: '2', name: 'Рабочая группа', username: '@workgroup', avatar: '', lastMessage: 'Встреча в 15:00', time: '13:45', unread: 5, isGroup: true },
  { id: '3', name: 'Мария Иванова', username: '@mariaiv', avatar: '', lastMessage: 'Спасибо за помощь!', time: '12:10', unread: 0 },
  { id: '4', name: 'Канал новостей', username: '@news_ch', avatar: '', lastMessage: 'Важные обновления', time: 'Вчера', unread: 12, isGroup: true },
];

const mockMessages: Message[] = [
  { id: '1', text: 'Привет! Как дела?', time: '14:20', isMine: false },
  { id: '2', text: 'Отлично! А у тебя?', time: '14:21', isMine: true },
  { id: '3', text: 'Тоже всё хорошо, спасибо 😊', time: '14:23', isMine: false },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'music' | 'wallet' | 'shop' | 'settings'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [profile, setProfile] = useState({
    name: 'Вы',
    username: '@yourname',
    avatar: '',
    banner: '',
    verified: true,
  });

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      text: messageInput,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }]);
    setMessageInput('');
  };

  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl">
          S
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageCircle" size={24} />
          </Button>

          <Button
            variant={activeTab === 'calls' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveTab('calls')}
          >
            <Icon name="Phone" size={24} />
          </Button>

          <Button
            variant={activeTab === 'music' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveTab('music')}
          >
            <Icon name="Music" size={24} />
          </Button>

          <Button
            variant={activeTab === 'wallet' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveTab('wallet')}
          >
            <Icon name="Wallet" size={24} />
          </Button>

          <Button
            variant={activeTab === 'shop' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveTab('shop')}
          >
            <Icon name="ShoppingBag" size={24} />
          </Button>
        </nav>

        <div className="flex flex-col gap-4">
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveTab('settings')}
          >
            <Icon name="Settings" size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setProfileOpen(true)}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </aside>

      {activeTab === 'chats' && (
        <>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-2">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
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

          <div className="flex-1 flex flex-col bg-muted/30">
            {selectedChat ? (
              <>
                <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedChat.isGroup ? <Icon name="Users" size={18} /> : selectedChat.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedChat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedChat.online ? 'онлайн' : 'был(а) недавно'}
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
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
                      onClick={sendMessage}
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Выберите чат для начала</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'calls' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="Phone" size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Звонки</p>
            <p className="text-sm">Раздел в разработке</p>
          </div>
        </div>
      )}

      {activeTab === 'music' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="Music" size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Музыка</p>
            <p className="text-sm">Раздел в разработке</p>
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="Wallet" size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Кошелёк</p>
            <p className="text-sm">Раздел в разработке</p>
          </div>
        </div>
      )}

      {activeTab === 'shop' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="ShoppingBag" size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Магазин</p>
            <p className="text-sm">Раздел в разработке</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="Settings" size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Настройки</p>
            <p className="text-sm">Раздел в разработке</p>
          </div>
        </div>
      )}

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Профиль</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative h-32 bg-gradient-to-br from-primary to-primary/60 rounded-xl overflow-hidden">
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
              >
                <Icon name="Camera" size={16} className="mr-1" />
                Баннер
              </Button>
            </div>

            <div className="flex items-start gap-4 -mt-8 px-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-card">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                >
                  <Icon name="Camera" size={14} />
                </Button>
              </div>

              <div className="flex-1 mt-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{profile.name}</h3>
                  {profile.verified && (
                    <Badge variant="secondary" className="rounded-full px-1.5 py-0.5">
                      <Icon name="BadgeCheck" size={14} className="text-primary" />
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{profile.username}</p>
              </div>
            </div>

            <div className="space-y-3 px-4">
              <div>
                <Label>Имя</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Username</Label>
                <Input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
              </div>

              <div>
                <Label>О себе</Label>
                <Textarea placeholder="Расскажите о себе..." rows={3} />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setProfileOpen(false)}>
                Отмена
              </Button>
              <Button className="flex-1" onClick={() => setProfileOpen(false)}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
