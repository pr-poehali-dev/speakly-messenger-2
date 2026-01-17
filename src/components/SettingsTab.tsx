import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(false);
  const [language, setLanguage] = useState('ru');
  const [theme, setTheme] = useState('light');

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Настройки</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-semibold mb-4">Основные</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <Icon name="Globe" size={20} className="text-muted-foreground" />
                  <div>
                    <Label htmlFor="language" className="font-medium">Язык</Label>
                    <p className="text-sm text-muted-foreground">Выберите язык интерфейса</p>
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <Icon name="Palette" size={20} className="text-muted-foreground" />
                  <div>
                    <Label htmlFor="theme" className="font-medium">Тема</Label>
                    <p className="text-sm text-muted-foreground">Внешний вид приложения</p>
                  </div>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Светлая</SelectItem>
                    <SelectItem value="dark">Тёмная</SelectItem>
                    <SelectItem value="auto">Авто</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Уведомления</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <Icon name="Bell" size={20} className="text-muted-foreground" />
                  <div>
                    <Label htmlFor="notifications" className="font-medium">Уведомления</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления о сообщениях</p>
                  </div>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <Icon name="Volume2" size={20} className="text-muted-foreground" />
                  <div>
                    <Label htmlFor="sounds" className="font-medium">Звуки</Label>
                    <p className="text-sm text-muted-foreground">Звук при получении сообщений</p>
                  </div>
                </div>
                <Switch id="sounds" checked={sounds} onCheckedChange={setSounds} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <Icon name="Smartphone" size={20} className="text-muted-foreground" />
                  <div>
                    <Label htmlFor="vibration" className="font-medium">Вибрация</Label>
                    <p className="text-sm text-muted-foreground">Вибрация при уведомлениях</p>
                  </div>
                </div>
                <Switch id="vibration" checked={vibration} onCheckedChange={setVibration} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Конфиденциальность</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Shield" size={20} />
                Безопасность
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Eye" size={20} />
                Кто может видеть мой профиль
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Lock" size={20} />
                Заблокированные пользователи
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Music" size={20} />
                Приватность плейлиста
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Поддержка</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="HelpCircle" size={20} />
                Помощь
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="MessageCircle" size={20} />
                Служба поддержки
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Info" size={20} />
                О приложении
              </Button>
            </div>
          </div>

          <Separator />

          <Button variant="destructive" className="w-full">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти из аккаунта
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
