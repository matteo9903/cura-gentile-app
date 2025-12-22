import { useState, useEffect } from "react";
import { Pill, ClipboardList, Calendar, HelpCircle } from "lucide-react";
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
        <header className="fixed top-0 left-0 right-0 h-14 bg-primary px-4 flex items-center z-40 safe-area-top">
          <Skeleton className="h-5 w-32 bg-primary-foreground/20" />
        </header>
        <div className="pt-16 pb-24 p-4 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header - Fixed, uniform height with title */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-primary px-4 flex items-center z-40 safe-area-top">
        <h1 className="text-lg font-bold text-primary-foreground">
          Diario paziente
        </h1>
      </header>

      {/* Content */}
      <div className="pt-16 pb-24 px-4 space-y-6">
        {/* 1. Assunzioni di oggi - First section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Assunzioni di oggi</h2>
          </div>
          <AssunzioniOggi assunzioni={assunzioniOggi} onUpdate={handleUpdate} />
        </section>

        {/* 2. Piano terapeutico */}
        {piano && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Piano terapeutico</h2>
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
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Questionari</h2>
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
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Domande frequenti</h2>
          </div>
          <FAQSection />
        </section>
      </div>
    </div>
  );
};

export default PatientDiary;