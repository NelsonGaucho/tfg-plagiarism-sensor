
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, FileText, DownloadCloud, RotateCcw, Diamond, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ResultDisplayProps {
  plagiarismPercentage: number;
  onReset: () => void;
}

export function ResultDisplay({ plagiarismPercentage, onReset }: ResultDisplayProps) {
  const isLow = plagiarismPercentage <= 20;
  const isMedium = plagiarismPercentage > 20 && plagiarismPercentage <= 50;
  const isHigh = plagiarismPercentage > 50;
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
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

  // Documento de ejemplo con secciones marcadas (verde/rojo)
  const documentSections = [
    { text: "1. Introducción\n\nEste trabajo de fin de grado tiene como objetivo analizar el impacto de las redes sociales en los jóvenes universitarios.", isSafe: true },
    { text: "Los estudios previos han demostrado que existe una correlación entre el uso de redes sociales y el rendimiento académico, como señala García (2019).", isSafe: true },
    { text: "Las redes sociales se han convertido en una herramienta fundamental para la comunicación entre los jóvenes universitarios, afectando su forma de relacionarse y de consumir información.", isSafe: false },
    { text: "2. Marco teórico\n\nLa teoría de la comunicación digital establece que los canales de comunicación influyen directamente en la forma en que se procesa la información (Johnson, 2018).", isSafe: true },
    { text: "Diferentes autores han planteado que las redes sociales generan dependencia psicológica y afectan la capacidad de concentración de los estudiantes universitarios.", isSafe: false },
    { text: "Los algoritmos de las redes sociales premian el contenido que genera mayor engagement, lo que puede llevar a la creación de burbujas informativas.", isSafe: true },
    { text: "3. Metodología\n\nPara este estudio se utilizó una metodología mixta, combinando encuestas cuantitativas con entrevistas cualitativas a una muestra de 250 estudiantes universitarios.", isSafe: true },
    { text: "Las variables dependientes fueron el rendimiento académico, medido por la nota media, y el tiempo dedicado al estudio. Las variables independientes incluyeron el tiempo de uso de redes sociales y el tipo de actividad realizada en ellas.", isSafe: false },
    { text: "4. Resultados\n\nLos resultados indican que existe una correlación negativa entre el tiempo de uso de redes sociales y el rendimiento académico (r = -0.42, p < 0.01).", isSafe: true },
    { text: "El análisis multivariante mostró que los estudiantes que utilizan redes sociales más de 3 horas diarias tienen un 27% menos de tiempo dedicado al estudio.", isSafe: false },
    { text: "5. Conclusiones\n\nEste trabajo demuestra que el uso excesivo de redes sociales afecta negativamente el rendimiento académico de los estudiantes universitarios.", isSafe: true },
    { text: "Se recomienda implementar programas de concientización sobre el uso responsable de tecnologías digitales en el ámbito universitario.", isSafe: true },
  ];

  const unlockPremiumContent = () => {
    // Aquí iría la lógica para verificar y descontar créditos
    setPremiumUnlocked(true);
  };

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
        
        <div className="mb-8">
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
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Análisis extenso y recomendaciones</h3>
            <div className="flex items-center">
              <Diamond className="h-4 w-4 text-emerald-600 mr-1.5" />
              <span className="text-sm text-muted-foreground">1 crédito</span>
            </div>
          </div>
          
          <div className={cn(
            "relative border rounded-lg overflow-hidden",
            !premiumUnlocked && "backdrop-blur-md"
          )}>
            <div className={cn(
              "p-4 max-h-96 overflow-y-auto",
              !premiumUnlocked && "pointer-events-none"
            )}>
              {documentSections.map((section, index) => (
                <p 
                  key={index} 
                  className={cn(
                    "mb-4 font-mono text-sm whitespace-pre-line",
                    section.isSafe ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                  )}
                >
                  {section.text}
                </p>
              ))}
            </div>
            
            {!premiumUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm p-6 text-center">
                <div className="mb-4 bg-primary/10 p-3 rounded-full">
                  <LockKeyhole className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Desbloquea el análisis completo</h4>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Obtén recomendaciones detalladas sobre qué partes modificar para evitar el plagio y mejorar la originalidad de tu trabajo.
                </p>
                
                {isAuthenticated ? (
                  <Button 
                    onClick={unlockPremiumContent} 
                    className="gap-2"
                  >
                    <Diamond className="h-4 w-4" />
                    Usar 1 crédito para desbloquear
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate('/login')}
                      className="mb-2"
                    >
                      Iniciar sesión para continuar
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => navigate('/pricing')}
                    >
                      No tienes suficientes créditos
                    </Button>
                  </>
                )}
              </div>
            )}
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
    </div>
  );
}
