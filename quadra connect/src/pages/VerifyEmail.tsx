import { useState, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length < 5) {
      toast({
        variant: "destructive",
        title: "Código incompleto",
        description: "Por favor, preencha todos os dígitos.",
      });
      return;
    }
    toast({
      title: "Email verificado!",
      description: "Redirecionando para o login...",
    });
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Verifique seu Email</h1>
            <p className="text-sm text-muted-foreground">
              Enviamos um código para seu endereço para que possamos confirmar sua identidade
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            Confirmação
          </Button>
        </div>
      </div>

      {/* Wave Footer */}
      <div className="h-32 relative overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          <path
            d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z"
            className="fill-secondary-dark"
          />
          <path
            d="M0,80 C300,110 900,50 1200,80 L1200,120 L0,120 Z"
            className="fill-primary"
            opacity="0.8"
          />
        </svg>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5 L25 15 L20 12 L15 15 Z M20 12 L20 30" stroke="black" strokeWidth="2"/>
            <ellipse cx="20" cy="32" rx="8" ry="3" fill="black"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
