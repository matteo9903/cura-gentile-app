import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Pill, Calendar, Info, Clock, ChevronDown, ChevronRight, FileText, Plus, Check, X, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PianoTerapeutico as PianoTerapeuticoType, Farmaco, GiornoCalendario, NotaAggiuntiva, diaryService, AssunzioneGiornaliera } from "@/services/diaryService";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";

interface PianoTerapeuticoProps {
  piano: PianoTerapeuticoType;
  calendario: GiornoCalendario[];
  note: NotaAggiuntiva[];
  onUpdate: () => void;
}

const PianoTerapeutico = ({ piano, calendario, note, onUpdate }: PianoTerapeuticoProps) => {
  const [selectedFarmaco, setSelectedFarmaco] = useState<Farmaco | null>(null);
  const [showCalendario, setShowCalendario] = useState(false);
  const [showCalendarioFarmaco, setShowCalendarioFarmaco] = useState<Farmaco | null>(null);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [newNota, setNewNota] = useState("");
  const [isAddingNota, setIsAddingNota] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState<AssunzioneGiornaliera | null>(null);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  };

  const formatDateFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
  };

  const handleAddNota = async () => {
    if (!newNota.trim()) return;
    setIsAddingNota(true);
    try {
      await diaryService.aggiungiNota(newNota);
      setNewNota("");
      toast({ title: "Nota aggiunta", description: "La nota è stata salvata con successo" });
      onUpdate();
    } finally {
      setIsAddingNota(false);
    }
  };

  const handleConfirmAssunzione = async (assunzione: AssunzioneGiornaliera, conferma: boolean) => {
    try {
      if (conferma) {
        await diaryService.confermaAssunzione(assunzione.id);
        toast({
          title: "Assunzione confermata",
          className: "bg-iov-green text-white",
        });
      } else {
        await diaryService.saltaAssunzione(assunzione.id, "", "media");
        toast({
          title: "Assunzione saltata",
          variant: "destructive",
        });
      }
      setConfirmPopup(null);
      onUpdate();
    } catch {
      toast({ title: "Errore", variant: "destructive" });
    }
  };

  // Group calendar days into weeks for horizontal swiping
  const groupedDays = [];
  for (let i = 0; i < calendario.length; i += 7) {
    groupedDays.push(calendario.slice(i, i + 7));
  }

  return (
    <>
      {/* Therapy Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Durata terapia</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(piano.dataInizio)} - {formatDate(piano.dataFine)} ({piano.durataTotale} giorni)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Drug Cards Carousel */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={12}
        slidesPerView={1.1}
        className="!pb-8"
      >
        {piano.farmaci.map((farmaco) => (
          <SwiperSlide key={farmaco.id}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{farmaco.nome}</h4>
                    <p className="text-xs text-muted-foreground">{farmaco.principioAttivo}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-muted-foreground">Orari: </span>
                    <span className="font-medium">{farmaco.orariAssunzione.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Pill className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Dose: </span>
                    <span className="font-medium">{farmaco.unitaPerDose} {farmaco.unitaPerDose === 1 ? 'compressa' : 'compresse'}</span>
                  </div>
                  {farmaco.tipo === 'ciclico' && farmaco.ciclo && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary-foreground shrink-0" />
                      <span className="text-muted-foreground">Ciclo: </span>
                      <span className="font-medium">{farmaco.ciclo.giorniOn} giorni sì / {farmaco.ciclo.giorniOff} giorni no</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedFarmaco(farmaco)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Info farmaco
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowCalendarioFarmaco(farmaco)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Note Aggiuntive - Collapsible */}
      <Collapsible open={noteExpanded} onOpenChange={setNoteExpanded}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">Note aggiuntive</CardTitle>
                  <span className="text-xs text-muted-foreground">({note.length})</span>
                </div>
                {noteExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {note.map((nota) => (
                <div key={nota.id} className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{formatDateFull(nota.data)}</p>
                  <p className="text-sm">{nota.contenuto}</p>
                </div>
              ))}
              
              <div className="pt-2 border-t space-y-2">
                <Textarea
                  value={newNota}
                  onChange={(e) => setNewNota(e.target.value)}
                  placeholder="Aggiungi una nota..."
                  rows={2}
                />
                <Button
                  size="sm"
                  onClick={handleAddNota}
                  disabled={!newNota.trim() || isAddingNota}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi nota
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Drug Info Modal - Fullscreen */}
      <Dialog open={!!selectedFarmaco} onOpenChange={() => setSelectedFarmaco(null)}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              {selectedFarmaco?.nome}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFarmaco && (
            <div className="flex-1 overflow-y-auto space-y-6 py-4">
              {/* Drug Image Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Pill className="h-16 w-16 text-muted-foreground/30" />
              </div>

              {/* Posologia Section - FIRST */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Posologia, modalità di assunzione e manipolazione
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
                  <p><strong>Posologia:</strong> {selectedFarmaco.infoFarmaco.posologia}</p>
                  <p><strong>Modalità:</strong> {selectedFarmaco.infoFarmaco.modalitaAssunzione}</p>
                  <p><strong>Manipolazione:</strong> {selectedFarmaco.infoFarmaco.manipolazione}</p>
                </div>
              </div>

              {/* Misure Contraccettive - Dedicated Section */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Misure contraccettive
                </h3>
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-sm">
                  <p>{selectedFarmaco.infoFarmaco.misureContraccettive}</p>
                </div>
              </div>

              {/* Side Effects */}
              <div className="space-y-2">
                <h3 className="font-semibold">Possibili effetti collaterali</h3>
                <ul className="space-y-1">
                  {selectedFarmaco.infoFarmaco.effettiCollaterali.map((effetto, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {effetto}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              <div className="space-y-2">
                <h3 className="font-semibold">Avvertenze</h3>
                <p className="text-sm text-muted-foreground">{selectedFarmaco.infoFarmaco.avvertenze}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendar Modal - Fullscreen with Swipeable Weeks */}
      <Dialog open={!!showCalendarioFarmaco} onOpenChange={() => setShowCalendarioFarmaco(null)}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendario - {showCalendarioFarmaco?.nome}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              className="h-full !pb-8"
            >
              {groupedDays.map((week, weekIdx) => (
                <SwiperSlide key={weekIdx}>
                  <div className="space-y-2 h-full overflow-y-auto pr-2">
                    <p className="text-xs text-muted-foreground font-medium mb-3">Settimana {weekIdx + 1}</p>
                    {week.map((giorno) => {
                      const farmacoAssunzioni = giorno.assunzioni.filter(
                        a => a.farmacoId === showCalendarioFarmaco?.id
                      );
                      
                      if (farmacoAssunzioni.length === 0) return null;
                      
                      return (
                        <div key={giorno.data} className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-2">{formatDateFull(giorno.data)}</p>
                          <div className="flex flex-wrap gap-2">
                            {farmacoAssunzioni.map((assunzione) => (
                              <button
                                key={assunzione.id}
                                onClick={() => assunzione.stato === 'da_confermare' && setConfirmPopup(assunzione)}
                                disabled={assunzione.stato !== 'da_confermare'}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                  assunzione.stato === 'confermata' && "bg-iov-green/20 text-iov-green",
                                  assunzione.stato === 'saltata' && "bg-destructive/20 text-destructive",
                                  assunzione.stato === 'da_confermare' && "bg-muted border border-border hover:bg-accent/20 cursor-pointer"
                                )}
                              >
                                {assunzione.orario} - {assunzione.unita} {assunzione.unita === 1 ? 'cpr' : 'cpr'}
                                {assunzione.stato === 'confermata' && <Check className="h-3 w-3 ml-1 inline" />}
                                {assunzione.stato === 'saltata' && <X className="h-3 w-3 ml-1 inline" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Popup */}
      <Dialog open={!!confirmPopup} onOpenChange={() => setConfirmPopup(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Conferma assunzione</DialogTitle>
          </DialogHeader>
          {confirmPopup && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="font-medium">{confirmPopup.farmacoNome}</p>
                <p className="text-sm text-muted-foreground">{confirmPopup.orario}</p>
                <p className="text-lg font-bold text-primary mt-2">
                  {confirmPopup.unita} {confirmPopup.unita === 1 ? 'compressa' : 'compresse'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-iov-green hover:bg-iov-green/90"
                  onClick={() => handleConfirmAssunzione(confirmPopup, true)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Conferma
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive"
                  onClick={() => handleConfirmAssunzione(confirmPopup, false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Salta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PianoTerapeutico;
