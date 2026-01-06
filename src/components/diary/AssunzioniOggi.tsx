import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pill, Clock, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AssunzioneGiornaliera, diaryService } from "@/services/diaryService";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";

interface AssunzioniOggiProps {
  assunzioni: AssunzioneGiornaliera[];
  onUpdate: () => void;
}

type SideEffectIntensity = "lieve" | "moderato" | "severo" | null;

const AssunzioniOggi = ({ assunzioni, onUpdate }: AssunzioniOggiProps) => {
  const [skipModalAssunzione, setSkipModalAssunzione] = useState<AssunzioneGiornaliera | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ assunzione: AssunzioneGiornaliera; type: "conferma" | "salta" } | null>(null);
  const [motivo, setMotivo] = useState("");
  const [sideEffectsOpen, setSideEffectsOpen] = useState(false);
  const [sideEffectsNote, setSideEffectsNote] = useState("");
  const [sideEffectsIntensity, setSideEffectsIntensity] = useState<SideEffectIntensity>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sideEffectsSubmitted, setSideEffectsSubmitted] = useState(false);
  const sideEffectsSnapshotRef = useRef<{ note: string; intensity: SideEffectIntensity } | null>(null);

  const todayKey = new Date().toISOString().split("T")[0];
  const [sideEffectsDate, setSideEffectsDate] = useState(todayKey);

  // Reset side-effects draft when the day changes
  useEffect(() => {
    if (sideEffectsDate !== todayKey) {
      setSideEffectsNote("");
      setSideEffectsIntensity(null);
      setSideEffectsDate(todayKey);
    }
  }, [todayKey, sideEffectsDate]);

  const clearSideEffects = () => {
    setSideEffectsNote("");
    setSideEffectsIntensity(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const currentAction = confirmAction;

    setIsLoading(true);
    try {
      if (currentAction.type === "conferma") {
        await diaryService.confermaAssunzione(currentAction.assunzione.id, "", "media");
        toast({
          title: "Assunzione confermata",
          description: `${currentAction.assunzione.farmacoNome} alle ${currentAction.assunzione.orario}`,
          className: "bg-iov-green text-white border-iov-green",
        });
      } else {
        await diaryService.saltaAssunzione(currentAction.assunzione.id, "", "media", motivo || undefined);
        toast({
          title: "Assunzione saltata",
          description: `${currentAction.assunzione.farmacoNome} alle ${currentAction.assunzione.orario}`,
          variant: "destructive",
        });
      }

      setConfirmAction(null);
      if (currentAction.type === "salta") {
        setSkipModalAssunzione(null);
        setMotivo("");
      }
      onUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  if (assunzioni.length === 0) {
    return (
      <Card className="border-iov-green/30 bg-iov-green/5">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-iov-green/20 flex items-center justify-center">
            <Check className="h-5 w-5 text-iov-green" />
          </div>
          <div>
            <p className="font-medium text-foreground">Tutto in ordine!</p>
            <p className="text-sm text-muted-foreground">Hai completato tutte le assunzioni di oggi</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16} slidesPerView={1} className="!pb-8">
        {assunzioni.map((assunzione) => (
          <SwiperSlide key={assunzione.id}>
            <Card className="border-secondary mx-1">
              <CardContent className="p-4 flex flex-col min-h-[190px]">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{assunzione.farmacoNome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {assunzione.unita} {assunzione.unita === 1 ? "compressa" : "compresse"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-accent" />
                      <span className="text-sm font-medium text-accent">{assunzione.orario}</span>
                    </div>
                  </div>
                </div>

                {assunzione.stato === "da_confermare" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Hai assunto il seguente farmaco?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setConfirmAction({ assunzione, type: "conferma" })}
                        disabled={isLoading}
                        className="flex-1 border-iov-green text-iov-green hover:bg-iov-green/10 font-semibold"
                      >
                        <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-iov-green text-white">
                          <Check className="h-5 w-5" />
                        </span>
                        Sì
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMotivo("");
                          setSkipModalAssunzione(assunzione);
                        }}
                        disabled={isLoading}
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-semibold"
                      >
                        <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white">
                          <X className="h-5 w-5" />
                        </span>
                        No
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    <Button
                      disabled
                      className={cn(
                        "w-full text-white justify-center",
                        assunzione.stato === "confermata" ? "bg-emerald-600 hover:bg-emerald-600" : "bg-destructive hover:bg-destructive",
                      )}
                    >
                      {assunzione.stato === "confermata" ? (
                        <>
                          <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                            <Check className="h-5 w-5 text-emerald-500" />
                          </span>
                          Farmaco assunto
                        </>
                      ) : (
                        <>
                          <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                            <X className="h-5 w-5 text-destructive" />
                          </span>
                          Farmaco non assunto
                        </>
                      )}
                    </Button>
                    {/* {assunzione.stato === "saltata" && assunzione.motivo && (
                      <p className="text-sm font-semibold text-destructive">Motivo: {assunzione.motivo}</p>
                    )} */}
                  </div>
                )}
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-4">
        <Button
          onClick={() => setSideEffectsOpen(true)}
          className="w-full bg-iov-yellow text-iov-dark-blue hover:bg-iov-yellow-dark font-semibold"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Segnala effetti collaterali
        </Button>
      </div>

      {/* Modal for skip reason (non-fullscreen) */}
      <Dialog
        open={!!skipModalAssunzione}
        onOpenChange={(open) => {
          if (!open) {
            setSkipModalAssunzione(null);
            setMotivo("");
          }
        }}
      >
        <DialogContent className="w-[94vw] max-w-sm sm:max-w-md rounded-xl px-4 sm:px-6">
          <DialogHeader className="pb-3">
            <DialogTitle>Salta assunzione</DialogTitle>
          </DialogHeader>

          {skipModalAssunzione && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">{skipModalAssunzione.farmacoNome}</p>
                <p className="text-sm text-muted-foreground">
                  {skipModalAssunzione.orario} - {skipModalAssunzione.unita} {skipModalAssunzione.unita === 1 ? "compressa" : "compresse"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="leading-snug break-words">
                  Per quale motivo non stai assumendo il farmaco?
                </Label>
                <Textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Scrivi la motivazione..."
                  rows={3}
                  className="px-3 w-full"
                />
              </div>

              <Button
                className="w-full bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => setConfirmAction({ assunzione: skipModalAssunzione, type: "salta" })}
                disabled={isLoading}
              >
                Non assumere il farmaco
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Double confirm popup */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
            if (!skipModalAssunzione) setMotivo("");
          }
        }}
      >
        <AlertDialogContent className="w-[90%] max-w-sm rounded-xl">
          <AlertDialogHeader className="pb-3">
            <AlertDialogTitle>
              {confirmAction?.type === "conferma" ? "Vuoi assumere il farmaco?" : "Confermi di non volere assumere il farmaco?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.assunzione.farmacoNome} - {confirmAction?.assunzione.orario}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isLoading}
              className={
                confirmAction?.type === "salta"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-iov-green hover:bg-iov-green/90 text-white"
              }
            >
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Side effects modal */}
      <Dialog
        open={sideEffectsOpen}
        onOpenChange={(open) => {
          if (open) {
            sideEffectsSnapshotRef.current = { note: sideEffectsNote, intensity: sideEffectsIntensity };
            setSideEffectsSubmitted(false);
            setSideEffectsOpen(true);
            return;
          }
          // closing: restore snapshot if nothing submitted
          if (!sideEffectsSubmitted && sideEffectsSnapshotRef.current) {
            setSideEffectsNote(sideEffectsSnapshotRef.current.note);
            setSideEffectsIntensity(sideEffectsSnapshotRef.current.intensity);
          }
          sideEffectsSnapshotRef.current = null;
          setSideEffectsSubmitted(false);
          setSideEffectsOpen(false);
        }}
      >
        <DialogContent className="w-[94vw] max-w-sm sm:max-w-md rounded-xl px-4 sm:px-6">
          <DialogHeader className="pb-3">
            <DialogTitle>Segnala effetti collaterali</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Quali disturbi hai avuto?</Label>
              <Textarea
                value={sideEffectsNote}
                onChange={(e) => setSideEffectsNote(e.target.value)}
                placeholder="Risposta..."
                rows={3}
                className="px-3 w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Intensità</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "lieve", label: "Lieve", dots: 1, color: "bg-green-500", tone: "bg-green-100" },
                  { value: "moderato", label: "Moderato", dots: 2, color: "bg-amber-400", tone: "bg-amber-100" },
                  { value: "severo", label: "Severo", dots: 3, color: "bg-orange-500", tone: "bg-orange-100" },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setSideEffectsIntensity(option.value as Exclude<SideEffectIntensity, null>)}
                    className={cn(
                      "rounded-lg border px-3 py-2 flex flex-col items-center gap-2 transition-colors",
                      sideEffectsIntensity === option.value
                        ? cn("border-iov-dark-blue", option.tone)
                        : "border-border bg-background"
                    )}
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: option.dots }).map((_, idx) => (
                        <span key={idx} className={cn("h-3.5 w-3.5 rounded-full", option.color)} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10"
              onClick={clearSideEffects}
              disabled={isLoading}
            >
              Cancella segnalazione
            </Button>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSideEffectsOpen(false);
                }}
              >
                Annulla
              </Button>
              <Button
                className="flex-1 bg-iov-dark-blue text-white hover:bg-iov-dark-blue-hover"
                disabled={isLoading || !sideEffectsNote.trim() || !sideEffectsIntensity}
                onClick={() => {
                  setSideEffectsSubmitted(true);
                  toast({
                    title: "Segnalazione inviata",
                    description: sideEffectsIntensity ? `Intensità: ${sideEffectsIntensity}` : undefined,
                  });
                  setSideEffectsOpen(false);
                }}
              >
                Invia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssunzioniOggi;
