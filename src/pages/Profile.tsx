import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, CreditCard, Bell, Shield, ChevronRight,
  LogOut, Camera, Edit2, Star, Calendar, Clock
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(62) 99999-1234",
    cpf: "123.456.789-00",
    city: "Anápolis",
    state: "Goiás",
    address: "Rua das Flores, 123",
  });
  const [editData, setEditData] = useState(profile);

  const handleSave = () => {
    setProfile(editData);
    setEditOpen(false);
    toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
  };

  const handleLogout = () => {
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
                  {profile.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-white/70 text-sm">{profile.email}</p>
              <Badge className="mt-2 bg-white/20 text-white border-0 text-xs">
                Membro desde 2024
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 -mt-14 space-y-5">
        {/* Stats */}
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
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-accent gap-1" onClick={() => setEditData(profile)}>
                    <Edit2 className="w-4 h-4" /> Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input value={editData.city} onChange={(e) => setEditData({...editData, city: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Estado</Label>
                        <Input value={editData.state} onChange={(e) => setEditData({...editData, state: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Endereço</Label>
                      <Input value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} />
                    </div>
                    <Button className="w-full" onClick={handleSave}>Salvar Alterações</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {[
                { icon: User, label: "Nome", value: profile.name },
                { icon: Mail, label: "Email", value: profile.email },
                { icon: Phone, label: "Telefone", value: profile.phone },
                { icon: CreditCard, label: "CPF", value: profile.cpf },
                { icon: MapPin, label: "Localização", value: `${profile.city}, ${profile.state}` },
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
