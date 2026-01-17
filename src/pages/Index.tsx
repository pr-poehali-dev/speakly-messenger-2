import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Sidebar from '@/components/Sidebar';
import ChatList, { type Chat } from '@/components/ChatList';
import ChatWindow, { type Message } from '@/components/ChatWindow';
import ProfileDialog from '@/components/ProfileDialog';

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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onProfileClick={() => setProfileOpen(true)}
        profile={profile}
      />

      {activeTab === 'chats' && (
        <>
          <ChatList
            chats={mockChats}
            selectedChat={selectedChat}
            onChatSelect={setSelectedChat}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            messageInput={messageInput}
            onMessageInputChange={setMessageInput}
            onSendMessage={sendMessage}
          />
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

      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={profile}
        onProfileChange={setProfile}
      />
    </div>
  );
}
