'use client'

import { useEffect, useState } from "react";
import { User, Clock, LogOut, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function Header({ title, showBackButton = false }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentShift, setCurrentShift] = useState("Shift A");
  const { data: session } = useSession();
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const userRoles = session?.user?.roles || [];
  const isAdmin = userRoles.includes('admin');
  
  const user = {
    name: session?.user?.name || "User",
    initials: session?.user?.email?.substring(0, 2).toUpperCase() || "U",
    avatar: null,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Determine shift based on time (example logic)
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) {
      setCurrentShift("Shift A");
    } else if (hour >= 14 && hour < 22) {
      setCurrentShift("Shift B");
    } else {
      setCurrentShift("Shift C");
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="p-4 lg:px-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">DT</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DIPTrack
            </h1>
          </div>
          {title && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-foreground">{title}</span>
            </>
          )}
        </div>

        {/* Right: Shift, Time, Profile */}
        <div className="flex items-center gap-3">
          {/* Shift Info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">{currentShift}</span>
          </div>

          {/* Live Time */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono text-foreground">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* User Profile */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarFallback className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white text-xs font-semibold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-popover border-border shadow-lg" align="end">
              <div className="flex flex-col gap-1">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsPopoverOpen(false);
                      router.push('/admin');
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-left text-foreground"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create User</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsPopoverOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-left text-muted-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Mobile Time & Shift - Second Row */}
      <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary">{currentShift}</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-card border border-border">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-mono text-foreground">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </header>
  );
}