import { useEffect, useRef, useCallback } from 'react'

const COLORS = [
  { r: 124, g: 58, b: 237 },  // purple
  { r: 6, g: 182, b: 212 },   // cyan
  { r: 236, g: 72, b: 153 },  // pink
  { r: 59, g: 130, b: 246 },  // blue
]

const MOUSE_RADIUS = 280
const MOUSE_PUSH_FORCE = 0.12
const MOUSE_TRAIL_LENGTH = 12

class Particle {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = (Math.random() - 0.5) * 0.4
    this.radius = Math.random() * 2 + 1
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.pulsePhase = Math.random() * Math.PI * 2
    this.pulseSpeed = 0.02 + Math.random() * 0.03
    this.isHub = Math.random() < 0.12
    if (this.isHub) this.radius = Math.random() * 2 + 3
    this.activation = 0
    this.activationDecay = 0.015 + Math.random() * 0.01
  }

  update(w, h, mx, my, mouseActive, mouseSpeed) {
    if (mouseActive) {
      const dx = this.x - mx
      const dy = this.y - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS && dist > 1) {
        // Repulsion — particles push away from cursor
        const strength = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
        const force = strength * strength * MOUSE_PUSH_FORCE * (1 + mouseSpeed * 0.02)
        this.vx += (dx / dist) * force
        this.vy += (dy / dist) * force

        // Activate particles near cursor
        if (dist < MOUSE_RADIUS * 0.5) {
          this.activation = Math.max(this.activation, strength * 0.8)
        }
      }
    }

    // Friction
    this.vx *= 0.985
    this.vy *= 0.985

    this.x += this.vx
    this.y += this.vy

    // Wrap around edges
    if (this.x < -20) this.x = w + 20
    if (this.x > w + 20) this.x = -20
    if (this.y < -20) this.y = h + 20
    if (this.y > h + 20) this.y = -20

    this.pulsePhase += this.pulseSpeed

    if (this.activation > 0) {
      this.activation -= this.activationDecay
      if (this.activation < 0) this.activation = 0
    }
  }
}

