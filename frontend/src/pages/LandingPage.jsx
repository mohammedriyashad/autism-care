import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  HeartHandshake,
  Lock,
  Menu,
  MessageCircle,
  Moon,
  Network,
  Phone,
  Ribbon,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Users,
  X,
} from 'lucide-react'

const awarenessCards = [
  {
    icon: Brain,
    title: 'Communication and learning',
    text: 'Autism can shape how a child communicates, learns, plays, and understands the world.',
  },
  {
    icon: HeartHandshake,
    title: 'Every child is unique',
    text: 'Support works best when it respects each child\'s strengths, pace, comfort, and preferences.',
  },
  {
    icon: Sparkles,
    title: 'Early support matters',
    text: 'Understanding, therapy guidance, and patient routines can build confidence and independence.',
  },
]

const impactCards = [
  ['Communication Challenges', 'Some children may use few words, gestures, symbols, or assistive tools to express needs.', MessageCircle],
  ['Social Interaction Difficulties', 'Eye contact, group play, turn-taking, and social cues may feel hard or confusing.', Users],
  ['Sensory Sensitivity', 'Sounds, lights, textures, smells, or busy places can feel overwhelming.', Activity],
  ['Repetitive Behaviors', 'Repeated movements or routines can help children feel calm, safe, and organized.', Ribbon],
  ['Emotional Expression', 'Children may need extra support to name feelings and show discomfort safely.', HeartHandshake],
  ['Learning Differences', 'Visual, structured, and interest-led learning can help children grow with confidence.', BookOpen],
]

const features = [
  ['AI-based Autism Screening', 'Gentle observation tools to support early conversations with specialists.', Brain],
  ['Child Progress Tracking', 'Track milestones, goals, communication wins, and daily care notes.', BarChart3],
  ['Therapy Session Management', 'Plan sessions, reminders, activities, and caregiver follow-up tasks.', CalendarCheck],
  ['Parent Guidance Resources', 'Simple guides for routines, sensory support, communication, and home practice.', BookOpen],
  ['Mood & Behavior Monitoring', 'Understand patterns in mood, sleep, sensory triggers, and behavior changes.', Activity],
  ['Doctor/Therapist Connectivity', 'Keep families, therapists, educators, and clinicians aligned.', Stethoscope],
]

const stats = [
  ['12,500+', 'Children Supported'],
  ['48,000+', 'Therapy Sessions Conducted'],
  ['320+', 'Parent Resources Available'],
  ['180+', 'Certified Specialists'],
]

const testimonials = [
  {
    quote: 'The platform made our home routines calmer. I finally had a simple way to track progress and share notes with our therapist.',
    name: 'Priya M.',
    role: 'Parent',
  },
  {
    quote: 'The visual design is gentle and the tools are practical. It helps families understand patterns without feeling judged.',
    name: 'Dr. Aaron Lee',
    role: 'Child therapist',
  },
  {
    quote: 'I use the resources with parents after sessions. The language is clear, compassionate, and easy to act on.',
    name: 'Maya R.',
    role: 'Special educator',
  },
]

const faqs = [
  ['Is this a diagnosis tool?', 'No. It supports awareness, tracking, and preparation for conversations with qualified clinicians.'],
  ['Can parents and therapists use it together?', 'Yes. The platform is designed for shared notes, therapy plans, progress tracking, and coordinated care.'],
  ['Is the interface child-friendly?', 'Yes. The design uses calming colors, readable text, simple layouts, and accessibility controls.'],
]

function AuthModal({ mode, onClose, onSubmit, setMode }) {
  const isSignup = mode === 'signup'
  return (
    <div className="as-modal-backdrop" role="dialog" aria-modal="true" aria-label={isSignup ? 'Sign up' : 'Login'}>
      <div className="as-auth-card as-rise">
        <button className="as-icon-button as-modal-close" onClick={onClose} aria-label="Close authentication modal">
          <X size={18} />
        </button>
        <div className="as-auth-icon"><Lock size={22} /></div>
        <h2>{isSignup ? 'Create your support account' : 'Welcome back'}</h2>
        <p>{isSignup ? 'Start tracking progress and connecting with care resources.' : 'Login to continue to your dashboard.'}</p>

        <label>
          Email
          <input type="email" placeholder="parent@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Enter password" />
        </label>
        {isSignup && (
          <label>
            Role
            <select defaultValue="parent">
              <option value="parent">Parent or caregiver</option>
              <option value="therapist">Therapist</option>
              <option value="educator">Educator</option>
            </select>
          </label>
        )}
        <button className="as-button as-button-primary as-full" onClick={onSubmit}>
          {isSignup ? 'Sign Up Free' : 'Login'}
        </button>
        <button className="as-auth-switch" onClick={() => setMode(isSignup ? 'login' : 'signup')}>
          {isSignup ? 'Already registered? Login' : 'New here? Create an account'}
        </button>
      </div>
    </div>
  )
}

