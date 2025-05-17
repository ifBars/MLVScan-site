import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGithub, FaDownload } from 'react-icons/fa';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Threat DB', href: '#threats' },
    { label: 'GitHub', href: 'https://github.com/ifBars/MLVScan', external: true }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.4
      }
    })
  };

  const handleNavigate = (url: string, isExternal: boolean = false) => {
    if (isExternal) {
      window.open(url, "_blank", "noopener noreferrer");
    } else {
      window.location.href = url;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div 
            className="fixed right-0 top-0 h-full w-4/5 max-w-xs bg-gray-900 z-50 shadow-2xl border-l border-gray-800"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button 
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                onClick={onClose}
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            {/* Menu items */}
            <nav className="px-8 pt-8 pb-16">
              <ul className="space-y-8">
                {menuItems.map((item, i) => (
                  <motion.li 
                    key={i}
                    custom={i} 
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <a 
                      className="text-2xl font-bold text-white hover:text-red-400 transition-colors flex items-center cursor-pointer"
                      onClick={() => handleNavigate(item.href, item.external)}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div 
                className="mt-12 space-y-4"
                variants={itemVariants}
                custom={menuItems.length + 1}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Button 
                  variant="accent" 
                  className="w-full py-6"
                  onClick={() => window.open("https://www.nexusmods.com/schedule1/mods/957?tab=files", "_blank", "noopener noreferrer")}
                >
                  <FaDownload className="mr-2" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 py-6"
                  onClick={() => window.open("https://github.com/ifBars/MLVScan", "_blank", "noopener noreferrer")}
                >
                  <FaGithub className="mr-2" />
                  GitHub
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 