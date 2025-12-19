import { BookOpen, Calendar, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PatientDiary = () => {
  return (
    <div className="h-full flex flex-col safe-area-top">
      {/* Header */}
      <header className="bg-primary px-4 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">
              Diario del Paziente
            </h1>
            <p className="text-xs text-primary-foreground/80">
              Monitora il tuo percorso di cura
            </p>
          </div>
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Diario Terapeutico
            </h2>
            <p className="text-muted-foreground mb-6">
              Qui potrai registrare i tuoi sintomi, l'aderenza alla terapia e le note quotidiane.
            </p>
            <p className="text-sm text-muted-foreground italic mb-6">
              Funzionalità in arrivo...
            </p>
            <Button disabled className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Nuova Voce
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDiary;
