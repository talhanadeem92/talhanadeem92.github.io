import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import PageWrapper from './components/PageWrapper'
import NeuralNetwork from './components/NeuralNetwork'
import DataPipeline from './components/DataPipeline'
import FloatingKeywords from './components/FloatingKeywords'
import AnimatedBot from './components/AnimatedBot'

export default function App() {
  const location = useLocation()

  return (
    <div className="relative bg-[#050816] text-white min-h-screen">
      {/* Animated background layers */}
      <DataPipeline />
      <NeuralNetwork />
      <FloatingKeywords />
      <AnimatedBot />

      <Navbar />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
            <Route path="/experience" element={<PageWrapper><Experience /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
