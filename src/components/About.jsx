import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const skills = [
  { category: 'Languages', items: ['Python', 'SQL', 'R', 'C++'] },
  { category: 'AI / ML', items: ['NLP', 'LLMs', 'RAG', 'Scikit-learn', 'Transformers'] },
  { category: 'Big Data', items: ['Apache Kafka', 'PySpark', 'Apache Airflow'] },
  { category: 'Databases', items: ['SQL Server', 'MySQL', 'MongoDB', 'Cassandra', 'SQLite'] },
  { category: 'Automation & Bots', items: ['Playwright', 'Selenium', 'Web Scraping', 'Python Bots', 'RPA'] },
  { category: 'DevOps & Tools', items: ['Docker', 'Git'] },
  { category: 'Visualization', items: ['Power BI', 'Tableau', 'Matplotlib'] },
]

const tagColors = [
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
]

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <p className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-2">{subtitle}</p>
      <h2 className="font-mono font-bold text-4xl sm:text-5xl gradient-text">{title}</h2>
      <div className="mx-auto mt-4 w-24 h-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500" />
    </div>
  )
}

export { SectionTitle }

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-28 px-6 max-w-6xl mx-auto">
      <SectionTitle title="About Me" subtitle="Who I Am" />

      <div ref={ref} className="grid md:grid-cols-2 gap-12 items-start">
        {/* Bio card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass-card gradient-border p-8 space-y-5"
        >
          <h3 className="font-mono font-semibold text-xl text-white">
            AI Engineer · Data Engineer · <span className="gradient-text">Bot Builder</span>
          </h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            I&apos;m a Data Science graduate from GIK Institute (CGPA 3.1/4.0, 2021–2025) and a
            Junior AI Engineer at <span className="text-white font-medium">CareCloud (MTBC)</span>,
            where I architect RAG pipelines, integrate LLMs into clinical workflows, and build NLP
            solutions for intelligent ICD/CPT code prediction and prior authorization automation.
          </p>
          <p className="text-gray-400 leading-relaxed text-sm">
            I also specialize in <span className="text-white font-medium">Data Engineering</span> —
            crafting end-to-end streaming pipelines with Kafka, Spark, and Airflow — and in building
            <span className="text-white font-medium"> Python bots &amp; web scrapers</span> that
            automate complex portals, harvest structured data at scale, and eliminate repetitive
            manual work.
          </p>
          <p className="text-gray-400 leading-relaxed text-sm">
            My award-winning final-year project <span className="text-white font-medium">Qurify</span> —
            an AI Quran chatbot powered by fine-tuned transformers and RAG — is a testament to
            combining rigorous engineering with meaningful, real-world impact.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="text-sm text-gray-400">📍 Lahore, Pakistan</span>
            <span className="text-sm text-gray-400">🎓 B.S. Data Science, GIKI</span>
            <span className="text-sm text-gray-400">💼 Open to opportunities</span>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-6"
        >
          {skills.map(({ category, items }, i) => (
            <div key={category}>
              <p className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${tagColors[i % tagColors.length]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
