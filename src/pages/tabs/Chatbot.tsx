import { useState, useEffect, useRef, useCallback } from "react";
import { chatService, ChatMessage } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header - Fixed, uniform height */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-primary px-4 flex items-center justify-between z-40 safe-area-top">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Bot className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">
              {chatbotInfo.nome}
            </h1>
            <div className="text-xs text-primary-foreground/80">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-iov-green animate-pulse-soft" />
                <span className="text-xs text-primary-foreground/80">online</span>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <p className="text-xs text-primary-foreground/80">
                Assistente virtuale per il tuo supporto terapeutico
              </p>
            </div> */}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10 h-12 w-12"
          onClick={() => setShowInfo(true)}
        >
          <Info className="h-7 w-7" />
        </Button>
      </header>

      {/* Messages Container - Fills space and scrolls from bottom */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="fixed top-[70px] bottom-36 left-0 right-0 overflow-y-auto p-4 flex flex-col"
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

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 relative group",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div
                  className={cn(
                    "flex items-center gap-2 mt-1",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs",
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                  <button
                    onClick={() => handleVoice(message.content)}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                      message.role === "user"
                        ? "text-primary-foreground/70 hover:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Volume2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Lia sta scrivendo...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar - Fixed */}
      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-3 z-40">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground"
            onClick={() =>
              toast({
                title: "Microfono",
                description: "Funzionalità vocale in arrivo...",
              })
            }
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-4"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Info Modal - Fullscreen */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="h-full max-h-full w-full max-w-full m-0 rounded-none flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              {chatbotInfo.nome} - {chatbotInfo.descrizione}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setShowInfo(false)}
            >
              <X className="h-6 w-6" />
            </Button>
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
