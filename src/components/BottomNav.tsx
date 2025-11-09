import { Activity, Bell, Layers, ClipboardCheck, Beaker, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Live", icon: Activity },
  { path: "/batches", label: "Batches", icon: Layers },
  { path: "/latex/field", label: "Latex", icon: Beaker },
  { path: "/gloves", label: "Gloves", icon: Package },
  { path: "/qc", label: "QC", icon: ClipboardCheck },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors rounded-lg",
                isActive 
                  ? "text-primary font-semibold" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};