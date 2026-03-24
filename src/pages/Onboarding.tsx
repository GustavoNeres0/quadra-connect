import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Calendar } from "lucide-react";

const onboardingSteps = [
  {
    icon: Search,
    iconColor: "bg-accent",
    title: "Encontre Quadras",
    description: "Navegue por centenas de quadras esportivas disponíveis na sua região. Filtre por cidade, estado e tipo de esporte.",
  },
  {
    icon: Calendar,
    iconColor: "bg-success",
    title: "Agende Facilmente",
    description: "Reserve quadras em poucos cliques. Escolha data, horário e convide seus amigos para jogar junto.",
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/login");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentData = onboardingSteps[currentStep];
  const Icon = currentData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="relative bg-card border-2 border-accent/30 rounded-3xl p-8 shadow-lg">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <div className={`${currentData.iconColor} w-24 h-24 rounded-full flex items-center justify-center shadow-lg`}>
              <Icon className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              {currentData.title}
            </h1>

            <p className="text-muted-foreground leading-relaxed max-w-sm">
              {currentData.description}
            </p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-foreground"
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
