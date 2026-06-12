import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, MapPin, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { unitsApi, categoriesApi, ApiError, type Unit, type Category } from "@/lib/api";

const quickCategories = [
  { label: "Futebol", emoji: "⚽" },
  { label: "Tênis", emoji: "🎾" },
  { label: "Basquete", emoji: "🏀" },
  { label: "Vôlei", emoji: "🏐" },
];

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

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  const popularUnits = units.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-blue text-white px-6 pt-8 pb-20 rounded-b-[2rem]">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm">Bem-vindo de volta 👋</p>
              {/* TODO: trocar "Usuário" pelo nome real via profileApi.customer() */}
              <h1 className="text-2xl font-bold">Usuário</h1>
            </div>
            <Avatar
              className="w-12 h-12 border-2 border-white/50 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarFallback className="bg-white/20 text-white font-bold">U</AvatarFallback>
            </Avatar>
          </div>

          {/* Search Bar */}
          <button
            onClick={() => navigate("/search")}
            className="w-full flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3.5 text-white/70 hover:bg-white/25 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="text-sm">Buscar quadras esportivas...</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 -mt-10 space-y-6">
        {/* Quick Categories */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-3">
              {quickCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => navigate("/search")}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-xs font-medium text-foreground">{cat.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {/* TODO: substituir valores fixos por dados reais de reservationsApi.listMine() (Passo 9) */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Reservas este mês</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-success/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12h</p>
                <p className="text-xs text-muted-foreground">Horas jogadas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próxima Reserva */}
        {/* TODO: substituir pelo dado real (próxima reserva futura) na integração de Reservations.tsx (Passo 9) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Próxima Reserva</h2>
            <Button variant="link" className="text-accent p-0 h-auto" onClick={() => navigate("/reservations")}>
              Ver todas <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Card className="border-l-4 border-l-accent shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Arena Sport Center</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> Rua das Flores, 123
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">Futebol</Badge>
                    <span className="text-xs text-muted-foreground">14/08 • 18:00 - 19:00</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">R$ 120,00</p>
                  <Badge className="bg-success/10 text-success border-0 text-xs mt-1">Confirmada</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quadras Populares */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Quadras Populares</h2>
            <Button variant="link" className="text-accent p-0 h-auto" onClick={() => navigate("/search")}>
              Ver mais <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Carregando quadras...
            </div>
          ) : popularUnits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma quadra cadastrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {popularUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/booking?courtId=${unit.id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-2xl">{sportEmoji(categoryName(unit.categoryId))}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{unit.name}</h3>
                      <p className="text-sm text-muted-foreground">{unit.city}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{categoryName(unit.categoryId)}</Badge>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">R$ {Number(unit.pricePerHour).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">/hora</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;