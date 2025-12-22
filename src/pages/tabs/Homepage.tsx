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
  Scale,
  Ruler,
  CalendarDays,
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

  const anagraphicsCardClass =
    "bg-iov-light-blue-light border border-iov-light-blue rounded-xl shadow-sm";
  const anagraphicsDetailBoxClass =
    "flex items-center gap-2 rounded-lg bg-white/80 border border-iov-light-blue border-l-4 border-iov-yellow px-3 py-2 text-iov-dark-blue shadow-inner";

  const accordionItemBaseClass = "border rounded-xl px-4 shadow-sm";
  const innerCardBaseClass = "bg-white/90 border border-iov-light-blue rounded-lg shadow-sm";

  const accordionThemes = {
    caregiver: {
      bg: "bg-iov-light-blue-light/70",
      border: "border-iov-light-blue",
      accent: "border-iov-light-blue-dark",
      icon: "text-iov-light-blue-dark",
      count: "bg-iov-light-blue-dark text-iov-dark-blue",
    },
    specialisti: {
      bg: "bg-iov-yellow-light/70",
      border: "border-iov-yellow",
      accent: "border-iov-yellow-dark",
      icon: "text-iov-yellow-dark",
      count: "bg-iov-yellow-dark text-iov-dark-blue",
    },
    diagnosi: {
      bg: "bg-iov-pink-light/70",
      border: "border-iov-pink",
      accent: "border-iov-pink-dark",
      icon: "text-iov-pink-dark",
    },
    comorbidita: {
      bg: "bg-iov-light-blue/60",
      border: "border-iov-light-blue",
      accent: "border-iov-light-blue-dark",
      icon: "text-iov-light-blue-dark",
      count: "bg-iov-light-blue-dark text-iov-dark-blue",
    },
    allergie: {
      bg: "bg-iov-gray-light",
      border: "border-iov-pink",
      accent: "border-iov-veneto-red",
      icon: "text-iov-veneto-red",
      count: "bg-iov-veneto-red text-white",
    },
  } as const;

  const caregiverTheme = accordionThemes.caregiver;
  const specialistiTheme = accordionThemes.specialisti;
  const diagnosiTheme = accordionThemes.diagnosi;
  const comorbiditaTheme = accordionThemes.comorbidita;
  const allergieTheme = accordionThemes.allergie;

  if (isLoading || !carta) {
    return (
      <div className="h-full flex flex-col safe-area-top">
        <header className="fixed top-0 left-0 right-0 h-[70px] bg-iov-gradient text-white px-4 flex items-center z-40 safe-area-top border-b border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full bg-white/40" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-44 bg-white/30" />
              <Skeleton className="h-3 w-32 bg-white/30" />
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
    <div className="min-h-screen bg-iov-gray-light safe-area-top">
      {/* Header - Fixed, uniform height */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-iov-gradient text-white px-4 flex items-center z-40 safe-area-top border-b border-white/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Carta d'Identita Farmacologica</h1>
            <p className="text-xs text-white/80">
              I tuoi dati anagrafici e clinici
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-[94px] p-4 space-y-4 pb-24">
        {/* Patient Info Card */}
        <Card className={`${anagraphicsCardClass} backdrop-blur`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-iov-dark-blue">
              <User className="h-10 w-10 shrink-0" />
              {carta.paziente.nome} {carta.paziente.cognome}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 bg-iov-light-blue-light rounded-lg shadow-inner text-iov-dark-blue border border-white/40">
                <Scale className="h-5 w-5 mb-1" />
                <span className="text-[11px] uppercase tracking-wide">Peso</span>
                <span className="font-semibold">{carta.paziente.peso} kg</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-iov-light-blue-light rounded-lg shadow-inner text-iov-dark-blue border border-white/40">
                <Ruler className="h-5 w-5 mb-1" />
                <span className="text-[11px] uppercase tracking-wide">Altezza</span>
                <span className="font-semibold">{carta.paziente.altezza} cm</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-iov-light-blue-light rounded-lg shadow-inner text-iov-dark-blue border border-white/40">
                <CalendarDays className="h-5 w-5 mb-1" />
                <span className="text-[11px] uppercase tracking-wide">Nascita</span>
                <span className="font-semibold">{carta.paziente.dataNascita}</span>
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <div className={anagraphicsDetailBoxClass}>
                <span className="text-[11px] font-semibold uppercase">CF</span>
                <span className="font-mono text-sm">{carta.paziente.codiceFiscale}</span>
              </div>
              <div className={anagraphicsDetailBoxClass}>
                <span className="text-[11px] font-semibold uppercase">TS</span>
                <span className="font-mono text-sm">800 123 456 789012</span>
              </div>
              <div className={anagraphicsDetailBoxClass}>
                <span className="text-[11px] font-semibold uppercase">Residenza</span>
                <span className="text-sm leading-snug">{carta.paziente.indirizzo}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accordion Sections */}
        <Accordion type="multiple" className="space-y-3">
          {/* Caregiver */}
          <AccordionItem
            value="caregiver"
            className={`${accordionItemBaseClass} ${caregiverTheme.bg} ${caregiverTheme.border}`}
          >
            <AccordionTrigger className="py-3 text-iov-dark-blue">
              <div className="flex items-center gap-2">
                <Users className={`h-5 w-5 ${caregiverTheme.icon}`} />
                <span>Contatti Caregiver</span>
                <Badge className={`ml-2 ${caregiverTheme.count}`}>
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
                    <Card className={`${innerCardBaseClass} border-l-4 ${caregiverTheme.accent}`}>
                      <CardContent className="p-3 space-y-2">
                        <p className="font-semibold">
                          {cg.nome} {cg.cognome}
                        </p>
                        <Badge className="bg-iov-yellow text-iov-dark-blue mb-1">
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
          <AccordionItem
            value="specialisti"
            className={`${accordionItemBaseClass} ${specialistiTheme.bg} ${specialistiTheme.border}`}
          >
            <AccordionTrigger className="py-3 text-iov-dark-blue">
              <div className="flex items-center gap-2">
                <Stethoscope className={`h-5 w-5 ${specialistiTheme.icon}`} />
                <span>Contatti Specialisti</span>
                <Badge className={`ml-2 ${specialistiTheme.count}`}>
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
                    <Card className={`${innerCardBaseClass} border-l-4 ${specialistiTheme.accent}`}>
                      <CardContent className="p-3 space-y-2">
                        <p className="font-semibold">
                          {sp.nome} {sp.cognome}
                        </p>
                        <Badge className="bg-iov-light-blue text-iov-dark-blue border border-iov-dark-blue mb-1">
                          {sp.specializzazione}
                        </Badge>
                        <p className="text-xs text-muted-foreground mb-2 leading-snug">
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
          <AccordionItem
            value="diagnosi"
            className={`${accordionItemBaseClass} ${diagnosiTheme.bg} ${diagnosiTheme.border}`}
          >
            <AccordionTrigger className="py-3 text-iov-dark-blue">
              <div className="flex items-center gap-2">
                <Heart className={`h-5 w-5 ${diagnosiTheme.icon}`} />
                <span>Diagnosi Oncologica</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className={`${innerCardBaseClass} border-l-4 ${diagnosiTheme.accent}`}>
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
                          {tp.note && `(${tp.note})`} Via orale - {new Date(
                            tp.dataInizio.split("/").reverse().join("-")
                          ).getFullYear()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Comorbidita */}
          <AccordionItem
            value="comorbidita"
            className={`${accordionItemBaseClass} ${comorbiditaTheme.bg} ${comorbiditaTheme.border}`}
          >
            <AccordionTrigger className="py-3 text-iov-dark-blue">
              <div className="flex items-center gap-2">
                <Heart className={`h-5 w-5 ${comorbiditaTheme.icon}`} />
                <span>Comorbidita</span>
                <Badge className={`ml-2 ${comorbiditaTheme.count}`}>
                  {carta.comorbidita.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {carta.comorbidita.map((cm, idx) => (
                  <Card key={idx} className={`${innerCardBaseClass} border-l-4 ${comorbiditaTheme.accent}`}>
                    <CardContent className="p-3 space-y-1">
                      <p className="font-semibold">{cm.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Dal {cm.annoInsorgenza}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Allergie */}
          <AccordionItem
            value="allergie"
            className={`${accordionItemBaseClass} ${allergieTheme.bg} ${allergieTheme.border}`}
          >
            <AccordionTrigger className="py-3 text-iov-dark-blue">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${allergieTheme.icon}`} />
                <span>Allergie</span>
                <Badge className={`ml-2 ${allergieTheme.count}`}>
                  {carta.allergie.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {carta.allergie.map((al, idx) => (
                  <Card key={idx} className={`${innerCardBaseClass} border-l-4 ${allergieTheme.accent}`}>
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
