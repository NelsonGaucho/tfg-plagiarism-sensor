
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface UploadAreaProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
}

export function UploadArea({ onFileAccepted, isProcessing }: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const fileType = file.type;
    
    if (
      fileType === 'application/pdf' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      onFileAccepted(file);
    } else {
      toast({
        title: "Formato no soportado",
        description: "Por favor, sube un archivo PDF o WORD.",
        variant: "destructive",
      });
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    disabled: isProcessing,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const getFileIcon = (mime: string) => {
    if (mime.includes('pdf')) return <FileText className="h-6 w-6" />;
    if (mime.includes('word')) return <File className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "upload-area glass-card p-12 rounded-xl cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 group animate-fade-in",
        isDragActive && "upload-area-active scale-[1.01]",
        isDragReject && "border-red-500 bg-red-50/10",
        isProcessing && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="rounded-full bg-primary/10 p-4 mb-4 transition-transform duration-300 group-hover:scale-110">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">
        {isDragActive ? "Suelta el archivo aquí" : "Sube tu TFG o TFM"}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-4">
        Arrastra y suelta tu documento o haz clic para seleccionarlo.
        Aceptamos archivos PDF y WORD.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-background/80 border border-border text-sm">
          {getFileIcon('application/pdf')}
          PDF
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-background/80 border border-border text-sm">
          {getFileIcon('application/word')}
          DOCX
        </div>
      </div>
      
      <Button 
        variant="outline" 
        disabled={isProcessing}
        className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
      >
        Seleccionar archivo
      </Button>
    </div>
  );
}
