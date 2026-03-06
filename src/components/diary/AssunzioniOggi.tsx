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
import { Pill, Clock, Check, X, AlertTriangle, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AssunzioneGiornaliera, diaryService } from "@/services/diaryService";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";

interface AssunzioniOggiProps {
  assunzioni: AssunzioneGiornaliera[];
  onUpdate: () => void;
  cardBorderClass?: string;
}

type SideEffectIntensity = "lieve" | "moderato" | "severo" | null;

const AssunzioniOggi = ({ assunzioni, onUpdate, cardBorderClass }: AssunzioniOggiProps) => {
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

  // Filter pending vs completed
  const pendingAssunzioni = assunzioni.filter(a => a.stato === 'da_confermare');
  const completedAssunzioni = assunzioni.filter(a => a.stato !== 'da_confermare');

  // Sort pending by time
  const sortedPending = [...pendingAssunzioni].sort((a, b) => a.orario.localeCompare(b.orario));
  const nextDose = sortedPending[0]; // The very next one to take

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

  const cardBorder = cardBorderClass ?? "border-border";

  // If all done
  if (assunzioni.length > 0 && pendingAssunzioni.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center space-y-3 backdrop-blur-md shadow-lg">
          <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(74,222,128,0.2)] border border-green-500/30">
            <Check className="h-8 w-8 text-green-300" />
          </div>
          <h3 className="text-xl font-bold text-white">Tutto completato!</h3>
          <p className="text-sm text-blue-100/80">Hai assunto tutti i farmaci previsti per oggi.</p>
        </div>

        <Button
          onClick={() => setSideEffectsOpen(true)}
          className="w-full bg-white/10 text-blue-100 border border-white/10 hover:bg-white/20 hover:text-white font-semibold h-12 shadow-sm backdrop-blur-sm transition-all"
        >
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
          Segnala effetti collaterali
        </Button>
      </div>
    );
  }

  // If no assunzioni at all
  if (assunzioni.length === 0) {
    return (
      <Card className={cn("bg-white/5 border-dashed border-2 border-white/10", cardBorder)}>
        <CardContent className="p-8 text-center text-blue-200/60">
          <Pill className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Nessuna assunzione prevista per oggi</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Main Action Card for NEXT Dose - Glossy Azure Inner Card */}
      {nextDose && (
        <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-white/10">
          {/* Glossy Azure Background: Semi-transparent white/blue with blur over the dark background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-0" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent z-0 pointer-events-none" />

          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-400 z-10 box-shadow-[0_0_10px_bg-blue-400]" />

          <div className="p-5 relative z-20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-400/20 text-blue-100 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-400/30 shadow-sm">
                  <Clock className="w-3 h-3 text-blue-200" />
                  {nextDose.orario}
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">{nextDose.farmacoNome}</h3>
                <p className="text-blue-100/90 mt-1 font-medium">
                  {nextDose.unita} {nextDose.unita === 1 ? "compressa" : "compresse"}
                </p>
              </div>
              {/* Clear icon container on dark/glossy bg */}
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20 shadow-inner backdrop-blur-sm">
                <Pill className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setConfirmAction({ assunzione: nextDose, type: "conferma" })}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white h-12 font-bold shadow-lg shadow-blue-500/30 border border-blue-400/50 transition-all active:scale-95"
              >
                <Check className="mr-2 h-5 w-5" />
                Assumi
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setMotivo("");
                  setSkipModalAssunzione(nextDose);
                }}
                disabled={isLoading}
                className="bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:text-white h-12 font-medium backdrop-blur-sm transition-all"
              >
                <X className="mr-2 h-5 w-5" />
                Salta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Upcoming List (if more unique pending) */}
      {sortedPending.length > 1 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-blue-200/70 uppercase tracking-wide px-1">Successive</h4>
          <Swiper
            spaceBetween={12}
            slidesPerView={1.2}
            className="!pb-2 !pl-1"
            breakpoints={{
              640: { slidesPerView: 2.2 }
            }}
          >
            {sortedPending.slice(1).map(assunzione => (
              <SwiperSlide key={assunzione.id}>
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 shadow-lg flex flex-col h-full backdrop-blur-md hover:bg-white/15 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white text-sm truncate max-w-[120px]" title={assunzione.farmacoNome}>
                      {assunzione.farmacoNome}
                    </span>
                    <span className="text-xs font-bold text-blue-100 bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-400/20">
                      {assunzione.orario}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80 mb-3 block">
                    {assunzione.unita} {assunzione.unita === 1 ? "cp" : "cp"}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full mt-auto h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    onClick={() => setConfirmAction({ assunzione, type: "conferma" })}
                  >
                    Assumi ora
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* 3. Side Effects & Report */}
      <Button
        onClick={() => setSideEffectsOpen(true)}
        variant="ghost"
        className="w-full justify-between px-0 hover:bg-white/5 text-blue-100/80 font-medium group transition-colors rounded-xl p-2"
      >
        <span className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
          Segnala effetti collaterali
        </span>
        <ChevronRight className="h-4 w-4 text-blue-200/50 group-hover:text-blue-100 group-hover:translate-x-1 transition-all" />
      </Button>

      {/* Modals remain mostly same but slightly cleaner */}
      <Dialog
        open={!!skipModalAssunzione}
        onOpenChange={(open) => {
          if (!open) {
            setSkipModalAssunzione(null);
            setMotivo("");
          }
        }}
      >
        <DialogContent className="w-[94vw] max-w-sm sm:max-w-md rounded-2xl px-5 py-6">
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-xl font-bold text-gray-900">Salta assunzione</DialogTitle>
          </DialogHeader>

          {skipModalAssunzione && (
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-800">{skipModalAssunzione.farmacoNome}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{skipModalAssunzione.orario}</span>
                  <span>•</span>
                  <span>{skipModalAssunzione.unita} {skipModalAssunzione.unita === 1 ? "cp" : "cp"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">
                  Motivazione (opzionale)
                </Label>
                <Textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Perché stai saltando questa dose?"
                  rows={3}
                  className="w-full resize-none bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setSkipModalAssunzione(null)} className="flex-1">Annulla</Button>
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-500 hover:bg-red-600 shadow-md shadow-red-200"
                  onClick={() => setConfirmAction({ assunzione: skipModalAssunzione, type: "salta" })}
                  disabled={isLoading}
                >
                  Salta dose
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
            if (!skipModalAssunzione) setMotivo("");
          }
        }}
      >
        <AlertDialogContent className="w-[90%] max-w-sm rounded-2xl">
          <AlertDialogHeader className="pb-3 text-left">
            <AlertDialogTitle className="text-lg font-bold">
              {confirmAction?.type === "conferma" ? "Conferma assunzione" : "Conferma esclusione"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {confirmAction?.type === "conferma"
                ? `Confermi di aver assunto ${confirmAction?.assunzione?.farmacoNome}?`
                : `Sei sicuro di voler saltare ${confirmAction?.assunzione?.farmacoNome}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isLoading} className="border-0 bg-gray-100 hover:bg-gray-200 text-gray-800">Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isLoading}
              className={
                confirmAction?.type === "salta"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
            >
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={sideEffectsOpen}
        onOpenChange={(open) => {
          if (open) {
            sideEffectsSnapshotRef.current = { note: sideEffectsNote, intensity: sideEffectsIntensity };
            setSideEffectsSubmitted(false);
            setSideEffectsOpen(true);
            return;
          }
          if (!sideEffectsSubmitted && sideEffectsSnapshotRef.current) {
            setSideEffectsNote(sideEffectsSnapshotRef.current.note);
            setSideEffectsIntensity(sideEffectsSnapshotRef.current.intensity);
          }
          sideEffectsSnapshotRef.current = null;
          setSideEffectsSubmitted(false);
          setSideEffectsOpen(false);
        }}
      >
        <DialogContent className="w-[94vw] max-w-sm sm:max-w-md rounded-2xl px-5 py-6">
          <DialogHeader className="pb-2 text-left">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <DialogTitle className="text-xl font-bold">Segnala effetti</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Descrivi i sintomi</Label>
              <Textarea
                value={sideEffectsNote}
                onChange={(e) => setSideEffectsNote(e.target.value)}
                placeholder="Es: Ho mal di stomaco da circa un'ora..."
                rows={3}
                className="w-full resize-none border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-gray-700">Intensità del disturbo</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "lieve", label: "Lieve", dots: 1, color: "bg-green-500", tone: "bg-green-50 border-green-200 text-green-700" },
                  { value: "moderato", label: "Moderato", dots: 2, color: "bg-amber-400", tone: "bg-amber-50 border-amber-200 text-amber-700" },
                  { value: "severo", label: "Severo", dots: 3, color: "bg-red-500", tone: "bg-red-50 border-red-200 text-red-700" },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setSideEffectsIntensity(option.value as Exclude<SideEffectIntensity, null>)}
                    className={cn(
                      "rounded-xl border px-2 py-3 flex flex-col items-center gap-2 transition-all duration-200",
                      sideEffectsIntensity === option.value
                        ? cn("shadow-sm ring-2 ring-offset-1 ring-gray-200", option.tone)
                        : "border-gray-100 bg-white hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <div className="flex gap-1 h-2 items-center">
                      {Array.from({ length: option.dots }).map((_, idx) => (
                        <span key={idx} className={cn("h-2 w-2 rounded-full", option.color)} />
                      ))}
                    </div>
                    <span className="text-xs font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                variant="ghost"
                className="flex-1 text-gray-500 hover:text-gray-700"
                onClick={() => setSideEffectsOpen(false)}
              >
                Annulla
              </Button>
              <Button
                className="flex-[2] bg-gray-900 text-white hover:bg-black font-semibold shadow-lg shadow-gray-200"
                disabled={isLoading || !sideEffectsNote.trim() || !sideEffectsIntensity}
                onClick={() => {
                  setSideEffectsSubmitted(true);
                  toast({
                    title: "Segnalazione inviata",
                    description: "Grazie per il tuo feedback.",
                    className: "bg-gray-900 text-white border-gray-900"
                  });
                  setSideEffectsOpen(false);
                }}
              >
                Invia segnalazione
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssunzioniOggi;
