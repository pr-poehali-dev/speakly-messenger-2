import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  currency: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', title: 'Пополнение кошелька', amount: 1000, currency: '₽', date: '17 янв, 14:30' },
  { id: '2', type: 'expense', title: 'Покупка енотиков', amount: 500, currency: '₽', date: '17 янв, 12:15' },
  { id: '3', type: 'expense', title: 'Подарок другу', amount: 250, currency: '₽', date: '16 янв, 18:45' },
  { id: '4', type: 'income', title: 'Пополнение кошелька', amount: 2000, currency: '₽', date: '15 янв, 10:20' },
];

export default function WalletTab() {
  const [balance] = useState(2500);
  const [enotCoins] = useState(1500);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [amount, setAmount] = useState('');

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Кошелёк</h1>
          <Button onClick={() => setTopUpOpen(true)}>
            <Icon name="Plus" size={18} className="mr-2" />
            Пополнить
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Баланс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{balance.toLocaleString()} ₽</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Енотики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{enotCoins.toLocaleString()}</div>
                <Badge variant="outline" className="text-xs">100 = 50₽</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Icon name="ShoppingBag" size={20} />
              Купить енотиков
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Icon name="Send" size={20} />
              Отправить деньги
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Icon name="History" size={20} />
              История операций
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 border-t border-border bg-muted/30">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Последние операции</h2>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-secondary transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Icon
                      name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'}
                      size={18}
                      className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium truncate">{transaction.title}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>

                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount} {transaction.currency}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Пополнить кошелёк</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Сумма пополнения</Label>
              <Input
                type="number"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(val.toString())}
                >
                  {val} ₽
                </Button>
              ))}
            </div>

            <div className="space-y-2 pt-4">
              <Label>Способ оплаты</Label>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="CreditCard" size={20} />
                Банковская карта
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Smartphone" size={20} />
                СБП
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Icon name="Wallet" size={20} />
                Электронный кошелёк
              </Button>
            </div>

            <Button className="w-full" onClick={() => setTopUpOpen(false)}>
              Пополнить {amount && `на ${amount} ₽`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
