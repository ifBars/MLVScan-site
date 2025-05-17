import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { FaExclamationTriangle, FaCalendarAlt, FaTag, 
  FaExclamationCircle, FaShieldAlt, FaSpinner, FaEye, FaInfoCircle, 
  FaExclamationCircle as FaCircle, FaCode, FaFileAlt, 
  FaChevronDown, FaChevronUp, FaCheck, FaTimes, FaList, FaTh, FaCopy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { threatService } from "../services/threatService";
import type { Threat, SeverityType } from "../types/threats";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ThreatsDatabase = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<number | null>(null);
  const [searchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<SeverityType>("All");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterSource, setFilterSource] = useState<string>("All");
  const [filterDateRange, setFilterDateRange] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedTechniques, setExpandedTechniques] = useState<{[key: string]: boolean}>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch threats data
  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true);
        const data = await threatService.getAllThreats();
        setThreats(data);
        setError(null);
      } catch (err) {
        setError("Failed to load threat database. Please try again later.");
        console.error("Error loading threats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  // Enhanced filtering with multiple criteria
  const filteredThreats = threats.filter(threat => {
    // Search term filtering
    const matchesSearch = 
      searchTerm === "" ||
      threat.names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (threat.stolen_mod && threat.stolen_mod.toLowerCase().includes(searchTerm.toLowerCase())) ||
      threat.techniques.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (threat.triggered_rules && threat.triggered_rules.some(rule => rule.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Severity filtering
    const matchesSeverity = filterSeverity === "All" || threat.severity === filterSeverity;
    
    // Type filtering
    const matchesType = filterType === "All" || threat.type === filterType;
    
    // Source filtering
    const matchesSource = filterSource === "All" || threat.source === filterSource;
    
    // Date range filtering
    let matchesDate = true;
    if (filterDateRange !== "All") {
      const threatDate = new Date(threat.date);
      const today = new Date();
      
      if (filterDateRange === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesDate = threatDate >= thirtyDaysAgo;
      } else if (filterDateRange === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = threatDate >= sevenDaysAgo;
      }
    }
    
    return matchesSearch && matchesSeverity && matchesType && matchesSource && matchesDate;
  }).sort((a, b) => {
    // Sorting logic
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "severity-high") {
      const severityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    } else if (sortBy === "severity-low") {
      const severityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    } else if (sortBy === "name-az") {
      return a.names[0].localeCompare(b.names[0]);
    } else if (sortBy === "name-za") {
      return b.names[0].localeCompare(a.names[0]);
    }
    return 0;
  });

  // Get unique filter options
  const uniqueTypes = ["All", ...Array.from(new Set(threats.map(threat => threat.type)))];
  const uniqueSources = ["All", ...Array.from(new Set(threats.map(threat => threat.source)))];

  // Count threats by severity
  const severityCounts = {
    Critical: threats.filter(threat => threat.severity === "Critical").length,
    High: threats.filter(threat => threat.severity === "High").length,
    Medium: threats.filter(threat => threat.severity === "Medium").length,
    Low: threats.filter(threat => threat.severity === "Low").length,
  };

  // Copy hash to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Toggle technique explanation
  const toggleTechniqueExpansion = (technique: string) => {
    setExpandedTechniques(prev => ({
      ...prev,
      [technique]: !prev[technique]
    }));
  };

  // Calculate statistics
  const totalThreats = threats.length;
  const lastThirtyDaysThreats = threats.filter(threat => {
    const threatDate = new Date(threat.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return threatDate >= thirtyDaysAgo;
  }).length;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedThreat(null);
      }
    };

    if (selectedThreat !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedThreat]);

  return (
    <section id="threats" className="py-12 px-4 sm:px-6 md:px-8 relative z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-red-900/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            Threats Database
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            A catalog of known malicious mods detected by MLVScan and the community. Stay informed about the latest threats.
          </p>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mx-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
              <FaShieldAlt className="text-xl text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Threats</p>
              <p className="text-2xl font-bold text-white">{totalThreats}</p>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-xl text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Critical Threats</p>
              <p className="text-2xl font-bold text-white">{severityCounts.Critical}</p>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center mr-4">
              <FaExclamationCircle className="text-xl text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">High Severity</p>
              <p className="text-2xl font-bold text-white">{severityCounts.High}</p>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4">
              <FaCalendarAlt className="text-xl text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last 30 Days</p>
              <p className="text-2xl font-bold text-white">{lastThirtyDaysThreats}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8 mb-8 shadow-xl mx-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="text-4xl text-red-500 animate-spin mb-4" />
              <p className="text-gray-300">Loading threat database...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
              <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
              <p className="text-gray-200 mb-4">{error}</p>
              <Button 
                variant="outline"
                className="border-red-700 text-red-400 hover:bg-red-900/30"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-6">
                {/* 
                <div className="relative w-full md:w-80">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search threats..."
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                */}
                
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-gray-700 ${viewMode === "table" ? "bg-gray-700 text-white" : "text-gray-400"} hover:text-white transition-colors`}
                    onClick={() => setViewMode("table")}
                  >
                    <FaList className="mr-2" />
                    Table
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-gray-700 ${viewMode === "cards" ? "bg-gray-700 text-white" : "text-gray-400"} hover:text-white transition-colors`}
                    onClick={() => setViewMode("cards")}
                  >
                    <FaTh className="mr-2" />
                    Cards
                  </Button>
                  {/*
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-gray-700 ${showFilterPanel ? "bg-red-900/30 text-white border-red-700" : "text-gray-400"} hover:text-white transition-colors`}
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                  >
                    <FaFilter className="mr-2" />
                    Filters
                    {showFilterPanel ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                  </Button>
                  */}
                </div>
              </div>

              {/*
              <AnimatePresence>
                {showFilterPanel && (
                  <motion.div 
                    className="mb-6 bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
                        <select 
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          value={filterSeverity}
                          onChange={(e) => setFilterSeverity(e.target.value as SeverityType)}
                        >
                          {["All", "Critical", "High", "Medium", "Low"].map((severity) => (
                            <option key={severity} value={severity}>{severity}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Threat Type</label>
                        <select 
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          {uniqueTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Source</label>
                        <select 
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          value={filterSource}
                          onChange={(e) => setFilterSource(e.target.value)}
                        >
                          {uniqueSources.map((source) => (
                            <option key={source} value={source}>{source}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                        <select 
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          value={filterDateRange}
                          onChange={(e) => setFilterDateRange(e.target.value)}
                        >
                          <option value="All">All Time</option>
                          <option value="30days">Last 30 Days</option>
                          <option value="7days">Last 7 Days</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-gray-700 ${sortBy === "newest" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                          onClick={() => setSortBy("newest")}
                        >
                          Newest
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-gray-700 ${sortBy === "oldest" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                          onClick={() => setSortBy("oldest")}
                        >
                          Oldest
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-gray-700 ${sortBy === "severity-high" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                          onClick={() => setSortBy("severity-high")}
                        >
                          Highest Severity
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-gray-700 ${sortBy === "severity-low" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                          onClick={() => setSortBy("severity-low")}
                        >
                          Lowest Severity
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-gray-700 ${sortBy === "name-az" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                          onClick={() => setSortBy("name-az")}
                        >
                          Name (A-Z)
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`border-gray-700 ${sortBy === "name-za" ? "bg-gray-700 text-white" : "text-gray-400"}`}
                          onClick={() => setSortBy("name-za")}
                        >
                          Name (Z-A)
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              */}

              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <motion.table 
                    className="w-full text-left"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <thead className="bg-gray-900/70 text-gray-400 text-sm uppercase">
                      <tr>
                        <th className="py-3 px-4 rounded-tl-md">Mod Name(s)</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4 rounded-tr-md text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {filteredThreats.length > 0 ? (
                        filteredThreats.map((threat) => (
                          <motion.tr 
                            key={threat.id} 
                            className="hover:bg-gray-800/30 transition-colors"
                            variants={itemVariants}
                          >
                            <td className="py-3 px-4 font-medium">
                              <div className="flex flex-col">
                                <span>{threat.names[0]}</span>
                                {threat.names.length > 1 && (
                                  <span className="text-xs text-gray-500 mt-1">
                                    +{threat.names.length - 1} aliases
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{threat.type}</td>
                            <td className="py-3 px-4 text-gray-400">{threat.source}</td>
                            <td className="py-3 px-4 text-gray-400">{threat.date}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  threat.severity === "Critical"
                                    ? "bg-red-900/30 text-red-400 border border-red-900/50"
                                    : threat.severity === "High"
                                    ? "bg-orange-900/30 text-orange-400 border border-orange-900/50"
                                    : threat.severity === "Medium"
                                    ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50"
                                    : "bg-blue-900/30 text-blue-400 border border-blue-900/50"
                                }`}
                              >
                                {threat.severity === "Critical" && <FaExclamationTriangle className="mr-1" />}
                                {threat.severity === "High" && <FaExclamationCircle className="mr-1" />}
                                {threat.severity}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
                              >
                                <FaEye className="mr-1.5" />
                                {selectedThreat === threat.id ? "Hide" : "View"}
                              </Button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No threats found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </motion.table>
                </div>
              ) : (
                /* Card View */
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {filteredThreats.length > 0 ? (
                    filteredThreats.map((threat) => (
                      <motion.div 
                        key={threat.id}
                        className="bg-gray-900/40 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all shadow-lg"
                        variants={itemVariants}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-md font-semibold text-white truncate">{threat.names[0]}</h3>
                              {threat.names.length > 1 && (
                                <p className="text-xs text-gray-500 mt-1">+{threat.names.length - 1} aliases</p>
                              )}
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                threat.severity === "Critical"
                                  ? "bg-red-900/30 text-red-400 border border-red-900/50"
                                  : threat.severity === "High"
                                  ? "bg-orange-900/30 text-orange-400 border border-orange-900/50"
                                  : threat.severity === "Medium"
                                  ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50"
                                  : "bg-blue-900/30 text-blue-400 border border-blue-900/50"
                              }`}
                            >
                              {threat.severity === "Critical" && <FaExclamationTriangle className="mr-1" />}
                              {threat.severity === "High" && <FaExclamationCircle className="mr-1" />}
                              {threat.severity}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex text-gray-400 text-sm">
                              <FaTag className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                              <span>{threat.type}</span>
                            </div>
                            <div className="flex text-gray-400 text-sm">
                              <FaCalendarAlt className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                              <span>{threat.date}</span>
                            </div>
                            {threat.stolen_mod && (
                              <div className="flex text-gray-400 text-sm">
                                <FaCode className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                                <span>Stolen from: {threat.stolen_mod}</span>
                              </div>
                            )}
                            {threat.triggered_rules && threat.triggered_rules.length > 0 && (
                              <div className="flex text-red-400 text-sm">
                                <FaExclamationCircle className="mt-0.5 mr-2 text-red-500 flex-shrink-0" />
                                <span>{threat.triggered_rules.length} MLVScan rules triggered</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-300 text-sm line-clamp-2 mb-4">{threat.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                              onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
                            >
                              <FaEye className="mr-1.5" />
                              View Details
                            </Button>
                            
                            <div className="flex space-x-2">
                              {threat.vt_link && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                                  onClick={() => window.open(threat.vt_link, "_blank", "noopener noreferrer")}
                                  title="View on VirusTotal"
                                >
                                  <FaShieldAlt />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-3 py-8 text-center text-gray-400">
                      No threats found matching your search criteria.
                    </div>
                  )}
                </motion.div>
              )}

              <AnimatePresence>
                {selectedThreat !== null && (
                  <motion.div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      ref={modalRef}
                      className="bg-gray-900/95 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      {(() => {
                        const threat = threats.find(
                          (t) => t.id === selectedThreat
                        );
                        if (!threat) return null;

                        return (
                          <div>
                            {/* Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
                              <div className="flex items-center">
                                <div className={`
                                  w-12 h-12 flex items-center justify-center rounded-full mr-4
                                  ${threat.severity === "Critical" ? "bg-red-900/30 text-red-500" :
                                    threat.severity === "High" ? "bg-orange-900/30 text-orange-500" :
                                    threat.severity === "Medium" ? "bg-yellow-900/30 text-yellow-500" :
                                    "bg-blue-900/30 text-blue-500"
                                  }
                                `}>
                                  {threat.severity === "Critical" && <FaExclamationTriangle className="text-2xl" />}
                                  {threat.severity === "High" && <FaExclamationCircle className="text-2xl" />}
                                  {threat.severity === "Medium" && <FaCircle className="text-2xl" />}
                                  {threat.severity === "Low" && <FaInfoCircle className="text-2xl" />}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white flex items-center">
                                    {threat.names[0]}
                                  </h3>
                                  <div className="flex items-center text-sm text-gray-400 mt-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                                      threat.severity === "Critical"
                                        ? "bg-red-900/30 text-red-400 border border-red-900/50"
                                        : threat.severity === "High"
                                        ? "bg-orange-900/30 text-orange-400 border border-orange-900/50"
                                        : threat.severity === "Medium"
                                        ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50"
                                        : "bg-blue-900/30 text-blue-400 border border-blue-900/50"
                                    }`}>
                                      {threat.severity}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="ml-2">{threat.type}</span>
                                    <span className="text-gray-500 mx-2">•</span>
                                    <span>{threat.date}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                                onClick={() => setSelectedThreat(null)}
                              >
                                <FaTimes />
                              </Button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                              {/* Quick Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                                  <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Source Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                      <span className="text-gray-500 w-24">Source:</span>
                                      <span className="text-white">{threat.source}</span>
                                    </div>
                                    {threat.stolen_mod && (
                                      <div className="flex items-center text-sm">
                                        <span className="text-gray-500 w-24">Stolen From:</span>
                                        <span className="text-white">{threat.stolen_mod}</span>
                                      </div>
                                    )}
                                    {threat.stolen_mod_link && (
                                      <div className="flex items-center text-sm mt-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/20 text-xs"
                                          onClick={() => window.open(threat.stolen_mod_link, "_blank", "noopener noreferrer")}
                                        >
                                          View Original Mod
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                                  <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Threat Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                      <span className="text-gray-500 w-24">Type:</span>
                                      <span className="text-white">{threat.type}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <span className="text-gray-500 w-24">Severity:</span>
                                      <span className={`${
                                        threat.severity === "Critical" ? "text-red-400" :
                                        threat.severity === "High" ? "text-orange-400" :
                                        threat.severity === "Medium" ? "text-yellow-400" :
                                        "text-blue-400"
                                      }`}>{threat.severity}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <span className="text-gray-500 w-24">Detected:</span>
                                      <span className="text-white">{threat.date}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Description */}
                              <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Description</h4>
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                                  <p className="text-gray-300">{threat.description}</p>
                                </div>
                              </div>
                              
                              {/* Aliases */}
                              {threat.names.length > 1 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Known Aliases</h4>
                                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 flex flex-wrap gap-2">
                                    {threat.names.map((name, index) => (
                                      <span 
                                        key={index}
                                        className="bg-gray-900/50 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700"
                                      >
                                        {name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Techniques */}
                              <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Malicious Techniques</h4>
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 space-y-3">
                                  {threat.techniques.map((technique, index) => (
                                    <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-md overflow-hidden">
                                      <div 
                                        className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-800/30"
                                        onClick={() => toggleTechniqueExpansion(technique)}
                                      >
                                        <span className="text-white font-medium">{technique}</span>
                                        {expandedTechniques[technique] ? (
                                          <FaChevronUp className="text-gray-400" />
                                        ) : (
                                          <FaChevronDown className="text-gray-400" />
                                        )}
                                      </div>
                                      {expandedTechniques[technique] && (
                                        <div className="px-4 py-3 border-t border-gray-700 bg-gray-800/20 text-sm text-gray-300">
                                          {technique === "Raw Bytes" && (
                                            <p>This technique involves embedding malicious code as raw bytes that are decoded at runtime to evade detection. It's commonly used to hide malicious payloads from static analysis tools.</p>
                                          )}
                                          {technique === "Assembly Loading" && (
                                            <p>Dynamically loading assemblies from memory or from unexpected locations. This technique allows malware to execute code that isn't directly visible in the mod's main assembly.</p>
                                          )}
                                          {technique === "Shell Execution" && (
                                            <p>Executing system shell commands to perform malicious actions outside the game's process. This can be used to download additional malware or execute commands with the user's privileges.</p>
                                          )}
                                          {technique === "Embedded Assembly" && (
                                            <p>Hiding a malicious assembly inside another file or resource and extracting it at runtime. This technique is used to conceal the true purpose of the mod.</p>
                                          )}
                                          {technique === "Dll Import" && (
                                            <p>Importing and calling functions from system DLLs to perform operations that wouldn't normally be possible through the game's API. Often used to access sensitive system resources or evade detection.</p>
                                          )}
                                          {!["Raw Bytes", "Assembly Loading", "Shell Execution", "Embedded Assembly", "Dll Import"].includes(technique) && (
                                            <p>This technique involves potentially harmful behavior that could compromise your system. It was detected by MLVScan's security analysis.</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* MLVScan Triggered Rules */}
                              {threat.triggered_rules && threat.triggered_rules.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">MLVScan Triggered Rules</h4>
                                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                      {threat.triggered_rules.map((rule, index) => (
                                        <span 
                                          key={index}
                                          className="bg-red-900/30 text-red-300 px-3 py-1 rounded-md text-sm border border-red-900/50 flex items-center"
                                        >
                                          <FaExclamationCircle className="mr-2 text-xs" /> {rule}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="mt-4 text-sm text-gray-400 bg-gray-900/30 p-3 rounded border border-gray-800">
                                      <FaInfoCircle className="inline-block mr-2 text-blue-400" />
                                      These are the specific MLVScan security rules that were triggered during analysis of this mod.
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* File Hash */}
                              <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">File Identifiers</h4>
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                                  <div className="mb-2 flex items-center text-sm text-gray-400">
                                    <FaFileAlt className="mr-2 text-gray-500" />
                                    SHA-256 Hash
                                  </div>
                                  <div className="relative">
                                    <code className="block p-3 bg-gray-950 rounded text-gray-400 text-xs overflow-x-auto font-mono border border-gray-800 pr-12">
                                      {threat.hash}
                                    </code>
                                    <button
                                      className={`absolute right-2 top-2 p-2 rounded-md ${
                                        copiedHash === threat.hash 
                                          ? "text-green-400 bg-green-900/20" 
                                          : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                                      }`}
                                      onClick={() => copyToClipboard(threat.hash)}
                                      title="Copy hash"
                                    >
                                      {copiedHash === threat.hash ? <FaCheck /> : <FaCopy />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex flex-wrap gap-3 mt-8">
                                {threat.vt_link && (
                                  <Button
                                    className="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950"
                                    onClick={() => window.open(threat.vt_link, "_blank", "noopener noreferrer")}
                                  >
                                    <FaShieldAlt className="mr-2" />
                                    View on VirusTotal
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                  onClick={() => setSelectedThreat(null)}
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ThreatsDatabase; 