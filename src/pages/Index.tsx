import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList, { type Chat } from '@/components/ChatList';
import ChatWindow, { type Message } from '@/components/ChatWindow';
import ProfileDialog from '@/components/ProfileDialog';
import CallsTab from '@/components/CallsTab';
import MusicTab from '@/components/MusicTab';
import WalletTab from '@/components/WalletTab';
import ShopTab from '@/components/ShopTab';
import SettingsTab from '@/components/SettingsTab';

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

      {activeTab === 'calls' && <CallsTab />}

      {activeTab === 'music' && <MusicTab />}

      {activeTab === 'wallet' && <WalletTab />}

      {activeTab === 'shop' && <ShopTab />}

      {activeTab === 'settings' && <SettingsTab />}

      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={profile}
        onProfileChange={setProfile}
      />
    </div>
  );
}