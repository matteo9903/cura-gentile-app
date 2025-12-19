import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { diaryService } from "@/services/diaryService";

interface FAQ {
  domanda: string;
  risposta: string;
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const loadFAQ = async () => {
      const data = await diaryService.getFAQ();
      setFaqs(data);
    };
    loadFAQ();
  }, []);

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, idx) => (
        <AccordionItem key={idx} value={`faq-${idx}`}>
          <AccordionTrigger className="text-left text-sm hover:no-underline">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{faq.domanda}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pl-6">
            {faq.risposta}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQSection;
