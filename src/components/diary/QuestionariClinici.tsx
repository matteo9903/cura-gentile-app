import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ClipboardList, Clock, Check, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Questionario, CompilazioneQuestionario, diaryService } from "@/services/diaryService";
import "swiper/css";
import "swiper/css/pagination";

interface QuestionariCliniciProps {
  questionari: Questionario[];
  compilazioni: CompilazioneQuestionario[];
  onUpdate: () => void;
}

const QuestionariClinici = ({ questionari, compilazioni, onUpdate }: QuestionariCliniciProps) => {
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null);
  const [risposte, setRisposte] = useState<Record<string, string | number>>({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedCompilazione, setSelectedCompilazione] = useState<CompilazioneQuestionario | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const daCompilare = questionari.filter(q => q.stato === 'da_compilare');

  useEffect(() => {
    if (selectedQuestionario) {
      setRisposte({});
      setShowSubmit(false);
    }
  }, [selectedQuestionario]);

  const handleScroll = () => {
    if (!scrollRef.current || !bottomRef.current) return;
    const container = scrollRef.current;
    const bottom = bottomRef.current;
    const rect = bottom.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    if (rect.top <= containerRect.bottom) {
      setShowSubmit(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuestionario) return;
    
    const allAnswered = selectedQuestionario.domande.every(d => risposte[d.id] !== undefined);
    if (!allAnswered) {
      toast({ title: "Attenzione", description: "Rispondi a tutte le domande", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await diaryService.compilaQuestionario(
        selectedQuestionario.id,
        Object.entries(risposte).map(([domandaId, risposta]) => ({ domandaId, risposta }))
      );
      toast({ title: "Questionario inviato", description: "Grazie per aver compilato il questionario" });
      setSelectedQuestionario(null);
      onUpdate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  };

  const getQuestionarioForCompilazione = (comp: CompilazioneQuestionario) =>
    questionari.find((q) => q.id === comp.questionarioId);

  const getRispostaForDomanda = (comp: CompilazioneQuestionario, domandaId: string) =>
    comp.risposte.find((r) => r.domandaId === domandaId)?.risposta;

  // Group compilations by year
  const compilazioniByYear = compilazioni.reduce((acc, c) => {
    const year = new Date(c.dataCompilazione).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(c);
    return acc;
  }, {} as Record<number, CompilazioneQuestionario[]>);

  return (
    <>
      {/* Questionnaires to compile */}
      {daCompilare.length > 0 ? (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={12}
          slidesPerView={1}
          className="!pb-8 overflow-hidden"
        >
          {daCompilare.map((questionario) => (
            <SwiperSlide key={questionario.id}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                      <ClipboardList className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground">{questionario.titolo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Frequenza: {questionario.frequenza}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{questionario.descrizione}</p>
                  
                  <Button className="w-full" onClick={() => setSelectedQuestionario(questionario)}>
                    Compila questionario
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Card className="border-iov-green/30 bg-iov-green/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-iov-green/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-iov-green" />
            </div>
            <div>
              <p className="font-medium text-foreground">Tutti i questionari compilati!</p>
              <p className="text-sm text-muted-foreground">Non ci sono questionari in attesa</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Compilations - Button + Modal */}
      {compilazioni.length > 0 && (
        <>
          <Button
            variant="ghost"
            className="w-full justify-between px-0 py-3 hover:bg-transparent active:bg-transparent active:opacity-70"
            onClick={() => setHistoryOpen(true)}
          >
            <span className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span>Compilazioni precedenti</span>
            </span>
            <span className="text-xs text-muted-foreground">({compilazioni.length})</span>
          </Button>

          <Dialog
            open={historyOpen}
            onOpenChange={(open) => {
              setHistoryOpen(open);
              if (!open) setSelectedCompilazione(null);
            }}
          >
            <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle>
                  {selectedCompilazione ? "Risposte questionario" : "Compilazioni precedenti"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {!selectedCompilazione ? (
                  Object.entries(compilazioniByYear)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, comps]) => (
                      <div key={year} className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">{year}</p>
                        <div className="space-y-2">
                          {comps.map((comp) => (
                            <Button
                              key={comp.id}
                              variant="ghost"
                              className="w-full h-auto justify-between bg-muted/40 hover:bg-muted/70 p-3 rounded-lg"
                              onClick={() => setSelectedCompilazione(comp)}
                            >
                              <span className="text-left">
                                <span className="block text-sm font-medium">{comp.titoloQuestionario}</span>
                                <span className="block text-xs text-muted-foreground">{formatDate(comp.dataCompilazione)}</span>
                              </span>
                              <Check className="h-4 w-4 text-iov-green shrink-0" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedCompilazione(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Indietro
                      </Button>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(selectedCompilazione.dataCompilazione)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">{selectedCompilazione.titoloQuestionario}</h3>
                      {(() => {
                        const q = getQuestionarioForCompilazione(selectedCompilazione);
                        if (!q) {
                          return (
                            <p className="text-sm text-muted-foreground">
                              Dettagli del questionario non disponibili.
                            </p>
                          );
                        }
                        return (
                          <div className="space-y-3">
                            {q.domande.map((domanda, idx) => {
                              const risposta = getRispostaForDomanda(selectedCompilazione, domanda.id);
                              return (
                                <div key={domanda.id} className="bg-muted/40 p-3 rounded-lg space-y-1">
                                  <p className="text-sm font-medium">
                                    {idx + 1}. {domanda.testo}
                                  </p>
                                  <p className="text-sm text-muted-foreground break-words">
                                    {risposta !== undefined && risposta !== "" ? String(risposta) : "—"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Questionnaire Modal - Fullscreen */}
      <Dialog open={!!selectedQuestionario} onOpenChange={() => setSelectedQuestionario(null)}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>{selectedQuestionario?.titolo}</DialogTitle>
          </DialogHeader>
          
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto py-4 space-y-6"
          >
            {selectedQuestionario?.domande.map((domanda, idx) => (
              <div key={domanda.id} className="space-y-3">
                <Label className="text-base">
                  {idx + 1}. {domanda.testo}
                </Label>
                
                {domanda.tipo === 'scala' && (
                  <div className="space-y-3">
                    <Slider
                      value={[typeof risposte[domanda.id] === 'number' ? risposte[domanda.id] as number : 5]}
                      onValueChange={(v) => setRisposte(prev => ({ ...prev, [domanda.id]: v[0] }))}
                      min={1}
                      max={10}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 - Molto male</span>
                      <span className="font-medium text-foreground">{risposte[domanda.id] || 5}</span>
                      <span>10 - Ottimo</span>
                    </div>
                  </div>
                )}
                
                {domanda.tipo === 'scelta_multipla' && domanda.opzioni && (
                  <RadioGroup
                    value={risposte[domanda.id] as string || ''}
                    onValueChange={(v) => setRisposte(prev => ({ ...prev, [domanda.id]: v }))}
                  >
                    {domanda.opzioni.map((opzione) => (
                      <div key={opzione} className="flex items-center space-x-2">
                        <RadioGroupItem value={opzione} id={`${domanda.id}-${opzione}`} />
                        <Label htmlFor={`${domanda.id}-${opzione}`} className="font-normal cursor-pointer">
                          {opzione}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {domanda.tipo === 'testo' && (
                  <Textarea
                    value={risposte[domanda.id] as string || ''}
                    onChange={(e) => setRisposte(prev => ({ ...prev, [domanda.id]: e.target.value }))}
                    placeholder="Scrivi qui la tua risposta..."
                    rows={3}
                  />
                )}
              </div>
            ))}
            
            <div ref={bottomRef} className="h-1" />
          </div>

          {showSubmit && (
            <div className="shrink-0 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Invio in corso..." : "Invia questionario"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionariClinici;
