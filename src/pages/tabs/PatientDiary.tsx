import { useState, useEffect } from "react";
import { BookOpen, Pill, ClipboardList, Calendar, HelpCircle } from "lucide-react";
import { diaryService, AssunzioneGiornaliera, PianoTerapeutico as PianoTerapeuticoType, GiornoCalendario, Questionario, CompilazioneQuestionario, NotaAggiuntiva } from "@/services/diaryService";
import AssunzioniOggi from "@/components/diary/AssunzioniOggi";
import PianoTerapeutico from "@/components/diary/PianoTerapeutico";
import QuestionariClinici from "@/components/diary/QuestionariClinici";
import FAQSection from "@/components/diary/FAQSection";
import { Skeleton } from "@/components/ui/skeleton";

const PatientDiary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assunzioniOggi, setAssunzioniOggi] = useState<AssunzioneGiornaliera[]>([]);
  const [piano, setPiano] = useState<PianoTerapeuticoType | null>(null);
  const [calendario, setCalendario] = useState<GiornoCalendario[]>([]);
  const [questionari, setQuestionari] = useState<Questionario[]>([]);
  const [compilazioni, setCompilazioni] = useState<CompilazioneQuestionario[]>([]);
  const [note, setNote] = useState<NotaAggiuntiva[]>([]);

  const loadData = async () => {
    try {
      const [assunzioni, pianoData, calendarioData, questionariData, compilazioniData, noteData] = await Promise.all([
        diaryService.getAssunzioniOggi(),
        diaryService.getPianoTerapeutico(),
        diaryService.getCalendario(),
        diaryService.getQuestionari(),
        diaryService.getCompilazioniPrecedenti(),
        diaryService.getNote()
      ]);
      
      setAssunzioniOggi(assunzioni);
      setPiano(pianoData);
      setCalendario(calendarioData);
      setQuestionari(questionariData);
      setCompilazioni(compilazioniData);
      setNote(noteData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background safe-area-top">
        <header className="fixed top-0 left-0 right-0 bg-primary px-4 py-3 z-40 safe-area-top">
          <div className="h-10" />
        </header>
        <div className="pt-16 pb-24 p-4 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header - Minimal, no page title */}
      <header className="fixed top-0 left-0 right-0 bg-primary px-4 py-3 z-40 safe-area-top">
        <div className="flex items-center justify-end">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-14 pb-24 px-4 space-y-6">
        {/* Page Title - Below header */}
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Diario paziente</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Monitora il tuo percorso di cura</p>
        </div>

        {/* 1. Assunzioni di oggi - First section after title */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Assunzioni di oggi</h2>
          </div>
          <AssunzioniOggi assunzioni={assunzioniOggi} onUpdate={handleUpdate} />
        </section>

        {/* 2. Piano terapeutico */}
        {piano && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Piano terapeutico</h2>
            </div>
            <div className="space-y-4">
              <PianoTerapeutico 
                piano={piano} 
                calendario={calendario} 
                note={note} 
                onUpdate={handleUpdate} 
              />
            </div>
          </section>
        )}

        {/* 3. Questionari clinici */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Questionari clinici</h2>
          </div>
          <div className="space-y-4">
            <QuestionariClinici 
              questionari={questionari} 
              compilazioni={compilazioni} 
              onUpdate={handleUpdate} 
            />
          </div>
        </section>

        {/* 4. FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Domande frequenti</h2>
          </div>
          <FAQSection />
        </section>
      </div>
    </div>
  );
};

export default PatientDiary;
