import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Gift {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
}

const mockGifts: Gift[] = [
  { id: '1', name: 'Сердце', price: 100, emoji: '❤️', category: 'Эмодзи' },
  { id: '2', name: 'Роза', price: 200, emoji: '🌹', category: 'Эмодзи' },
  { id: '3', name: 'Торт', price: 300, emoji: '🎂', category: 'Эмодзи' },
  { id: '4', name: 'Корона', price: 500, emoji: '👑', category: 'Премиум' },
  { id: '5', name: 'Бриллиант', price: 1000, emoji: '💎', category: 'Премиум' },
  { id: '6', name: 'Ракета', price: 800, emoji: '🚀', category: 'Премиум' },
  { id: '7', name: 'Звезда', price: 150, emoji: '⭐', category: 'Эмодзи' },
  { id: '8', name: 'Огонь', price: 250, emoji: '🔥', category: 'Эмодзи' },
];

export default function ShopTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [enotCoins] = useState(1500);

  const categories = ['Все', 'Эмодзи', 'Премиум'];

  const filteredGifts = mockGifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || gift.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyGift = () => {
    if (selectedGift && enotCoins >= selectedGift.price) {
      alert(`Подарок "${selectedGift.name}" успешно куплен!`);
      setSelectedGift(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Магазин</h1>
              <p className="text-sm text-muted-foreground mt-1">
                У вас {enotCoins} енотиков
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              100 енотиков = 50₽
            </Badge>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Поиск подарков..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 pb-4 flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'outline' : 'ghost'}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGifts.map((gift) => (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className="p-6 rounded-2xl bg-card hover:bg-secondary transition-colors border border-border"
            >
              <div className="text-6xl mb-3 text-center">{gift.emoji}</div>
              <div className="text-center">
                <p className="font-medium mb-1">{gift.name}</p>
                <div className="flex items-center justify-center gap-1 text-primary font-semibold">
                  <Icon name="Coins" size={14} />
                  <span>{gift.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedGift} onOpenChange={() => setSelectedGift(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Купить подарок</DialogTitle>
          </DialogHeader>
          {selectedGift && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="text-8xl mb-4">{selectedGift.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedGift.name}</h3>
                <div className="flex items-center justify-center gap-2 text-xl text-primary font-semibold">
                  <Icon name="Coins" size={20} />
                  <span>{selectedGift.price} енотиков</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Баланс:</span>
                  <span className="font-medium">{enotCoins} енотиков</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Стоимость:</span>
                  <span className="font-medium">-{selectedGift.price} енотиков</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Остаток:</span>
                  <span className="font-bold">{enotCoins - selectedGift.price} енотиков</span>
                </div>
              </div>

              {enotCoins < selectedGift.price && (
                <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm text-center">
                  Недостаточно енотиков. Пополните баланс!
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedGift(null)}>
                  Отмена
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleBuyGift}
                  disabled={enotCoins < selectedGift.price}
                >
                  Купить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
