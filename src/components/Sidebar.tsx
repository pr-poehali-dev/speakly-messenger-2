import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  activeTab: 'chats' | 'calls' | 'music' | 'wallet' | 'shop' | 'settings';
  onTabChange: (tab: 'chats' | 'calls' | 'music' | 'wallet' | 'shop' | 'settings') => void;
  onProfileClick: () => void;
  profile: {
    name: string;
    avatar: string;
  };
}

export default function Sidebar({ activeTab, onTabChange, onProfileClick, profile }: SidebarProps) {
  return (
    <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl">
        S
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        <Button
          variant={activeTab === 'chats' ? 'default' : 'ghost'}
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={() => onTabChange('chats')}
        >
          <Icon name="MessageCircle" size={24} />
        </Button>

        <Button
          variant={activeTab === 'calls' ? 'default' : 'ghost'}
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={() => onTabChange('calls')}
        >
          <Icon name="Phone" size={24} />
        </Button>

        <Button
          variant={activeTab === 'music' ? 'default' : 'ghost'}
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={() => onTabChange('music')}
        >
          <Icon name="Music" size={24} />
        </Button>

        <Button
          variant={activeTab === 'wallet' ? 'default' : 'ghost'}
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={() => onTabChange('wallet')}
        >
          <Icon name="Wallet" size={24} />
        </Button>

        <Button
          variant={activeTab === 'shop' ? 'default' : 'ghost'}
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={() => onTabChange('shop')}
        >
          <Icon name="ShoppingBag" size={24} />
        </Button>
      </nav>

      <div className="flex flex-col gap-4">
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={() => onTabChange('settings')}
        >
          <Icon name="Settings" size={24} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-2xl"
          onClick={onProfileClick}
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
  );
}
