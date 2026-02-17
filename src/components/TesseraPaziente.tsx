import React from "react";
import { Paziente } from "@/services/patientService";
import { User, MapPin, CalendarDays, Scale, Ruler, Fingerprint } from "lucide-react";

interface TesseraPazienteProps {
    paziente: Paziente;
}

export const TesseraPaziente: React.FC<TesseraPazienteProps> = ({ paziente }) => {
    // Helpers for formatting
    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(d);
    };

    return (
        <div
            className="relative w-full overflow-hidden rounded-3xl shadow-xl transition-all hover:shadow-2xl"
            style={{
                background: `linear-gradient(135deg, var(--e-global-color-primary, #104676) 0%, var(--e-global-color-secondary, #002451) 100%)`,
                color: "white",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Decorative overlay circles */}
            <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
                style={{ background: "var(--e-global-color-accent, #F2C043)" }}
            />
            <div
                className="absolute top-40 -left-10 w-40 h-40 rounded-full opacity-5"
                style={{ background: "var(--e-global-color-593361d, #61C4C1)" }}
            />

            {/* Main Content */}
            <div className="relative z-10 p-6">
                <div className="flex flex-row justify-between items-stretch gap-4 mb-5 border-b border-white/10 pb-5">
                    <div className="flex flex-col justify-center flex-1">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            {paziente.nome}
                            <span className="block text-xl opacity-90 font-semibold">{paziente.cognome}</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2 text-white/70 text-xs uppercase tracking-widest">
                            <Fingerprint className="w-3.5 h-3.5" />
                            <span className="font-mono">{paziente.codiceFiscale}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg min-w-[110px] p-2 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[9px] uppercase text-white/60 font-bold tracking-widest relative z-10">Gruppo</span>
                        <span className="text-4xl font-bold text-white tracking-tighter relative z-10 my-1">A<sup className="text-2xl align-top top-0 ml-0.5">+</sup></span>
                        <span className="text-[9px] uppercase text-white/60 font-bold tracking-widest relative z-10">Sanguigno</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                    {/* Data di Nascita */}
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase font-bold tracking-wider">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>Data di Nascita</span>
                        </div>
                        <div className="text-xl font-medium text-white pl-0.5">
                            {formatDate(paziente.dataNascita)}
                        </div>
                    </div>

                    {/* Residenza - Full Width */}
                    <div className="col-span-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase font-bold tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Residenza</span>
                        </div>
                        <div className="text-lg font-medium text-white leading-snug break-words pl-0.5">
                            {paziente.indirizzo}
                        </div>
                    </div>

                    {/* Biometrics */}
                    <div className="col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-white/10 mt-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/10 shrink-0">
                                <Scale className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Peso</span>
                                <span className="font-bold text-white text-xl">{paziente.peso} <span className="text-sm font-medium opacity-70">kg</span></span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/10 shrink-0">
                                <Ruler className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Altezza</span>
                                <span className="font-bold text-white text-xl">{paziente.altezza} <span className="text-sm font-medium opacity-70">cm</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom strip */}
            <div
                className="relative z-10 h-1.5 w-full"
                style={{
                    background: "linear-gradient(90deg, var(--e-global-color-accent, #F2C043) 0%, var(--e-global-color-95acd2f, #C99800) 100%)"
                }}
            />
        </div>

    );
};
