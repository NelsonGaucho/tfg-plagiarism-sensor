
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader, Search, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanProgressProps {
  progress: number;
  isComplete: boolean;
}

export function ScanProgress({ progress, isComplete }: ScanProgressProps) {
  const getStepStatus = (stepThreshold: number) => {
    if (isComplete) return "complete";
    if (progress >= stepThreshold) return "active";
    return "pending";
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-center mb-2">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            progress < 100 ? "bg-primary/20" : "bg-plagiarism-low/20"
          )}>
            {progress < 100 ? (
              <Loader className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <FileSearch className="h-6 w-6 text-plagiarism-low" />
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-center mb-2">
          {progress < 100 ? "Analizando documento..." : "Análisis completado"}
        </h3>
        
        <p className="text-muted-foreground text-center mb-4">
          {progress < 100 
            ? "Estamos escaneando tu documento en busca de contenido duplicado." 
            : "Hemos completado el análisis de tu documento."}
        </p>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={cn(
          "p-4 rounded-lg border transition-all duration-300",
          getStepStatus(10) === "complete" ? "border-plagiarism-low bg-plagiarism-low/5" :
          getStepStatus(10) === "active" ? "border-primary bg-primary/5 animate-pulse-opacity" :
          "border-muted bg-muted/5"
        )}>
          <h4 className="font-medium mb-1">Extracción de texto</h4>
          <p className="text-sm text-muted-foreground">Extrayendo contenido del documento</p>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border transition-all duration-300",
          getStepStatus(40) === "complete" ? "border-plagiarism-low bg-plagiarism-low/5" :
          getStepStatus(40) === "active" ? "border-primary bg-primary/5 animate-pulse-opacity" :
          "border-muted bg-muted/5"
        )}>
          <h4 className="font-medium mb-1">Comparación web</h4>
          <p className="text-sm text-muted-foreground">Comparando con fuentes en internet</p>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border transition-all duration-300",
          getStepStatus(70) === "complete" ? "border-plagiarism-low bg-plagiarism-low/5" :
          getStepStatus(70) === "active" ? "border-primary bg-primary/5 animate-pulse-opacity" :
          "border-muted bg-muted/5"
        )}>
          <h4 className="font-medium mb-1">Análisis final</h4>
          <p className="text-sm text-muted-foreground">Calculando porcentaje de originalidad</p>
        </div>
      </div>
    </div>
  );
}
