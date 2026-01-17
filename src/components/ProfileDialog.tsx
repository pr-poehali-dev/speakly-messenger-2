import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Profile {
  name: string;
  username: string;
  avatar: string;
  banner: string;
  verified: boolean;
}

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export default function ProfileDialog({ open, onOpenChange, profile, onProfileChange }: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onChange={(e) => onProfileChange({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Username</Label>
              <Input
                value={profile.username}
                onChange={(e) => onProfileChange({ ...profile, username: e.target.value })}
              />
            </div>

            <div>
              <Label>О себе</Label>
              <Textarea placeholder="Расскажите о себе..." rows={3} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
