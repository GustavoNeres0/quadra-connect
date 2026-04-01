import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCPF, formatPhone } from "@/lib/validations";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", cpf: "", phone: "", address: "", city: "", state: "", password: "", confirmPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "cpf") formattedValue = formatCPF(value);
    else if (name === "phone") formattedValue = formatPhone(value);
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Erro", description: "As senhas não coincidem." });
      return;
    }
    if (formData.password.length < 6) {
      toast({ variant: "destructive", title: "Erro", description: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }
    toast({ title: "Cadastro realizado!", description: "Você já pode fazer login." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
            <p className="text-muted-foreground">Preencha seus dados para se cadastrar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" placeholder="Digite seu nome completo" value={formData.name} onChange={handleChange} className="h-12" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} className="h-12" maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} className="h-12" maxLength={14} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange} className="h-12" maxLength={15} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" name="address" placeholder="Rua, número, complemento" value={formData.address} onChange={handleChange} className="h-12" maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} className="h-12" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" name="state" placeholder="UF" value={formData.state} onChange={handleChange} className="h-12" maxLength={2} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleChange} className="h-12" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Digite a senha novamente" value={formData.confirmPassword} onChange={handleChange} className="h-12" maxLength={100} />
            </div>
            <div className="space-y-3 pt-4">
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90">Criar Conta</Button>
              <Button type="button" variant="outline" className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => navigate("/login")}>
                Já tenho conta
              </Button>
            </div>
          </form>
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

export default Register;
