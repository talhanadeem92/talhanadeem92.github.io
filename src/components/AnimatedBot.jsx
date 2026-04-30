import { useEffect, useRef } from 'react'

/*
  Full-body Data/AI/Bot Engineer Robot
  - Head with tracking eyes, antenna with signal rings
  - Torso with glowing chest display cycling data-engineering stats
  - Left arm holds a wrench that rotates, right arm holds a data pipe with flowing particles
  - Spinning gears on shoulders
  - Tool belt with icons (Kafka, Spark, Python, Docker, etc.)
  - Hover jets / thrusters at feet
  - Chat bubbles with data engineering phrases
  - 4 mini helper-bots floating around
  - All reacts to mouse cursor
*/

const PHRASES = [
  'ETL complete ✓', 'Kafka → Spark', 'Pipeline healthy',
  'Streaming 42k/s', 'Bot deployed!', 'Scraping data…',
  'Model trained ✓', 'docker compose up', 'RAG indexing…',
  'Loss: 0.003', 'SELECT * FROM…', 'import torch',
  'Airflow DAG ✓', 'Embedding batch', 'GPU go brrr',
  'apt install nlp', 'Lambda invoked', 'Vector upsert ✓',
]

const DISPLAY_LINES = [
  'STATUS: ONLINE', 'CPU: ██████░░ 74%', 'GPU: █████░░░ 62%',
  'MEM: ███████░ 88%', 'JOBS: 14 running', 'PIPE: streaming',
  'KAFKA: 3 topics', 'SPARK: 8 cores', 'MODELS: 6 loaded',
  'LATENCY: 12ms', 'UPTIME: 99.97%', 'BOTS: 4 active',
]

const TOOL_ICONS = ['⚡', '🐍', '🐳', '⚙', '📊', '🔧']

