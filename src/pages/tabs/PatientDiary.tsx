import { useState, useEffect, useMemo } from "react";
import { Pill, ClipboardList, Calendar, HelpCircle, ChevronRight, Clock } from "lucide-react";
import { diaryService, AssunzioneGiornaliera, PianoTerapeutico as PianoTerapeuticoType, GiornoCalendario, Questionario, CompilazioneQuestionario, NotaAggiuntiva } from "@/services/diaryService";
import AssunzioniOggi from "@/components/diary/AssunzioniOggi";
import PianoTerapeutico from "@/components/diary/PianoTerapeutico";
import QuestionariClinici from "@/components/diary/QuestionariClinici";
import FAQSection from "@/components/diary/FAQSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PatientDiary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assunzioniOggi, setAssunzioniOggi] = useState<AssunzioneGiornaliera[]>([]);
  const [piano, setPiano] = useState<PianoTerapeuticoType | null>(null);
  const [calendario, setCalendario] = useState<GiornoCalendario[]>([]);
  const [questionari, setQuestionari] = useState<Questionario[]>([]);
  const [compilazioni, setCompilazioni] = useState<CompilazioneQuestionario[]>([]);
  const [note, setNote] = useState<NotaAggiuntiva[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdate = () => {
    loadData();
  };

  const formattedDateTime = useMemo(() => {
    const day = currentTime.getDate();
    const month = currentTime.toLocaleString("it-IT", { month: "long" });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const year = currentTime.getFullYear();
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");

    return `${day} ${capitalizedMonth} ${year} - Ore ${hours}:${minutes}`;
  }, [currentTime]);

  const nextDose = useMemo(() => {
    // Very basic logic: find first non-confirmed/skipped dose
    return assunzioniOggi.find(a => a.stato === 'da_confermare');
  }, [assunzioniOggi]);

  const pendingCount = assunzioniOggi.filter(a => a.stato === 'da_confermare').length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div
          className="pb-8 rounded-b-[2.5rem] shadow-lg mb-6"
          style={{
            background: "linear-gradient(to bottom, #002451, #104676)",
            paddingTop: "max(20px, var(--safe-area-top))",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-8">
            <Skeleton className="h-10 w-24 bg-white/20" />
            <Skeleton className="h-10 w-24 bg-white/20" />
          </div>
          <div className="flex flex-col gap-1 text-white px-2">
            <Skeleton className="h-8 w-48 bg-white/20" />
            <Skeleton className="h-4 w-32 bg-white/20" />
          </div>
        </div>
        <div className="px-4 mt-6 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">

      {/* Header - Home Style (Detached) */}
      <div
        className="pb-8 rounded-b-[2.5rem] shadow-xl relative overflow-hidden"
        style={{
          background: "linear-gradient(170deg, #002451 0%, #104676 100%)",
          paddingTop: "max(24px, var(--safe-area-top))",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Decorative circle */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
          <img
            src="https://www.ioveneto.it/wp-content/uploads/2025/03/IOV_20anni_oriz_bianco-1.svg"
            alt="IOV 20 anni"
            className="h-9 w-auto object-contain opacity-90"
          />
          <img
            src="https://www.ioveneto.it/wp-content/uploads/2025/03/logo-veneto-ok.png"
            alt="Regione Veneto"
            className="h-9 w-auto object-contain opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1 text-white px-1 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            Il mio diario
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-medium text-white/90 capitalize mb-0.5 tracking-wide">
              {formattedDateTime}
            </p>
          </div>
        </div>
      </div>

      {/* Content - Separated from header (mt-6) */}
      <div className="px-4 mt-6 space-y-5">

        {/* 1. Assunzioni - Dark Blue Container (Home Style) */}
        <div className="relative group">
          {/* subtle glow */}
          <div className="absolute -inset-0.5 bg-blue-400/30 rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <Card
            className="rounded-3xl border border-white/10 shadow-xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #002451 0%, #104676 100%)", // Dark Blue
            }}
          >
            <CardHeader className="pb-2 pt-5 px-5 flex-row items-center justify-between space-y-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-100 border border-white/10 shadow-inner">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white">Assunzioni</CardTitle>
                  {pendingCount > 0 ? (
                    <p className="text-[12px] font-medium text-orange-200/90 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pendingCount} da completare
                    </p>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                      <p className="text-[12px] font-medium text-green-200 ml-1">
                        Tutto completato
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {nextDose && (
                <Badge variant="outline" className="bg-orange-500/20 text-orange-100 border-orange-500/30 animate-pulse backdrop-blur-md shadow-sm">
                  Prossima: {nextDose.orario}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="px-5 pb-6 pt-4">
              <AssunzioniOggi
                assunzioni={assunzioniOggi}
                onUpdate={handleUpdate}
                cardBorderClass="border-white/10 bg-white/5" // Pass minimal separation style
              />
            </CardContent>
          </Card>
        </div>

        {/* 2. Piano Terapeutico */}
        <div className="relative group">
          <Card className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-5 px-5 flex-row items-center justify-between space-y-0 border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Piano Terapeutico</CardTitle>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent className="px-5 pb-6 pt-4">
              <PianoTerapeutico piano={piano} />
            </CardContent>
          </Card>
        </div>

        {/* 3. Questionari */}
        <div className="relative group">
          <Card className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-5 px-5 flex-row items-center justify-between space-y-0 border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Questionari</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                {questionari.length} disponibili
              </Badge>
            </CardHeader>
            <CardContent className="px-5 pb-6 pt-4">
              <QuestionariClinici questionari={questionari} compilazioni={compilazioni} />
            </CardContent>
          </Card>
        </div>

        {/* 4. FAQ */}
        <div className="relative group">
          <Card className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-5 px-5 flex-row items-center justify-between space-y-0 border-b border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">FAQ e Supporto</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-6 pt-4">
              <FAQSection />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default PatientDiary;
