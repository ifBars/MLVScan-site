import { useState, useEffect } from 'react'
import './App.css'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import ThreatsDatabase from './components/ThreatsDatabase'
import ThreatReporting from './components/ThreatReporting'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'
import { FaArrowUp } from 'react-icons/fa'

function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden px-4 sm:px-6">
      {/* Dynamic Particle Background */}
      <ParticleBackground />
      
      <Navbar />
      <Hero />
      <Features />
      <ThreatsDatabase />
      <ThreatReporting />
      <Footer />
      
      {/* Scroll to top button */}
      <button
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-red-600 text-white shadow-lg shadow-red-900/20 z-40 transition-all duration-300 ${
          showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </div>
  )
}

export default App
