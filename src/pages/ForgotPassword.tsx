import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ variant: "destructive", title: "Erro", description: "Por favor, insira seu email." });
      return;
    }
    toast({ title: "Email enviado!", description: "Verifique sua caixa de entrada para redefinir sua senha." });
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleSMSReset = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Em desenvolvimento", description: "Recuperação por SMS estará disponível em breve." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Recuperar Senha</h1>
            <p className="text-muted-foreground">Escolha como deseja recuperar sua senha</p>
          </div>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleEmailReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
                </div>
                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90">Enviar Email</Button>
              </form>
            </TabsContent>
            <TabsContent value="sms">
              <form onSubmit={handleSMSReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12" maxLength={15} />
                </div>
                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90">Enviar SMS</Button>
              </form>
            </TabsContent>
          </Tabs>
          <Button type="button" variant="outline" className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => navigate("/login")}>
            Voltar ao Login
          </Button>
        </div>
      </div>
      <div className="h-32 relative overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" className="fill-secondary-dark" />
          <path d="M0,80 C300,110 900,50 1200,80 L1200,120 L0,120 Z" className="fill-primary" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
};

export default ForgotPassword;
