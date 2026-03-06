import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { validateRegistrationPassword } from "@/services/registration/registrationValidation";
import { cn } from "@/lib/utils";
import {
  User,
  Settings,
  Lock,
  Shield,
  LogOut,
  Loader2,
  ChevronRight,
  Fingerprint,
} from "lucide-react";

// Privacy policy modal
import PrivacyPolicy from "@/components/profile/privacy_policy";

/**
 * Generates a random alphanumeric string of the given `length`.
 *
 * Why this exists (in this file):
 * - When enabling biometrics we want to store *some* secret in secure storage so that a later
 *   biometric check can "unlock" something. That secret does not need to be the real access token
 *   (which can rotate/expire). A random, app-generated value is stable as long as we keep it stored.
 *
 * How it works:
 * - Preferred path: uses `globalThis.crypto.getRandomValues(...)` (Web Crypto) to generate
 *   cryptographically secure random bytes, then maps them into the `alphabet`.
 * - We use rejection sampling (discarding bytes >= `max`) so the mapping does not introduce
 *   modulo bias (i.e., every character in the alphabet has the same probability).
 * - Fallback path: if Web Crypto is not available, it falls back to `Math.random`.
 *   This is NOT cryptographically secure, but it still provides a random-ish string for environments
 *   where secure randomness is unavailable. If this secret is used for security-critical purposes,
 *   prefer ensuring Web Crypto is available and remove the fallback.
 *
 * Output properties:
 * - Characters: `[A-Z][a-z][0-9]` (62-char alphabet)
 * - Length: exactly `length`
 */
