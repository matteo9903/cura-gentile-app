import { useEffect, useState } from "react";
import { patientService, CartaIdentitaTerapeutica } from "@/services/patientService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  User,
  Users,
  Stethoscope,
  Heart,
  AlertTriangle,
  Pill,
  FileText,
  Phone,
  Mail,
  MapPin,
  Scale,
  Ruler,
  Droplets,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Homepage = () => {
  const [carta, setCarta] = useState<CartaIdentitaTerapeutica | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await patientService.getCartaTerapeutica();
      setCarta(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading || !carta) {
    return (
      <div className="h-full flex flex-col safe-area-top">
        <header className="bg-primary px-4 py-4">
          <Skeleton className="h-6 w-48 bg-primary-foreground/20" />
        </header>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-primary px-4 py-4 z-40 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">
              Carta d'Identità Terapeutica
            </h1>
            <p className="text-xs text-primary-foreground/80">
              v. {carta.versione} del {carta.dataAggiornamento}
            </p>
          </div>
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 p-4 space-y-4">
        {/* Patient Info Card */}
        <Card className="border-secondary border-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              {carta.paziente.nome} {carta.paziente.cognome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="flex flex-col items-center p-2 bg-secondary/30 rounded-lg">
                <Scale className="h-4 w-4 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Peso</span>
                <span className="font-semibold">{carta.paziente.peso} kg</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-secondary/30 rounded-lg">
                <Ruler className="h-4 w-4 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Altezza</span>
                <span className="font-semibold">{carta.paziente.altezza} cm</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-secondary/30 rounded-lg">
                <Droplets className="h-4 w-4 text-destructive mb-1" />
                <span className="text-xs text-muted-foreground">Gruppo</span>
                <span className="font-semibold">{carta.paziente.gruppoSanguigno}</span>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">CF:</span>
                <span className="font-mono text-xs">{carta.paziente.codiceFiscale}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{carta.paziente.indirizzo}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Accordion Sections */}
        <Accordion type="multiple" className="space-y-2">
          {/* Caregiver */}
          <AccordionItem value="caregiver" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-iov-blue" />
                <span>Contatti Caregiver</span>
                <Badge variant="secondary" className="ml-2">
                  {carta.caregiver.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={12}
                slidesPerView={1}
                className="pb-8"
              >
                {carta.caregiver.map((cg, idx) => (
                  <SwiperSlide key={idx}>
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <p className="font-semibold">
                          {cg.nome} {cg.cognome}
                        </p>
                        <Badge className="bg-accent text-accent-foreground mb-2">
                          {cg.relazione}
                        </Badge>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <Phone className="h-3 w-3" /> {cg.telefono}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-3 w-3" /> {cg.email}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </AccordionContent>
          </AccordionItem>

          {/* Specialisti */}
          <AccordionItem value="specialisti" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-iov-blue" />
                <span>Specialisti</span>
                <Badge variant="secondary" className="ml-2">
                  {carta.specialisti.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={12}
                slidesPerView={1}
                className="pb-8"
              >
                {carta.specialisti.map((sp, idx) => (
                  <SwiperSlide key={idx}>
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <p className="font-semibold">
                          {sp.nome} {sp.cognome}
                        </p>
                        <Badge className="bg-primary text-primary-foreground mb-1">
                          {sp.specializzazione}
                        </Badge>
                        <p className="text-xs text-muted-foreground mb-2">
                          {sp.ospedale}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <Phone className="h-3 w-3" /> {sp.telefono}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-3 w-3" /> {sp.email}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </AccordionContent>
          </AccordionItem>

          {/* Diagnosi */}
          <AccordionItem value="diagnosi" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                <span>Diagnosi Oncologica</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="bg-muted/50">
                <CardContent className="p-3 space-y-2">
                  <p className="font-semibold">{carta.diagnosiOncologica.tipo}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      Stadio: {carta.diagnosiOncologica.stadio}
                    </Badge>
                    <Badge variant="outline">
                      {carta.diagnosiOncologica.istologia}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Data diagnosi: {carta.diagnosiOncologica.datadiagnosi}
                  </p>
                  <p className="text-sm bg-secondary/50 p-2 rounded">
                    {carta.diagnosiOncologica.note}
                  </p>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Comorbidità */}
          <AccordionItem value="comorbidita" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-iov-pink" />
                <span>Comorbidità</span>
                <Badge variant="secondary" className="ml-2">
                  {carta.comorbidita.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {carta.comorbidita.map((cm, idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-3">
                      <p className="font-semibold">{cm.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Dal {cm.annoInsorgenza}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Terapia: </span>
                        {cm.terapiaInCorso}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Allergie */}
          <AccordionItem value="allergie" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <span>Allergie</span>
                <Badge variant="secondary" className="ml-2">
                  {carta.allergie.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {carta.allergie.map((al, idx) => (
                  <Card key={idx} className="bg-muted/50 border-l-4 border-l-destructive">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{al.sostanza}</p>
                        <Badge
                          variant={
                            al.gravita === "grave"
                              ? "destructive"
                              : al.gravita === "moderata"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {al.gravita}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{al.tipo}</p>
                      <p className="text-sm mt-1">{al.reazione}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Terapie */}
          <AccordionItem value="terapie" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-iov-green" />
                <span>Terapie Oncologiche</span>
                <Badge variant="secondary" className="ml-2">
                  {carta.terapieOncologiche.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={12}
                slidesPerView={1}
                className="pb-8"
              >
                {carta.terapieOncologiche.map((tp, idx) => (
                  <SwiperSlide key={idx}>
                    <Card className="bg-secondary/30 border-l-4 border-l-iov-green">
                      <CardContent className="p-3">
                        <p className="font-semibold text-lg">{tp.farmaco}</p>
                        <div className="flex gap-2 my-2">
                          <Badge>{tp.dosaggio}</Badge>
                          <Badge variant="outline">{tp.frequenza}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Inizio: {tp.dataInizio}
                        </p>
                        {tp.note && (
                          <p className="text-sm mt-2 bg-muted p-2 rounded">
                            {tp.note}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Note Generali */}
        <Card className="bg-accent/20 border-accent">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Note Generali
            </h3>
            <p className="text-sm">{carta.noteGenerali}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Homepage;
