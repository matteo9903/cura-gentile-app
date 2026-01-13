import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/tabs/homepage", label: "Home", icon: Home },
  { path: "/tabs/diario", label: "Diario", icon: BookOpen },
  { path: "/tabs/chatbot", label: "Mia", icon: MessageCircle },
  { path: "/tabs/profilo", label: "Profilo", icon: User },
];

/**
 * TabsLayout is a React component that provides a layout structure for a tabbed navigation interface,
 * typically used in mobile or web applications. It renders the main page content and a fixed tab bar at the bottom.
 *
 * ## Functionality
 * - Uses React Router's `useLocation` and `useNavigate` hooks to determine the current route and handle navigation.
 * - Renders the current page content via the `<Outlet />` component.
 * - Displays a fixed tab bar at the bottom of the screen, with each tab represented as a button.
 * - Highlights the active tab based on the current route.
 * - Navigates to the corresponding route when a tab is clicked.
 *
 * ## CSS Statements
 * - `min-h-screen bg-background`: Ensures the layout takes at least the full viewport height and applies a background color.
 * - `fixed bottom-0 left-0 right-0`: Positions the tab bar fixed at the bottom, spanning the full width.
 * - `bg-tab-bar border-t border-border`: Styles the tab bar background and adds a top border.
 * - `safe-area-bottom`: Adds padding for devices with a safe area (e.g., iPhones with notches).
 * - `z-50`: Ensures the tab bar appears above other elements.
 * - `flex items-center justify-around py-1`: Arranges tab buttons horizontally, centered, and spaced evenly.
 * - `transition-colors`: Smoothly animates color changes on interaction.
 * - `bg-primary text-primary-foreground`: Highlights the active tab with primary theme colors.
 * - `bg-transparent text-muted-foreground`: Styles inactive tabs with muted colors.
 * - `text-xs font-medium`: Styles tab labels with small, medium-weight text.
 * - `text-tab-active` / `text-tab-inactive`: Applies specific colors to active/inactive tab labels.
 *
 * @component
 */

const TabsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Page Content */}
      <main
        style={{ paddingBottom: "calc(var(--tab-bar-height) + var(--safe-area-bottom))" }}
      >
        <Outlet />
      </main>

      {/* Tab Bar - Fixed */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-tab-bar border-t border-border safe-area-bottom z-50"
        style={{ minHeight: "var(--tab-bar-height)" }}
      >
        <div className="flex items-center justify-around py-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-1 min-w-[60px] gap-0 transition-colors"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-full mb-0 transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-transparent text-muted-foreground"
                  )}
                >
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span 
                  className={cn(
                    "text-sm font-medium",
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
