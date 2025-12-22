import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  Lock,
  Shield,
  LogOut,
  Loader2,
  ChevronRight,
  X,
} from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const getInitials = () => {
    if (!user) return "U";
    return `${user.nome?.[0] || ""}${user.cognome?.[0] || ""}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Disconnesso",
      description: "Logout effettuato con successo",
    });
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non coincidono",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Errore",
        description: "La nuova password deve avere almeno 6 caratteri",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const success = await authService.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );

      if (success) {
        toast({
          title: "Successo",
          description: "Password modificata con successo",
        });
        setShowChangePassword(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast({
          title: "Errore",
          description: "Password attuale non corretta",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header - Fixed, uniform height */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-primary px-4 flex items-center z-40 safe-area-top">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">
              Il mio profilo
            </h1>
            <p className="text-xs text-primary-foreground/80">
              Gestisci il tuo account 
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-[94px] p-4 space-y-4 pb-24">
        {/* User Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-primary">
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {user?.nome} {user?.cognome}
                </h2>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4"
            onClick={() =>
              toast({
                title: "Impostazioni",
                description: "Funzionalità in arrivo...",
              })
            }
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Impostazioni</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4"
            onClick={() => setShowChangePassword(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Cambia password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4"
            onClick={() => setShowPrivacy(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Privacy e sicurezza</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full mt-6"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Esci dall'account
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          IOV Mobile App v1.0.0
        </p>
      </div>

      {/* Change Password Modal - Fullscreen */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center">
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Cambia password
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Password attuale</Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
                placeholder="Inserisci la password attuale"
                className="px-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nuova password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="Inserisci la nuova password"
                className="px-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma nuova password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Conferma la nuova password"
                className="px-4"
              />
            </div>
          </div>
          <div className="shrink-0 pt-4 border-t">
            <Button
              className="w-full"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva nuova password"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal - Fullscreen */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy e sicurezza
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <section>
              <h3 className="font-semibold text-primary mb-2">
                Trattamento dei dati personali
              </h3>
              <p className="text-sm text-muted-foreground">
                I tuoi dati personali sono trattati in conformità al Regolamento
                UE 2016/679 (GDPR) e al D.Lgs. 196/2003 e successive modifiche.
                L'IOV - Istituto Oncologico Veneto è il titolare del trattamento.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-primary mb-2">
                Finalità del trattamento
              </h3>
              <p className="text-sm text-muted-foreground">
                I dati sono raccolti e trattati per le seguenti finalità:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                <li>Gestione del percorso terapeutico</li>
                <li>Comunicazioni relative alla cura</li>
                <li>Miglioramento dei servizi sanitari</li>
                <li>Adempimenti di legge</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-primary mb-2">
                Conservazione dei dati
              </h3>
              <p className="text-sm text-muted-foreground">
                I dati sono conservati per il tempo necessario al raggiungimento
                delle finalità per cui sono stati raccolti e comunque non oltre i
                termini previsti dalla normativa vigente.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-primary mb-2">I tuoi diritti</h3>
              <p className="text-sm text-muted-foreground">
                Hai il diritto di accedere ai tuoi dati, richiederne la rettifica
                o la cancellazione, opporti al trattamento e richiedere la
                portabilità dei dati. Per esercitare i tuoi diritti, contatta il
                DPO all'indirizzo: dpo@iov.it
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-primary mb-2">
                Sicurezza dell'app
              </h3>
              <p className="text-sm text-muted-foreground">
                L'app utilizza protocolli di sicurezza avanzati per proteggere i
                tuoi dati. Le comunicazioni sono crittografate e l'accesso
                richiede autenticazione.
              </p>
            </section>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Ultimo aggiornamento: 13 gennaio 2025
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
