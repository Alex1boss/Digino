import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  Package, 
  Plus,
  X,
  ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [userName, setUserName] = useState("Alex");

  // Toggle logged in state for demo purposes
  const toggleLoggedIn = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide welcome message after 5 seconds
  useEffect(() => {
    if (isLoggedIn && showWelcomeMessage) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, showWelcomeMessage]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 py-4 ${
        isScrolled 
          ? isLoggedIn 
            ? "bg-[#0B0B2E]/90 shadow-md backdrop-blur-lg border-b border-[#0056D2]/10" 
            : "bg-[#0A0A23]/95 shadow-md backdrop-blur-lg"
          : isLoggedIn
            ? "bg-[#0B0B2E] border-b border-[#0056D2]/10 backdrop-blur-sm"
            : "bg-[#0A0A23] backdrop-blur-sm"
      } transition-all duration-300`}
    >
      {/* Welcome message - shows up when user logs in */}
      {isLoggedIn && showWelcomeMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 left-0 w-full bg-gradient-to-r from-[#0056D2] to-[#0077B6] text-white py-1 text-center text-sm font-medium"
        >
          Welcome back, {userName}! 👋
        </motion.div>
      )}

      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className={`mr-2 p-1.5 rounded ${
              isLoggedIn 
                ? "text-[#0056D2] bg-[#0056D2]/10" 
                : "text-[#4F46E5] bg-[#4F46E5]/10"
            }`}>
              <Zap size={22} />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold">
              <span className="text-white">Digino</span>
              <span className={isLoggedIn ? "text-[#0056D2]" : "text-[#4F46E5]"}>AI</span>
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/" ? "text-[#0056D2]" : ""
          }`}>
            Home
          </Link>
          <Link href="/explore" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/explore" ? "text-[#0056D2]" : ""
          }`}>
            Explore
          </Link>
          <Link href="/buy" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/buy" ? "text-[#0056D2]" : ""
          }`}>
            Buy
          </Link>
          <Link href="/sell" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/sell" ? "text-[#0056D2]" : ""
          }`}>
            Sell
          </Link>
        </div>

        {/* User Actions Area */}
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                <Search size={20} />
              </Button>
              
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 relative">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-[#1A1A2E] border border-[#0056D2]/20">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" onClick={() => setNotificationCount(0)}>
                      Mark all read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="py-3 px-3 focus:bg-[#0056D2]/10">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">Your product was purchased</div>
                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 px-3 focus:bg-[#0056D2]/10">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">New message from admin</div>
                        <div className="text-sm text-muted-foreground">Yesterday</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 px-3 focus:bg-[#0056D2]/10">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">Payment received $129.00</div>
                        <div className="text-sm text-muted-foreground">Last week</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 hover:bg-white/5 flex items-center gap-2">
                    <Avatar className="h-9 w-9 border-2 border-white/10">
                      <AvatarImage src="/avatar-placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-[#0056D2] to-[#00C49A] text-white">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={16} className="text-white/70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 overflow-hidden rounded-xl border border-white/10 bg-[#1A1A2E] p-1 text-white shadow-lg shadow-black/20 backdrop-blur-lg"
                >
                  <div className="flex items-center gap-2 rounded-md p-3 mb-1">
                    <Avatar className="h-10 w-10 border-2 border-white/10">
                      <AvatarImage src="/avatar-placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-[#0056D2] to-[#00C49A] text-white">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-medium">{userName}</span>
                      <span className="text-xs text-white/60">premium@example.com</span>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md p-2.5 text-sm focus:bg-[#0056D2]/20">
                      <User size={16} className="text-[#0056D2]" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md p-2.5 text-sm focus:bg-[#0056D2]/20">
                      <ShoppingBag size={16} className="text-[#00C49A]" />
                      <span>My Purchases</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md p-2.5 text-sm focus:bg-[#0056D2]/20">
                      <Package size={16} className="text-[#BB86FC]" />
                      <span>My Products</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md p-2.5 text-sm focus:bg-[#0056D2]/20">
                      <Settings size={16} className="text-white/70" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-md p-2.5 text-sm focus:bg-[#0056D2]/20" onClick={toggleLoggedIn}>
                      <LogOut size={16} className="text-red-400" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Floating Action Button - for quick selling */}
              <div className="hidden lg:flex">
                <Button
                  className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:from-[#0056D2]/90 hover:to-[#00C49A]/90 text-white rounded-full px-5 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Sell Product
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-[#0056D2]/20 text-white font-medium transition duration-200 text-sm md:text-base rounded-lg hover:bg-[#0056D2]/5"
                onClick={toggleLoggedIn}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:from-[#0056D2]/90 hover:to-[#00C49A]/90 text-white text-sm md:text-base rounded-lg"
              >
                Get Started
              </Button>
            </>
          )}
          
          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : (
                <div className="flex flex-col gap-1.5">
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A23]/95 backdrop-blur-lg overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <Link href="/" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5">
                Home
              </Link>
              <Link href="/explore" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5">
                Explore
              </Link>
              <Link href="/buy" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5">
                Buy
              </Link>
              <Link href="/sell" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5">
                Sell
              </Link>
              {isLoggedIn && (
                <>
                  <div className="w-full h-px bg-white/10 my-2"></div>
                  <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3">
                    <User size={16} /> My Profile
                  </Link>
                  <Link href="/purchases" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3">
                    <ShoppingBag size={16} /> My Purchases
                  </Link>
                  <Link href="/products" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3">
                    <Package size={16} /> My Products
                  </Link>
                  <Link href="/settings" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3">
                    <Settings size={16} /> Settings
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Action Button for Mobile - visible when logged in */}
      {isLoggedIn && (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-30 lg:hidden">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-tr from-[#0056D2] to-[#00C49A] hover:shadow-[#0056D2]/20 hover:shadow-xl transition-all duration-300">
              <Plus size={24} />
            </Button>
          </motion.div>
        </div>
      )}
    </motion.header>
  );
}
