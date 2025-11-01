import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileLoad: (content: string) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="p-8 rounded-full bg-gradient-primary shadow-glow animate-pulse">
        <Upload className="w-16 h-16 text-primary-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-accent bg-clip-text text-transparent">
          Carregue o Arquivo do WhatsApp
        </h2>
        <p className="text-muted-foreground mb-6">
          Selecione o arquivo Conversa.txt exportado do WhatsApp
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        size="lg"
        className="bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-glow px-8 py-6 text-lg"
      >
        <Upload className="w-5 h-5 mr-2" />
        Selecionar Arquivo
      </Button>
    </div>
  );
}
