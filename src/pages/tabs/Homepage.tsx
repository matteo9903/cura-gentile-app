import { useEffect, useMemo, useState } from "react";
import { patientService, CartaIdentitaTerapeutica } from "@/services/patientService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Stethoscope,
  AlertTriangle,
  Phone,
  ShieldPlus,
  ActivitySquare,
  BriefcaseMedical
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TesseraPaziente } from "@/components/TesseraPaziente";
import { ContattiCard } from "@/components/ContattiCard";
import { DiagnosiOncologicaCard } from "@/components/DiagnosiOncologicaCard";
import { ComorbiditaAllergieCard } from "@/components/ComorbiditaAllergieCard";

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
        <DiagnosiOncologicaCard
          diagnosi={carta.diagnosiOncologica}
          terapie={carta.terapieOncologiche}
        />

        {/* Comorbidità & Allergie */}
        <ComorbiditaAllergieCard
          comorbidita={carta.comorbidita}
          allergie={carta.allergie}
        />
      </div>
    </div>
  );
};

export default Homepage;
