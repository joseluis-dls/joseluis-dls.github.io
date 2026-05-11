const { useState, useEffect, useRef } = React;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

function initGrid() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let mx = 0, my = 0;
  let raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const onMouseMove = (e) => { mx = e.clientX; my = e.clientY; };
  document.addEventListener('mousemove', onMouseMove);

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const size = 48;
    const cols = Math.ceil(w / size) + 1;
    const rows = Math.ceil(h / size) + 1;
    const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const { r: red, g: green, b: blue } = hexToRgb(accentHex);

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * size;
        const y = r * size;
        const dx = x - mx, dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 280);
        const alpha = 0.08 + influence * 0.25;
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + influence * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(draw);
  }
  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    document.removeEventListener('mousemove', onMouseMove);
  };
}

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

function ProjectCard({ project, index }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600 + index * 200);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`project-card proj-${index}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}

      <div
        className="card-bg"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${project.accent}22 0%, ${project.color} 70%)`,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s',
          position: 'absolute', inset: 0
        }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <defs>
            <pattern id={`pat-${project.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke={project.accent} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pat-${project.id})`} />
        </svg>
        <div style={{
          position: 'absolute', top: 20, right: 20,
          display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
          opacity: hovered ? 0 : 1, transition: 'opacity 0.3s'
        }}>
          {project.tech.map((t) =>
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
              color: project.accent, background: project.color,
              border: `1px solid ${project.accent}44`, padding: '3px 8px'
            }}>{t}</span>
          )}
        </div>
      </div>

      <div className="card-content">
        <div className="card-label" style={{ color: project.accent }}>{project.label}</div>
        <div className="card-name">{project.name}</div>
      </div>

      <div className="card-reveal">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: project.accent, textTransform: 'uppercase' }}>
          {project.industry}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray)', maxWidth: 240, textAlign: 'center', lineHeight: 1.7, padding: '0 16px' }}>
          {project.description}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {project.metrics.map((m) =>
            <span key={m} style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
              color: project.accent, background: project.color,
              border: `1px solid ${project.accent}66`, padding: '4px 10px'
            }}>{m}</span>
          )}
        </div>
        {project.url && project.url !== '#' &&
          <a href={project.url} className="card-visit-btn" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            Ver proyecto →
          </a>
        }
      </div>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const COUNT = 55;
    const LINK_DIST = 110;
    const MOUSE_DIST = 130;
    const ACCENT = [74, 140, 247]; // #4A8CF7

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.8,
    }));

    let raf;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      // draw links between particles
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const a = (1 - d / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${a})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // draw links to mouse
      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) {
          const a = (1 - d / MOUSE_DIST) * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // draw particles
      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        const near = d < MOUSE_DIST;
        const alpha = near ? 0.9 : 0.45;
        const radius = near ? p.r * 1.6 : p.r;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

function PitchTerminal() {
  const CODE = [
    [
      { t: 'const ',    c: '#4A8CF7' },
      { t: 'deliver',   c: '#F2F2F2' },
      { t: ' = async (', c: '#F2F2F2' },
      { t: 'project',   c: '#FCA5A5' },
      { t: ') => {',    c: '#F2F2F2' },
    ],
    [
      { t: '  const ',  c: '#4A8CF7' },
      { t: 'build',     c: '#F2F2F2' },
      { t: ' = await ', c: '#4A8CF7' },
      { t: 'compile',   c: '#86EFAC' },
      { t: '(project);', c: '#F2F2F2' },
    ],
    [
      { t: '  await ',  c: '#4A8CF7' },
      { t: 'audit',     c: '#86EFAC' },
      { t: '({ target: ', c: '#F2F2F2' },
      { t: '95',        c: '#FCD34D' },
      { t: ' });',      c: '#F2F2F2' },
    ],
    [
      { t: '  // handoff + docs incluidos', c: '#4B5563' },
    ],
    [
      { t: '  return ', c: '#4A8CF7' },
      { t: 'ship',      c: '#86EFAC' },
      { t: '({ ...build, onTime: ', c: '#F2F2F2' },
      { t: 'true',      c: '#4A8CF7' },
      { t: ' });',      c: '#F2F2F2' },
    ],
    [
      { t: '};',        c: '#F2F2F2' },
    ],
  ];

  const OUT = [
    { t: '$ run deliver',                       c: '#555' },
    { t: '▸ Compiling    [████████████] 100%',  c: '#4A8CF7' },
    { t: '✓ Perf 98 · Access 100 · SEO 100',    c: '#28C840' },
    { t: '✓ LCP 1.1s  CLS 0.00  FID 0ms',       c: '#28C840' },
    { t: '✓ Deployed to production',            c: '#28C840' },
  ];

  const lineLen = (segs) => segs.reduce((s, x) => s + x.t.length, 0);

  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState('typing');
  const [outIdx, setOutIdx] = useState(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (phase !== 'typing') return;
    if (lineIdx >= CODE.length) {
      const t = setTimeout(() => setPhase('outputting'), 400);
      return () => clearTimeout(t);
    }
    const total = lineLen(CODE[lineIdx]);
    if (charIdx < total) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 28 + Math.random() * 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0); }, 90);
    return () => clearTimeout(t);
  }, [phase, lineIdx, charIdx]);

  useEffect(() => {
    if (phase !== 'outputting') return;
    if (outIdx >= OUT.length) {
      const t = setTimeout(() => setPhase('done'), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setOutIdx(i => i + 1), 360);
    return () => clearTimeout(t);
  }, [phase, outIdx]);

  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => {
      setPhase('typing'); setLineIdx(0); setCharIdx(0); setOutIdx(0);
    }, 5000);
    return () => clearTimeout(t);
  }, [phase]);

  const renderSegs = (segs, limit) => {
    let rem = limit == null ? Infinity : limit;
    return segs.map((seg, i) => {
      if (rem <= 0) return null;
      const show = seg.t.slice(0, Math.max(0, rem));
      rem -= seg.t.length;
      return show ? <span key={i} style={{ color: seg.c }}>{show}</span> : null;
    });
  };

  const cursor = <span className="pt-cursor" style={{ opacity: blink ? 1 : 0 }}>│</span>;

  return (
    <div className="terminal-window">
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="terminal-dot dot-red" />
          <span className="terminal-dot dot-yellow" />
          <span className="terminal-dot dot-green" />
        </div>
        <div className="terminal-wintitle">jdsdev — deliver.js</div>
      </div>
      <div className="terminal-body pitch-terminal-body">
        <div className="pt-code">
          {CODE.map((segs, i) => {
            if (i < lineIdx) return <div key={i} className="pt-line">{renderSegs(segs)}</div>;
            if (i === lineIdx && phase === 'typing')
              return <div key={i} className="pt-line">{renderSegs(segs, charIdx)}{cursor}</div>;
            return null;
          })}
        </div>
        {outIdx > 0 && (
          <div className="pt-output">
            {OUT.slice(0, outIdx).map((line, i) =>
              <div key={i} className="pt-line" style={{ color: line.c }}>{line.t}</div>
            )}
            {phase === 'outputting' && cursor}
          </div>
        )}
        {phase === 'done' && (
          <div className="pt-line" style={{ color: '#555', marginTop: 4 }}>
            $ {cursor}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="funnel-tag" style={{ marginBottom: 4 }}>// o envíame un correo</div>

      <div className="form-field">
        <label className="form-label" htmlFor="cf-name">Nombre</label>
        <input className="form-input" id="cf-name" name="name" type="text"
          value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cf-email">Email</label>
        <input className="form-input" id="cf-email" name="email" type="email"
          value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cf-message">Proyecto</label>
        <textarea className="form-textarea" id="cf-message" name="message"
          value={form.message} onChange={handleChange}
          placeholder="Cuéntame brevemente qué tienes en mente..." required />
      </div>

      {status === 'success' &&
        <div className="form-status success">✓ Enviado. Te respondo en menos de 24h.</div>
      }
      {status === 'error' &&
        <div className="form-status error">Algo falló. Escríbeme a hola@jdsdev.com</div>
      }

      <button className="form-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando...' : 'Enviar mensaje →'}
      </button>
    </form>
  );
}
