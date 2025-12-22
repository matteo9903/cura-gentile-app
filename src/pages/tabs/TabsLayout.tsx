import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/tabs/homepage", label: "Home", icon: Home },
  { path: "/tabs/diario", label: "Diario", icon: BookOpen },
  { path: "/tabs/chatbot", label: "Lia", icon: MessageCircle },
  { path: "/tabs/profilo", label: "Profilo", icon: User },
];

const TabsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Page Content */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* Tab Bar - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-tab-bar border-t border-border safe-area-bottom z-50">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 min-w-[64px] transition-colors"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full mb-1 transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary/50 text-muted-foreground"
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span 
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-tab-active" : "text-tab-inactive"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default TabsLayout;