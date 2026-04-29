import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionTitle } from './About'

const experiences = [
  {
    company: 'CareCloud (MTBC)',
    role: 'Junior AI Engineer',
    period: 'May 2025 – Present',
    location: 'Lahore, Pakistan',
    color: 'from-purple-600 to-cyan-500',
    bullets: [
      'Engineered RAG pipelines with embeddings and vector search for ICD/CPT clinical code prediction.',
      'Built LLM integrations for intelligent retrieval and summarization of clinical documentation.',
      'Implemented intelligent Prior Authorization automation workflows to streamline insurance approval processes.',
      'Automated the UnitedHealthcare (UHC) portal using Playwright, reducing manual effort and accelerating authorization processing.',
    ],
  },
  {
    company: 'Techlogix',
    role: 'Data Analyst Intern',
    period: 'July 2024 – August 2024',
    location: 'Lahore, Pakistan',
    color: 'from-cyan-500 to-pink-500',
    bullets: [
      'Built Power BI reports and interactive dashboards for SECP financial datasets.',
      'Performed SQL data extraction, cleansing, and transformation for downstream analytics.',
      'Collaborated with senior analysts to automate recurring reporting workflows.',
    ],
  },
]

const education = {
  institution: 'Ghulam Ishaq Khan Institute of Engineering Sciences & Technology (GIKI)',
  degree: 'Bachelor of Science – Data Science',
  period: '2021 – 2025',
  cgpa: '3.1 / 4.00',
  highlights: [
    'Final Year Project: Qurify – AI Quran Chatbot (Award-Winning)',
    'Relevant coursework: Machine Learning, NLP, Big Data, Database Systems, Statistical Inference',
  ],
}

export default function Experience() {
  const ref = useRef(null)
  const eduRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const eduInView = useInView(eduRef, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <SectionTitle title="Experience" subtitle="Where I've Worked" />

        {/* Work timeline */}
        <div ref={ref} className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-600 via-cyan-500 to-pink-500 opacity-30" />

          <div className="space-y-10 pl-16">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="relative"
              >
                {/* Dot */}
                <div
                  className={`absolute -left-[42px] top-2 w-4 h-4 rounded-full bg-gradient-to-br ${exp.color} shadow-lg`}
                />

                <div className="glass-card gradient-border p-6 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-mono font-bold text-lg text-white">{exp.role}</h3>
                      <p className={`font-semibold text-sm bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{exp.period}</p>
                      <p className="text-xs text-gray-600">{exp.location}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {exp.bullets.map((b) => (
                      <li key={b} className="text-sm text-gray-400 flex gap-2">
                        <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-20">
          <SectionTitle title="Education" subtitle="Where I Studied" />

          <motion.div
            ref={eduRef}
            initial={{ opacity: 0, y: 30 }}
            animate={eduInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glass-card gradient-border p-8 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-mono font-bold text-lg text-white">{education.degree}</h3>
                <p className="text-purple-400 text-sm font-medium">{education.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-mono">{education.period}</p>
                <p className="text-xs text-cyan-400 font-mono">CGPA: {education.cgpa}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {education.highlights.map((h) => (
                <li key={h} className="text-sm text-gray-400 flex gap-2">
                  <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
