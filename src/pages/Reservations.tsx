import { useState, useEffect, useMemo } from "react";
import { Calendar, Users, MapPin, Clock, CheckCircle2, AlertCircle, XCircle, Search, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  reservationsApi, unitsApi, categoriesApi, ApiError,
  ReservationStatus, type Reservation, type Unit, type Category,
} from "@/lib/api";

const statusConfig: Record<ReservationStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  [ReservationStatus.PENDING]: { label: "Pendente", icon: AlertCircle, className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  [ReservationStatus.CONFIRMED]: { label: "Confirmada", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
  [ReservationStatus.REJECTED]: { label: "Rejeitada", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  [ReservationStatus.CANCELLED]: { label: "Cancelada", icon: XCircle, className: "bg-muted text-muted-foreground border-border" },
  [ReservationStatus.COMPLETED]: { label: "Concluída", icon: CheckCircle2, className: "bg-primary/10 text-primary border-primary/20" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

interface ReservationCardProps {
  reservation: Reservation;
  unit?: Unit;
  categoryName: string;
  onCancel: (id: string) => void;
  cancelling: boolean;
}

const ReservationCard = ({ reservation, unit, categoryName, onCancel, cancelling }: ReservationCardProps) => {
  const cfg = statusConfig[reservation.status];
  const Icon = cfg.icon;
  const start = new Date(reservation.startTime);
  const end = new Date(reservation.endTime);
  const durationHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  const canCancel = reservation.status === ReservationStatus.PENDING || reservation.status === ReservationStatus.CONFIRMED;

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
      <div className="h-1.5 gradient-blue" />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2 text-xs font-medium">{categoryName}</Badge>
            <h3 className="font-bold text-lg leading-tight truncate">{unit?.name ?? "Quadra"}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{unit?.address ?? "-"}</span>
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
            <span className="text-sm font-semibold">{formatDate(reservation.startTime)}</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-border/60">
            <Clock className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Horário</span>
            <span className="text-sm font-semibold">{formatTime(reservation.startTime)}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Duração</span>
            <span className="text-sm font-semibold">{durationHours}h</span>
          </div>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-xs text-muted-foreground">Valor total</span>
          <span className="text-lg font-bold text-foreground">R$ {Number(reservation.totalPrice).toFixed(2)}</span>
        </div>

        {reservation.bailPaid && (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 w-fit">
            Caução pago
          </Badge>
        )}

        {canCancel && (
          <Button
            variant="outline"
            disabled={cancelling}
            onClick={() => onCancel(reservation.id)}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {cancelling ? "Cancelando..." : "Cancelar reserva"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [units, setUnits] = useState<Record<string, Unit>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [data, categoriesData] = await Promise.all([
          reservationsApi.listMine(),
          categoriesApi.list(),
        ]);
        setReservations(data);
        setCategories(categoriesData);

        const unitIds = [...new Set(data.map((r) => r.unitId))];
        const unitsData = await Promise.all(unitIds.map((id) => unitsApi.get(id)));
        setUnits(Object.fromEntries(unitsData.map((u) => [u.id, u])));
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Erro ao carregar reservas";
        toast({ variant: "destructive", title: "Erro", description: message });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryName = (categoryId?: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "Outro";

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcoming = reservations.filter((r) => new Date(r.startTime) >= now);
    const past = reservations.filter((r) => new Date(r.startTime) < now);
    return { upcoming, past };
  }, [reservations]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await reservationsApi.cancel(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: ReservationStatus.CANCELLED } : r))
      );
      toast({ title: "Reserva cancelada" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Erro ao cancelar reserva";
      toast({ variant: "destructive", title: "Erro", description: message });
    } finally {
      setCancellingId(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
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
              upcoming.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  unit={units[r.unitId]}
                  categoryName={categoryName(units[r.unitId]?.categoryId)}
                  onCancel={handleCancel}
                  cancelling={cancellingId === r.id}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {past.length === 0 ? (
              <EmptyState label="Nenhuma reserva no histórico" />
            ) : (
              past.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  unit={units[r.unitId]}
                  categoryName={categoryName(units[r.unitId]?.categoryId)}
                  onCancel={handleCancel}
                  cancelling={cancellingId === r.id}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reservations;