function AutismIllustration() {
  return (
    <div className="as-hero-visual as-float" aria-label="Illustration of a child learning with a supportive adult">
      <div className="as-orbit as-orbit-one" />
      <div className="as-orbit as-orbit-two" />
      <div className="as-visual-card as-child-card">
        <div className="as-person as-child"><span /></div>
        <div>
          <strong>Child-led learning</strong>
          <p>Visual routines, gentle prompts, and emotional safety.</p>
        </div>
      </div>
      <div className="as-visual-card as-care-card">
        <div className="as-person as-adult"><span /></div>
        <div>
          <strong>Parent + therapist support</strong>
          <p>Guidance that follows each child's pace.</p>
        </div>
      </div>
      <div className="as-progress-card">
        <div><CheckCircle2 size={18} /> Calm routine completed</div>
        <div className="as-progress-bar"><span /></div>
      </div>
      <Ribbon className="as-floating-ribbon" size={42} />
    </div>
  )
}

export default function LandingPage({ isAuthenticated, onAuthSuccess, onDashboard }) {
  const [authMode, setAuthMode] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((index) => (index + 1) % testimonials.length)
    }, 5200)
    return () => clearInterval(timer)
  }, [])

  const shellClass = useMemo(() => [
    'as-landing',
    darkMode ? 'as-dark' : 'as-light',
    largeText ? 'as-large-text' : '',
    highContrast ? 'as-high-contrast' : '',
  ].filter(Boolean).join(' '), [darkMode, largeText, highContrast])

  const openAuth = (mode) => {
    setAuthMode(mode)
    setMenuOpen(false)
  }

  const handleAuthSubmit = () => {
    onAuthSuccess()
    setAuthMode(null)
  }

  return (
    <div className={shellClass}>
      <div className="as-bg-ribbon"><Ribbon size={26} /></div>
      <header className="as-navbar">
        <a className="as-logo" href="#home" aria-label="Autism Support home">
          <span><Ribbon size={23} /></span>
          <strong>AutismCare</strong>
        </a>

        <button className="as-icon-button as-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={menuOpen ? 'open' : ''}>
          <a href="#home">Home</a>
          <a href="#about">About Autism</a>
          <a href="#features">Features</a>
          <a href="#resources">Resources</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="as-nav-actions">
          <button className="as-icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <button className="as-button as-button-primary" onClick={onDashboard}>Dashboard</button>
          ) : (
            <>
              <button className="as-button as-button-ghost" onClick={() => openAuth('login')}>Login</button>
              <button className="as-button as-button-primary" onClick={() => openAuth('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="as-hero" id="home">
          <div className="as-hero-copy as-rise">
            <div className="as-eyebrow"><Sparkles size={16} /> Support, awareness, and smarter care</div>
            <h1>Empowering Every Autistic Child to <span>Thrive</span></h1>
            <p>
              Providing awareness, early support, therapy guidance, and smart tools for children with Autism Spectrum Disorder (ASD).
            </p>
            <div className="as-hero-actions">
              <button className="as-button as-button-primary as-button-lg" onClick={() => isAuthenticated ? onDashboard() : openAuth('signup')}>
                Get Started
              </button>
              <a className="as-button as-button-soft as-button-lg" href="#about">Learn About Autism</a>
            </div>
            <div className="as-trust-row">
              <span><ShieldCheck size={17} /> Family-centered</span>
              <span><Star size={17} /> Therapist-informed</span>
              <span><HeartHandshake size={17} /> Sensory-aware</span>
            </div>
          </div>
          <AutismIllustration />
        </section>

        <section className="as-section" id="about">
          <div className="as-section-heading">
            <p>Autism awareness</p>
            <h2>What is Autism?</h2>
            <span>
              Autism Spectrum Disorder (ASD) affects communication, behavior, social interaction, and learning patterns.
              Every autistic child is unique. Early support and understanding can greatly improve development and confidence.
            </span>
          </div>
          <div className="as-card-grid as-three">
            {awarenessCards.map(({ icon: Icon, title, text }) => (
              <article className="as-glass-card" key={title}>
                <Icon size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="as-section">
          <div className="as-section-heading">
            <p>How autism may affect children</p>
            <h2>Support begins with understanding</h2>
          </div>
          <div className="as-card-grid as-six">
            {impactCards.map(([title, text, Icon]) => (
              <article className="as-support-card" key={title}>
                <div><Icon size={22} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="as-section" id="features">
          <div className="as-section-heading">
            <p>Platform features</p>
            <h2>Smart tools for families and care teams</h2>
          </div>
          <div className="as-card-grid as-three">
            {features.map(([title, text, Icon]) => (
              <article className="as-feature-card" key={title}>
                <Icon size={25} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="as-stats-section">
          {stats.map(([value, label], index) => (
            <div className="as-stat-card" style={{ '--delay': `${index * 120}ms` }} key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="as-section as-split" id="resources">
          <div>
            <div className="as-section-heading as-left">
              <p>Parent and specialist voices</p>
              <h2>Trusted by supportive care teams</h2>
            </div>
            <div className="as-testimonial-card">
              <p>"{testimonials[testimonialIndex].quote}"</p>
              <div>
                <strong>{testimonials[testimonialIndex].name}</strong>
                <span>{testimonials[testimonialIndex].role}</span>
              </div>
              <div className="as-carousel-dots">
                {testimonials.map((item, index) => (
                  <button
                    key={item.name}
                    className={index === testimonialIndex ? 'active' : ''}
                    onClick={() => setTestimonialIndex(index)}
                    aria-label={`Show testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="as-faq-card">
            <div className="as-section-heading as-left">
              <p>FAQ</p>
              <h2>Helpful answers</h2>
            </div>
            {faqs.map(([question, answer], index) => (
              <button className="as-faq-item" key={question} onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}>
                <span>{question}</span>
                <ChevronDown className={activeFaq === index ? 'open' : ''} size={18} />
                {activeFaq === index && <p>{answer}</p>}
              </button>
            ))}
          </div>
        </section>

        <section className="as-accessibility">
          <div>
            <p>Accessibility support</p>
            <h2>Make the page easier to read</h2>
          </div>
          <div>
            <button className={largeText ? 'active' : ''} onClick={() => setLargeText(!largeText)}>Large text</button>
            <button className={highContrast ? 'active' : ''} onClick={() => setHighContrast(!highContrast)}>High contrast</button>
          </div>
        </section>

        <section className="as-cta" id="contact">
          <Network size={30} />
          <h2>Join Our Supportive Community Today</h2>
          <p>Start with gentle screening, helpful resources, and coordinated support for your child and care team.</p>
          <div>
            <button className="as-button as-button-primary as-button-lg" onClick={() => isAuthenticated ? onDashboard() : openAuth('signup')}>
              Sign Up Free
            </button>
            <button className="as-button as-button-soft as-button-lg" onClick={() => openAuth('signup')}>
              Book Consultation
            </button>
          </div>
        </section>
      </main>

      <footer className="as-footer">
        <div>
          <a className="as-logo" href="#home"><span><Ribbon size={21} /></span><strong>AutismCare</strong></a>
          <p>Awareness, support, and care coordination for autistic children and the people who love and teach them.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <a href="#about">About Autism</a>
          <a href="#features">Features</a>
          <a href="#resources">Resources</a>
        </div>
        <div>
          <h3>Contact Info</h3>
          <span><Phone size={15} /> +1 555 012 4567</span>
          <span>support@autismcare.local</span>
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </div>
        <div>
          <h3>Social</h3>
          <div className="as-socials">
            <a href="#home" aria-label="Community">C</a>
            <a href="#home" aria-label="LinkedIn">in</a>
            <a href="#home" aria-label="Twitter">X</a>
          </div>
        </div>
      </footer>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSubmit={handleAuthSubmit}
          setMode={setAuthMode}
        />
      )}
    </div>
  )
}
