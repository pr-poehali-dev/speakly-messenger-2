import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import type { User } from '@/lib/api';

interface AuthDialogProps {
  open: boolean;
  onSuccess: (user: User) => void;
}

export default function AuthDialog({ open, onSuccess }: AuthDialogProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'register'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    setLoading(true);
    try {
      const user = await api.login(phone);
      if (user.id) {
        onSuccess(user);
      }
    } catch (error) {
      setStep('code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = () => {
    if (code === '1234') {
      setStep('register');
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const user = await api.register(phone, name, username);
      onSuccess(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Добро пожаловать в Speakly</DialogTitle>
          <DialogDescription>
            {step === 'phone' && 'Введите номер телефона для входа'}
            {step === 'code' && 'Введите код из SMS'}
            {step === 'register' && 'Создайте свой профиль'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {step === 'phone' && (
            <>
              <div>
                <Label>Номер телефона</Label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                />
              </div>
              <Button className="w-full" onClick={handlePhoneSubmit} disabled={loading}>
                Продолжить
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              <div>
                <Label>Код из SMS</Label>
                <Input
                  type="text"
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
                />
                <p className="text-xs text-muted-foreground mt-2">Код отправлен на {phone}</p>
              </div>
              <Button className="w-full" onClick={handleCodeSubmit}>
                Подтвердить
              </Button>
            </>
          )}

          {step === 'register' && (
            <>
              <div>
                <Label>Ваше имя</Label>
                <Input
                  placeholder="Иван Петров"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  placeholder="@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleRegister} disabled={loading}>
                Создать аккаунт
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
