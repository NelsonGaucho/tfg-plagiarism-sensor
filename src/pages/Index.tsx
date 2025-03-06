
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { UploadArea } from '@/components/UploadArea';
import { ScanProgress } from '@/components/ScanProgress';
import { ResultDisplay } from '@/components/ResultDisplay';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [plagiarismPercentage, setPlagiarismPercentage] = useState(0);
  const { toast } = useToast();

  // Mock scanning process
  useEffect(() => {
    if (!scanning || !file) return;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanComplete(true);
            // Generate a random plagiarism percentage for demo purposes
            const randomPercentage = Math.floor(Math.random() * 100);
            setPlagiarismPercentage(randomPercentage);
          }, 500);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [scanning, file]);

  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
    setScanning(true);
    toast({
      title: "Documento recibido",
      description: `Analizando ${acceptedFile.name}`,
    });
  };

  const handleReset = () => {
    setFile(null);
    setScanning(false);
    setProgress(0);
    setScanComplete(false);
    setPlagiarismPercentage(0);
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="max-w-4xl mx-auto">
          {!file && (
            <div className="space-y-6 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                  Detector de Plagio para TFG y TFM
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Analiza tu trabajo académico y detecta coincidencias con contenido publicado en internet.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <UploadArea 
                  onFileAccepted={handleFileAccepted}
                  isProcessing={scanning}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center text-sm text-muted-foreground"
              >
                <p>
                  Subiendo un documento, aceptas nuestros{" "}
                  <a href="#" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    Términos de Servicio
                  </a>
                  {" "}y{" "}
                  <a href="#" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    Política de Privacidad
                  </a>
                </p>
              </motion.div>
            </div>
          )}
          
          {file && scanning && !scanComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-xl border p-6 md:p-8"
            >
              <ScanProgress progress={progress} isComplete={false} />
            </motion.div>
          )}
          
          {file && scanComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ResultDisplay 
                plagiarismPercentage={plagiarismPercentage} 
                onReset={handleReset}
              />
            </motion.div>
          )}
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default Index;
