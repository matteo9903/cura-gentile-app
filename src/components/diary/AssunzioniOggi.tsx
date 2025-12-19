import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [skipModal, setSkipModal] = useState<AssunzioneGiornaliera | null>(null);
  const [effettiCollaterali, setEffettiCollaterali] = useState("");
  const [intensita, setIntensita] = useState<"bassa" | "media" | "alta">("media");
  const [isLoading, setIsLoading] = useState(false);

  const pendingAssunzioni = assunzioni.filter(a => a.stato === 'da_confermare');

  const handleConferma = async (assunzione: AssunzioneGiornaliera) => {
    setIsLoading(true);
    try {
      await diaryService.confermaAssunzione(assunzione.id);
      toast({
        title: "Assunzione confermata",
        description: `${assunzione.farmacoNome} alle ${assunzione.orario}`,
        className: "bg-iov-green text-white border-iov-green",
      });
      onUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalta = async () => {
    if (!skipModal) return;
    setIsLoading(true);
    try {
      await diaryService.saltaAssunzione(skipModal.id, effettiCollaterali, intensita);
      toast({
        title: "Assunzione saltata",
        description: `${skipModal.farmacoNome} alle ${skipModal.orario}`,
        variant: "destructive",
      });
      setSkipModal(null);
      setEffettiCollaterali("");
      setIntensita("media");
      onUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingAssunzioni.length === 0) {
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
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={12}
        slidesPerView={1.1}
        className="!pb-8"
      >
        {pendingAssunzioni.map((assunzione) => (
          <SwiperSlide key={assunzione.id}>
            <Card className="border-secondary">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{assunzione.farmacoNome}</h4>
                    <p className="text-sm text-muted-foreground">{assunzione.unita} {assunzione.unita === 1 ? 'compressa' : 'compresse'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-accent" />
                      <span className="text-sm font-medium text-accent">{assunzione.orario}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleConferma(assunzione)}
                    disabled={isLoading}
                    className="flex-1 bg-iov-green hover:bg-iov-green/90"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Conferma
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSkipModal(assunzione)}
                    disabled={isLoading}
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Salta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Skip Modal */}
      <Dialog open={!!skipModal} onOpenChange={() => setSkipModal(null)}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Salta assunzione</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {skipModal && (
              <>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">{skipModal.farmacoNome}</p>
                  <p className="text-sm text-muted-foreground">{skipModal.orario} - {skipModal.unita} {skipModal.unita === 1 ? 'compressa' : 'compresse'}</p>
                </div>

                <div className="space-y-2">
                  <Label>Effetti collaterali riscontrati</Label>
                  <Textarea
                    value={effettiCollaterali}
                    onChange={(e) => setEffettiCollaterali(e.target.value)}
                    placeholder="Descrivi eventuali effetti collaterali..."
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Intensità</Label>
                  <RadioGroup value={intensita} onValueChange={(v) => setIntensita(v as "bassa" | "media" | "alta")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bassa" id="bassa" />
                      <Label htmlFor="bassa" className="font-normal cursor-pointer">Bassa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="media" />
                      <Label htmlFor="media" className="font-normal cursor-pointer">Media</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alta" id="alta" />
                      <Label htmlFor="alta" className="font-normal cursor-pointer">Alta</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>

          <div className="shrink-0 pt-4 border-t">
            <Button
              onClick={handleSalta}
              disabled={isLoading}
              className="w-full"
              variant="destructive"
            >
              Conferma salto assunzione
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssunzioniOggi;
