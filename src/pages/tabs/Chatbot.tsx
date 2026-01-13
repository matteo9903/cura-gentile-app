import { useState, useEffect, useRef, useCallback } from "react";
import { chatService, ChatMessage } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Info,
  Send,
  Mic,
  Volume2,
  Loader2,
  Bot,
  X,
  User as UserIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Network } from '@capacitor/network';

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const chatbotInfo = chatService.getChatbotInfo();

  useEffect(() => {
    const loadInitialMessages = async () => {
      const initialMessages = await chatService.getInitialMessages();
      setMessages(initialMessages);
    };
    loadInitialMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingOlder || !hasOlderMessages) return;

    if (container.scrollTop < 50) {
      setIsLoadingOlder(true);
      const olderMessages = await chatService.loadOlderMessages();
      if (olderMessages.length > 0) {
        setMessages((prev) => [...olderMessages, ...prev]);
      } else {
        setHasOlderMessages(false);
      }
      setIsLoadingOlder(false);
    }
  }, [isLoadingOlder, hasOlderMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage.content);
      setMessages((prev) => [...prev, response]);
    } catch {
      toast({
        title: "Errore",
        description: "Impossibile inviare il messaggio. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "it-IT";
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Non disponibile",
        description: "La sintesi vocale non è supportata dal tuo browser.",
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const [isOnline, setIsOnline] = useState<boolean>(true);

  // useEffect(() => {
  //   async function initializeNetworkStatus() {
  //     const status = await Network.getStatus();
  //     setIsOnline(status.connected);
  //     console.log("Initial network status:", status.connected);

  //     Network.addListener('networkStatusChange', (status) => {
  //       setIsOnline(status.connected);
  //       console.log("Network status changed:", status.connected);
  //     });
  //   }

  //   initializeNetworkStatus();

  //   // Cleanup listener on unmount
  //   return () => {
  //     Network.removeAllListeners();
  //     console.log("Network listeners removed");
  //   };
  // }, []);

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        paddingTop: "var(--safe-area-top)",
        paddingBottom: "var(--safe-area-bottom)",
      }}
    >
      {/* Header - Fixed, uniform height */}
      <header
        className="fixed top-0 left-0 right-0 bg-iov-gradient text-white px-4 flex items-center justify-between z-40 border-b border-white/20 shadow-lg"
        style={{
          paddingTop: "calc(var(--safe-area-top)/2)",
          paddingBottom: "calc(var(--safe-area-top)/2)",
          minHeight: "70px",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              {chatbotInfo.nome}
            </h1>
            <div className="text-xs text-white/80">
                <div className="flex items-center gap-1">
                {/* <span className={"w-2 h-2 rounded-full animate-pulse-soft" + (isOnline ? " bg-iov-green" : " bg-red-500")} />
                <span className="text-[14px] text-white/80">{isOnline ? "ONLINE" : "OFFLINE"}</span> */}
                <span className={"w-2 h-2 rounded-full animate-pulse-soft" + " bg-iov-green"}/>
                <span className="text-[14px] text-white/80">{"ONLINE"}</span>
                </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <p className="text-xs text-primary-foreground/80">
                Assistente virtuale per il tuo supporto terapeutico
              </p>
            </div> */}
          </div>
        </div>
        <div 
          style={{
            width: '100%',
            display:'flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            marginRight: '-0.5rem'
          }}
        >
          <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 h-12 w-12"
          onClick={() => setShowInfo(true)}
        >
          <Info style={{width: '1.3rem', height: '1.3rem'}} />
        </Button>
        </div>
      </header>

      {/* Messages Container - Fills space and scrolls from bottom */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="fixed left-0 right-0 overflow-y-auto px-4 pb-6 flex flex-col"
        style={{
          top: "calc(82px + var(--safe-area-top))",
          bottom: "calc(var(--tab-bar-height) + var(--chat-input-height) + var(--safe-area-bottom))",
        }}
      >
        {/* Spacer to push messages to bottom when few messages */}
        <div className="flex-1" />
        {/* Messages list */}
        <div className="space-y-4">
          {isLoadingOlder && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2 animate-fade-in",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                {!isUser && (
                  <img
                    src="/chatbot.png"
                    alt={`${chatbotInfo.nome} avatar`}
                    className="h-14 w-14 object-contain"
                  />
                )}

                <div
                  className={cn(
                    "max-w-[78%] min-w-0 rounded-2xl px-4 py-3 relative group",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-sm ml-auto"
                      : "bg-card border border-border rounded-bl-sm"
                  )}
                >
                  <div className={cn("flex items-center gap-3", isUser && "flex-row-reverse")}>
                    <p className="text-md whitespace-pre-wrap break-words flex-1 text-left">
                      {message.content}
                    </p>
                    {/* <button
                      onClick={() => handleVoice(message.content)}
                      className={cn(
                        "shrink-0 transition-colors flex items-center justify-center text-md",
                        isUser ? "text-white/90 hover:text-white" : "text-black/80 hover:text-black"
                      )}
                      aria-label="Ascolta il messaggio"
                    >
                      <Volume2 className="h-5 w-5" strokeWidth={2.5} />
                    </button> */}
                  </div>
                  <div className={cn("mt-2", isUser ? "text-right" : "text-left")}>
                    <span
                      className={cn(
                        "text-xs",
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>

                {isUser && (
                  <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Mia sta scrivendo...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar - Fixed */}
      <div
        className="fixed left-0 right-0 bg-card border-t border-border p-3 z-40 shadow-md"
        style={{
          bottom: "calc(var(--tab-bar-height) + var(--safe-area-bottom))",
        }}
      >
        <div className="flex items-center gap-2">
          {/* <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground h-12 w-12"
            onClick={() =>
              toast({
                title: "Microfono",
                description: "Funzionalità",
              })
            }
          >
            <Mic style={{height: '1.5rem', width: '1.5rem'}} />
          </Button> */}
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Messaggio..."
            className="flex-1 px-4 py-3 min-h-[32px] max-h-32 rounded-lg border border-input bg-background text-lg leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-lg"
            disabled={isLoading}
            rows={1}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0 h-12 w-12"
          >
            <Send style={{height: '1.5rem', width: '1.5rem'}} />
          </Button>
        </div>
      </div>

      {/* Info Modal - Fullscreen */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center pb-3">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              {chatbotInfo.nome} - {chatbotInfo.descrizione}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Scopri cosa può fare {chatbotInfo.nome} per te:
            </p>
            {chatbotInfo.funzionalita.map((func, idx) => (
              <Card key={idx} className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary mb-1">
                    {func.titolo}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {func.descrizione}
                  </p>
                </CardContent>
              </Card>
            ))}
            <div className="bg-accent/20 border border-accent rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> {chatbotInfo.disclaimer}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chatbot;




