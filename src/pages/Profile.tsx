import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, CreditCard, Bell, Shield, ChevronRight,
  LogOut, Camera, Star, Calendar, Clock, Loader2, Edit2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { authApi, profileApi, ApiError, type AuthUser, type CustomerProfile } from "@/lib/api";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [userData, customerData] = await Promise.all([
          authApi.me(),
          profileApi.customer(),
        ]);
        setUser(userData);
        setCustomer(customerData);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Erro ao carregar perfil";
        toast({ variant: "destructive", title: "Erro", description: message });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEditClick = () => {
    toast({ title: "Em breve", description: "A edição de perfil ainda não está disponível na API." });
  };

  const handleLogout = () => {
    authApi.logout();
    toast({ title: "Logout realizado!", description: "Até logo!" });
    navigate("/login");
  };

  const stats = [
    { label: "Reservas", value: "24", icon: Calendar },
    { label: "Horas", value: "48h", icon: Clock },
    { label: "Avaliação", value: "4.9", icon: Star },
  ];

  const menuItems = [
    { icon: CreditCard, label: "Métodos de Pagamento", desc: "Cartões e Pix cadastrados" },
    { icon: Bell, label: "Notificações", desc: "Alertas de reservas e promoções", toggle: true },
    { icon: Shield, label: "Privacidade e Segurança", desc: "Senha e dados pessoais" },
  ];

  const memberSince = customer?.createdAt
    ? new Date(customer.createdAt).getFullYear()
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-blue text-white px-6 pt-8 pb-24 rounded-b-[2rem]">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Meu Perfil</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-3 border-white/50">
                <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                  {customer?.name
                    ? customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{customer?.name ?? "Usuário"}</h2>
              <p className="text-white/70 text-sm">{user?.email}</p>
              {memberSince && (
                <Badge className="mt-2 bg-white/20 text-white border-0 text-xs">
                  Membro desde {memberSince}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 -mt-14 space-y-5">
        {/* Stats */}
        {/* TODO: substituir por dados reais de reservationsApi.listMine() */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 divide-x divide-border">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex flex-col items-center gap-1 py-1">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Informações Pessoais</h3>
              <Button variant="ghost" size="sm" className="text-accent gap-1" onClick={handleEditClick}>
                <Edit2 className="w-4 h-4" /> Editar
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { icon: User, label: "Nome", value: customer?.name ?? "-" },
                { icon: Mail, label: "Email", value: user?.email ?? "-" },
                { icon: Phone, label: "Telefone", value: customer?.phone ?? "-" },
                { icon: CreditCard, label: "CPF", value: customer?.cpf ?? "-" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-sm">
          <CardContent className="p-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    {item.toggle ? (
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {i < menuItems.length - 1 && <Separator className="mx-3" />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;