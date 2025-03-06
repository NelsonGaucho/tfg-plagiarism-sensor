
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, FileText, DownloadCloud, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  plagiarismPercentage: number;
  onReset: () => void;
}

export function ResultDisplay({ plagiarismPercentage, onReset }: ResultDisplayProps) {
  const isLow = plagiarismPercentage <= 20;
  const isMedium = plagiarismPercentage > 20 && plagiarismPercentage <= 50;
  const isHigh = plagiarismPercentage > 50;
  
  const getStatusColor = () => {
    if (isLow) return 'text-plagiarism-low';
    if (isMedium) return 'text-plagiarism-medium';
    return 'text-plagiarism-high';
  };
  
  const getStatusBg = () => {
    if (isLow) return 'bg-plagiarism-low/10';
    if (isMedium) return 'bg-plagiarism-medium/10';
    return 'bg-plagiarism-high/10';
  };
  
  const getStatusBorder = () => {
    if (isLow) return 'border-plagiarism-low/20';
    if (isMedium) return 'border-plagiarism-medium/20';
    return 'border-plagiarism-high/20';
  };
  
  const getStatusIcon = () => {
    if (isLow) return <CheckCircle className="h-12 w-12 text-plagiarism-low" />;
    if (isMedium) return <AlertTriangle className="h-12 w-12 text-plagiarism-medium" />;
    return <XCircle className="h-12 w-12 text-plagiarism-high" />;
  };
  
  const getMessage = () => {
    if (isLow) return "Tu documento parece mayormente original.";
    if (isMedium) return "Se ha detectado algo de contenido similar a fuentes externas.";
    return "Se ha detectado una cantidad significativa de posible plagio.";
  };
  
  const getRecommendation = () => {
    if (isLow) return "Tu trabajo tiene un bajo nivel de similitud con fuentes externas. Puedes seguir adelante.";
    if (isMedium) return "Considera revisar y citar adecuadamente las secciones marcadas antes de entregar.";
    return "Recomendamos una revisión exhaustiva y reescribir partes significativas de tu trabajo.";
  };

  // Mock data for demonstration
  const plagiarismSources = [
    { url: "wikipedia.org/articulo-academico", matchPercentage: plagiarismPercentage * 0.4 },
    { url: "repositorio-universidad.edu/tesis-2018", matchPercentage: plagiarismPercentage * 0.3 },
    { url: "plataforma-academica.com/paper-2019", matchPercentage: plagiarismPercentage * 0.2 },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex justify-center mb-4"
        >
          {getStatusIcon()}
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-2">Resultado del análisis</h2>
        <p className="text-muted-foreground">{getMessage()}</p>
      </div>
      
      <div className="glass-card rounded-xl border p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-1">Informe de plagio</h3>
            <p className="text-sm text-muted-foreground">
              Resultados del análisis de tu documento
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Ver informe</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <DownloadCloud className="h-4 w-4" />
              <span>Descargar</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="text-center">
              <div className={cn(
                "inline-flex items-center justify-center h-32 w-32 rounded-full mb-4 transition-all duration-300",
                getStatusBg(), getStatusBorder()
              )}>
                <motion.span 
                  className={cn("text-4xl font-bold", getStatusColor())}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {plagiarismPercentage}%
                </motion.span>
              </div>
              <h4 className="font-medium mb-1">Contenido similar</h4>
              <p className="text-sm text-muted-foreground">Porcentaje de plagio detectado</p>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-3">Recomendación</h3>
            <p className="text-muted-foreground mb-4">{getRecommendation()}</p>
            
            <div className={cn(
              "rounded-lg p-4 border",
              getStatusBg(), getStatusBorder()
            )}>
              <h4 className={cn("font-medium mb-2", getStatusColor())}>
                Nivel de alerta: {isLow ? "Bajo" : isMedium ? "Medio" : "Alto"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isLow 
                  ? "Tu documento cumple con los estándares académicos de originalidad."
                  : isMedium 
                    ? "Es recomendable revisar y citar adecuadamente las fuentes."
                    : "Es necesario reescribir partes significativas de tu documento."}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Principales fuentes similares</h3>
          <div className="space-y-3">
            {plagiarismSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-background/40">
                <span className="text-sm font-medium truncate max-w-[70%]">{source.url}</span>
                <span className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-full",
                  source.matchPercentage <= 10 ? "bg-plagiarism-low/10 text-plagiarism-low" :
                  source.matchPercentage <= 25 ? "bg-plagiarism-medium/10 text-plagiarism-medium" :
                  "bg-plagiarism-high/10 text-plagiarism-high"
                )}>
                  {source.matchPercentage.toFixed(1)}% coincidencia
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="gap-2 hover:bg-background"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Analizar otro documento</span>
        </Button>
      </div>
    </div>
  );
}
