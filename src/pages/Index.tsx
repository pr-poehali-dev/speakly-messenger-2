import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList, { type Chat } from '@/components/ChatList';
import ChatWindow, { type Message } from '@/components/ChatWindow';
import ProfileDialog from '@/components/ProfileDialog';
import AuthDialog from '@/components/AuthDialog';
import CallsTab from '@/components/CallsTab';
import MusicTab from '@/components/MusicTab';
import WalletTab from '@/components/WalletTab';
import ShopTab from '@/components/ShopTab';
import SettingsTab from '@/components/SettingsTab';
import { api, type User } from '@/lib/api';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'music' | 'wallet' | 'shop' | 'settings'>('chats');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profile = {
    name: currentUser?.name || 'Вы',
    username: currentUser?.username || '@yourname',
    avatar: currentUser?.avatar || '',
    banner: '',
    verified: currentUser?.verified || false,
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('speakly_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      loadChats(user.id);
    }
  }, []);

  const loadChats = async (userId: number) => {
    try {
      const data = await api.getChats(userId);
      setChats(data);
    } catch (error) {
      console.error('Load chats error:', error);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('speakly_user', JSON.stringify(user));
    loadChats(user.id);
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    if (currentUser) {
      try {
        const data = await api.getMessages(Number(chat.id), currentUser.id);
        setMessages(data);
      } catch (error) {
        console.error('Load messages error:', error);
      }
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUser) return;
    
    try {
      const result = await api.sendMessage(
        Number(selectedChat.id),
        currentUser.id,
        messageInput
      );
      
      setMessages([...messages, {
        id: result.id.toString(),
        text: messageInput,
        time: result.time,
        isMine: true,
      }]);
      setMessageInput('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleFileUpload = async (fileUrl: string, fileType: string) => {
    if (!selectedChat || !currentUser) return;
    
    try {
      const result = await api.sendMessage(
        Number(selectedChat.id),
        currentUser.id,
        '',
        fileUrl,
        fileType
      );
      
      setMessages([...messages, {
        id: result.id.toString(),
        text: '',
        fileUrl,
        fileType,
        time: result.time,
        isMine: true,
      }]);
    } catch (error) {
      console.error('Send file error:', error);
    }
  };

  if (!currentUser) {
    return <AuthDialog open={true} onSuccess={handleAuthSuccess} />;
  }

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
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            messageInput={messageInput}
            onMessageInputChange={setMessageInput}
            onSendMessage={sendMessage}
            onFileUpload={handleFileUpload}
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
        onProfileChange={(newProfile) => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, ...newProfile });
          }
        }}
      />
    </div>
  );
}