class Signal {
  constructor(fromIdx, toIdx) {
    this.fromIdx = fromIdx
    this.toIdx = toIdx
    this.progress = 0
    this.speed = 0.008 + Math.random() * 0.012
    this.alive = true
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  update(particles) {
    this.progress += this.speed
    if (this.progress >= 1) {
      particles[this.toIdx].activation = 1
      this.alive = false
    }
  }
}

export default function NeuralNetwork() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    particles: [],
    signals: [],
    mouse: { x: 0, y: 0, active: false, speed: 0, prevX: 0, prevY: 0 },
    mouseTrail: [],
    animId: null,
    lastSignalTime: 0,
  })

  const init = useCallback((canvas) => {
    const w = canvas.width
    const h = canvas.height
    const count = Math.min(Math.floor((w * h) / 12000), 120)
    const particles = []
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(w, h))
    }
    stateRef.current.particles = particles
    stateRef.current.signals = []
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const state = stateRef.current

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init(canvas)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e) => {
      const m = state.mouse
      m.prevX = m.x
      m.prevY = m.y
      m.x = e.clientX
      m.y = e.clientY
      m.speed = Math.sqrt((m.x - m.prevX) ** 2 + (m.y - m.prevY) ** 2)
      m.active = true

      // Add trail point
      state.mouseTrail.push({ x: m.x, y: m.y, alpha: 1 })
      if (state.mouseTrail.length > MOUSE_TRAIL_LENGTH) {
        state.mouseTrail.shift()
      }

      // Burst signals from nearby particles when moving fast
      if (m.speed > 8) {
        const { particles, signals } = state
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - m.x
          const dy = particles[i].y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            // Find a random connected neighbor to send signal to
            for (let j = 0; j < particles.length; j++) {
              if (i === j) continue
              const ddx = particles[i].x - particles[j].x
              const ddy = particles[i].y - particles[j].y
              if (ddx * ddx + ddy * ddy < 150 * 150) {
                if (signals.length < 80) {
                  signals.push(new Signal(i, j))
                }
                break
              }
            }
          }
        }
      }
    }
    const onMouseLeave = () => {
      state.mouse.active = false
      state.mouse.speed = 0
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onMouseLeave)

    const CONNECTION_DIST = 150
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST

    const draw = (time) => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const { particles, signals, mouse, mouseTrail } = state

      // Update particles
      for (const p of particles) {
        p.update(w, h, mouse.x, mouse.y, mouse.active, mouse.speed)
      }

      // Draw mouse trail
      if (mouse.active && mouseTrail.length > 1) {
        for (let i = 0; i < mouseTrail.length; i++) {
          const t = mouseTrail[i]
          t.alpha *= 0.88
          const size = (i / mouseTrail.length) * 4 + 1
          const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, size * 3)
          grad.addColorStop(0, `rgba(124, 58, 237, ${t.alpha * 0.5})`)
          grad.addColorStop(0.5, `rgba(6, 182, 212, ${t.alpha * 0.3})`)
          grad.addColorStop(1, `rgba(236, 72, 153, 0)`)
          ctx.beginPath()
          ctx.arc(t.x, t.y, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }
        // Remove dead trail points
        while (mouseTrail.length > 0 && mouseTrail[0].alpha < 0.01) {
          mouseTrail.shift()
        }
      }

      // Draw mouse glow ring
      if (mouse.active) {
        const glowIntensity = Math.min(mouse.speed / 20, 1) * 0.2 + 0.05
        const ringGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS)
        ringGrad.addColorStop(0, `rgba(124, 58, 237, ${glowIntensity})`)
        ringGrad.addColorStop(0.3, `rgba(6, 182, 212, ${glowIntensity * 0.5})`)
        ringGrad.addColorStop(1, `rgba(6, 182, 212, 0)`)
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = ringGrad
        ctx.fill()

        // Cursor crosshair dot
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + glowIntensity})`
        ctx.fill()
      }

      // Draw mouse connection lines to nearby particles
      if (mouse.active) {
        for (const p of particles) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS * 0.8) {
            const alpha = (1 - dist / (MOUSE_RADIUS * 0.8)) * 0.4
            const { r, g, b } = p.color
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // Find connections and draw them
      const connections = []
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < CONNECTION_DIST_SQ) {
            const dist = Math.sqrt(distSq)
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25
            connections.push([i, j, alpha])

            const ci = particles[i].color
            const cj = particles[j].color
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            )
            grad.addColorStop(0, `rgba(${ci.r},${ci.g},${ci.b},${alpha})`)
            grad.addColorStop(1, `rgba(${cj.r},${cj.g},${cj.b},${alpha})`)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Spawn signals periodically along connections
      if (connections.length > 0 && time - state.lastSignalTime > 300) {
        const [fi, ti] = connections[Math.floor(Math.random() * connections.length)]
        signals.push(new Signal(fi, ti))
        state.lastSignalTime = time
        if (Math.random() < 0.3) {
          signals.push(new Signal(ti, fi))
        }
      }

      // Update and draw signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]
        s.update(particles)
        if (!s.alive) {
          signals.splice(i, 1)
          continue
        }
        const from = particles[s.fromIdx]
        const to = particles[s.toIdx]
        const sx = from.x + (to.x - from.x) * s.progress
        const sy = from.y + (to.y - from.y) * s.progress
        const glowSize = 4 + s.progress * 3
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowSize)
        grad.addColorStop(0, `rgba(${s.color.r},${s.color.g},${s.color.b},0.9)`)
        grad.addColorStop(1, `rgba(${s.color.r},${s.color.g},${s.color.b},0)`)
        ctx.beginPath()
        ctx.arc(sx, sy, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // Draw particles
      for (const p of particles) {
        const pulse = Math.sin(p.pulsePhase) * 0.3 + 0.7
        const r = p.radius * pulse
        const { color } = p

        // Glow from activation
        if (p.activation > 0) {
          const glowR = r + 12 * p.activation
          const actGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
          actGrad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${0.6 * p.activation})`)
          actGrad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
          ctx.fillStyle = actGrad
          ctx.fill()
        }

        // Core glow
        const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3)
        coreGrad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${0.5 * pulse})`)
        coreGrad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2)
        ctx.fillStyle = coreGrad
        ctx.fill()

        // Solid center
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${0.8 * pulse})`
        ctx.fill()
      }

      // Decay mouse speed over time
      mouse.speed *= 0.9

      state.animId = requestAnimationFrame(draw)
    }

    state.animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(state.animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}
