import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "./ui/badge";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [userName, setUserName] = useState("Alex");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  // Toggle logged in state for demo purposes
  const toggleLoggedIn = () => {
    setIsLoggedIn(!isLoggedIn);
    if (!isLoggedIn) {
      setShowWelcomeMessage(true);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            location === "/" ? "text-[#0056D2]" : "text-white"
          }`}>
            Home
          </Link>
          <Link href="/explore" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/explore" ? "text-[#0056D2]" : "text-white"
          }`}>
            Explore
          </Link>
          <Link href="/buy" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/buy" ? "text-[#0056D2]" : "text-white"
          }`}>
            Buy
          </Link>
          <Link href="/sell" className={`font-medium transition-colors duration-200 hover:text-[#0056D2] ${
            location === "/sell" ? "text-[#0056D2]" : "text-white"
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
                <Search size={20} className="text-white" />
              </Button>
              
              {/* Notifications */}
              <div className="relative" ref={notificationMenuRef}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-white/5 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} className="text-white" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
                
                {/* Notification dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#1A1A2E] border border-[#0056D2]/20 rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-between p-3 border-b border-[#0056D2]/10">
                      <span className="font-medium text-white">Notifications</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sm text-[#0056D2] hover:bg-[#0056D2]/10"
                        onClick={() => setNotificationCount(0)}
                      >
                        Mark all read
                      </Button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      <div className="p-3 hover:bg-[#0056D2]/10 cursor-pointer border-b border-[#0056D2]/10">
                        <div className="font-medium text-white">Your product was purchased</div>
                        <div className="text-sm text-white/60">2 hours ago</div>
                      </div>
                      <div className="p-3 hover:bg-[#0056D2]/10 cursor-pointer border-b border-[#0056D2]/10">
                        <div className="font-medium text-white">New message from admin</div>
                        <div className="text-sm text-white/60">Yesterday</div>
                      </div>
                      <div className="p-3 hover:bg-[#0056D2]/10 cursor-pointer">
                        <div className="font-medium text-white">Payment received $129.00</div>
                        <div className="text-sm text-white/60">Last week</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  className="rounded-full p-1 hover:bg-white/5 flex items-center gap-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0056D2] to-[#00C49A] flex items-center justify-center text-white font-medium border-2 border-white/10">
                    {userName.charAt(0)}
                  </div>
                  {showUserMenu ? (
                    <ChevronUp size={16} className="text-white/70" />
                  ) : (
                    <ChevronDown size={16} className="text-white/70" />
                  )}
                </Button>
                
                {/* User menu dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-lg overflow-hidden p-1 z-50">
                    <div className="flex items-center gap-2 p-3 mb-1">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0056D2] to-[#00C49A] flex items-center justify-center text-white font-medium border-2 border-white/10">
                        {userName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{userName}</span>
                        <span className="text-xs text-white/60">premium@example.com</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-white/10 my-1"></div>
                    
                    <div className="px-1">
                      <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start text-sm text-white hover:bg-[#0056D2]/20 rounded-md p-2.5">
                          <User size={16} className="text-[#0056D2] mr-3" />
                          <span>My Profile</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start text-sm text-white hover:bg-[#0056D2]/20 rounded-md p-2.5">
                        <ShoppingBag size={16} className="text-[#00C49A] mr-3" />
                        <span>My Purchases</span>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm text-white hover:bg-[#0056D2]/20 rounded-md p-2.5">
                        <Package size={16} className="text-[#BB86FC] mr-3" />
                        <span>My Products</span>
                      </Button>
                    </div>
                    
                    <div className="w-full h-px bg-white/10 my-1"></div>
                    
                    <div className="px-1">
                      <Button variant="ghost" className="w-full justify-start text-sm text-white hover:bg-[#0056D2]/20 rounded-md p-2.5">
                        <Settings size={16} className="text-white/70 mr-3" />
                        <span>Settings</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm text-white hover:bg-[#0056D2]/20 rounded-md p-2.5"
                        onClick={toggleLoggedIn}
                      >
                        <LogOut size={16} className="text-red-400 mr-3" />
                        <span>Log out</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
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
              <Link href="/" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 text-white">
                Home
              </Link>
              <Link href="/explore" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 text-white">
                Explore
              </Link>
              <Link href="/buy" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 text-white">
                Buy
              </Link>
              <Link href="/sell" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 text-white">
                Sell
              </Link>
              {isLoggedIn && (
                <>
                  <div className="w-full h-px bg-white/10 my-2"></div>
                  <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3 text-white">
                    <User size={16} /> My Profile
                  </Link>
                  <Link href="/purchases" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3 text-white">
                    <ShoppingBag size={16} /> My Purchases
                  </Link>
                  <Link href="/products" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3 text-white">
                    <Package size={16} /> My Products
                  </Link>
                  <Link href="/settings" onClick={() => setShowMobileMenu(false)} className="py-2 px-4 rounded-lg hover:bg-white/5 flex items-center gap-3 text-white">
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
            <Button className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-tr from-[#0056D2] to-[#00C49A] hover:shadow-[#0056D2]/20 hover:shadow-xl transition-all duration-300 text-white">
              <Plus size={24} />
            </Button>
          </motion.div>
        </div>
      )}
    </motion.header>
  );
}