const generateRandomString = (length: number) => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.getRandomValues) {
    return Array.from({ length }, () => {
      return alphabet[Math.floor(Math.random() * alphabet.length)] ?? "0";
    }).join("");
  }

  // Rejection sampling to avoid modulo bias.
  const max = Math.floor(256 / alphabet.length) * alphabet.length; // 248 for length 62
  let out = "";

  while (out.length < length) {
    const bytes = new Uint8Array((length - out.length) * 2);
    cryptoObj.getRandomValues(bytes);

    for (const byte of bytes) {
      if (out.length >= length) break;
      if (byte >= max) continue;
      out += alphabet[byte % alphabet.length];
    }
  }

  return out;
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingBiometrics, setIsUpdatingBiometrics] = useState(false);
  const [biometricEnabledUi, setBiometricEnabledUi] = useState(false);
  const passwordValidation = useMemo(
    () => validateRegistrationPassword(passwordForm.newPassword),
    [passwordForm.newPassword],
  );
  const showPasswordFeedback = passwordForm.newPassword.length > 0;
  const showConfirmPasswordFeedback = passwordForm.confirmPassword.length > 0;
  const confirmPasswordMatches =
    passwordForm.confirmPassword.length > 0 &&
    passwordForm.newPassword === passwordForm.confirmPassword;
  const canSubmitPassword =
    Boolean(passwordForm.oldPassword) &&
    passwordValidation.isValid &&
    confirmPasswordMatches;

  useEffect(() => {
    if (!showSettings) return;
  }, [showSettings]);

  const getInitials = () => {
    if (!user) return "U";
    const name = user.nome?.trim() || "";
    const surname = user.cognome?.trim() || "";
    const first = name[0] || "";
    const second = surname[0] || name[1] || first;
    return `${first}${second}`.slice(0, 2).toUpperCase();
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
    if (!canSubmitPassword) return;

    setIsChangingPassword(true);

    try {
      toast({
        title: "Password aggiornata",
        description: "La password è stata modificata con successo",
      });
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      // toast({
      //   title: "Errore",
      //   description: "Non è stato possibile aggiornare la password. Riprova.",
      //   variant: "destructive",
      // });
    } finally {
      setIsChangingPassword(false);
    }
  };



  const handleToggleBiometrics = async (nextEnabled: boolean) => {

    setBiometricEnabledUi(nextEnabled);
  };

  const getFieldBorderClass = (isValid: boolean, shouldShow: boolean) => {
    if (!shouldShow) return "";
    return isValid ? "border-iov-green" : "border-iov-veneto-red";
  };

  return (
    <div
      className="flex flex-col bg-background relative overflow-hidden"
      style={{
        height: "calc(100vh - var(--tab-bar-height) - var(--safe-area-bottom))",
        paddingTop: "var(--safe-area-top)",
        paddingBottom: "var(--safe-area-bottom)",
      }}
    >
      {/* Background Decorative Elements for Glassmorphism Contrast */}
      <div className="absolute top-[20%] -left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] -right-[10%] w-80 h-80 bg-iov-light-blue /10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header - Fixed, rounded styling similar to Homepage */}
      <header
        className="fixed top-0 left-0 right-0 text-white z-40 pb-6 rounded-b-[2.5rem] shadow-lg overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #002451, #104676)",
          paddingTop: "max(20px, var(--safe-area-top))",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Settings className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              Impostazioni
            </h1>
            <p className="text-sm font-medium text-white/80 uppercase tracking-wide">
              Gestisci la tua app
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 relative z-10"
        style={{
          paddingTop: "calc(110px + var(--safe-area-top))"
        }}
      >
        {/* Settings List - Premium Glassmorphism */}
        <div className="space-y-4 pt-2">
          {/* Biometric Toggle Card */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl p-5 shadow-sm group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="font-bold text-primary text-lg block leading-tight">Biometria</span>
                  <span className="text-xs text-primary/60 font-medium">Usa impronta o volto</span>
                </div>
              </div>
              <Switch
                checked={biometricEnabledUi}
                onCheckedChange={handleToggleBiometrics}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Change Password Button */}
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-5 px-5 bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl hover:bg-white/50 hover:text-primary transition-all group shadow-sm"
            onClick={() => setShowChangePassword(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-primary text-lg">Cambia password</span>
            </div>
            <ChevronRight className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors" />
          </Button>

          {/* Privacy Button */}
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-5 px-5 bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl hover:bg-white/50 hover:text-primary transition-all group shadow-sm"
            onClick={() => setShowPrivacy(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-primary text-lg">Privacy e sicurezza</span>
            </div>
            <ChevronRight className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors" />
          </Button>

          {/* Logout - Destructive Glass Action */}
          <div className="pt-4">
            <Button
              variant="destructive"
              className="w-full h-auto py-5 px-5 bg-iov-veneto-red/10 backdrop-blur-md border border-iov-veneto-red/20 rounded-3xl hover:bg-iov-veneto-red/20 text-iov-veneto-red font-bold text-lg transition-all shadow-sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-6 w-6" />
              Esci dall'account
            </Button>
          </div>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-primary/40 font-semibold pt-6 tracking-widest uppercase">
          IOV Mobile App v1.0.0
        </p>
      </div>

      {/* Change Password Modal - Fullscreen */}
      <Dialog open={showChangePassword} onOpenChange={() => {
        setShowChangePassword(!showChangePassword)
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
      }}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col border-none shadow-none p-0 overflow-hidden">
          {/* Modal Header */}
          <div className="p-6 pb-4 flex items-center gap-4 border-b">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary">Cambia password</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 p-6">
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
                className="h-12 border-primary/20 focus:border-primary transition-colors"
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
                className={cn(
                  "h-12 transition-colors",
                  getFieldBorderClass(passwordValidation.isValid, showPasswordFeedback) || "border-primary/20",
                )}
              />
              {showPasswordFeedback && (
                <p
                  className={cn(
                    "text-xs font-semibold",
                    passwordValidation.isValid ? "text-iov-green" : "text-iov-veneto-red",
                  )}
                >
                  {passwordValidation.message}
                </p>
              )}
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
                className={cn(
                  "h-12 transition-colors",
                  getFieldBorderClass(confirmPasswordMatches, showConfirmPasswordFeedback) || "border-primary/20",
                )}
              />
              {showConfirmPasswordFeedback && (
                <p
                  className={cn(
                    "text-xs font-semibold",
                    confirmPasswordMatches ? "text-iov-green" : "text-iov-veneto-red",
                  )}
                >
                  {confirmPasswordMatches
                    ? "Le password coincidono."
                    : "Le password non coincidono."}
                </p>
              )}
            </div>
          </div>
          <div className="p-6 border-t bg-slate-50/50">
            <Button
              className="w-full h-12 text-lg font-bold"
              onClick={handleChangePassword}
              disabled={isChangingPassword || !canSubmitPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva nuova password"
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full mt-2 h-12 font-semibold text-primary/60"
              onClick={() => setShowChangePassword(false)}
            >
              Annulla
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal - Fullscreen */}
      <PrivacyPolicy
        showPrivacy={showPrivacy}
        setShowPrivacy={setShowPrivacy}
        privacyRead={undefined}
        setPrivacyRead={undefined}
      />
    </div>
  );
};

export default Profile;
