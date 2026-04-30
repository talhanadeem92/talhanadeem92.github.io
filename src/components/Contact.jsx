import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiMail, FiGithub, FiLinkedin, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { SectionTitle } from './About'

const socials = [
  {
    icon: <FiMail size={20} />,
    label: 'Email',
    value: 'talhadogar1177@gmail.com',
    href: 'mailto:talhadogar1177@gmail.com',
    color: 'group-hover:text-pink-400',
  },
  {
    icon: <FiLinkedin size={20} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/talha-nadeem-136159268',
    href: 'https://www.linkedin.com/in/talha-nadeem-136159268/',
    color: 'group-hover:text-blue-400',
  },
  {
    icon: <FiGithub size={20} />,
    label: 'GitHub',
    value: 'github.com/talhanadeem92',
    href: 'https://github.com/talhanadeem92',
    color: 'group-hover:text-purple-400',
  },
  {
    icon: <FiPhone size={20} />,
    label: 'Phone',
    value: '+92 336 6860177',
    href: 'tel:+923366860177',
    color: 'group-hover:text-cyan-400',
  },
  {
    icon: <FiMapPin size={20} />,
    label: 'Location',
    value: 'Lahore, Pakistan',
    href: null,
    color: 'group-hover:text-emerald-400',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, message } = form
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.open(`mailto:talhadogar1177@gmail.com?subject=${subject}&body=${body}`)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section className="relative py-28 px-6">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Get In Touch" subtitle="Contact" />

        <div ref={ref} className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-gray-400 leading-relaxed">
              I&apos;m actively looking for opportunities in AI / ML engineering. Whether you have a
              project, a full-time role, or just want to connect — my inbox is always open.
            </p>

            <div className="space-y-4">
              {socials.map(({ icon, label, value, href, color }) => (
                <div key={label} className="group flex items-center gap-4">
                  <div className={`p-3 glass-card rounded-xl text-gray-400 transition-colors duration-200 ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-mono uppercase tracking-wide">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-300">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="glass-card gradient-border p-8 space-y-5"
          >
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or opportunity..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              <FiSend size={16} />
              {sent ? 'Opening your email client…' : 'Send Message'}
            </button>
          </motion.form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-20 font-mono">
          Designed & built by{' '}
          <span className="gradient-text font-semibold">Talha Nadeem</span> · 2025
        </p>
      </div>
    </section>
  )
}
