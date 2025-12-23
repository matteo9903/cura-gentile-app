import { useEffect, useMemo, useState } from "react";
import { patientService, CartaIdentitaTerapeutica } from "@/services/patientService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Users,
  Stethoscope,
  HeartPulse,
  Heart,
  AlertTriangle,
  Phone,
  Mail,
  Scale,
  Ruler,
  CalendarDays,
  CreditCard,
  Baby,
  Syringe,
  ActivitySquare,
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

  const initials = useMemo(() => {
    if (!carta) return "";
    const name = `${carta.paziente.nome} ${carta.paziente.cognome}`.trim();
    const parts = name.split(" ").filter(Boolean);
    if (!parts.length) return "";
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return `${first}${last}`.toUpperCase();
  }, [carta]);

  const tagBase = "px-3 py-1 rounded-full text-[11px] font-semibold border-0";
  const pillBase =
    "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-white/40 shadow-sm";
  const sectionTitleClass = "flex items-center gap-2 text-iov-dark-blue font-semibold text-base";
  const sectionContainerClass = "bg-white/70 rounded-2xl p-3 shadow-sm border border-white/60";
  const subtleLabel = "text-[11px] uppercase tracking-wide text-iov-dark-blue/70 font-semibold";

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[76px] bg-iov-gradient text-white px-4 flex items-center z-40 safe-area-top border-b border-white/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Carta d'Identità Farmacologica</h1>
            <p className="text-[12px] text-white/85">Profilo clinico sempre a portata di mano</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-[96px] p-4 pb-24 space-y-4">
        {/* Identity Card */}
        <Card className="bg-white/90 border-none shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-iov-gradient p-4 pb-5 text-white">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white/25 border border-white/30 flex items-center justify-center text-lg font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/80 uppercase font-semibold">Paziente</p>
                <h2 className="text-xl font-bold leading-snug">
                  {carta.paziente.nome} {carta.paziente.cognome}
                </h2>
                <p className="text-[12px] text-white/80">{carta.paziente.codiceFiscale}</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className={`${pillBase} text-iov-dark-blue`}>
                <Scale className="h-4 w-4 text-iov-dark-blue/80" />
                <div>
                  <p className={subtleLabel}>Peso</p>
                  <p className="font-semibold">{carta.paziente.peso} kg</p>
                </div>
              </div>
              <div className={`${pillBase} text-iov-dark-blue`}>
                <Ruler className="h-4 w-4 text-iov-dark-blue/80" />
                <div>
                  <p className={subtleLabel}>Altezza</p>
                  <p className="font-semibold">{carta.paziente.altezza} cm</p>
                </div>
              </div>
              <div className={`${pillBase} text-iov-dark-blue`}>
                <CalendarDays className="h-4 w-4 text-iov-dark-blue/80" />
                <div>
                  <p className={subtleLabel}>Data di nascita</p>
                  <p className="font-semibold">{carta.paziente.dataNascita}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="bg-iov-gray-light rounded-xl p-3 border border-white/60 text-iov-dark-blue">
                <p className={subtleLabel}>Codice Fiscale</p>
                <p className="font-mono text-base font-semibold break-words">{carta.paziente.codiceFiscale}</p>
              </div>
              <div className="bg-iov-gray-light rounded-xl p-3 border border-white/60 text-iov-dark-blue">
                <p className={subtleLabel}>Tessera Sanitaria</p>
                <p className="font-mono text-base font-semibold break-words">800 123 456 789012</p>
              </div>
              <div className="bg-iov-gray-light rounded-xl p-3 border border-white/60 text-iov-dark-blue">
                <p className={subtleLabel}>Residenza</p>
                <p className="text-[15px] font-semibold leading-snug break-words">{carta.paziente.indirizzo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        <section className={sectionContainerClass}>
          <div className={sectionTitleClass}>
            <Users className="h-5 w-5 text-iov-dark-blue" />
            <span>Contatti Caregiver</span>
            <Badge className={`${tagBase} bg-iov-light-blue-dark text-iov-dark-blue ml-auto`}>
              {carta.caregiver.length}
            </Badge>
          </div>
          <div className="mt-3">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={14}
              slidesPerView={1}
              className="pb-8"
            >
              {carta.caregiver.map((cg, idx) => (
                <SwiperSlide key={idx}>
                  <Card className="bg-white/90 border border-iov-light-blue/60 rounded-2xl shadow-sm">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-iov-light-blue-light text-iov-dark-blue font-bold flex items-center justify-center">
                          {`${cg.nome[0]}${cg.cognome[0]}`.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-iov-dark-blue">
                            {cg.nome} {cg.cognome}
                          </p>
                          <Badge className={`${tagBase} bg-iov-light-blue-dark text-iov-dark-blue mt-1`}>
                            {cg.relazione}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-iov-dark-blue">
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-iov-dark-blue/80" /> {cg.telefono}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-iov-dark-blue/80" /> {cg.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Specialists */}
        <section className={sectionContainerClass}>
          <div className={sectionTitleClass}>
            <Stethoscope className="h-5 w-5 text-iov-yellow-dark" />
            <span>Specialisti di riferimento</span>
            <Badge className={`${tagBase} bg-iov-yellow-dark text-iov-dark-blue ml-auto`}>
              {carta.specialisti.length}
            </Badge>
          </div>
          <div className="mt-3">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={14}
              slidesPerView={1}
              className="pb-8"
            >
              {carta.specialisti.map((sp, idx) => (
                <SwiperSlide key={idx}>
                  <Card className="bg-white/90 border border-iov-yellow/60 rounded-2xl shadow-sm">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-iov-yellow-light text-iov-dark-blue font-bold flex items-center justify-center">
                          {`${sp.nome[0]}${sp.cognome[0]}`.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-iov-dark-blue">
                            {sp.nome} {sp.cognome}
                          </p>
                          <Badge className={`${tagBase} bg-iov-yellow-dark text-iov-dark-blue mt-1`}>
                            {sp.specializzazione}
                          </Badge>
                          <p className="text-xs text-iov-dark-blue/70 mt-1">{sp.ospedale}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-iov-dark-blue">
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-iov-dark-blue/80" /> {sp.telefono}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-iov-dark-blue/80" /> {sp.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Diagnosis */}
        <section className={sectionContainerClass}>
          <div className={sectionTitleClass}>
            <HeartPulse className="h-5 w-5 text-iov-pink-dark" />
            <span>Diagnosi Oncologica</span>
          </div>
          <div className="mt-3">
            <Card className="bg-white/95 border border-iov-pink/60 rounded-2xl shadow-sm">
              <CardContent className="p-4 space-y-3 text-iov-dark-blue">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-iov-pink-light flex items-center justify-center text-iov-pink-dark">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-iov-dark-blue/70">Tipo</p>
                    <p className="font-semibold leading-snug">{carta.diagnosiOncologica.tipo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`${pillBase} bg-iov-pink-light/70 text-iov-pink-dark`}>
                    <ActivitySquare className="h-4 w-4" />
                    <div>
                      <p className={subtleLabel}>Stadio</p>
                      <p className="font-semibold">{carta.diagnosiOncologica.stadio}</p>
                    </div>
                  </div>
                  <div className={`${pillBase} bg-iov-pink-light/70 text-iov-pink-dark`}>
                    <Baby className="h-4 w-4" />
                    <div>
                      <p className={subtleLabel}>Data diagnosi</p>
                      <p className="font-semibold">{carta.diagnosiOncologica.datadiagnosi}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-iov-pink-light/60 rounded-xl p-3 border border-iov-pink/40">
                  <p className={subtleLabel}>Istologia</p>
                  <p className="font-semibold">{carta.diagnosiOncologica.istologia}</p>
                  <p className="text-sm text-iov-dark-blue/80 mt-1">{carta.diagnosiOncologica.note}</p>
                </div>
                <div className="space-y-2">
                  <p className={subtleLabel}>Terapie in corso</p>
                  <div className="flex flex-col gap-2">
                    {carta.terapieOncologiche.map((tp, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-iov-gray-light rounded-xl p-3 border border-white/70"
                      >
                        <Syringe className="h-4 w-4 text-iov-pink-dark mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold">{tp.farmaco}</p>
                          <p className="text-sm text-iov-dark-blue/80">{tp.dosaggio} • {tp.frequenza}</p>
                          {tp.note && <p className="text-xs text-iov-dark-blue/70 mt-1">{tp.note}</p>}
                          <p className="text-[11px] text-iov-dark-blue/60 mt-1">Avvio: {tp.dataInizio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comorbidità & Allergie */}
        <section className={sectionContainerClass}>
          <div className={sectionTitleClass}>
            <Heart className="h-5 w-5 text-iov-dark-blue" />
            <span>Comorbidità</span>
            <Badge className={`${tagBase} bg-iov-light-blue-dark text-iov-dark-blue ml-auto`}>
              {carta.comorbidita.length}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {carta.comorbidita.map((cm, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-iov-light-blue-light text-iov-dark-blue px-3 py-2 rounded-full border border-iov-light-blue/70"
              >
                <ActivitySquare className="h-4 w-4" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold">{cm.nome}</span>
                  <span className="text-[11px] text-iov-dark-blue/70">Dal {cm.annoInsorgenza}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className={sectionTitleClass}>
              <AlertTriangle className="h-5 w-5 text-iov-pink-dark" />
              <span>Allergie</span>
              <Badge className={`${tagBase} bg-iov-pink-dark text-white ml-auto`}>
                {carta.allergie.length}
              </Badge>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {carta.allergie.map((al, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white/90 border border-iov-pink/40 rounded-xl px-3 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-iov-pink-light flex items-center justify-center text-iov-pink-dark font-bold">
                      {al.sostanza[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-iov-dark-blue">{al.sostanza}</p>
                      <p className="text-[12px] text-iov-dark-blue/70">{al.reazione}</p>
                    </div>
                  </div>
                  <Badge
                    className={`${tagBase} ${
                      al.gravita === "grave"
                        ? "bg-iov-veneto-red text-white"
                        : al.gravita === "moderata"
                        ? "bg-iov-yellow text-iov-dark-blue"
                        : "bg-iov-light-blue-dark text-iov-dark-blue"
                    }`}
                  >
                    {al.gravita}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
