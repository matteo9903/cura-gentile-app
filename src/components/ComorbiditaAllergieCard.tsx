import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldPlus, AlertTriangle, ActivitySquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComorbiditaAllergieCardProps {
    comorbidita: string[];
    allergie: string[];
}

export const ComorbiditaAllergieCard: React.FC<ComorbiditaAllergieCardProps> = ({
    comorbidita,
    allergie,
}) => {
    return (
        <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-white mb-24">
            <CardHeader
                className="p-4"
                style={{
                    background:
                        "linear-gradient(135deg, var(--e-global-color-primary) 0%, var(--e-global-color-secondary) 100%)",
                }}
            >
                <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                        <ActivitySquare className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold tracking-wide text-white">Profilo Clinico</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs defaultValue="comorbidita" className="w-full">
                    <div className="px-4 pt-4">
                        <TabsList className="w-full h-auto min-h-[3.5rem] bg-[var(--e-global-color-2ba0d54)] p-1.5 rounded-2xl grid grid-cols-2 gap-2">
                            <TabsTrigger
                                value="comorbidita"
                                className="h-full rounded-xl data-[state=active]:bg-white data-[state=active]:text-[var(--e-global-color-primary)] data-[state=active]:shadow-md text-[var(--e-global-color-84f2dc3)] font-bold transition-all duration-300 py-2"
                            >
                                <div className="flex flex-col items-center gap-1.5">
                                    <ShieldPlus className="h-5 w-5" />
                                    <span className="text-[11px] uppercase tracking-wide">Comorbidità</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="allergie"
                                className="h-full rounded-xl data-[state=active]:bg-white data-[state=active]:text-[var(--e-global-color-e9c01dd)] data-[state=active]:shadow-md text-[var(--e-global-color-84f2dc3)] font-bold transition-all duration-300 py-2"
                            >
                                <div className="flex flex-col items-center gap-1.5">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="text-[11px] uppercase tracking-wide">Allergie</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Comorbidità Content */}
                    <TabsContent value="comorbidita" className="p-4 space-y-3 mt-0 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {comorbidita.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {comorbidita.map((cm, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-[var(--e-global-color-74623b0)] text-[var(--e-global-color-primary)] px-3 py-2 rounded-xl border border-[var(--e-global-color-2aa682b)]/40 shadow-sm"
                                    >
                                        <ShieldPlus className="h-4 w-4 shrink-0" />
                                        <span className="text-[13px] font-semibold">{cm}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[var(--e-global-color-84f2dc3)] py-8 text-sm italic">
                                Nessuna comorbidità registrata.
                            </p>
                        )}
                    </TabsContent>

                    {/* Allergie Content */}
                    <TabsContent value="allergie" className="p-4 space-y-3 mt-0 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {allergie.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {allergie.map((al, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-[#FFF5F5] text-[var(--e-global-color-e9c01dd)] px-3 py-2 rounded-xl border border-[var(--e-global-color-e9c01dd)]/30 shadow-sm"
                                    >
                                        <AlertTriangle className="h-4 w-4 shrink-0" />
                                        <span className="text-[13px] font-semibold">{al}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[var(--e-global-color-84f2dc3)] py-8 text-sm italic">
                                Nessuna allergia nota.
                            </p>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
