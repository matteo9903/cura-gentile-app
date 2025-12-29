import { useState } from "react";
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
import { Pill, Clock, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AssunzioneGiornaliera, diaryService } from "@/services/diaryService";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";

interface AssunzioniOggiProps {
  assunzioni: AssunzioneGiornaliera[];
  onUpdate: () => void;
}

const AssunzioniOggi = ({ assunzioni, onUpdate }: AssunzioniOggiProps) => {
  const [skipModalAssunzione, setSkipModalAssunzione] = useState<AssunzioneGiornaliera | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ assunzione: AssunzioneGiornaliera; type: "conferma" | "salta" } | null>(null);
  const [motivo, setMotivo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
              <CardContent className="p-4">
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
                        <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-iov-green text-white">
                          <Check className="h-4 w-4" />
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
                        <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white">
                          <X className="h-4 w-4" />
                        </span>
                        No
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      disabled
                      className={cn(
                        "w-full text-white justify-center",
                        assunzione.stato === "confermata" ? "bg-emerald-600 hover:bg-emerald-600" : "bg-destructive hover:bg-destructive",
                      )}
                    >
                      {assunzione.stato === "confermata" ? (
                        <>
                          <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <Check className="h-4 w-4 text-emerald-600" />
                          </span>
                          Farmaco assunto
                        </>
                      ) : (
                        <>
                          <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <X className="h-4 w-4 text-destructive" />
                          </span>
                          Farmaco non assunto
                        </>
                      )}
                    </Button>
                    {assunzione.stato === "saltata" && assunzione.motivo && (
                      <p className="text-sm font-semibold text-destructive">Motivo: {assunzione.motivo}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

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
        <DialogContent className="w-[90%] max-w-md rounded-xl">
          <DialogHeader>
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
                <Label>Per quale motivo non stai assumendo il farmaco?</Label>
                <Textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Scrivi la motivazione..."
                  rows={3}
                  className="px-3"
                />
              </div>

              <Button
                className="w-full bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => setConfirmAction({ assunzione: skipModalAssunzione, type: "salta" })}
                disabled={isLoading}
              >
                Confermi di non volere assumere il farmaco?
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
        <AlertDialogContent>
          <AlertDialogHeader>
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
    </>
  );
};

export default AssunzioniOggi;
