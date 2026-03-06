import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Shield } from "lucide-react";
import { SetStateAction } from "react";

const PrivacyPolicy = (
    { showPrivacy, setShowPrivacy, privacyRead, setPrivacyRead }
) => {

    const handleOpenChange = (status: boolean) => {

        setShowPrivacy(status);

        if (privacyRead === undefined || setPrivacyRead === undefined)
            return

        if (privacyRead === false) {
            console.log("Changing privacy read to true")
            setPrivacyRead(true)
        }

    }

    return (
        <Dialog open={showPrivacy} onOpenChange={handleOpenChange}>
            <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
                <DialogHeader className="shrink-0 flex flex-row items-center pb-3">
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Privacy e sicurezza
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-6 py-4 text-sm text-muted-foreground">
                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">1. Introduzione</h3>
                        <p>
                            La presente informativa è resa ai sensi del Regolamento UE 2016/679 ("GDPR") e
                            del D. Lgs. 196/2003, come modificato dal D. Lgs. 101/2018. L'obiettivo è spiegare
                            in modo chiaro e trasparente come vengono trattati i dati personali attraverso
                            l'applicazione, di proprietà di IRCCS Istituto Oncologico Veneto di
                            Castelfranco e sviluppata da Laife Reply per supportare il monitoraggio e il
                            trattamento della pressione arteriosa da parte dell'utente/paziente.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">2. Titolare del trattamento</h3>
                        <p>
                            IRCCS Istituto Oncologico Veneto (IOV) - Ospedale San Giacomo

                            Via dei Carpani, 16/Z – 31033 Castelfranco Veneto (TV)

                            Codice Fiscale/P.IVA 04074560287

                            Email: privacy@iov.it

                            PEC: iov@legalmail.it
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">3. Responsabile della Protezione dei Dati (DPO)</h3>
                        <p>
                            Il DPO di IOV è contattabile
                            all'indirizzo:

                            Email: dpo@final.it
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">4. Responsabile Tecnologico (Fabbricante)</h3>
                        <p>
                            Laife Reply (Reply Group) – Fornitore della piattaforma tecnologica.

                            Sede legale: Corso Francia 110, 10143 Torino

                            Email: privacy@reply.it
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="font-semibold text-primary">5. Finalità e Basi Giuridiche del Trattamento</h3>

                        <div className="space-y-2">
                            <p className="font-semibold text-primary/80">a) Erogazione del servizio</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Creazione dell'account, raccolta e gestione dei dati sanitari per fornire supporto nel monitoraggio dell'aderenza terapeutica;</li>
                                <li>Base giuridica: esecuzione di un contratto (art. 6.1.b GDPR) e consenso esplicito per i dati sanitari (art. 9.2.a GDPR).</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold text-primary/80">b) Miglioramento dei servizi</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Analisi anonima dei dati di utilizzo per ottimizzare funzionalità e performance dell'app;</li>
                                <li>Base giuridica: legittimo interesse (art. 6.1.f GDPR) e, per dati particolari, previo consenso.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold text-primary/80">c) Comunicazioni informative (es. newsletter)</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Invio di aggiornamenti e novità su funzionalità e servizi analoghi;</li>
                                <li>Base giuridica: legittimo interesse (art. 6.1.f GDPR). È sempre possibile annullare l'iscrizione.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold text-primary/80">d) Obblighi di legge</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Adempimento di obblighi fiscali, contabili e normativi;</li>
                                <li>Base giuridica: obbligo legale (art. 6.1.c GDPR).</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold text-primary/80">e) Attività di ricerca scientifica e statistica</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Utilizzo anonimo e aggregato dei dati per fini di studio, sviluppo clinico, elaborazione di statistiche aggregate e progetti di ricerca scientifica, anche in collaborazione con università o enti di ricerca;</li>
                                <li>Base giuridica: consenso esplicito (art. 9.2.a GDPR), trattando i dati in forma anonima o pseudonimizzata, in conformità con i principi del GDPR.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">6. Tipologia di Dati trattati</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Dati identificativi comuni: nome, cognome, email, codice fiscale</li>
                            <li>Dati biometrici e personali: sesso, altezza, peso, età</li>
                            <li>Dati sanitari: patologie, farmaci, dati clinici</li>
                            <li>Dati di utilizzo: log, tempo di utilizzo, errori applicativi</li>
                            {/* <li>Dati importati: da Apple Health o Google Fit (previa autorizzazione)</li> */}
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">7. Modalità del trattamento</h3>
                        <p>
                            Il trattamento avviene con strumenti elettronici, in conformità ai principi di correttezza,
                            liceità, minimizzazione e trasparenza. Sono adottate misure tecniche e organizzative adeguate
                            (artt. 25 e 32 GDPR) per garantire integrità, disponibilità e riservatezza dei dati.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">8. Destinatari dei Dati</h3>
                        <p>
                            I dati personali possono essere comunicati a soggetti terzi designati Responsabili del trattamento
                            ai sensi dell'art. 28 del GDPR: Fornitori di servizi e consulenti (Cloud provider, servizi IT,
                            supporti tecnici) e ad altri soggetti autorizzati da norme di legge. Un elenco aggiornato dei
                            destinatari può essere richiesto scrivendo ai contatti del Titolare. I dati non saranno in alcun
                            caso oggetto di diffusione e di pubblicazione. Potranno essere resi pubblici i risultati della
                            sperimentazione, ricavati dall'elaborazione di dati in forma aggregata e anonima, nel corso di
                            convegni o tramite pubblicazioni scientifiche.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">9. Trasferimento Extra UE</h3>
                        <p>
                            I dati vengono conservati in server localizzati nello Spazio Economico Europeo (SEE). Eventuali
                            trasferimenti al di fuori dell'UE avverranno solo se adeguatamente garantiti (decisioni di
                            adeguatezza, clausole contrattuali standard).
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">10. Conservazione dei Dati</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>per il tempo necessario all'erogazione del servizio;</li>
                            <li>secondo i termini previsti dalla normativa fiscale e civilistica;</li>
                            <li>fino alla revoca del consenso o alla cancellazione dell'account;</li>
                            <li>più a lungo solo in caso di reclami o potenziali contenziosi.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">11. Diritti dell'Interessato</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>accedere ai suoi dati (art. 15 GDPR);</li>
                            <li>chiedere la rettifica o l'aggiornamento (art. 16);</li>
                            <li>chiedere la cancellazione (art. 17);</li>
                            <li>chiedere la limitazione del trattamento (art. 18);</li>
                            <li>opporsi per motivi legittimi (art. 21);</li>
                            <li>ricevere i suoi dati in formato leggibile (portabilità – art. 20);</li>
                            <li>revocare il consenso in qualsiasi momento;</li>
                            <li>presentare reclamo al Garante della Privacy (www.garanteprivacy.it).</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">12. Obbligatorietà del Conferimento</h3>
                        <p>
                            Il conferimento dei dati è necessario per l'erogazione del servizio tramite l'app.
                            In caso contrario, non potrà essere garantito l'accesso alle funzionalità.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-semibold text-primary">13. Aggiornamenti dell'Informativa</h3>
                        <p>
                            L'informativa potrà essere soggetta a modifiche. Gli aggiornamenti saranno notificati tramite
                            l'app o altri canali ufficiali di IRCCS Istituto Oncologico Veneto di Castelfranco.
                        </p>
                    </section>

                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            La data di ultimo aggiornamento della presente informativa è del <b>15/05/2025</b>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PrivacyPolicy;
