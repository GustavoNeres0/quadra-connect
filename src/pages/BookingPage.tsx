import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Clock, Users, DollarSign, Loader2 } from "lucide-react";
import { unitsApi, categoriesApi, reservationsApi, ApiError, type Unit, type Category } from "@/lib/api";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("courtId");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingUnit, setLoadingUnit] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [numPlayers, setNumPlayers] = useState("2");

  useEffect(() => {
    if (!courtId) {
      setLoadingUnit(false);
      return;
    }

    const loadData = async () => {
      try {
        const [unitData, categoriesData] = await Promise.all([
          unitsApi.get(courtId),
          categoriesApi.list(),
        ]);
        setUnit(unitData);
        setCategories(categoriesData);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Quadra não encontrada";
        toast({ variant: "destructive", title: "Erro", description: message });
      } finally {
        setLoadingUnit(false);
      }
    };
    loadData();
  }, [courtId]);

  const categoryName = useMemo(
    () => categories.find((c) => c.id === unit?.categoryId)?.name ?? "Outro",
    [categories, unit]
  );

  const calculateTotalPrice = () => {
    if (!unit) return 0;
    return Number(unit.pricePerHour) * parseInt(duration);
  };

  const handleReservation = async () => {
    if (!date || !startTime || !unit) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Por favor, preencha todos os campos." });
      return;
    }

    const [hours, minutes] = startTime.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + parseInt(duration));

    setSubmitting(true);
    try {
      await reservationsApi.create({
        unitId: unit.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        totalPrice: calculateTotalPrice(),
      });
      toast({ title: "Reserva confirmada!", description: "Sua reserva foi realizada com sucesso." });
      navigate("/reservations");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Erro ao confirmar reserva";
      toast({ variant: "destructive", title: "Erro", description: message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUnit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Quadra não encontrada.</p>
          <Button onClick={() => navigate("/search")}>Voltar à busca</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate("/search")} className="mb-6 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />Voltar
        </Button>

        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <h1 className="text-2xl font-bold">{unit.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{categoryName}</span>
            </div>
            <p className="text-muted-foreground">{unit.address}</p>
            {unit.description && <p className="text-muted-foreground text-sm">{unit.description}</p>}
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">R$ {Number(unit.pricePerHour).toFixed(2)}</span>
              <span className="text-muted-foreground">/ hora</span>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold">Detalhes da Reserva</h2>
            <div className="space-y-2">
              <Label>Selecione a Data</Label>
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(date) => date < new Date()} className="rounded-md border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime"><Clock className="w-4 h-4 inline mr-2" />Horário de Início</Label>
              <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (horas)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="3">3 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numPlayers"><Users className="w-4 h-4 inline mr-2" />Número de Jogadores</Label>
              <Input id="numPlayers" type="number" min="1" max="20" value={numPlayers} onChange={(e) => setNumPlayers(e.target.value)} className="h-12" />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-primary">R$ {calculateTotalPrice().toFixed(2)}</span>
              </div>
              <Button onClick={handleReservation} disabled={submitting} className="w-full h-12 bg-accent hover:bg-accent/90">
                {submitting ? "Confirmando..." : "Confirmar Reserva"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BookingPage;