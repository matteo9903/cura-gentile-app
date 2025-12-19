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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Page Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Tab Bar */}
      <nav className="bg-tab-bar border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-2 min-w-[64px] transition-colors",
                  isActive ? "text-tab-active" : "text-tab-inactive"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 mb-1",
                    isActive && "fill-current"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default TabsLayout;
