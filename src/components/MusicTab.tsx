import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

const mockTracks: Track[] = [
  { id: '1', title: 'Midnight City', artist: 'M83', duration: '4:04', cover: '' },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', cover: '' },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', cover: '' },
  { id: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: '2:58', cover: '' },
  { id: '5', title: 'Heat Waves', artist: 'Glass Animals', duration: '3:58', cover: '' },
  { id: '6', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', duration: '2:21', cover: '' },
];

export default function MusicTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [volume, setVolume] = useState([80]);

  const filteredTracks = mockTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Музыка</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="public-playlist" className="text-sm">Публичный плейлист</Label>
                <Switch id="public-playlist" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Icon name="Plus" size={20} />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Поиск музыки..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 pb-4 flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            Мой плейлист
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Рекомендации
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Топ треки
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrack(track);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-colors ${
                currentTrack?.id === track.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Music" size={20} className="text-primary" />
              </div>

              <div className="flex-1 text-left overflow-hidden">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>

              <span className="text-sm text-muted-foreground">{track.duration}</span>

              <Button size="icon" variant="ghost" className="rounded-full">
                <Icon name="Heart" size={18} />
              </Button>
            </button>
          ))}
        </div>
      </ScrollArea>

      {currentTrack && (
        <div className="border-t border-border bg-card p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Music" size={24} className="text-primary" />
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>

              <Button size="icon" variant="ghost" className="rounded-full">
                <Icon name="Heart" size={20} />
              </Button>
            </div>

            <div className="space-y-2">
              <Slider value={[35]} max={100} step={1} className="w-full" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>1:24</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Volume2" size={18} className="text-muted-foreground" />
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-24" />
              </div>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Icon name="Shuffle" size={18} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Icon name="SkipBack" size={20} />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full w-12 h-12"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Icon name="SkipForward" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Icon name="Repeat" size={18} />
                </Button>
              </div>

              <Button size="icon" variant="ghost" className="rounded-full">
                <Icon name="ListMusic" size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
