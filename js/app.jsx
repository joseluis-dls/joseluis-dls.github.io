const GRID_OPACITY = 0.3;

const PROCESS_STEPS = [
  ['01', 'Análisis',          'Objetivos, KPIs y auditoría del proyecto.'],
  ['02', 'Diseño',            'UX, wireframes y sistema de diseño.'],
  ['03', 'Desarrollo',        'Código limpio con deploys incrementales.'],
  ['04', 'Entrega y ajustes', 'Revisión con cliente y rondas de modificaciones.'],
  ['05', 'Deploy',            'Lanzamiento, soporte y documentación.'],
];

function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [navOpen, setNavOpen]         = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const cleanup = initGrid();
    const canvas = document.getElementById('grid-canvas');
    if (canvas) canvas.style.opacity = GRID_OPACITY;
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60);
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 150) {
        setActiveSection('funnel');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => { if (cleanup) cleanup(); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const ids = ['hero', 'pitch', 'projects', 'skills', 'process', 'funnel'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.15, rootMargin: '-10% 0px -30% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const closeNav = () => setNavOpen(false);
  const navActive = (id) => activeSection === id ? 'active' : '';

  return (
    <>
      {/* ── Nav ── */}
      <nav className={navScrolled ? 'scrolled' : ''}>
        <div className="nav-logo"><span>JDS</span>.studio</div>
        <ul className={`nav-links ${navOpen ? 'open' : ''}`}>
          <li><a href="#hero"     onClick={closeNav} className={navActive('hero')}>Inicio</a></li>
          <li><a href="#pitch"    onClick={closeNav} className={navActive('pitch')}>Propuesta</a></li>
          <li><a href="#projects" onClick={closeNav} className={navActive('projects')}>Proyectos</a></li>
          <li><a href="#skills"   onClick={closeNav} className={navActive('skills')}>Skills</a></li>
          <li><a href="#process"  onClick={closeNav} className={activeSection === 'process' || activeSection === 'funnel' ? 'active' : ''}>Colaboremos</a></li>
        </ul>
        <button
          className={`nav-hamburger ${navOpen ? 'open' : ''}`}
          onClick={() => setNavOpen((v) => !v)}
          aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={navOpen}>
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section id="hero">
        <div className="hero-left">
          <div className={`hero-tag hero-anim ${AVAILABLE ? '' : 'unavailable'}`}>
            {AVAILABLE ? 'Available for projects' : 'Currently unavailable'}
          </div>
          <h1 className="hero-name hero-anim d1">
            <span className="glitch-wrap">JDS Studio</span>
          </h1>
          <p className="hero-role hero-anim d2">Desarrollo Front-End &amp; UX</p>
          <p className="hero-sub hero-anim d2">
            [Especializado en interfaces de&nbsp;<span>alto rendimiento</span>
            <br />y estéticas de&nbsp;<span>lujo</span>.]
          </p>
          <div className="hero-anim d3">
            <a href="#projects" className="btn-outline">
              <span>Explorar Proyectos</span>
              <span style={{ fontSize: 16 }}>→</span>
            </a>
          </div>
        </div>

        <div className="hero-right hero-anim d2">
          <div className="hero-stat">
            <div className="hero-stat-num"><Counter to={4} />+ <span>años</span></div>
            <div className="hero-stat-label">experiencia</div>
          </div>
          <div className="hero-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num"><Counter to={PROJECTS.length} /></div>
            <div className="hero-stat-label">proyectos desplegados</div>
          </div>
          <div className="hero-divider" />
          <div className="hero-stat">
            <div className="hero-stat-num"><Counter to={98} /><span>%</span></div>
            <div className="hero-stat-label">satisfaction rate</div>
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-arrows">
            <svg viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l6 6 6-6"/></svg>
            <svg viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l6 6 6-6"/></svg>
            <svg viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l6 6 6-6"/></svg>
          </div>
        </div>
      </section>

      {/* ── Pitch ── */}
      <section id="pitch">
        <div className="section-header fade-up">
          <div>
            <div className="section-tag">// propuesta</div>
            <h2 className="section-title">Elevemos <span style={{color:'var(--accent)'}}>tu marca</span></h2>
          </div>
          <div className="section-count">01 / 04</div>
        </div>
        <div className="pitch-grid fade-up">
          <div className="pitch-body">
            <p className="pitch-quote">
              Si vienes de uno de mis proyectos,<br />ya sabes lo que puedo hacer por el <strong>tuyo</strong>.<br /><br />
              No es solo diseño — es <strong>código</strong> limpio y <strong>criterio</strong> construido proyecto a proyecto.
            </p>
            <a className="pitch-cta" href="#funnel">
              Quiero un proyecto
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </a>
          </div>
          <PitchTerminal />
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects">
        <div className="section-header fade-up">
          <div>
            <div className="section-tag">// proyectos desplegados</div>
            <h2 className="section-title">Showroom</h2>
          </div>
          <div className="section-count">02 / 04</div>
        </div>
        <div className="bento-grid">
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <div className="section-header fade-up">
          <div>
            <div className="section-tag">// especialización</div>
            <h2 className="section-title"><span style={{color:'var(--accent)'}}>Stack</span> &amp; Skills</h2>
          </div>
          <div className="section-count">03 / 04</div>
        </div>
        <div className="terminal-window fade-up">
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
            </div>
            <div className="terminal-wintitle">jdsdev — stack</div>
          </div>
          <div className="terminal-body">
            <div className="terminal-prompt">
              <span className="terminal-ps">$ </span>
              <span className="terminal-cmd">tree</span>
            </div>
            <div className="stack-tree">
              {SKILLS.map((s, i) => {
                const isLastBranch = i === SKILLS.length - 1;
                return (
                  <div key={s.label} className="tree-branch">
                    <div className="tree-row">
                      <span className="tree-conn">{isLastBranch ? '└──' : '├──'}</span>
                      <span className="tree-dir">{s.label}</span>
                    </div>
                    {s.chips.map(([name, featured], j) => {
                      const isLastFile = j === s.chips.length - 1;
                      return (
                        <div key={name} className="tree-row">
                          <span className="tree-pipe">{isLastBranch ? '     ' : '│    '}</span>
                          <span className="tree-conn">{isLastFile ? '└──' : '├──'}</span>
                          <span className={`tree-file ${featured ? 'featured' : ''}`}>{name}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process">
        <div className="section-header fade-up">
          <div>
            <div className="section-tag">// proceso</div>
            <h2 className="section-title">Metodología</h2>
          </div>
          <div className="section-count">04 / 04</div>
        </div>
        <div className="timeline fade-up">
          {PROCESS_STEPS.map(([num, label, desc]) =>
            <div key={num} className="timeline-step">
              <div className="timeline-num">{num}</div>
              <div className="timeline-label">{label}</div>
              <div className="timeline-desc">{desc}</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Funnel ── */}
      <section id="funnel">
        <div className="funnel-grid fade-up">

          {/* Left — primary CTA */}
          <div>
            <div className="funnel-tag">// hablemos</div>
            <h2 className="funnel-title">¿Cuándo<br />empezamos?</h2>
            <p className="funnel-sub" style={{ textAlign: 'left', marginLeft: 0, marginRight: 0 }}>
              Selectivo. Rápido. Sin sorpresas.<br />Cuéntame tu idea.
            </p>
            <div className="funnel-btns">
              <a
                href="https://wa.me/523141039917?text=Hola%2C%20quiero%20hablar%20sobre%20un%20proyecto"
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer">
                <span>Iniciar por WhatsApp →</span>
              </a>
            </div>
            <div className="response-badge">
              <div className="response-time">24h</div>
              <div className="response-meta">tiempo de<br />respuesta</div>
            </div>
          </div>

          {/* Right — email form */}
          <ContactForm />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-copy">© 2026 JDS</div>
        <div className="footer-cta">
          ¿Te gusta este sitio?&nbsp;
          <a href="https://wa.me/523141039917" target="_blank" rel="noopener noreferrer">
            Hagamos uno para ti
          </a>
        </div>
        <div className="footer-socials">
          <a href="https://github.com/joseluis-dls" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
