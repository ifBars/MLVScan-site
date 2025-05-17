import { FaGithub, FaTwitter, FaDiscord, FaShieldAlt, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-950 relative overflow-hidden pt-20 pb-10 px-4 sm:px-6 md:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-900/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600/30 to-red-800/30 rounded-full backdrop-blur-sm border border-red-500/20 shadow-lg shadow-red-900/10 flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL || ''}MLVScan-Shield.png`} alt="MLVScan Logo" className="w-7 h-7" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
                MLVScan
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Open-source security for the Schedule 1 modding community.
            </p>
            <div className="flex space-x-5">
              <a
                href="https://github.com/ifBars/MLVScan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="https://discord.gg/rV2QSAnqhX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaDiscord size={22} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  Features
                </a>
              </li>
              <li>
                <a href="#threats" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  Threats Database
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nexusmods.com/schedule1/mods/957?tab=files" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  Download
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com/ifBars/MLVScan/issues" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  Report an Issue
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ifBars/MLVScan/blob/master/LICENSE" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  License
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ifBars/MLVScan/blob/master/README.md#contributing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  Contributing
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MLVScan. All rights reserved. Licensed under GNU GPL v3.
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            <span>Made with</span>
            <FaHeart className="mx-1 text-red-500" size={12} />
            <span>for the gaming community</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 