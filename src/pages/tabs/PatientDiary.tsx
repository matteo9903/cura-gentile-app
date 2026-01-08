import { useState, useEffect, useMemo } from "react";
import { Pill, ClipboardList, Calendar, HelpCircle, BookOpen } from "lucide-react";
import { diaryService, AssunzioneGiornaliera, PianoTerapeutico as PianoTerapeuticoType, GiornoCalendario, Questionario, CompilazioneQuestionario, NotaAggiuntiva } from "@/services/diaryService";
import AssunzioniOggi from "@/components/diary/AssunzioniOggi";
import PianoTerapeutico from "@/components/diary/PianoTerapeutico";
import QuestionariClinici from "@/components/diary/QuestionariClinici";
import FAQSection from "@/components/diary/FAQSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
    });
  }, []);

  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-background"
        style={{
          paddingTop: "var(--safe-area-top)",
          paddingBottom: "var(--safe-area-bottom)",
        }}
      >
        <header 
          className="fixed top-0 left-0 right-0 bg-iov-gradient text-white px-4 flex items-center justify-between z-40 border-b border-white/20 shadow-lg"
          style={{
            paddingTop: "calc(var(--safe-area-top)/2)",
            paddingBottom: "calc(var(--safe-area-top)/2)",
            minHeight: "70px",
          }}
          >
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full bg-white/40" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32 bg-white/30" />
              <Skeleton className="h-3 w-28 bg-white/30" />
            </div>
          </div>
        </header>
        <div className="pt-[94px] pb-24 p-4 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        paddingTop: "var(--safe-area-top)",
        paddingBottom: "var(--safe-area-top)",
      }}>
      {/* Header - Fixed, uniform height with title */}
      <header
        className="fixed top-0 left-0 right-0 bg-iov-gradient text-white px-4 flex items-center justify-between z-40 border-b border-white/20 shadow-lg"
        style={{
          paddingTop: "calc(var(--safe-area-top)/2)",
          paddingBottom: "calc(var(--safe-area-top)/2)",
          minHeight: "70px",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              Diario paziente
            </h1>
            <p className="text-[14px] text-white/80">
              Monitora il tuo piano terapeutico
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pb-4 px-4 space-y-6"
        style={{
          paddingTop: 'calc(70px + var(--safe-area-top)/2)'
        }}
      >
        {/* 1. Assunzioni di oggi - First section */}
        <Card className="bg-white border border-iov-light-blue rounded-2xl shadow-sm">
          <CardHeader className="pb-0 pt-4 px-4 flex-row items-center gap-3 space-y-0">
            <div className="w-11 h-11 rounded-xl bg-iov-light-blue-light flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold">Assunzioni di oggi</CardTitle>
              <span className="inline-flex mt-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-iov-light-blue-dark text-iov-dark-blue">
                {todayLabel}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-5 pt-3">
            <AssunzioniOggi
              assunzioni={assunzioniOggi}
              onUpdate={handleUpdate}
              cardBorderClass="border-iov-light-blue"
            />
          </CardContent>
        </Card>

        {/* 2. Piano terapeutico */}
        {piano && (
          <Card className="bg-white border border-iov-yellow rounded-2xl shadow-sm">
            <CardHeader className="pb-0 pt-4 px-4 flex-row items-center gap-3 space-y-0">
              <div className="w-11 h-11 rounded-xl bg-iov-yellow-light flex items-center justify-center">
                <Calendar className="h-5 w-5 text-iov-dark-blue" />
              </div>
              <CardTitle className="text-lg font-bold">Piano terapeutico</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-5 pt-3">
              <PianoTerapeutico 
                piano={piano} 
                calendario={calendario} 
                note={note} 
                onUpdate={handleUpdate} 
                cardBorderClass="border-iov-yellow"
              />
            </CardContent>
          </Card>
        )}

        {/* 3. Questionari clinici */}
        <Card className="bg-white border border-iov-pink rounded-2xl shadow-sm">
          <CardHeader className="pb-0 pt-4 px-4 flex-row items-center gap-3 space-y-0">
            <div className="w-11 h-11 rounded-xl bg-iov-pink-light flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-iov-pink-dark" />
            </div>
            <CardTitle className="text-lg font-bold">Questionari</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-5 pt-3">
            <QuestionariClinici 
              questionari={questionari} 
              compilazioni={compilazioni} 
              onUpdate={handleUpdate}
              cardBorderClass="border-iov-pink"
            />
          </CardContent>
        </Card>

        {/* 4. FAQ */}
        <Card className="bg-white border border-iov-dark-blue rounded-2xl shadow-sm">
          <CardHeader className="pb-0 pt-4 px-4 flex-row items-center gap-3 space-y-0">
            <div className="w-11 h-11 rounded-xl bg-iov-light-blue-dark flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-iov-dark-blue" />
            </div>
            <CardTitle className="text-lg font-bold">Domande frequenti</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-5 pt-3">
            <FAQSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDiary;
