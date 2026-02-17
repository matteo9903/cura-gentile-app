import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, Stethoscope, BriefcaseMedical } from "lucide-react";

interface Caregiver {
    nome: string;
    cognome: string;
    telefono: string;
    relazione?: string;
}

interface Specialista {
    label: string;
    telefono: string;
    note?: string;
}

interface EmegencyContact {
    label: string;
    telefono: string;
}

interface ContattiCardProps {
    caregivers: Caregiver[];
    specialisti: Specialista[];
    emergenza: EmegencyContact[];
}

export const ContattiCard: React.FC<ContattiCardProps> = ({
    caregivers,
    specialisti,
    emergenza,
}) => {
    return (
        <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-white">
            <CardHeader
                className="p-4"
                style={{
                    background:
                        "linear-gradient(135deg, var(--e-global-color-primary) 0%, var(--e-global-color-secondary) 100%)",
                }}
            >
                <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                        <Phone className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold tracking-wide text-white">I tuoi Contatti</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs defaultValue="caregiver" className="w-full">
                    <div className="px-4 pt-4">
                        <TabsList className="w-full h-auto min-h-[3.5rem] bg-[var(--e-global-color-2ba0d54)] p-1.5 rounded-2xl grid grid-cols-3 gap-2">
                            <TabsTrigger
                                value="caregiver"
                                className="h-full rounded-xl data-[state=active]:bg-white data-[state=active]:text-[var(--e-global-color-primary)] data-[state=active]:shadow-md text-[var(--e-global-color-84f2dc3)] font-bold transition-all duration-300 py-2"
                            >
                                <div className="flex flex-col items-center gap-1.5">
                                    <Users className="h-5 w-5" />
                                    <span className="text-[11px] uppercase tracking-wide">Caregiver</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="specialisti"
                                className="h-full rounded-xl data-[state=active]:bg-white data-[state=active]:text-[var(--e-global-color-95acd2f)] data-[state=active]:shadow-md text-[var(--e-global-color-84f2dc3)] font-bold transition-all duration-300 py-2"
                            >
                                <div className="flex flex-col items-center gap-1.5">
                                    <Stethoscope className="h-5 w-5" />
                                    <span className="text-[11px] uppercase tracking-wide">Specialisti</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="emergenza"
                                className="h-full rounded-xl data-[state=active]:bg-white data-[state=active]:text-[var(--e-global-color-e9c01dd)] data-[state=active]:shadow-md text-[var(--e-global-color-84f2dc3)] font-bold transition-all duration-300 py-2"
                            >
                                <div className="flex flex-col items-center gap-1.5">
                                    <BriefcaseMedical className="h-5 w-5" />
                                    <span className="text-[11px] uppercase tracking-wide">Emergenza</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Caregiver Content */}
                    <TabsContent value="caregiver" className="p-4 space-y-3 mt-0 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {caregivers.length > 0 ? (
                            caregivers.map((cg, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[var(--e-global-color-2ba0d54)] shadow-sm hover:border-[var(--e-global-color-26490e7)] transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-[var(--e-global-color-74623b0)] flex items-center justify-center text-[var(--e-global-color-104676)] border border-[var(--e-global-color-2aa682b)]/40 shadow-sm group-hover:scale-105 transition-transform">
                                            <span className="font-bold text-sm">
                                                {cg.nome.charAt(0)}
                                                {cg.cognome.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--e-global-color-text)] text-sm">
                                                {cg.nome} {cg.cognome}
                                            </p>
                                            {cg.relazione && (
                                                <p className="text-[11px] font-medium text-[var(--e-global-color-84f2dc3)] tracking-wide">
                                                    {cg.relazione}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={`tel:${cg.telefono}`}
                                        className="w-10 h-10 rounded-xl bg-[var(--e-global-color-26490e7)] flex items-center justify-center text-white shadow-lg shadow-[var(--e-global-color-26490e7)]/30 active:scale-95 transition-all hover:bg-[var(--e-global-color-primary)]"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[var(--e-global-color-84f2dc3)] py-8 text-sm italic">Nessun contatto caregiver.</p>
                        )}
                    </TabsContent>

                    {/* Specialisti Content */}
                    <TabsContent value="specialisti" className="p-4 space-y-3 mt-0 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {specialisti.length > 0 ? (
                            specialisti.map((sp, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[var(--e-global-color-2ba0d54)] shadow-sm hover:border-[var(--e-global-color-95acd2f)] transition-colors group"
                                >
                                    <div className="flex-1">
                                        <p className="font-bold text-[var(--e-global-color-text)] text-sm">
                                            {sp.label}
                                        </p>
                                        {sp.note && (
                                            <p className="text-[11px] text-[var(--e-global-color-95acd2f)] font-semibold mt-0.5">
                                                {sp.note}
                                            </p>
                                        )}
                                    </div>
                                    <a
                                        href={`tel:${sp.telefono}`}
                                        className="w-10 h-10 rounded-xl bg-[var(--e-global-color-95acd2f)] flex items-center justify-center text-white shadow-lg shadow-[var(--e-global-color-95acd2f)]/30 active:scale-95 transition-all shrink-0 ml-3 hover:bg-[#b08500]"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[var(--e-global-color-84f2dc3)] py-8 text-sm italic">Nessun contatto specialista.</p>
                        )}
                    </TabsContent>

                    {/* Emergenza Content */}
                    <TabsContent value="emergenza" className="p-4 mt-0 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-2 gap-3">
                            {emergenza.map((em, idx) => (
                                <a
                                    key={idx}
                                    href={`tel:${em.telefono}`}
                                    className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--e-global-color-e9c01dd)]/30 bg-[#FFF5F5] hover:bg-[#FFE0E0] active:scale-95 transition-all outline-none"
                                >
                                    <div className="w-11 h-11 rounded-full bg-[var(--e-global-color-e9c01dd)] flex items-center justify-center text-white shadow-lg shadow-[var(--e-global-color-e9c01dd)]/30 mb-2 group-hover:scale-110 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-[var(--e-global-color-e9c01dd)] text-xl leading-none mb-1">
                                        {em.telefono}
                                    </span>
                                    <span className="text-[10px] text-center font-bold text-[var(--e-global-color-text)] uppercase tracking-wide leading-tight opacity-80">
                                        {em.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
