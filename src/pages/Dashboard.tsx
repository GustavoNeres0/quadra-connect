import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [userName] = useState("Usuário");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({ title: "Logout realizado!", description: "Até logo!" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-blue text-white p-6 pb-24 relative">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-start justify-between mb-8">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary-light text-white text-xl">{userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20"><Bell className="w-6 h-6" /></Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleLogout}><LogOut className="w-6 h-6" /></Button>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">Seja bem-vindo, {userName}</h1>
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Quadra Sport <span className="text-muted-foreground font-normal">mandou uma mensagem</span></p>
                <p className="text-sm text-muted-foreground">Boa tarde, você consegue chegar 10 minutos mais cedo?</p>
                <Button variant="link" className="p-0 h-auto text-accent">Responder →</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 -mt-16 pb-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Minhas Reservas</h2>
          <p className="text-sm text-muted-foreground mb-2">Próxima reserva: 14/08 - Quadra Central</p>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Quadra de Esportes Fortes</h3>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pago</p>
                    <p className="text-2xl font-bold text-success">R$ 46,90</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">A Receber</p>
                    <p className="text-2xl font-bold text-destructive">R$ 290,10</p>
                  </div>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Hoje</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">12 membros</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-card">
                          <AvatarFallback className="bg-primary text-xs">U{i}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
