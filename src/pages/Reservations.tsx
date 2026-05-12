import { useState, useMemo } from "react";
import { Calendar, Users, MapPin, Clock, CheckCircle2, AlertCircle, CircleDollarSign, ArrowRight, Search } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Reservation {
  id: string;
  reservation_date: string;
  start_time: string;
  duration: number;
  num_players: number;
  total_price: number;
  amount_paid: number;
  payment_status: "paid" | "partial" | "pending";
  court_name: string;
  sport_type: string;
  location: string;
}

const mockReservations: Reservation[] = [
  { id: "1", reservation_date: "2026-05-20", start_time: "19:00", duration: 1, num_players: 10, total_price: 120, amount_paid: 120, payment_status: "paid", court_name: "Arena Sport Center", sport_type: "Futebol", location: "Rua das Flores, 123" },
  { id: "2", reservation_date: "2026-05-25", start_time: "20:00", duration: 2, num_players: 4, total_price: 160, amount_paid: 80, payment_status: "partial", court_name: "Quadra Central Tênis", sport_type: "Tênis", location: "Av. Brasil, 456" },
  { id: "3", reservation_date: "2026-06-02", start_time: "18:30", duration: 1, num_players: 6, total_price: 60, amount_paid: 0, payment_status: "pending", court_name: "Vôlei Praia Club", sport_type: "Vôlei de Praia", location: "Rua do Esporte, 789" },
  { id: "4", reservation_date: "2026-04-15", start_time: "17:00", duration: 1, num_players: 8, total_price: 90, amount_paid: 90, payment_status: "paid", court_name: "Basquete Arena", sport_type: "Basquete", location: "Rua Central, 321" },
];

const statusConfig = {
  paid: { label: "Pago", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
  partial: { label: "Parcial", icon: CircleDollarSign, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  pending: { label: "Pendente", icon: AlertCircle, className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

const formatDate = (s: string) =>
  new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const ReservationCard = ({ r }: { r: Reservation }) => {
  const cfg = statusConfig[r.payment_status];
  const Icon = cfg.icon;
  const progress = (r.amount_paid / r.total_price) * 100;

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
      <div className="h-1.5 gradient-blue" />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2 text-xs font-medium">{r.sport_type}</Badge>
            <h3 className="font-bold text-lg leading-tight truncate">{r.court_name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{r.location}</span>
            </div>
          </div>
          <Badge variant="outline" className={`${cfg.className} gap-1 shrink-0 font-medium`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/60">
          <div className="flex flex-col items-center text-center">
            <Calendar className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Data</span>
            <span className="text-sm font-semibold">{formatDate(r.reservation_date)}</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-border/60">
            <Clock className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Horário</span>
            <span className="text-sm font-semibold">{r.start_time}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Jogadores</span>
            <span className="text-sm font-semibold">{r.num_players}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground">Pagamento</span>
            <span className="text-sm">
              <span className="font-bold text-foreground">R$ {r.amount_paid.toFixed(2)}</span>
              <span className="text-muted-foreground"> / R$ {r.total_price.toFixed(2)}</span>
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {r.payment_status !== "paid" && (
          <Button className="w-full gradient-blue text-primary-foreground hover:opacity-90 border-0">
            Concluir pagamento
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Reservations = () => {
  const [reservations] = useState<Reservation[]>(mockReservations);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const { upcoming, past } = useMemo(() => {
    const upcoming = reservations.filter((r) => r.reservation_date >= today);
    const past = reservations.filter((r) => r.reservation_date < today);
    return { upcoming, past };
  }, [reservations, today]);

  const totalSpent = reservations.reduce((acc, r) => acc + r.amount_paid, 0);

  const EmptyState = ({ label }: { label: string }) => (
    <Card className="border-2 border-dashed rounded-2xl">
      <CardContent className="p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-muted-foreground">Encontre quadras disponíveis e faça sua reserva.</p>
        </div>
        <Button onClick={() => navigate("/search")} className="gradient-blue text-primary-foreground border-0 hover:opacity-90">
          <Search className="w-4 h-4" />
          Buscar quadras
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-blue text-primary-foreground rounded-b-3xl shadow-lg">
        <div className="container mx-auto max-w-2xl px-5 pt-10 pb-8">
          <h1 className="text-3xl font-bold">Minhas Reservas</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">Acompanhe e gerencie seus agendamentos</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{upcoming.length}</p>
              <p className="text-xs text-primary-foreground/80">Próximas</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{past.length}</p>
              <p className="text-xs text-primary-foreground/80">Concluídas</p>
            </div>
            
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-5 -mt-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 rounded-full bg-card border shadow-sm p-1">
            <TabsTrigger value="upcoming" className="rounded-full data-[state=active]:gradient-blue data-[state=active]:text-primary-foreground">
              Próximas ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-full data-[state=active]:gradient-blue data-[state=active]:text-primary-foreground">
              Histórico ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcoming.length === 0 ? (
              <EmptyState label="Nenhuma reserva próxima" />
            ) : (
              upcoming.map((r) => <ReservationCard key={r.id} r={r} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {past.length === 0 ? (
              <EmptyState label="Nenhuma reserva no histórico" />
            ) : (
              past.map((r) => <ReservationCard key={r.id} r={r} />)
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reservations;
