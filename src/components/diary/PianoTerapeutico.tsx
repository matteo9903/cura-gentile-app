import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pill, Calendar, Info, Clock, FileText, Plus, Check, X, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PianoTerapeutico as PianoTerapeuticoType, Farmaco, GiornoCalendario, NotaAggiuntiva, diaryService, AssunzioneGiornaliera, NoteStrutturate } from "@/services/diaryService";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";

interface PianoTerapeuticoProps {
  piano: PianoTerapeuticoType;
  calendario: GiornoCalendario[];
  note: NotaAggiuntiva[];
  onUpdate: () => void;
}

const PianoTerapeutico = ({ piano, calendario, onUpdate }: PianoTerapeuticoProps) => {
  const [selectedFarmaco, setSelectedFarmaco] = useState<Farmaco | null>(null);
  const [showCalendarioFarmaco, setShowCalendarioFarmaco] = useState<Farmaco | null>(null);
  const [noteStrutturate, setNoteStrutturate] = useState<NoteStrutturate | null>(null);
  const [newFarmacoNome, setNewFarmacoNome] = useState("");
  const [newFarmacoDosaggio, setNewFarmacoDosaggio] = useState("");
  const [domandeSpecialista, setDomandeSpecialista] = useState("");
  const [actionModal, setActionModal] = useState<{ assunzione: AssunzioneGiornaliera; type: 'conferma' | 'salta' } | null>(null);
  const [effettiCollaterali, setEffettiCollaterali] = useState("");
  const [motivo, setMotivo] = useState("");
  const [intensita, setIntensita] = useState<"bassa" | "media" | "alta">("media");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNoteStrutturate = async () => {
      const data = await diaryService.getNoteStrutturate();
      setNoteStrutturate(data);
      setDomandeSpecialista(data.domandeSpecialista);
    };
    loadNoteStrutturate();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  };

  const formatDateFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
  };

  const handleAddFarmaco = async () => {
    if (!newFarmacoNome.trim() || !newFarmacoDosaggio.trim()) return;
    await diaryService.aggiungiFarmacoAggiuntivo(newFarmacoNome, newFarmacoDosaggio);
    setNewFarmacoNome("");
    setNewFarmacoDosaggio("");
    const data = await diaryService.getNoteStrutturate();
    setNoteStrutturate(data);
    toast({ title: "Farmaco aggiunto" });
  };

  const handleRemoveFarmaco = async (id: string) => {
    await diaryService.rimuoviFarmacoAggiuntivo(id);
    const data = await diaryService.getNoteStrutturate();
    setNoteStrutturate(data);
  };

  const handleSaveDomande = async () => {
    await diaryService.aggiornaDomandeSpecialista(domandeSpecialista);
    toast({ title: "Domande salvate" });
  };

  const resetActionForm = () => {
    setEffettiCollaterali("");
    setMotivo("");
    setIntensita("media");
    setActionModal(null);
  };

  const handleCalendarAction = async () => {
    if (!actionModal) return;
    setIsLoading(true);
    try {
      if (actionModal.type === 'conferma') {
        await diaryService.confermaAssunzione(actionModal.assunzione.id, effettiCollaterali, intensita);
        toast({ title: "Assunzione confermata", className: "bg-iov-green text-white" });
      } else {
        await diaryService.saltaAssunzione(actionModal.assunzione.id, effettiCollaterali, intensita, motivo);
        toast({ title: "Assunzione saltata", variant: "destructive" });
      }
      resetActionForm();
      onUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  const isDatePast = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateFuture = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  // Group calendar days into weeks
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

      {/* Drug Cards Carousel - One at a time */}
      <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16} slidesPerView={1} className="!pb-8">
        {piano.farmaci.map((farmaco) => (
          <SwiperSlide key={farmaco.id}>
            <Card className="h-full mx-1">
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
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedFarmaco(farmaco)}>
                    <Info className="h-4 w-4 mr-1" />
                    Info farmaco
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowCalendarioFarmaco(farmaco)}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Note Aggiuntive - Refactored as single editable block */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Note aggiuntive</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Altri farmaci assunti */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Altri farmaci assunti</Label>
            {noteStrutturate?.altriFarmaci.map((f) => (
              <div key={f.id} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                <div className="flex-1">
                  <span className="text-sm font-medium">{f.nome}</span>
                  <span className="text-xs text-muted-foreground ml-2">- {f.dosaggio}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveFarmaco(f.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input placeholder="Nome farmaco" value={newFarmacoNome} onChange={(e) => setNewFarmacoNome(e.target.value)} className="flex-1 px-3" />
              <Input placeholder="Dosaggio" value={newFarmacoDosaggio} onChange={(e) => setNewFarmacoDosaggio(e.target.value)} className="w-32 px-3" />
              <Button size="icon" onClick={handleAddFarmaco} disabled={!newFarmacoNome.trim() || !newFarmacoDosaggio.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Domande per lo specialista */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Domande per lo specialista</Label>
            <Textarea value={domandeSpecialista} onChange={(e) => setDomandeSpecialista(e.target.value)} placeholder="Scrivi qui le domande che vuoi fare al tuo specialista..." rows={3} className="px-3" />
            <Button size="sm" onClick={handleSaveDomande} className="w-full">Salva domande</Button>
          </div>
        </CardContent>
      </Card>

      {/* Drug Info Modal - Fullscreen */}
      <Dialog open={!!selectedFarmaco} onOpenChange={() => setSelectedFarmaco(null)}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              {selectedFarmaco?.nome}
            </DialogTitle>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setSelectedFarmaco(null)}>
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          
          {selectedFarmaco && (
            <div className="flex-1 overflow-y-auto space-y-6 py-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Pill className="h-16 w-16 text-muted-foreground/30" />
              </div>

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

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Misure contraccettive
                </h3>
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-sm">
                  <p>{selectedFarmaco.infoFarmaco.misureContraccettive}</p>
                </div>
              </div>

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

              <div className="space-y-2">
                <h3 className="font-semibold">Avvertenze</h3>
                <p className="text-sm text-muted-foreground">{selectedFarmaco.infoFarmaco.avvertenze}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendar Modal - Fullscreen */}
      <Dialog open={!!showCalendarioFarmaco} onOpenChange={() => setShowCalendarioFarmaco(null)}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendario - {showCalendarioFarmaco?.nome}
            </DialogTitle>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setShowCalendarioFarmaco(null)}>
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16} slidesPerView={1} className="h-full !pb-8">
              {groupedDays.map((week, weekIdx) => (
                <SwiperSlide key={weekIdx}>
                  <div className="space-y-2 h-full overflow-y-auto pr-2">
                    <p className="text-xs text-muted-foreground font-medium mb-3">Settimana {weekIdx + 1}</p>
                    {week.map((giorno) => {
                      const farmacoAssunzioni = giorno.assunzioni.filter(a => a.farmacoId === showCalendarioFarmaco?.id);
                      if (farmacoAssunzioni.length === 0) return null;
                      const isFuture = isDateFuture(giorno.data);
                      const isPast = isDatePast(giorno.data);
                      
                      return (
                        <div key={giorno.data} className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-2">{formatDateFull(giorno.data)}</p>
                          <div className="flex flex-wrap gap-2">
                            {farmacoAssunzioni.map((assunzione) => {
                              const isForgotten = isPast && assunzione.stato === 'da_confermare';
                              return (
                                <button
                                  key={assunzione.id}
                                  onClick={() => !isFuture && assunzione.stato === 'da_confermare' && setActionModal({ assunzione, type: 'conferma' })}
                                  disabled={isFuture || assunzione.stato !== 'da_confermare'}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                    assunzione.stato === 'confermata' && "bg-iov-green/20 text-iov-green",
                                    assunzione.stato === 'saltata' && "bg-destructive/20 text-destructive",
                                    isForgotten && "bg-orange-500/20 text-orange-600 hover:bg-orange-500/30 cursor-pointer",
                                    !isForgotten && assunzione.stato === 'da_confermare' && !isFuture && "bg-muted border border-border hover:bg-accent/20 cursor-pointer",
                                    isFuture && assunzione.stato === 'da_confermare' && "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                  )}
                                >
                                  {assunzione.orario} - {assunzione.unita} cpr
                                  {assunzione.stato === 'confermata' && <Check className="h-3 w-3 ml-1 inline" />}
                                  {assunzione.stato === 'saltata' && <X className="h-3 w-3 ml-1 inline" />}
                                </button>
                              );
                            })}
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

      {/* Calendar Action Modal */}
      <Dialog open={!!actionModal} onOpenChange={() => resetActionForm()}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>{actionModal?.type === 'conferma' ? 'Conferma assunzione' : 'Salta assunzione'}</DialogTitle>
          </DialogHeader>
          {actionModal && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="font-medium">{actionModal.assunzione.farmacoNome}</p>
                <p className="text-sm text-muted-foreground">{actionModal.assunzione.orario}</p>
                <p className="text-lg font-bold text-primary mt-2">{actionModal.assunzione.unita} {actionModal.assunzione.unita === 1 ? 'compressa' : 'compresse'}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Effetti collaterali</Label>
                <Textarea value={effettiCollaterali} onChange={(e) => setEffettiCollaterali(e.target.value)} placeholder="Descrivi eventuali effetti..." rows={2} className="px-3" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Intensità</Label>
                <RadioGroup value={intensita} onValueChange={(v) => setIntensita(v as "bassa" | "media" | "alta")} className="flex gap-4">
                  <div className="flex items-center space-x-1"><RadioGroupItem value="bassa" id="cal-bassa" /><Label htmlFor="cal-bassa" className="text-sm">Bassa</Label></div>
                  <div className="flex items-center space-x-1"><RadioGroupItem value="media" id="cal-media" /><Label htmlFor="cal-media" className="text-sm">Media</Label></div>
                  <div className="flex items-center space-x-1"><RadioGroupItem value="alta" id="cal-alta" /><Label htmlFor="cal-alta" className="text-sm">Alta</Label></div>
                </RadioGroup>
              </div>

              {actionModal.type === 'salta' && (
                <div className="space-y-2">
                  <Label className="text-sm">Motivo</Label>
                  <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo..." rows={2} className="px-3" />
                </div>
              )}

              <div className="flex gap-2">
                <Button className={cn("flex-1", actionModal.type === 'conferma' ? "bg-iov-green hover:bg-iov-green/90" : "")} onClick={() => { setActionModal({ ...actionModal, type: 'conferma' }); handleCalendarAction(); }} disabled={isLoading}>
                  <Check className="h-4 w-4 mr-1" />Conferma
                </Button>
                <Button variant="outline" className="flex-1 border-destructive text-destructive" onClick={() => { setActionModal({ ...actionModal, type: 'salta' }); handleCalendarAction(); }} disabled={isLoading}>
                  <X className="h-4 w-4 mr-1" />Salta
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