import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, Share2, Copy, Check, MessageCircle, Loader2 } from "lucide-react";
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
import { unitsApi, categoriesApi, ApiError, type Unit, type Category } from "@/lib/api";

const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();

const sportEmoji = (categoryName: string) => {
  const name = normalizeText(categoryName);
  if (name.includes("futebol")) return "⚽";
  if (name.includes("tenis")) return "🎾";
  if (name.includes("volei")) return "🏐";
  if (name.includes("basquete")) return "🏀";
  return "🏟️";
};

const Search = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [estado, setEstado] = useState("Todos");
  const [cidade, setCidade] = useState("Todas");
  const [tipoQuadra, setTipoQuadra] = useState("Todos os Tipos");
  const [searchTerm, setSearchTerm] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Unit | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [unitsData, categoriesData] = await Promise.all([
          unitsApi.list(),
          categoriesApi.list(),
        ]);
        setUnits(unitsData);
        setCategories(categoriesData);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Erro ao carregar quadras";
        toast({ variant: "destructive", title: "Erro", description: message });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "Outro";

  // Opções dinâmicas dos filtros
  const estados = useMemo(
    () => Array.from(new Set(units.map((u) => u.state))).sort(),
    [units]
  );
  const cidades = useMemo(
    () => Array.from(new Set(units.map((u) => u.city))).sort(),
    [units]
  );
  const tipos = useMemo(
    () => Array.from(new Set(units.map((u) => categoryName(u.categoryId)))).sort(),
    [units, categories]
  );

  const filteredCourts = useMemo(() => {
    let filtered = units;

    if (estado !== "Todos") {
      filtered = filtered.filter((unit) => unit.state === estado);
    }
    if (cidade !== "Todas") {
      filtered = filtered.filter((unit) => unit.city === cidade);
    }
    if (tipoQuadra !== "Todos os Tipos") {
      filtered = filtered.filter((unit) => categoryName(unit.categoryId) === tipoQuadra);
    }
    if (searchTerm) {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered.filter((unit) =>
        normalizeText(unit.name).includes(normalizedSearch) ||
        normalizeText(unit.address).includes(normalizedSearch)
      );
    }
    return filtered;
  }, [units, estado, cidade, tipoQuadra, searchTerm, categories]);

  const handleShare = (court: Unit) => {
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
                {estados.map((uf) => (
                  <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cidade} onValueChange={setCidade}>
              <SelectTrigger><SelectValue placeholder="Cidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as Cidades</SelectItem>
                {cidades.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tipoQuadra} onValueChange={setTipoQuadra}>
              <SelectTrigger><SelectValue placeholder="Tipo de Quadra" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos os Tipos">Todos os Tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input placeholder="Busque pelo nome" className="pl-10 h-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Carregando quadras...
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                {filteredCourts.length === 0 ? "Nenhuma quadra encontrada" : `Foram encontradas ${filteredCourts.length} Quadras`}
              </p>

              {filteredCourts.map((court) => (
                <div key={court.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">{sportEmoji(categoryName(court.categoryId))}</div>
                        <p className="text-sm text-muted-foreground">{court.name}</p>
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-foreground text-background">{categoryName(court.categoryId)}</Badge>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">{court.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />{court.address}
                      </p>
                      {court.description && (
                        <p className="text-sm text-muted-foreground mt-1">{court.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-2xl font-bold text-primary">R$ {Number(court.pricePerHour).toFixed(2)}</p>
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
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Search;