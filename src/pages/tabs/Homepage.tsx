import { useEffect, useMemo, useState } from "react";
import { patientService, CartaIdentitaTerapeutica } from "@/services/patientService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Stethoscope,
  Microscope,
  AlertTriangle,
  Phone,
  ClipboardPlus,
  ShieldPlus,
  Syringe,
  ActivitySquare,
  Pill,
  BriefcaseMedical
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TesseraPaziente } from "@/components/TesseraPaziente";
import { ContattiCard } from "@/components/ContattiCard";

const Homepage = () => {
  const [carta, setCarta] = useState<CartaIdentitaTerapeutica | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This returns a string like "Europe/Rome", "America/New_York", etc.
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      <div className="pb-24 space-y-5 px-4"
        style={{
          // paddingTop: 'calc(70px + var(--safe-area-top)/2)'
        }}
      >
        <div
          className="pb-10 rounded-b-[3rem] shadow-lg mb-6"
          style={{
            background: "linear-gradient(to bottom, #002451, #104676)",
            paddingTop: "max(20px, var(--safe-area-top))",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-8">
            <img
              src="https://www.ioveneto.it/wp-content/uploads/2025/03/IOV_20anni_oriz_bianco-1.svg"
              alt="IOV 20 anni"
              className="h-10 w-auto object-contain"
            />
            <img
              src="https://www.ioveneto.it/wp-content/uploads/2025/03/logo-veneto-ok.png"
              alt="Regione Veneto"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col gap-1 text-white px-2">
            <p className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
              Ciao, {carta.paziente.nome}
            </p>
            <p className="text-sm font-medium text-white/80">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Tessera Paziente */}
        <div className="mb-6">
          <TesseraPaziente paziente={carta.paziente} />
        </div>

        {/* All Contacts - Compact Layout */}
        <div className="space-y-3">
          <ContattiCard
            caregivers={carta.caregiver}
            specialisti={specialistContacts}
            emergenza={emergencyContacts}
          />
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
                    <p className="font-semibold leading-snug">{carta.diagnosiOncologica}</p>
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
                          {tp.somministrazione.includes("Orale") ? (
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
                          {tp.note && <p className="text-[11px] text-iov-dark-blue/60 mt-1">{tp.note}</p>}
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
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {carta.comorbidita.map((cm, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-iov-light-blue-light text-iov-dark-blue px-3 py-2 rounded-full border border-iov-light-blue/70"
              >
                <ActivitySquare className="h-4 w-4" />
                <span className="text-[13px] font-semibold">{cm}</span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className={sectionTitleClass}>
              <div className="w-10 h-10 rounded-xl bg-iov-pink-light border border-iov-pink flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-iov-pink-dark" />
              </div>
              <span>Allergie</span>
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
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-[13px] font-semibold">{al}</span>
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
