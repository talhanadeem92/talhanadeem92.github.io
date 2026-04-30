import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

const KEYWORDS = [
  'TensorFlow', 'PyTorch', 'Kafka', 'Spark', 'NLP', 'RAG',
  'LLM', 'BERT', 'GPT', 'CNN', 'Transformer', 'Pipeline',
  'ETL', 'Feature Store', 'MLOps', 'Kubernetes', 'Docker',
  'Embeddings', 'Vector DB', 'Fine-tuning', 'Hugging Face',
  'LangChain', 'Neural Net', 'Deep Learning', 'Gradient',
  'Attention', 'Tokenizer', 'Inference', 'Python', 'SQL',
  'Airflow', 'dbt', 'Snowflake', 'FastAPI', 'Scikit-learn',
]

const ICONS = [
  '{ }', '< />', 'λ', '∑', '∂', '→', '⊕', '⊗', '∇', '⟨ ⟩',
  '01', '10', '∞', 'μ', 'σ', 'θ', 'α', 'Δ', '⊙',
]

const MOUSE_PUSH_RADIUS = 180

export default function FloatingKeywords() {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const itemRefs = useRef([])
  const animIdRef = useRef(null)
  const offsetsRef = useRef([])

  const items = useMemo(() => {
    const all = []
    for (let i = 0; i < 18; i++) {
      const text = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]
      all.push({
        id: `kw-${i}`,
        text,
        type: 'keyword',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.5 + 0.65,
        duration: 25 + Math.random() * 35,
        driftX: (Math.random() - 0.5) * 120,
        driftY: -60 - Math.random() * 100,
      })
    }
    for (let i = 0; i < 12; i++) {
      const text = ICONS[Math.floor(Math.random() * ICONS.length)]
      all.push({
        id: `ic-${i}`,
        text,
        type: 'icon',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.6 + 0.8,
        duration: 30 + Math.random() * 40,
        driftX: (Math.random() - 0.5) * 80,
        driftY: -40 - Math.random() * 80,
      })
    }
    return all
  }, [])

  // Initialize offsets for mouse interaction
  useEffect(() => {
    offsetsRef.current = items.map(() => ({ x: 0, y: 0, scale: 1, opacity: 0 }))
  }, [items])

  // Mouse tracking
  useEffect(() => {
    const onMouse = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    const onLeave = () => {
      mouseRef.current.active = false
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // CSS animation for base drift (done via keyframes, not Framer Motion, for perf)
  // Mouse displacement via rAF
  useEffect(() => {
    const animate = () => {
      const mouse = mouseRef.current
      const offsets = offsetsRef.current
      const els = itemRefs.current

      for (let i = 0; i < els.length; i++) {
        const el = els[i]
        if (!el) continue

        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = cx - mouse.x
        const dy = cy - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        const off = offsets[i]

        if (mouse.active && dist < MOUSE_PUSH_RADIUS) {
          const strength = (MOUSE_PUSH_RADIUS - dist) / MOUSE_PUSH_RADIUS
          const pushX = (dx / dist) * strength * 60
          const pushY = (dy / dist) * strength * 60
          // Smooth towards target
          off.x += (pushX - off.x) * 0.15
          off.y += (pushY - off.y) * 0.15
          off.scale = 1 + strength * 0.5
          off.opacity = strength * 0.35
        } else {
          // Spring back
          off.x *= 0.92
          off.y *= 0.92
          off.scale += (1 - off.scale) * 0.08
          off.opacity *= 0.92
        }

        el.style.transform = `translate(${off.x}px, ${off.y}px) scale(${off.scale})`
        el.style.opacity = 0.07 + off.opacity
      }

      animIdRef.current = requestAnimationFrame(animate)
    }

    animIdRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animIdRef.current)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <span
          key={item.id}
          ref={(el) => { itemRefs.current[i] = el }}
          className={`absolute select-none whitespace-nowrap transition-none ${
            item.type === 'keyword'
              ? 'font-mono text-purple-400 font-semibold'
              : 'font-mono text-cyan-400 font-bold'
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            opacity: 0.07,
            animation: `floatKeyword ${item.duration}s linear infinite`,
            animationDelay: `${Math.random() * -30}s`,
            '--drift-x': `${item.driftX}px`,
            '--drift-y': `${item.driftY}px`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  )
}
