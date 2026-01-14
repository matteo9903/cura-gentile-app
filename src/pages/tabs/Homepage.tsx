import { useEffect, useMemo, useState } from "react";
import { patientService, CartaIdentitaTerapeutica } from "@/services/patientService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Stethoscope,
  Microscope,
  AlertTriangle,
  Phone,
  Scale,
  Ruler,
  CalendarDays,
  Fingerprint,
  MapPin,
  ShieldCheck,
  IdCard,
  ClipboardPlus,
  ShieldPlus,
  Syringe,
  ActivitySquare,
  Pill,
  BriefcaseMedical
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
    const firstWord = parts[0] ?? "";
    const firstChar = firstWord[0] ?? "";
    const secondChar =
      (parts.length > 1 ? parts[parts.length - 1]?.[0] : firstWord[1]) ?? firstChar;
    return `${firstChar}${secondChar}`.slice(0, 2).toUpperCase();
  }, [carta]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
      .format(new Date())
      .toUpperCase();
  }, []);

  const tagBase = "px-3 py-1 rounded-full text-[11px] font-semibold border-0";
  const pillBase =
    "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-white/40 shadow-sm";
  const sectionTitleClass = "flex items-center gap-2 text-iov-dark-blue font-semibold text-base";
  const sectionContainerBaseClass = "bg-white/70 rounded-2xl p-3 shadow-sm";
  const subtleLabel = "text-[11px] uppercase tracking-wide text-iov-dark-blue/70 font-semibold";

  const specialistContacts = useMemo(() => {
    if (!carta) return [];
    const labels = ["Per consulenze", "Per urgenze", "Farmacia ospedaliera"];
    return labels
      .map((label, idx) => ({
        label,
        telefono:
          carta.specialisti[idx]?.telefono ??
          carta.specialisti[idx % carta.specialisti.length]?.telefono ??
          "",
        note: label === "Farmacia ospedaliera" ? "Orari: Lun-Ven 8.30-16.30" : undefined,
      }))
      .filter((item) => item.telefono);
  }, [carta]);

  const emergencyContacts = useMemo(
    () => [
      { label: "Soccorso Pubblico", telefono: "113" },
      { label: "Emergenza Sanitaria", telefono: "118" },
      { label: "N.U.E.", telefono: "112" },
      { label: "Guardia Medica", telefono: "116117" },
    ],
    []
  );

  if (isLoading || !carta) {
    return (
      <div 
        className="min-h-screen bg-background"
        style={{
          paddingTop: "var(--safe-area-top)",
          paddingBottom: "var(--safe-area-bottom)",
        }}
      >
        <header 
          className="fixed top-0 left-0 right-0 bg-iov-gradient text-white px-4 flex items-center justify-between z-40 border-b border-white/20 shadow-lg"
          style={{
            paddingTop: "calc(var(--safe-area-top)/2)",
            paddingBottom: "calc(var(--safe-area-top)/2)",
            minHeight: "70px",
          }}
        >
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
    <div 
      className="min-h-screen bg-background"
      style={{
        // paddingTop: "var(--safe-area-top)",
        paddingTop: "var(--safe-area-top)/3",
        paddingBottom: "var(--safe-area-bottom)",
      }}
    >
      {/* Header */}
      {/* <header 
        className="fixed top-0 left-0 right-0 bg-iov-gradient text-white px-4 flex items-center justify-between z-40 border-b border-white/20 shadow-lg"
        style={{
          paddingTop: "calc(var(--safe-area-top)/2)",
          paddingBottom: "calc(var(--safe-area-top)/2)",
          minHeight: "70px",
        }}
        >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Carta d'Identità Farmacologica</h1>
            <p className="text-[14px] text-white/85">Profilo clinico a portata di mano</p>
          </div>
        </div>
      </header> */}

      {/* Content */}
      <div className="p-4 pb-4 space-y-4"
        style={{
          // paddingTop: 'calc(70px + var(--safe-area-top)/2)'
        }}
      >
        {/* Identity Card */}
        <Card className="bg-white/90 border border-iov-dark-blue rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-iov-gradient px-5 py-6 text-white">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/25 border border-white/30 flex items-center justify-center text-lg font-bold">
                {initials}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-primary uppercase tracking-[0.25em] text-white/80">Ciao</p>
                <p
                  className="text-3xl font-black leading-tight break-words text-iov-yellow-dark"
                  style={{ textShadow: "0 8px 18px rgba(0, 0, 0, 0.35)" }}
                >
                  {carta.paziente.nome}
                </p>
                <p className="text-sm font-semibold text-white/85">{formattedDate}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/95 border border-iov-light-blue rounded-2xl shadow-sm">
          <CardHeader className="pb-0 pt-4 px-4 flex-row items-center gap-3 space-y-0">
            <div className="w-11 h-11 rounded-xl bg-iov-light-blue-light flex items-center justify-center">
              <IdCard className="h-5 w-5 text-iov-dark-blue" />
            </div>
            <CardTitle className="text-lg font-bold text-iov-dark-blue">Dati personali</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className={`${pillBase} text-iov-dark-blue flex-col items-start border-iov-light-blue`}>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-iov-dark-blue/80" />
                  <p className={subtleLabel}>Peso</p>
                </div>
                <p className="font-semibold text-[15px]">{carta.paziente.peso} kg</p>
              </div>
              <div className={`${pillBase} text-iov-dark-blue flex-col items-start border-iov-light-blue`}>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-iov-dark-blue/80" />
                  <p className={subtleLabel}>Altezza</p>
                </div>
                <p className="font-semibold text-[15px]">{carta.paziente.altezza} cm</p>
              </div>
              <div className={`${pillBase} text-iov-dark-blue flex-col items-start border-iov-light-blue`}>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-iov-dark-blue/80" />
                  <p className={subtleLabel}>Nascita</p>
                </div>
                <p className="font-semibold text-[15px]">{carta.paziente.dataNascita}</p>
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="bg-iov-gray-light rounded-xl p-3 border border-iov-light-blue text-iov-dark-blue flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-iov-light-blue flex items-center justify-center text-iov-dark-blue">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className={subtleLabel}>Codice Fiscale</p>
                  <p className="font-mono text-base font-semibold break-words">{carta.paziente.codiceFiscale}</p>
                </div>
              </div>
              <div className="bg-iov-gray-light rounded-xl p-3 border border-iov-light-blue text-iov-dark-blue flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-iov-light-blue flex items-center justify-center text-iov-dark-blue">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className={subtleLabel}>Tessera Sanitaria</p>
                  <p className="font-mono text-base font-semibold break-words">800 123 456 789012</p>
                </div>
              </div>
              <div className="bg-iov-gray-light rounded-xl p-3 border border-iov-light-blue text-iov-dark-blue flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-iov-light-blue flex items-center justify-center text-iov-dark-blue self-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className={subtleLabel}>Residenza</p>
                  <p className="text-[15px] font-semibold leading-snug break-words">{carta.paziente.indirizzo}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Contacts - Compact Layout */}
        <div className="space-y-3">
          {/* Contatti Caregiver - White cards matching Specialists */}
          <section className={`${sectionContainerBaseClass} border border-iov-light-blue`}>
            <div className={sectionTitleClass}>
              <div className="w-10 h-10 rounded-xl bg-iov-light-blue-light border border-iov-light-blue flex items-center justify-center">
                <Users className="h-5 w-5 text-iov-dark-blue" />
              </div>
              <span>Contatti Caregiver</span>
              <Badge className={`${tagBase} bg-iov-light-blue-dark text-iov-dark-blue ml-auto`}>
                {carta.caregiver.length}
              </Badge>
            </div>
            <div className="mt-2 space-y-2">
              {carta.caregiver.map((cg, idx) => (
                <Card key={idx} className="bg-white/95 border border-iov-light-blue rounded-2xl shadow-sm">
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-iov-dark-blue text-base">
                        {cg.nome} {cg.cognome}
                      </p>
                      <p className="text-xs text-iov-dark-blue/70">{cg.relazione}</p>
                    </div>
                    <a
                      href={`tel:${cg.telefono}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-iov-light-blue-light text-iov-dark-blue border border-iov-light-blue hover:bg-iov-light-blue/80 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-semibold">{cg.telefono}</span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contatti Specialisti - Unchanged */}
          <section className={`${sectionContainerBaseClass} border border-iov-yellow`}>
            <div className={sectionTitleClass}>
              <div className="w-10 h-10 rounded-xl bg-iov-yellow/20 border border-iov-yellow flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-iov-yellow-dark" />
              </div>
              <span>Contatti specialisti</span>
              <Badge className={`${tagBase} bg-iov-yellow-dark text-iov-dark-blue ml-auto`}>
                {specialistContacts.length}
              </Badge>
            </div>
            <div className="mt-2 space-y-2">
              {specialistContacts.map((sp, idx) => (
                <Card key={idx} className="bg-white/95 border border-iov-yellow rounded-2xl shadow-sm">
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-iov-dark-blue text-base">{sp.label}</p>
                      {sp.note && <p className="text-xs text-iov-dark-blue/70 mt-1">{sp.note}</p>}
                    </div>
                    <a
                      href={`tel:${sp.telefono}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-iov-yellow-light text-iov-dark-blue border border-iov-yellow hover:bg-iov-yellow/70 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-semibold">{sp.telefono}</span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contatti Emergenza - Orange theme, compact grid layout */}
          <section className={`${sectionContainerBaseClass} border border-iov-emergency-orange`}>
            <div className={`${sectionTitleClass}`}>
              <div className="w-10 h-10 rounded-xl border border-iov-emergency-orange flex items-center justify-center"
                style={{
                  backgroundColor: 'hsla(24, 95%, 53%, 0.2)'
                }}
              >
                <BriefcaseMedical className="h-5 w-5 text-iov-emergency-orange-dark" />
              </div>
              <span>Contatti emergenza</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {emergencyContacts.map((ec, idx) => (
                <a
                  key={idx}
                  href={`tel:${ec.telefono}`}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white border border-iov-emergency-orange shadow-sm hover:bg-iov-emergency-orange/10 transition-colors active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-iov-emergency-orange flex items-center justify-center shadow">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-bold text-lg text-iov-emergency-orange-dark">{ec.telefono}</p>
                  <p className="text-xs font-medium text-iov-dark-blue/80 text-center leading-tight">{ec.label}</p>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Diagnosis */}
        <section className={`${sectionContainerBaseClass} border border-iov-pink`}>
          <div className={sectionTitleClass}>
            <div className="w-10 h-10 rounded-xl bg-iov-pink-light border border-iov-pink flex items-center justify-center">
              <ClipboardPlus className="h-5 w-5 text-iov-pink-dark" />
            </div>
            <span>Diagnosi Oncologica</span>
          </div>
          <div className="mt-3">
            <Card className="bg-white/95 border border-iov-pink rounded-2xl shadow-sm">
              <CardContent className="p-4 space-y-3 text-iov-dark-blue">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-iov-pink-light flex items-center justify-center text-iov-pink-dark">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-iov-dark-blue/70">Tipo</p>
                    <p className="font-semibold leading-snug">{carta.diagnosiOncologica.tipo}</p>
                  </div>
                </div>
                {/* <div className="bg-iov-pink-light/60 rounded-xl p-3 border border-iov-pink/40">
                  <p className={subtleLabel}>Istologia</p>
                  <p className="font-semibold">{carta.diagnosiOncologica.istologia}</p>
                  <p className="text-sm text-iov-dark-blue/80 mt-1">{carta.diagnosiOncologica.note}</p>
                </div> */}
                <div className="space-y-2">
                  <p className={subtleLabel}>Terapie in corso</p>
                  <div className="flex flex-col gap-2">
                    {carta.terapieOncologiche.map((tp, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-iov-gray-light rounded-xl p-3 border border-white/70"
                      >
                        <div className="h-9 w-9 rounded-lg bg-white/80 border border-iov-pink/50 flex items-center justify-center shrink-0">
                          {tp.somministrazione === "Orale" ? (
                            <Pill className="h-4 w-4 text-iov-pink-dark" />
                          ) : (
                            <Syringe className="h-4 w-4 text-iov-pink-dark" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold">{tp.farmaco}</p>
                          <Badge className={`${tagBase} bg-iov-pink-dark text-white inline-flex w-fit`}>
                            Terapia {tp.somministrazione}
                          </Badge>
                          <p className="text-sm text-iov-dark-blue/80">{tp.dosaggio} - {tp.frequenza}</p>
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
        <section className={`${sectionContainerBaseClass} border border-iov-light-blue`}>
          <div className={sectionTitleClass}>
            <div className="w-10 h-10 rounded-xl bg-iov-light-blue-dark flex items-center justify-center">
              <ShieldPlus className="h-5 w-5 text-iov-dark-blue" />
            </div>
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
                <span className="text-[13px] font-semibold">{cm.nome}</span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className={sectionTitleClass}>
              <div className="w-10 h-10 rounded-xl bg-iov-pink-light border border-iov-pink flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-iov-pink-dark" />
              </div>
              <span>Allergie</span>
              <Badge className={`${tagBase} bg-iov-pink-dark text-white ml-auto`}>
                {carta.allergie.length}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {carta.allergie.map((al, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-iov-pink-light/60 text-iov-pink-dark px-3 py-2 rounded-full border border-iov-pink/50 shadow-sm"
                  style={{
                      backgroundColor: 'hsla(339.3443, 81.33%, 85.29%, 0.2)'
                    }}
                >
                  <AlertTriangle className="h-4 w-4"/>
                  <span className="text-[13px] font-semibold">{al.sostanza}</span>
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
