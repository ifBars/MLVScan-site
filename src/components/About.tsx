import { Button } from "./ui/button";
import { FaCode, FaFileCode, FaBan, FaFileAlt, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutItem = ({ icon, title, description, index }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  index: number 
}) => (
  <motion.div 
    className="flex gap-5"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
  >
    <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-3 rounded-xl h-min border border-red-500/10">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">
        {description}
      </p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, index }: {
  icon: React.ReactNode,
  title: string,
  description: string,
  index: number
}) => (
  <motion.div 
    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
  >
    <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-3 rounded-xl h-min border border-red-500/10 w-fit mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">
      {description}
    </p>
  </motion.div>
);

const SeverityCard = ({ severity, color, description, index }: {
  severity: string,
  color: string,
  description: string,
  index: number
}) => {
  const bgClass = `bg-${color}-950/20`;
  const borderClass = `border-${color}-900/50`;
  const textClass = `text-${color}-400`;
  
  return (
    <motion.div 
      className={`p-4 ${bgClass} border ${borderClass} rounded-lg`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
    >
      <h4 className={`font-bold ${textClass} mb-1`}>{severity}</h4>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  );
};

const About = () => {
  const aboutItems = [
    {
      icon: <FaCode className="text-red-500 w-6 h-6" />,
      title: "Pre-load Analysis",
      description: "MLVScan analyzes all mods before they are loaded by MelonLoader. It inspects code patterns to identify potentially harmful behavior without executing the mod."
    },
    {
      icon: <FaFileCode className="text-red-500 w-6 h-6" />,
      title: "Suspicious Pattern Detection",
      description: "The plugin uses a database of known malicious patterns to identify code that might harm your system, including process spawning, network connections, and more."
    },
    {
      icon: <FaBan className="text-red-500 w-6 h-6" />,
      title: "Automatic Disabling",
      description: "When a suspicious mod is detected, MLVScan prevents it from loading, logging detailed information and creating a report with specific findings."
    },
    {
      icon: <FaFileAlt className="text-red-500 w-6 h-6" />,
      title: "Detailed Reporting",
      description: "MLVScan generates comprehensive reports with detailed information about each suspicious pattern, helping you understand the potential threats."
    }
  ];
  
  const severities = [
    {
      severity: "Critical",
      color: "red",
      description: "High-risk activities like executing external processes or loading assemblies"
    },
    {
      severity: "High",
      color: "orange",
      description: "Potentially dangerous behaviors like loading encrypted or obfuscated data"
    },
    {
      severity: "Medium",
      color: "yellow",
      description: "Suspicious patterns that might be legitimate in some contexts"
    },
    {
      severity: "Low",
      color: "blue",
      description: "Minor suspicious patterns with little to no risk"
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 md:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 right-0 w-[1000px] h-[1000px] bg-red-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gray-900/80 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            How MLVScan Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            MLVScan uses static analysis to detect malicious code without executing it, keeping your system safe from harm.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start px-4">
          <div>
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
                Key Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutItems.map((item, index) => (
                  <FeatureCard 
                    key={index}
                    index={index}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
              
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button 
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white group"
                  onClick={() => window.open("https://github.com/ifBars/MLVScan/blob/master/README.md", "_blank", "noopener noreferrer")}
                >
                  <span>Read More</span>
                  <FaChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
              Security Report Interpretation
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              When MLVScan detects a suspicious finding, it will generate a report with findings categorized by severity:
            </p>
            
            <div className="space-y-4">
              {severities.map((severity, index) => (
                <SeverityCard 
                  key={index}
                  index={index}
                  severity={severity.severity}
                  color={severity.color}
                  description={severity.description}
                />
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm">
                <span className="text-red-400 font-medium">Important:</span> Review the report details carefully before deciding to whitelist a mod. When in doubt, consult the community or report the mod.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 