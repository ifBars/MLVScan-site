import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";

const ThreatReporting = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 relative z-1">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6 max-w-3xl mx-auto mb-8">
            <h3 className="text-xl font-bold mb-4 text-white">Threat Reporting</h3>
            <p className="text-gray-300 mb-6">
              Help keep the community safe! If you discover a suspicious mod that is not in the database,
              please report it so that MLVScan can analyze and potentially add it to the threat database.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-gray-200 mb-2 flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2" /> Report a Suspicious Mod
                </h4>
                <p className="text-gray-400 text-sm mb-3">
                  Found a mod that seems suspicious or is behaving in unusual ways?
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950"
                  onClick={() => window.open("https://github.com/ifBars/MLVScan/issues", "_blank", "noopener noreferrer")}
                >
                  Submit Report
                </Button>
              </div>
              
              <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-gray-200 mb-2 flex items-center">
                  <FaShieldAlt className="text-blue-500 mr-2" /> Scan or Check a Mod
                </h4>
                <p className="text-gray-400 text-sm mb-3">
                  Not sure if a mod is safe? Use MLVScan to verify its safety.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950"
                  onClick={() => window.open("https://www.nexusmods.com/schedule1/mods/957?tab=files", "_blank", "noopener noreferrer")}
                >
                  Get MLVScan
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThreatReporting; 