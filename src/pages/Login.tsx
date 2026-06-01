import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: "destructive", title: "Erro", description: "Por favor, preencha todos os campos." });
      return;
    }
    toast({ title: "Login realizado!", description: "Redirecionando..." });
    navigate("/home");
  };

  const handleGoogleLogin = () => {
    toast({ title: "Login com Google", description: "Funcionalidade disponível em breve." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
            <button type="button" className="text-accent text-sm hover:underline" onClick={() => navigate("/forgot-password")}>
              Esqueceu sua senha?
            </button>
            <div className="space-y-3 pt-2">
              <Button type="submit" variant="outline" className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Login
              </Button>
              <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full h-12 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Entrar com Google
              </Button>
              <Button type="button" onClick={() => navigate("/register")} className="w-full h-12 bg-primary hover:bg-primary/90">
                Cadastrar
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

export default Login;
