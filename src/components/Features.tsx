import { Card } from "./ui/card";
import { FaShieldAlt, FaExclamationTriangle, FaListAlt, FaLock, FaFileAlt, FaThumbsUp } from "react-icons/fa";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description, index }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  index: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card className="group bg-gray-800/30 backdrop-blur-sm border-gray-700 p-6 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 h-full">
      <div className="flex flex-col items-center md:items-start text-center md:text-left h-full">
        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 p-4 rounded-xl mb-5 group-hover:bg-gradient-to-br group-hover:from-red-600/30 group-hover:to-red-800/30 transition-all duration-300 border border-red-500/10 group-hover:border-red-500/20">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors duration-300">{title}</h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
      </div>
    </Card>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-red-500 w-6 h-6" />,
      title: "Pre-load Scanning",
      description: "Catches malicious code before it can execute, preventing damage to your system."
    },
    {
      icon: <FaExclamationTriangle className="text-red-500 w-6 h-6" />,
      title: "Severity Classification",
      description: "Categorizes threats by risk level (Critical, High, Medium, Low) for better decision-making."
    },
    {
      icon: <FaListAlt className="text-red-500 w-6 h-6" />,
      title: "Modular Detection Rules",
      description: "Uses a variety of detection patterns to identify various types of malicious behavior."
    },
    {
      icon: <FaLock className="text-red-500 w-6 h-6" />,
      title: "Automatic Disabling",
      description: "Prevents suspicious mods from loading to protect your game and system."
    },
    {
      icon: <FaFileAlt className="text-red-500 w-6 h-6" />,
      title: "Detailed Reports",
      description: "Generates comprehensive scan reports with specific findings for your review."
    },
    {
      icon: <FaThumbsUp className="text-red-500 w-6 h-6" />,
      title: "Whitelisting",
      description: "Allows trusted mods to bypass scanning for maximum compatibility."
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 md:px-8 relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-900 to-transparent -z-10"></div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            Powerful Security Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            MLVScan protects your game with advanced security features designed to catch even the most sophisticated malicious mods.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 