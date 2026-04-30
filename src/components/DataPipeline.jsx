import { useEffect, useRef, useCallback } from 'react'

/*
  DataPipeline — animated AI/Data/Bot pipeline visualization
  Shows labeled hexagonal nodes (Data, ETL, Model, NLP, Bot, API, Deploy)
  connected by curved paths with glowing data particles flowing through.
  Mouse interaction: cursor acts as an "energy source" — nearby nodes light up,
  particles accelerate toward cursor, and new sparks burst from the cursor.
*/

const COLORS = {
  purple: { r: 124, g: 58, b: 237 },
  cyan:   { r: 6, g: 182, b: 212 },
  pink:   { r: 236, g: 72, b: 153 },
  blue:   { r: 59, g: 130, b: 246 },
  green:  { r: 16, g: 185, b: 129 },
}

const PIPELINE_NODES = [
  { label: 'Data',    color: COLORS.cyan,   rx: 0.10, ry: 0.30 },
  { label: 'ETL',     color: COLORS.blue,   rx: 0.22, ry: 0.18 },
  { label: 'Model',   color: COLORS.purple, rx: 0.38, ry: 0.35 },
  { label: 'NLP',     color: COLORS.pink,   rx: 0.52, ry: 0.15 },
  { label: 'LLM',     color: COLORS.purple, rx: 0.65, ry: 0.32 },
  { label: 'RAG',     color: COLORS.cyan,   rx: 0.78, ry: 0.18 },
  { label: 'Bot',     color: COLORS.green,  rx: 0.88, ry: 0.35 },
  { label: 'API',     color: COLORS.blue,   rx: 0.50, ry: 0.50 },
  { label: 'Kafka',   color: COLORS.cyan,   rx: 0.15, ry: 0.55 },
  { label: 'Spark',   color: COLORS.pink,   rx: 0.30, ry: 0.68 },
  { label: 'Deploy',  color: COLORS.green,  rx: 0.75, ry: 0.55 },
  { label: 'Vector DB', color: COLORS.purple, rx: 0.60, ry: 0.70 },
  { label: 'Scraper', color: COLORS.green,  rx: 0.90, ry: 0.65 },
  { label: 'PyTorch', color: COLORS.pink,   rx: 0.08, ry: 0.75 },
  { label: 'Pipeline', color: COLORS.blue,  rx: 0.42, ry: 0.82 },
]

// Connections: [fromIndex, toIndex]
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [0, 8], [8, 9], [9, 7], [7, 4], [7, 10], [10, 6],
  [2, 7], [4, 11], [11, 14], [9, 14], [13, 9],
  [5, 10], [6, 12], [1, 9], [3, 7], [11, 10],
]

const MOUSE_RADIUS = 250
const NODE_RADIUS = 22

class FlowParticle {
  constructor(edgeIdx, edges, nodes) {
    this.reset(edgeIdx, edges, nodes)
  }

  reset(edgeIdx, edges, nodes) {
    this.edgeIdx = edgeIdx
    this.progress = 0
    this.speed = 0.003 + Math.random() * 0.006
    this.alive = true
    this.size = 1.5 + Math.random() * 2
    const edge = edges[edgeIdx]
    const fromColor = nodes[edge[0]].color
    const toColor = nodes[edge[1]].color
    this.color = Math.random() < 0.5 ? fromColor : toColor
  }
}

class Spark {
  constructor(x, y) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const speed = 1.5 + Math.random() * 3
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.life = 1
    this.decay = 0.015 + Math.random() * 0.025
    this.size = 1 + Math.random() * 2
    const colorArr = Object.values(COLORS)
    this.color = colorArr[Math.floor(Math.random() * colorArr.length)]
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.97
    this.vy *= 0.97
    this.life -= this.decay
  }
}

