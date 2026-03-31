import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Reservation {
  id: string;
  reservation_date: string;
  num_players: number;
  total_price: number;
  amount_paid: number;
  payment_status: string;
  court_name: string;
  sport_type: string;
}

const mockReservations: Reservation[] = [
  { id: "1", reservation_date: "2026-03-01", num_players: 10, total_price: 120, amount_paid: 120, payment_status: "paid", court_name: "Arena Sport Center", sport_type: "Futebol" },
  { id: "2", reservation_date: "2026-03-05", num_players: 4, total_price: 80, amount_paid: 40, payment_status: "partial", court_name: "Quadra Central Tênis", sport_type: "Tênis" },
  { id: "3", reservation_date: "2026-03-10", num_players: 6, total_price: 60, amount_paid: 0, payment_status: "pending", court_name: "Vôlei Praia Club", sport_type: "Vôlei de Praia" },
];

const Reservations = () => {
  const [reservations] = useState<Reservation[]>(mockReservations);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600";
      case "partial": return "text-yellow-600";
      case "pending": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Pago";
      case "partial": return "Parcial";
      case "pending": return "Pendente";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Histórico de Reservas</h1>
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Você ainda não tem reservas.</p>
                <button onClick={() => navigate("/search")} className="text-accent hover:underline mt-2">Buscar quadras disponíveis</button>
              </CardContent>
            </Card>
          ) : (
            reservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden border-2">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{reservation.court_name}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.sport_type}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(reservation.reservation_date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{reservation.num_players}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${getStatusColor(reservation.payment_status)}`}>
                          {getStatusLabel(reservation.payment_status)}
                        </span>
                        <span className="font-bold">
                          R$ {reservation.amount_paid.toFixed(2)} / R$ {reservation.total_price.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={(reservation.amount_paid / reservation.total_price) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Reservations;
