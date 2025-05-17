import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FaBars, FaDownload } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "py-2 navbar-glass shadow-lg" 
            : "py-4 bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-full backdrop-blur-sm border border-red-500/20 shadow-lg shadow-red-900/10 flex items-center justify-center">
              <img src="/MLVScan-Shield.png" alt="MLVScan Logo" className="w-7 h-7" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
              MLVScan
            </span>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#features" className="text-gray-300 hover:text-white transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#threats" className="text-gray-300 hover:text-white transition-colors relative group">
              Threat DB
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="https://github.com/ifBars/MLVScan" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-white transition-colors relative group"
            >
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              variant="accent" 
              size="sm"
              className={`hidden md:flex ${
                scrolled ? "py-2" : "py-2.5"
              }`}
              onClick={() => window.open("https://www.nexusmods.com/schedule1/mods/957?tab=files", "_blank", "noopener noreferrer")}
            >
              <FaDownload className="mr-2 w-4 h-4" />
              Download
            </Button>
            
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800/50 transition-colors"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <FaBars className="text-white w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </motion.nav>
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar; 