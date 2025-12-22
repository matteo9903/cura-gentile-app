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
  Phone,
  Mail,
  MapPin,
  Scale,
  Ruler,
  Droplets,
  CreditCard,
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
        <header className="fixed top-0 left-0 right-0 h-[70px] bg-primary px-4 flex items-center z-40 safe-area-top">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full bg-primary-foreground/20" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-44 bg-primary-foreground/20" />
              <Skeleton className="h-3 w-32 bg-primary-foreground/20" />
            </div>
          </div>
        </header>
        <div className="pt-[94px] flex-1 p-4 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header - Fixed, uniform height */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-primary px-4 flex items-center z-40 safe-area-top">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">
              Carta d'Identità Farmacologica
            </h1>
            <p className="text-xs text-primary-foreground/80">
              I tuoi dati anagrafici e clinici
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-[94px] p-4 space-y-4 pb-24">
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
                <CreditCard className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">TS:</span>
                <span className="font-mono text-xs">800 123 456 789012</span>
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
                <span>Contatti Specialisti</span>
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

          {/* Diagnosi Oncologica - Simplified */}
          <AccordionItem value="diagnosi" className="border rounded-lg px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                <span>Diagnosi Oncologica</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="bg-muted/50">
                <CardContent className="p-3 space-y-3">
                  {/* Tumor info */}
                  <div>
                    <p className="font-semibold">{carta.diagnosiOncologica.tipo}</p>
                    <Badge variant="outline" className="mt-1">
                      Stadio: {carta.diagnosiOncologica.stadio}
                    </Badge>
                  </div>

                  {/* Oncological therapies as text annotations */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Terapie oncologiche:</p>
                    {carta.terapieOncologiche.map((tp, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{tp.farmaco}</span>
                        <span className="text-muted-foreground"> - {tp.dosaggio}, {tp.frequenza}</span>
                        <span className="text-muted-foreground block text-xs">
                          {tp.note && `(${tp.note})`} ƒ?½ Via orale ƒ?½ {new Date(tp.dataInizio.split('/').reverse().join('-')).getFullYear()}
                        </span>
                      </div>
                    ))}
                  </div>
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
        </Accordion>
      </div>
    </div>
  );
};

export default Homepage;
