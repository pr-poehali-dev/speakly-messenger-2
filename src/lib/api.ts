const API_URL = 'https://functions.poehali.dev/414e8f30-edd5-4181-84e4-1d339b28dcdc';

export interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  avatar?: string;
  verified?: boolean;
  enotCoins?: number;
  balanceRub?: number;
}

export interface Chat {
  id: number;
  name: string;
  username?: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  isGroup?: boolean;
}

export interface Message {
  id: number;
  text: string;
  fileUrl?: string;
  fileType?: string;
  time: string;
  isMine: boolean;
  sender?: string;
}

export const api = {
  async register(phone: string, name: string, username?: string): Promise<User> {
    const response = await fetch(`${API_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, username })
    });
    return response.json();
  },

  async login(phone: string): Promise<User> {
    const response = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return response.json();
  },

  async getChats(userId: number): Promise<Chat[]> {
    const response = await fetch(`${API_URL}?action=get_chats&user_id=${userId}`);
    return response.json();
  },

  async getMessages(chatId: number, userId: number): Promise<Message[]> {
    const response = await fetch(`${API_URL}?action=get_messages&chat_id=${chatId}&user_id=${userId}`);
    return response.json();
  },

  async sendMessage(chatId: number, senderId: number, text: string, fileUrl?: string, fileType?: string): Promise<{ id: number; time: string }> {
    const response = await fetch(`${API_URL}?action=send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, sender_id: senderId, text, file_url: fileUrl, file_type: fileType })
    });
    return response.json();
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await fetch(`${API_URL}?action=search_users&query=${encodeURIComponent(query)}`);
    return response.json();
  },

  async createChat(userId: number, targetUserId: number, name: string, isGroup = false): Promise<{ chat_id: number }> {
    const response = await fetch(`${API_URL}?action=create_chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, target_user_id: targetUserId, name, is_group: isGroup })
    });
    return response.json();
  },

  async uploadFile(file: File): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const response = await fetch(`${API_URL}?action=upload_file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            file_name: `${Date.now()}_${file.name}`,
            file_type: file.type
          })
        });
        resolve(await response.json());
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
