import { Button } from "./ui/button";
import { FaDownload, FaGithub, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-36 pb-24 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gray-800 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-red-600/30 to-red-800/30 p-5 rounded-full backdrop-blur-sm border border-red-500/20 shadow-lg shadow-red-900/10 flex items-center justify-center">
              <img src="/MLVScan-Shield.png" alt="MLVScan Logo" className="w-12 h-12" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-red-400 leading-tight px-4"
          >
            Defend Your System Against
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Malicious Mods</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed px-4"
          >
            MLVScan automatically detects and disables potentially malicious MelonLoader mods before they can harm your system.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto px-4"
          >
            <Button 
              size="lg" 
              variant="accent" 
              className="w-full md:w-auto px-8 py-6 text-lg"
              onClick={() => window.open("https://www.nexusmods.com/schedule1/mods/957?tab=files", "_blank", "noopener noreferrer")}
            >
              <FaDownload className="mr-2" />
              Download
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full md:w-auto border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm px-8 py-6 text-lg"
              onClick={() => window.open("https://github.com/ifBars/MLVScan", "_blank", "noopener noreferrer")}
            >
              <FaGithub className="mr-2" />
              View on GitHub
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero; 