import { useNavigate } from "react-router-dom";
import { Search, Calendar, MapPin, TrendingUp, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";

const popularCourts = [
  { id: "1", name: "Arena Sport Center", sport: "Futebol", price: 120, city: "Anápolis", rating: 4.8 },
  { id: "2", name: "Quadra Central Tênis", sport: "Tênis", price: 80, city: "Anápolis", rating: 4.5 },
  { id: "4", name: "Basquete Arena", sport: "Basquete", price: 90, city: "Anápolis", rating: 4.7 },
];

const quickCategories = [
  { label: "Futebol", emoji: "⚽" },
  { label: "Tênis", emoji: "🎾" },
  { label: "Basquete", emoji: "🏀" },
  { label: "Vôlei", emoji: "🏐" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-blue text-white px-6 pt-8 pb-20 rounded-b-[2rem]">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm">Bem-vindo de volta 👋</p>
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
          <div className="space-y-3">
            {popularCourts.map((court) => (
              <Card
                key={court.id}
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/booking?courtId=${court.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">
                      {court.sport === "Futebol" ? "⚽" : court.sport === "Tênis" ? "🎾" : "🏀"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{court.name}</h3>
                    <p className="text-sm text-muted-foreground">{court.city}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-foreground">{court.rating}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary">R$ {court.price}</p>
                    <p className="text-xs text-muted-foreground">/hora</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
