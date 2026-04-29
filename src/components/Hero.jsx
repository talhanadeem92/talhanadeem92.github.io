import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi'
import { useEffect, useState } from 'react'

const roles = ['AI / ML Engineer', 'Data Engineer', 'Python Bot Developer', 'Web Scraping Expert', 'NLP & LLM Specialist', 'RAG Pipeline Builder']

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const full = roles[roleIdx]
    let timeout

    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIdx((i) => (i + 1) % roles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIdx])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Animated gradient blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-4"
        >
          Hello, I&apos;m
        </motion.p>

        <h1 className="font-mono font-bold text-5xl sm:text-6xl md:text-7xl mb-4 leading-tight">
          <span className="gradient-text">Talha Nadeem</span>
        </h1>

        <div className="h-12 flex items-center justify-center mb-6">
          <span className="text-xl sm:text-2xl text-gray-300 font-medium">
            {displayed}
            <span className="inline-block w-0.5 h-6 bg-purple-400 ml-1 animate-pulse" />
          </span>
        </div>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          AI / ML Engineer who builds end-to-end intelligent systems — LLM-powered RAG pipelines
          and clinical NLP at <span className="text-white font-medium">CareCloud</span>, scalable
          data engineering with Kafka &amp; Spark, and Python bots that scrape, automate, and
          deliver real business impact. Based in Lahore, Pakistan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#projects"
            className="px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 transition-transform shadow-lg shadow-purple-500/25"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full font-semibold text-sm glass-card gradient-border hover:scale-105 transition-transform"
          >
            Contact Me
          </a>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-5">
          {[
            { icon: <FiGithub size={20} />, href: 'https://github.com/talhanadeem92', label: 'GitHub' },
            { icon: <FiLinkedin size={20} />, href: 'https://www.linkedin.com/in/talha-nadeem/', label: 'LinkedIn' },
            { icon: <FiMail size={20} />, href: 'mailto:talhadogar1177@gmail.com', label: 'Email' },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="p-3 glass-card gradient-border text-gray-400 hover:text-white hover:scale-110 transition-all duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-gray-500 hover:text-purple-400 transition-colors animate-float"
        aria-label="Scroll down"
      >
        <FiArrowDown size={24} />
      </motion.a>
    </section>
  )
}
