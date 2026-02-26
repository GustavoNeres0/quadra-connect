import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, Car, Shirt, Share2, Copy, Check, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

interface Court {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_hour: number;
  city: string;
  state: string;
  has_parking: boolean;
  has_locker: boolean;
  description: string;
  owner_id: string | null;
}

const mockCourts: Court[] = [
  { id: "1", name: "Arena Sport Center", location: "Rua das Flores, 123", sport_type: "Futebol", price_per_hour: 120, city: "Anápolis", state: "Goiás", has_parking: true, has_locker: true, description: "Quadra society com grama sintética", owner_id: null },
  { id: "2", name: "Quadra Central Tênis", location: "Av. Brasil, 456", sport_type: "Tênis", price_per_hour: 80, city: "Anápolis", state: "Goiás", has_parking: true, has_locker: false, description: "Quadra de tênis profissional", owner_id: null },
  { id: "3", name: "Vôlei Praia Club", location: "Rua do Esporte, 789", sport_type: "Vôlei de Praia", price_per_hour: 60, city: "Goiânia", state: "Goiás", has_parking: false, has_locker: true, description: "Quadra de vôlei de praia", owner_id: null },
  { id: "4", name: "Basquete Arena", location: "Rua Central, 321", sport_type: "Basquete", price_per_hour: 90, city: "Anápolis", state: "Goiás", has_parking: true, has_locker: true, description: "Quadra coberta de basquete", owner_id: null },
  { id: "5", name: "Vôlei Indoor", location: "Av. Goiás, 555", sport_type: "Vôlei", price_per_hour: 70, city: "Goiânia", state: "Goiás", has_parking: false, has_locker: false, description: "Quadra de vôlei indoor", owner_id: null },
];

const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();

const Search = () => {
  const [estado, setEstado] = useState("Goiás");
  const [cidade, setCidade] = useState("Anápolis");
  const [tipoQuadra, setTipoQuadra] = useState("Todos os Tipos");
  const [searchTerm, setSearchTerm] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>(mockCourts);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    filterCourts();
  }, [estado, cidade, tipoQuadra, searchTerm]);

  const filterCourts = () => {
    let filtered = mockCourts;

    if (estado !== "Todos") {
      filtered = filtered.filter((court) => court.state === estado);
    }
    if (cidade !== "Todas") {
      filtered = filtered.filter((court) => court.city === cidade);
    }
    if (tipoQuadra !== "Todos os Tipos") {
      filtered = filtered.filter((court) => court.sport_type === tipoQuadra);
    }
    if (searchTerm) {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered.filter((court) =>
        normalizeText(court.name).includes(normalizedSearch) ||
        normalizeText(court.location).includes(normalizedSearch)
      );
    }
    setFilteredCourts(filtered);
  };

  const handleShare = (court: Court) => {
    setSelectedCourt(court);
  };

  const handleReserve = (courtId: string) => {
    navigate(`/booking?courtId=${courtId}`);
  };

  const handleCopyLink = () => {
    if (!selectedCourt) return;
    const courtLink = `${window.location.origin}/booking?courtId=${selectedCourt.id}`;
    navigator.clipboard.writeText(courtLink);
    setLinkCopied(true);
    toast({ title: "Link copiado!", description: "O link da quadra foi copiado para a área de transferência." });
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Encontre sua Quadra</h1>
            <p className="text-muted-foreground">Reserve quadras esportivas na sua cidade</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Estados</SelectItem>
                <SelectItem value="Goiás">Goiás</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cidade} onValueChange={setCidade}>
              <SelectTrigger><SelectValue placeholder="Cidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as Cidades</SelectItem>
                <SelectItem value="Anápolis">Anápolis</SelectItem>
                <SelectItem value="Goiânia">Goiânia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoQuadra} onValueChange={setTipoQuadra}>
              <SelectTrigger><SelectValue placeholder="Tipo de Quadra" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos os Tipos">Todos os Tipos</SelectItem>
                <SelectItem value="Tênis">Tênis</SelectItem>
                <SelectItem value="Futebol">Futebol</SelectItem>
                <SelectItem value="Vôlei">Vôlei</SelectItem>
                <SelectItem value="Vôlei de Praia">Vôlei de Praia</SelectItem>
                <SelectItem value="Basquete">Basquete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input placeholder="Busque pelo nome" className="pl-10 h-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">
              {filteredCourts.length === 0 ? "Nenhuma quadra encontrada" : `Foram encontradas ${filteredCourts.length} Quadras`}
            </p>

            {filteredCourts.map((court) => (
              <div key={court.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🏀</div>
                      <p className="text-sm text-muted-foreground">{court.name}</p>
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-foreground text-background">{court.sport_type}</Badge>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{court.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />{court.location}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {court.has_parking && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground"><Car className="w-4 h-4" /><span>Estacionamento</span></div>
                    )}
                    {court.has_locker && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground"><Shirt className="w-4 h-4" /><span>Vestiário</span></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-2xl font-bold text-primary">R$ {court.price_per_hour.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">/ hora</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={selectedCourt?.id === court.id} onOpenChange={(open) => !open && setSelectedCourt(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => handleShare(court)}>
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Compartilhar Quadra</DialogTitle>
                            <DialogDescription>Compartilhe {court.name} com seus amigos</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Input readOnly value={`${window.location.origin}/booking?courtId=${court.id}`} className="h-10 text-sm" />
                              <Button size="icon" onClick={handleCopyLink} className="bg-accent hover:bg-accent/90 shrink-0">
                                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <Button onClick={handleCopyLink} className="w-full bg-accent hover:bg-accent/90">
                              {linkCopied ? "Link Copiado!" : "Copiar Link"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => navigate(`/chat?courtId=${court.id}&courtName=${encodeURIComponent(court.name)}`)}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button className="bg-accent hover:bg-accent/90" onClick={() => handleReserve(court.id)}>
                        Reservar Quadra
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Search;
