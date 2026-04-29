import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { SectionTitle } from './About'

const projects = [
  {
    title: 'Qurify – AI Quran Chatbot',
    description:
      'Award-winning FYP. A transformer-based NLP chatbot fine-tuned on Quranic text with retrieval-augmented generation to answer Islamic queries with contextual accuracy.',
    tags: ['Python', 'Transformers', 'NLP', 'LLMs', 'RAG', 'Fine-tuning'],
    github: 'https://github.com/talhanadeem92',
    highlight: true,
    badge: '🏆 FYP Award',
  },
  {
    title: 'Real-Time Voting Platform',
    description:
      'End-to-end streaming pipeline for live vote aggregation using Apache Kafka producers/consumers, Spark Structured Streaming for transformations, and a Streamlit real-time dashboard.',
    tags: ['Apache Kafka', 'PySpark', 'Streamlit', 'Python'],
    github: 'https://github.com/talhanadeem92',
  },
  {
    title: 'Customer360 Analytics Dashboard',
    description:
      'Comprehensive business intelligence solution for a retail client — SQL Server data model, Python ETL pipelines, and multi-page Power BI reports with drill-through and bookmarks.',
    tags: ['Power BI', 'Python', 'SQL Server', 'DAX'],
    github: 'https://github.com/talhanadeem92',
  },
  {
    title: 'Laptop Advisor – ML Recommender',
    description:
      'Scikit-learn recommendation engine that predicts the best laptop for a user based on use-case preferences, budget, and specs. Includes feature engineering and model comparison.',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'ML'],
    github: 'https://github.com/talhanadeem92',
  },
  {
    title: 'Shop Insights – Statistical Analysis',
    description:
      'Exploratory data analysis and inferential statistics on retail shop datasets. Hypothesis testing, correlation analysis, and publication-quality visualizations.',
    tags: ['Python', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib'],
    github: 'https://github.com/talhanadeem92',
  },
  {
    title: 'Prior Authorization Automation',
    description:
      'Playwright-based RPA bot for automating UHC insurance portal workflows, reducing manual processing time for clinical documentation at CareCloud.',
    tags: ['Playwright', 'Python', 'Automation', 'RPA'],
    github: null,
    badge: '🏢 Professional',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="projects" className="relative py-28 px-6">
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Projects" subtitle="What I've Built" />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.title}
              custom={i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={cardVariants}
              className={`glass-card ${proj.highlight ? 'gradient-border' : 'border border-white/5'} p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-mono font-semibold text-base text-white leading-snug">
                  {proj.title}
                </h3>
                {proj.badge && (
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                    {proj.badge}
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed flex-1">{proj.description}</p>

              <div className="flex flex-wrap gap-2">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-1">
                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <FiGithub size={14} /> Code
                  </a>
                )}
                {proj.demo && (
                  <a
                    href={proj.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <FiExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/talhanadeem92"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card gradient-border text-sm font-medium hover:scale-105 transition-transform"
          >
            <FiGithub /> View All on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
