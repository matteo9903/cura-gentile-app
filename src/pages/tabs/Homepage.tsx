import { useEffect, useMemo, useState } from "react";
import { patientService, CartaIdentitaTerapeutica } from "@/services/patientService";
import { ContattiCard } from "@/components/ContattiCard";
import { DiagnosiOncologicaCard } from "@/components/DiagnosiOncologicaCard";
import { ComorbiditaAllergieCard } from "@/components/ComorbiditaAllergieCard";
import { TesseraPaziente } from "@/components/TesseraPaziente";
import { Skeleton } from "@/components/ui/skeleton";

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

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
      .format(new Date())
      .toUpperCase();
  }, []);

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
        className="min-h-screen bg-background pb-24"
      >
        {/* Skeleton Header - Matching the new rounded design */}
        <div
          className="pb-6 rounded-b-[2.5rem] shadow-lg mb-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(to bottom, #002451, #104676)",
            paddingTop: "max(20px, var(--safe-area-top))",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          {/* Decorative blur for skeleton */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
            <Skeleton className="h-9 w-24 bg-white/10" />
            <Skeleton className="h-9 w-24 bg-white/10" />
          </div>

          <div className="flex flex-col gap-2 text-white px-2 relative z-10 pb-4">
            <Skeleton className="h-10 w-48 bg-white/10 rounded-lg" />
            <Skeleton className="h-5 w-32 bg-white/10 rounded-md" />
          </div>
        </div>

        {/* Content Skeletons */}
        <div className="px-4 space-y-5 -mt-6 relative z-10">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background pb-24"
    >
      {/* Header - Full Width */}
      <div
        className="pb-6 rounded-b-[2.5rem] shadow-lg mb-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #002451, #104676)",
          paddingTop: "max(20px, var(--safe-area-top))",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
          <img
            src="https://www.ioveneto.it/wp-content/uploads/2025/03/IOV_20anni_oriz_bianco-1.svg"
            alt="IOV 20 anni"
            className="h-9 w-auto object-contain"
          />
          <img
            src="https://www.ioveneto.it/wp-content/uploads/2025/03/logo-veneto-ok.png"
            alt="Regione Veneto"
            className="h-9 w-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-1 text-white px-2 relative z-10 pb-4">
          <p className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            Ciao, {carta.paziente.nome}
          </p>
          <p className="text-sm font-medium text-white/80 uppercase tracking-wide">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-5 relative z-10">

        {/* Tessera Paziente */}
        <div className="mb-2">
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