export default function DataPipeline() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)

  const buildState = useCallback((w, h) => {
    const nodes = PIPELINE_NODES.map((n) => ({
      ...n,
      x: n.rx * w,
      y: n.ry * h,
      activation: 0,
      pulsePhase: Math.random() * Math.PI * 2,
    }))

    const particles = []
    for (let i = 0; i < EDGES.length * 3; i++) {
      const edgeIdx = i % EDGES.length
      const p = new FlowParticle(edgeIdx, EDGES, nodes)
      p.progress = Math.random() // stagger start positions
      particles.push(p)
    }

    return {
      nodes,
      particles,
      sparks: [],
      mouse: { x: -9999, y: -9999, active: false, speed: 0 },
      lastSparkTime: 0,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stateRef.current = buildState(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e) => {
      const s = stateRef.current
      if (!s) return
      const prev = { x: s.mouse.x, y: s.mouse.y }
      s.mouse.x = e.clientX
      s.mouse.y = e.clientY
      s.mouse.speed = Math.sqrt((s.mouse.x - prev.x) ** 2 + (s.mouse.y - prev.y) ** 2)
      s.mouse.active = true
    }
    const onLeave = () => {
      const s = stateRef.current
      if (!s) return
      s.mouse.active = false
      s.mouse.x = -9999
      s.mouse.y = -9999
      s.mouse.speed = 0
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)

    let animId
    const draw = (time) => {
      const s = stateRef.current
      if (!s) { animId = requestAnimationFrame(draw); return }
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const { nodes, particles, sparks, mouse } = s

      // --- Draw edges (curved paths) ---
      for (const [fi, ti] of EDGES) {
        const from = nodes[fi]
        const to = nodes[ti]
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2 - 30
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.quadraticCurveTo(midX, midY, to.x, to.y)
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.06)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // --- Mouse glow aura ---
      if (mouse.active) {
        const intensity = Math.min(mouse.speed / 15, 1) * 0.15 + 0.04
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS)
        grad.addColorStop(0, `rgba(124, 58, 237, ${intensity})`)
        grad.addColorStop(0.4, `rgba(6, 182, 212, ${intensity * 0.4})`)
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // --- Mouse connection lines to nearby nodes ---
      if (mouse.active) {
        for (const node of nodes) {
          const dx = node.x - mouse.x
          const dy = node.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.3
            const { r, g, b } = node.color
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(node.x, node.y)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.setLineDash([4, 4])
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
      }

      // --- Update and draw nodes ---
      for (const node of nodes) {
        node.pulsePhase += 0.02
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7

        // Mouse proximity activation
        if (mouse.active) {
          const dx = node.x - mouse.x
          const dy = node.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const strength = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
            node.activation = Math.max(node.activation, strength)
          }
        }
        node.activation *= 0.97

        const { r, g, b } = node.color
        const baseAlpha = 0.08 + node.activation * 0.5

        // Outer glow ring
        const glowSize = NODE_RADIUS + 15 + node.activation * 20
        const glowGrad = ctx.createRadialGradient(node.x, node.y, NODE_RADIUS * 0.5, node.x, node.y, glowSize)
        glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.4 * pulse})`)
        glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = glowGrad
        ctx.fill()

        // Hexagonal node shape
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6
          const nr = NODE_RADIUS * (1 + node.activation * 0.15)
          const px = node.x + Math.cos(angle) * nr
          const py = node.y + Math.sin(angle) * nr
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.3})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${baseAlpha * 1.5 * pulse})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Label
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.2 + node.activation * 0.7})`
        ctx.font = `${10 + node.activation * 3}px "Space Grotesk", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.label, node.x, node.y)
      }

      // --- Update and draw flow particles ---
      for (const p of particles) {
        const edge = EDGES[p.edgeIdx]
        const from = nodes[edge[0]]
        const to = nodes[edge[1]]
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2 - 30

        // Mouse boost: speed up particles near cursor
        let speedMul = 1
        const t = p.progress
        // Quadratic bezier position
        const px = (1-t)*(1-t)*from.x + 2*(1-t)*t*midX + t*t*to.x
        const py = (1-t)*(1-t)*from.y + 2*(1-t)*t*midY + t*t*to.y

        if (mouse.active) {
          const dx = px - mouse.x
          const dy = py - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS * 0.7) {
            speedMul = 1 + (1 - dist / (MOUSE_RADIUS * 0.7)) * 4
          }
        }

        p.progress += p.speed * speedMul

        if (p.progress >= 1) {
          // Arrived at destination — activate destination node
          nodes[edge[1]].activation = Math.min(nodes[edge[1]].activation + 0.3, 1)
          // Reset on a random edge
          p.reset(Math.floor(Math.random() * EDGES.length), EDGES, nodes)
        }

        // Draw particle
        const { r, g, b } = p.color
        const t2 = p.progress
        const drawX = (1-t2)*(1-t2)*from.x + 2*(1-t2)*t2*midX + t2*t2*to.x
        const drawY = (1-t2)*(1-t2)*from.y + 2*(1-t2)*t2*midY + t2*t2*to.y

        const pGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.size * 3)
        pGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.8 * speedMul > 1 ? 1 : 0.6})`)
        pGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.beginPath()
        ctx.arc(drawX, drawY, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = pGrad
        ctx.fill()

        // Solid core
        ctx.beginPath()
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`
        ctx.fill()
      }

      // --- Sparks from cursor (when moving fast) ---
      if (mouse.active && mouse.speed > 5 && time - s.lastSparkTime > 30) {
        const count = Math.min(Math.floor(mouse.speed / 8), 5)
        for (let i = 0; i < count; i++) {
          sparks.push(new Spark(mouse.x, mouse.y))
        }
        s.lastSparkTime = time
      }

      // Update and draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i]
        sp.update()
        if (sp.life <= 0) { sparks.splice(i, 1); continue }
        const { r, g, b } = sp.color
        const spGrad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 2)
        spGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${sp.life * 0.8})`)
        spGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = spGrad
        ctx.fill()
      }

      // Limit sparks
      if (sparks.length > 100) sparks.splice(0, sparks.length - 100)

      mouse.speed *= 0.9

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [buildState])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  )
}