export default function AnimatedBot() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // State
    const bot = {
      x: 0, y: 0,
      targetX: 0, targetY: 0,
      bobPhase: 0,
      eyeX: 0, eyeY: 0,
      eyeScale: 1,
      blush: 0,
      mouthOpen: 0,
      antennaAngle: 0,
      wrenchAngle: 0,
      gearAngle: 0,
      displayLine: 0,
      displayTimer: 0,
    }
    const signals = []
    const bubbles = []
    const pipeParticles = []
    let lastBubbleTime = 0

    // Mini bots
    const minis = [
      { x: 0, y: 0, vx: 0.3, vy: -0.2, size: 20, phase: 0, c: { r: 6, g: 182, b: 212 } },
      { x: 0, y: 0, vx: -0.4, vy: 0.1, size: 18, phase: 2, c: { r: 124, g: 58, b: 237 } },
      { x: 0, y: 0, vx: 0.2, vy: 0.4, size: 22, phase: 4, c: { r: 236, g: 72, b: 153 } },
      { x: 0, y: 0, vx: -0.1, vy: -0.3, size: 19, phase: 1, c: { r: 16, g: 185, b: 129 } },
    ]

    const mouse = { x: -9999, y: -9999, active: false }

    function initPositions() {
      const w = canvas.width, h = canvas.height
      bot.x = bot.targetX = w * 0.5
      bot.y = bot.targetY = h * 0.5
      minis.forEach((m, i) => {
        m.x = w * (0.1 + i * 0.25) + Math.random() * 100
        m.y = h * (0.2 + Math.random() * 0.6)
      })
    }
    initPositions()

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true }
    const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)

    // --- Helper ---
    function rr(x, y, w, h, r) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    function drawGear(cx, cy, outerR, innerR, teeth, angle, color, alpha) {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.beginPath()
      for (let i = 0; i < teeth; i++) {
        const a1 = (i / teeth) * Math.PI * 2
        const a2 = ((i + 0.35) / teeth) * Math.PI * 2
        const a3 = ((i + 0.5) / teeth) * Math.PI * 2
        const a4 = ((i + 0.85) / teeth) * Math.PI * 2
        if (i === 0) ctx.moveTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR)
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR)
        ctx.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR)
        ctx.lineTo(Math.cos(a4) * innerR, Math.sin(a4) * innerR)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(${color}, ${alpha})`
      ctx.lineWidth = 1.2
      ctx.stroke()
      // Center hole
      ctx.beginPath()
      ctx.arc(0, 0, innerR * 0.35, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.6})`
      ctx.stroke()
      ctx.restore()
    }

    function drawWrench(cx, cy, angle, size, alpha) {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.globalAlpha = alpha
      // Handle
      rr(-3, 0, 6, size, 2)
      ctx.fillStyle = 'rgba(124, 58, 237, 0.3)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
      // Jaw top
      ctx.beginPath()
      ctx.moveTo(-8, 0); ctx.lineTo(-3, 0); ctx.lineTo(-3, -4); ctx.lineTo(-10, -10)
      ctx.lineTo(-8, -4); ctx.lineTo(-8, 0)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)'
      ctx.fill()
      // Jaw bottom
      ctx.beginPath()
      ctx.moveTo(8, 0); ctx.lineTo(3, 0); ctx.lineTo(3, -4); ctx.lineTo(10, -10)
      ctx.lineTo(8, -4); ctx.lineTo(8, 0)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)'
      ctx.fill()
      ctx.restore()
    }

    function drawDataPipe(x1, y1, x2, y2, alpha, time) {
      // Pipe body
      const dx = x2 - x1, dy = y2 - y1
      const len = Math.sqrt(dx * dx + dy * dy)
      const nx = -dy / len * 4, ny = dx / len * 4
      ctx.beginPath()
      ctx.moveTo(x1 + nx, y1 + ny); ctx.lineTo(x2 + nx, y2 + ny)
      ctx.lineTo(x2 - nx, y2 - ny); ctx.lineTo(x1 - nx, y1 - ny)
      ctx.closePath()
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.12})`
      ctx.fill()
      ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.3})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Flowing data globs inside pipe
      for (let i = 0; i < 5; i++) {
        const t = ((time * 0.002 + i * 0.2) % 1)
        const px = x1 + dx * t
        const py = y1 + dy * t
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 4)
        grad.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.7})`)
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }
    }

    // --- Main draw ---
    let animId
    const animate = (time) => {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Lazy follow cursor
      if (mouse.active) {
        bot.targetX += (mouse.x * 0.12 + w * 0.5 - bot.targetX) * 0.008
        bot.targetY += (mouse.y * 0.15 + h * 0.45 - bot.targetY) * 0.008
      }
      bot.x += (bot.targetX - bot.x) * 0.02
      bot.y += (bot.targetY - bot.y) * 0.02
      bot.bobPhase += 0.02
      bot.gearAngle += 0.015
      bot.wrenchAngle = Math.sin(time * 0.002) * 0.3

      const bobY = Math.sin(bot.bobPhase) * 5
      const bx = bot.x, by = bot.y + bobY
      const S = 1 // scale factor

      // Eye tracking
      const dirX = mouse.x - bx, dirY = mouse.y - by
      const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1
      const nX = dirX / dirLen, nY = dirY / dirLen
      bot.eyeX += (nX - bot.eyeX) * 0.08
      bot.eyeY += (nY - bot.eyeY) * 0.08

      // Proximity reaction
      const dist = dirLen
      const close = 220
      if (dist < close) {
        const p = (close - dist) / close
        bot.eyeScale += (1 + p * 0.6 - bot.eyeScale) * 0.1
        bot.blush += (p - bot.blush) * 0.08
        bot.mouthOpen += (p * 1.5 - bot.mouthOpen) * 0.1
      } else {
        bot.eyeScale += (1 - bot.eyeScale) * 0.05
        bot.blush *= 0.95; bot.mouthOpen *= 0.9
      }
      bot.antennaAngle = Math.sin(time * 0.003) * 0.4 + nX * 0.3

      const ALPHA = 0.85

      // ===== MINI BOTS =====
      for (const m of minis) {
        m.x += m.vx; m.y += m.vy
        m.vx += (Math.random() - 0.5) * 0.015; m.vy += (Math.random() - 0.5) * 0.015
        m.vx *= 0.995; m.vy *= 0.995
        if (mouse.active) {
          const dx = m.x - mouse.x, dy = m.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 150 && d > 1) { const f = (150 - d) / 150 * 0.25; m.vx += (dx / d) * f; m.vy += (dy / d) * f }
        }
        if (m.x < -60) m.x = w + 60; if (m.x > w + 60) m.x = -60
        if (m.y < -60) m.y = h + 60; if (m.y > h + 60) m.y = -60
        const mb = m.y + Math.sin(time * 0.002 + m.phase) * 6
        const { r, g, b } = m.c
        ctx.save(); ctx.globalAlpha = 0.45
        // Mini body
        rr(m.x - m.size, mb - m.size * 0.7, m.size * 2, m.size * 2.2, m.size * 0.35)
        ctx.fillStyle = `rgba(${r},${g},${b}, 0.2)`; ctx.fill()
        ctx.strokeStyle = `rgba(${r},${g},${b}, 0.5)`; ctx.lineWidth = 1.2; ctx.stroke()
        // Mini eyes
        const eo = Math.sin(time * 0.001 + m.phase) * 2
        for (const s of [-1, 1]) {
          ctx.beginPath(); ctx.arc(m.x + s * m.size * 0.3 + eo, mb - m.size * 0.15, m.size * 0.16, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b}, 0.9)`; ctx.fill()
        }
        // Mini gear
        drawGear(m.x, mb + m.size * 0.5, m.size * 0.4, m.size * 0.28, 6, time * 0.003 + m.phase, `${r},${g},${b}`, 0.5)
        ctx.restore()
      }

      // ===== BIG ROBOT =====
      ctx.save()
      ctx.globalAlpha = ALPHA
      // Scale up the robot — draw at 1.6x size
      ctx.translate(bx, by)
      ctx.scale(1.6, 1.6)
      ctx.translate(-bx, -by)

      // ---- Hover thrusters / jets (feet) ----
      const feetY = by + 95
      for (const side of [-1, 1]) {
        const fx = bx + side * 18
        // Thruster cone
        ctx.beginPath()
        ctx.moveTo(fx - 8, feetY); ctx.lineTo(fx + 8, feetY)
        ctx.lineTo(fx + 5, feetY + 14); ctx.lineTo(fx - 5, feetY + 14)
        ctx.closePath()
        ctx.fillStyle = 'rgba(15, 20, 40, 0.5)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'
        ctx.lineWidth = 0.8; ctx.stroke()
        // Flame particles
        for (let i = 0; i < 3; i++) {
          const fy = feetY + 14 + i * 6 + Math.sin(time * 0.01 + side + i) * 3
          const fSize = (3 - i) * 2 + Math.sin(time * 0.008 + i) * 1
          const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fSize)
          grad.addColorStop(0, `rgba(6, 182, 212, ${0.4 - i * 0.1})`)
          grad.addColorStop(1, 'rgba(124, 58, 237, 0)')
          ctx.beginPath(); ctx.arc(fx, fy, fSize, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        }
      }

      // ---- Legs ----
      for (const side of [-1, 1]) {
        const legX = bx + side * 15
        rr(legX - 6, by + 62, 12, 35, 4)
        ctx.fillStyle = 'rgba(15, 20, 40, 0.5)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)'; ctx.lineWidth = 1; ctx.stroke()
        // Knee light
        ctx.beginPath(); ctx.arc(legX, by + 78, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + Math.sin(time * 0.004 + side) * 0.2})`; ctx.fill()
      }

      // ---- Tool belt ----
      rr(bx - 32, by + 52, 64, 12, 4)
      ctx.fillStyle = 'rgba(20, 25, 50, 0.5)'; ctx.fill()
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)'; ctx.lineWidth = 0.8; ctx.stroke()
      ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      TOOL_ICONS.forEach((ic, i) => {
        const ix = bx - 25 + i * 10
        ctx.fillStyle = `rgba(255,255,255, ${0.25 + Math.sin(time * 0.003 + i) * 0.1})`
        ctx.fillText(ic, ix, by + 58)
      })

      // ---- Torso ----
      rr(bx - 30, by + 5, 60, 50, 10)
      const torsoGrad = ctx.createLinearGradient(bx, by + 5, bx, by + 55)
      torsoGrad.addColorStop(0, 'rgba(20, 25, 50, 0.6)')
      torsoGrad.addColorStop(1, 'rgba(10, 14, 30, 0.6)')
      ctx.fillStyle = torsoGrad; ctx.fill()
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'; ctx.lineWidth = 1.2; ctx.stroke()

      // ---- Chest display ----
      rr(bx - 20, by + 12, 40, 28, 5)
      ctx.fillStyle = 'rgba(5, 8, 22, 0.8)'; ctx.fill()
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'; ctx.lineWidth = 0.8; ctx.stroke()
      // Scanline effect
      for (let sy = by + 14; sy < by + 38; sy += 3) {
        ctx.beginPath(); ctx.moveTo(bx - 18, sy); ctx.lineTo(bx + 18, sy)
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.04 + Math.sin(sy * 0.2 + time * 0.003) * 0.02})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }
      // Display text
      bot.displayTimer++
      if (bot.displayTimer > 120) { bot.displayTimer = 0; bot.displayLine = (bot.displayLine + 1) % DISPLAY_LINES.length }
      ctx.font = '8px "Space Grotesk", monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = `rgba(6, 182, 212, ${0.6 + Math.sin(time * 0.005) * 0.2})`
      ctx.fillText(DISPLAY_LINES[bot.displayLine], bx, by + 22)
      ctx.fillStyle = 'rgba(124, 58, 237, 0.5)'
      ctx.fillText(DISPLAY_LINES[(bot.displayLine + 1) % DISPLAY_LINES.length], bx, by + 32)

      // ---- Shoulder gears ----
      drawGear(bx - 34, by + 10, 10, 7, 8, bot.gearAngle, '124, 58, 237', 0.35)
      drawGear(bx + 34, by + 10, 10, 7, 8, -bot.gearAngle, '6, 182, 212', 0.35)

      // ---- Left arm (wrench) ----
      ctx.save()
      const laX = bx - 38, laY = by + 18
      // Upper arm
      ctx.beginPath(); ctx.moveTo(bx - 30, by + 15); ctx.lineTo(laX, laY + 20)
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke()
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(20, 25, 50, 0.5)'; ctx.stroke()
      // Elbow joint
      ctx.beginPath(); ctx.arc(laX, laY + 20, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)'; ctx.fill()
      // Wrench at hand
      drawWrench(laX - 6, laY + 32, bot.wrenchAngle, 22, 0.5)
      ctx.restore()

      // ---- Right arm (data pipe) ----
      const raX = bx + 38, raY = by + 18
      ctx.beginPath(); ctx.moveTo(bx + 30, by + 15); ctx.lineTo(raX, raY + 20)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke()
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(20, 25, 50, 0.5)'; ctx.stroke()
      // Elbow
      ctx.beginPath(); ctx.arc(raX, raY + 20, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(124, 58, 237, 0.3)'; ctx.fill()
      // Data pipe — the arm holds a pipe with flowing data
      drawDataPipe(raX + 4, raY + 26, raX + 4, raY + 60, 0.6, time)
      ctx.lineCap = 'butt'

      // ---- Neck ----
      rr(bx - 6, by - 5, 12, 12, 3)
      ctx.fillStyle = 'rgba(15, 20, 40, 0.5)'; ctx.fill()
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)'; ctx.lineWidth = 0.8; ctx.stroke()

      // ---- HEAD ----
      const headCY = by - 28
      // Antenna
      const tipAX = bx + Math.sin(bot.antennaAngle) * 16
      const tipAY = headCY - 38
      ctx.beginPath(); ctx.moveTo(bx, headCY - 18)
      ctx.quadraticCurveTo(bx + Math.sin(bot.antennaAngle) * 8, headCY - 28, tipAX, tipAY)
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.45)'; ctx.lineWidth = 2; ctx.stroke()
      ctx.beginPath(); ctx.arc(tipAX, tipAY, 4, 0, Math.PI * 2)
      const aPulse = Math.sin(time * 0.005) * 0.3 + 0.7
      ctx.fillStyle = `rgba(6, 182, 212, ${aPulse})`; ctx.fill()
      // Antenna glow
      const aGlow = ctx.createRadialGradient(tipAX, tipAY, 2, tipAX, tipAY, 14)
      aGlow.addColorStop(0, `rgba(6, 182, 212, ${aPulse * 0.35})`); aGlow.addColorStop(1, 'rgba(6, 182, 212, 0)')
      ctx.beginPath(); ctx.arc(tipAX, tipAY, 14, 0, Math.PI * 2); ctx.fillStyle = aGlow; ctx.fill()

      // Signal rings
      if (time % 70 < 2) {
        signals.push({ x: tipAX, y: tipAY, r: 4, a: 0.5,
          c: dist < close ? { r: 236, g: 72, b: 153 } : { r: 6, g: 182, b: 212 },
        })
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]; s.r += 1; s.a -= 0.01
        if (s.a <= 0) { signals.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${s.c.r},${s.c.g},${s.c.b},${s.a})`; ctx.lineWidth = 1.2; ctx.stroke()
      }
      if (signals.length > 15) signals.splice(0, signals.length - 15)

      // Ears
      for (const side of [-1, 1]) {
        const ex = bx + side * 37
        rr(ex - 5, headCY - 10, 10, 20, 4)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)'; ctx.fill()
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)'; ctx.lineWidth = 0.8; ctx.stroke()
        ctx.beginPath(); ctx.arc(ex, headCY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${0.35 + Math.sin(time * 0.003 + side) * 0.25})`; ctx.fill()
      }

      // Head shape
      rr(bx - 32, headCY - 20, 64, 40, 14)
      const hGrad = ctx.createLinearGradient(bx, headCY - 20, bx, headCY + 20)
      hGrad.addColorStop(0, 'rgba(20, 25, 50, 0.65)'); hGrad.addColorStop(1, 'rgba(10, 14, 30, 0.65)')
      ctx.fillStyle = hGrad; ctx.fill()
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'; ctx.lineWidth = 1.2; ctx.stroke()

      // Visor
      rr(bx - 24, headCY - 12, 48, 20, 8)
      ctx.fillStyle = 'rgba(124, 58, 237, 0.06)'; ctx.fill()
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)'; ctx.lineWidth = 0.6; ctx.stroke()

      // Eyes
      const eyeCY = headCY - 3
      for (const side of [-1, 1]) {
        const ecx = bx + side * 12 + bot.eyeX * 4
        const ecy = eyeCY + bot.eyeY * 3
        const er = 7 * bot.eyeScale
        // Glow
        const eG = ctx.createRadialGradient(ecx, ecy, er * 0.3, ecx, ecy, er * 2.2)
        eG.addColorStop(0, 'rgba(6, 182, 212, 0.35)'); eG.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.beginPath(); ctx.arc(ecx, ecy, er * 2.2, 0, Math.PI * 2); ctx.fillStyle = eG; ctx.fill()
        // Eye
        ctx.beginPath(); ctx.arc(ecx, ecy, er, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.85)'; ctx.fill()
        // Pupil
        ctx.beginPath(); ctx.arc(ecx + bot.eyeX * 2, ecy + bot.eyeY * 1.5, er * 0.42, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill()
        // Highlight
        ctx.beginPath(); ctx.arc(ecx - 1.5, ecy - 2, er * 0.18, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill()
      }

      // Blush
      if (bot.blush > 0.01) {
        for (const side of [-1, 1]) {
          ctx.beginPath(); ctx.arc(bx + side * 18, eyeCY + 8, 5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(236, 72, 153, ${bot.blush * 0.25})`; ctx.fill()
        }
      }

      // Mouth
      const mouthY = headCY + 12
      if (bot.mouthOpen > 0.1) {
        ctx.beginPath(); ctx.ellipse(bx + bot.eyeX * 2, mouthY, 6, 3 * bot.mouthOpen, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.45)'; ctx.fill()
      } else {
        ctx.beginPath(); ctx.arc(bx + bot.eyeX * 2, mouthY - 1, 8, 0.15 * Math.PI, 0.85 * Math.PI)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'; ctx.lineWidth = 1.2; ctx.stroke()
      }

      ctx.restore() // end bot ALPHA

      // ===== CHAT BUBBLES =====
      if (time - lastBubbleTime > 3500) {
        bubbles.push({
          text: PHRASES[Math.floor(Math.random() * PHRASES.length)],
          x: bx - 50, y: headCY - 30, a: 0, phase: 0, timer: 0,
        })
        lastBubbleTime = time
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]; b.timer++
        if (b.phase === 0) { b.a += 0.02; if (b.a >= 0.5) { b.phase = 1; b.timer = 0 } }
        else if (b.phase === 1) { b.y -= 0.12; if (b.timer > 130) b.phase = 2 }
        else { b.a -= 0.012; b.y -= 0.25; if (b.a <= 0) { bubbles.splice(i, 1); continue } }

        ctx.save(); ctx.globalAlpha = b.a
        ctx.font = '10px "Space Grotesk", monospace'
        const tw = ctx.measureText(b.text).width + 14
        const bx2 = b.x - tw, by2 = b.y - 12
        rr(bx2, by2, tw, 22, 7)
        ctx.fillStyle = 'rgba(15, 20, 40, 0.85)'; ctx.fill()
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.35)'; ctx.lineWidth = 0.7; ctx.stroke()
        // Pointer
        ctx.beginPath()
        ctx.moveTo(bx2 + tw - 8, by2 + 22)
        ctx.lineTo(bx2 + tw, by2 + 28)
        ctx.lineTo(bx2 + tw - 16, by2 + 22)
        ctx.fillStyle = 'rgba(15, 20, 40, 0.85)'; ctx.fill()
        // Text
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)'
        ctx.textBaseline = 'middle'; ctx.textAlign = 'left'
        ctx.fillText(b.text, bx2 + 7, by2 + 11)
        ctx.restore()
      }
      if (bubbles.length > 3) bubbles.splice(0, bubbles.length - 3)

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
    />
  )
}
