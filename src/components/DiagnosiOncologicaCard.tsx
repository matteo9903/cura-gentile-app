import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ClipboardPlus, Microscope, Pill, Syringe } from "lucide-react";
import { TerapiaOncologica } from "@/services/patientService";
import { Badge } from "@/components/ui/badge";

interface DiagnosiOncologicaCardProps {
    diagnosi: string;
    terapie: TerapiaOncologica[];
}

export const DiagnosiOncologicaCard: React.FC<DiagnosiOncologicaCardProps> = ({
    diagnosi,
    terapie,
}) => {
    // Group therapies by unique administration types
    const groupedTherapies = useMemo(() => {
        const groups: Record<string, TerapiaOncologica[]> = {};

        terapie.forEach((terapia) => {
            terapia.somministrazione.forEach((type) => {
                const normalizedType = type.toLowerCase();
                if (!groups[normalizedType]) {
                    groups[normalizedType] = [];
                }
                // Avoid duplicates if a therapy is already in the group (though structured data usually implies 1 entry per therapy object)
                if (!groups[normalizedType].some(t => t.farmaco === terapia.farmaco)) {
                    groups[normalizedType].push(terapia);
                }
            });
        });

        return groups;
    }, [terapie]);

    // Helper to get formatted title for administration
    const getAdministrationTitle = (type: string) => {
        return `Terapia ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    };

    return (
        <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-white mb-6">
            <CardHeader
                className="p-4"
                style={{
                    background:
                        "linear-gradient(135deg, var(--e-global-color-primary) 0%, var(--e-global-color-secondary) 100%)",
                }}
            >
                <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                        <ClipboardPlus className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold tracking-wide text-white">Diagnosi Oncologica</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <div className="p-4 space-y-4">
                    {/* Diagnosis Section */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--e-global-color-74623b0)] border border-[var(--e-global-color-2aa682b)]/40">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-[var(--e-global-color-primary)] shadow-sm">
                            <Microscope className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                            <p className="text-[11px] font-bold text-[var(--e-global-color-84f2dc3)] uppercase tracking-wide">
                                Diagnosi Principale
                            </p>
                            <p className="font-bold text-[var(--e-global-color-text)] leading-snug">
                                {diagnosi}
                            </p>
                        </div>
                    </div>

                    {/* Therapies Accordion */}
                    {Object.keys(groupedTherapies).length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-[11px] font-bold text-[var(--e-global-color-84f2dc3)] uppercase tracking-wide ml-1">
                                Terapie in corso
                            </p>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {Object.entries(groupedTherapies).map(([type, therapies], idx) => (
                                    <AccordionItem
                                        key={idx}
                                        value={`item-${idx}`}
                                        className="border border-[var(--e-global-color-2ba0d54)] rounded-2xl bg-white overflow-hidden shadow-sm data-[state=open]:border-[var(--e-global-color-accent)] data-[state=open]:ring-1 data-[state=open]:ring-[var(--e-global-color-accent)]/20 transition-all duration-300"
                                    >
                                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[var(--e-global-color-74623b0)]/50 transition-colors [&[data-state=open]>div>svg]:text-[var(--e-global-color-accent)]">
                                            <div className="flex items-center gap-3 text-left">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--e-global-color-2ba0d54)]/50 flex items-center justify-center text-[var(--e-global-color-primary)]">
                                                    {type.includes("oral") ? (
                                                        <Pill className="h-4 w-4" />
                                                    ) : (
                                                        <Syringe className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-[var(--e-global-color-text)] text-sm">
                                                    {getAdministrationTitle(type)}
                                                </span>
                                                <Badge className="ml-2 bg-[var(--e-global-color-2ba0d54)] text-[var(--e-global-color-primary)] hover:bg-[var(--e-global-color-2ba0d54)] border-none h-5 px-2 text-[10px]">
                                                    {therapies.length}
                                                </Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 pt-1 bg-[var(--e-global-color-74623b0)]/30">
                                            <div className="flex flex-col gap-2 mt-2">
                                                {therapies.map((tp, innerIdx) => (
                                                    <div
                                                        key={innerIdx}
                                                        className="bg-white p-3 rounded-xl border border-[var(--e-global-color-2ba0d54)] shadow-sm"
                                                    >
                                                        <p className="font-bold text-[var(--e-global-color-text)] text-sm">
                                                            {tp.farmaco}
                                                        </p>
                                                        {tp.note && (
                                                            <p className="text-[11px] text-[var(--e-global-color-84f2dc3)] mt-1 font-medium">
                                                                {tp.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-[var(--e-global-color-84f2dc3)] italic text-sm">
                            Nessuna terapia in corso registrata.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
