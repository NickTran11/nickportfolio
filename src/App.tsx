import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronRight,
  Cloud,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MonitorCog,
  Network,
  Radar,
  Shield,
  Sparkles,
  SquareTerminal
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Scene, { FocusKey } from "./components/Scene";

type SectionMeta = {
  id: string;
  label: string;
  focus: FocusKey;
};

const sectionMeta: SectionMeta[] = [
  { id: "landing", label: "Landing", focus: "none" },
  { id: "intro", label: "Intro", focus: "ring" },
  { id: "about", label: "About", focus: "king" },
  { id: "skills", label: "Skills", focus: "none" },
  { id: "projects", label: "Projects", focus: "board" },
  { id: "resume", label: "Resume", focus: "glass" },
  { id: "contact", label: "Contact", focus: "football" }
];

const skills = [
  "Network Administration",
  "Cybersecurity",
  "Industrial Networking",
  "SCADA / OT Concepts",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "HTML / CSS",
  "Git / GitHub",
  "AWS IoT",
  "ThingSpeak",
  "VirtualBox",
  "Wireshark",
  "Autopsy",
  "YARA",
  "Ghidra",
  "Incident Analysis"
];

const workFields = [
  {
    id: "cyber",
    title: "Cybersecurity & Networking",
    icon: <Shield size={18} />,
    points: [
      "Network fundamentals (LAN, TCP/IP, firewall)",
      "Basic security concepts (phishing, threats, protection)"
    ]
  },
  {
    id: "cloud",
    title: "Cloud & IT Systems",
    icon: <Cloud size={18} />,
    points: [
      "Cloud basics (AWS / Azure fundamentals)",
      "IT support, troubleshooting",
      "System setup and maintenance"
    ]
  },
  {
    id: "instrumentation",
    title: "Instrumentation & Industrial Systems (Upcoming)",
    icon: <Radar size={18} />,
    points: [
      "Currently preparing for Instrumentation Engineering Technology",
      "Interest in industrial systems, sensors, and control systems"
    ]
  },
  {
    id: "content",
    title: "Digital Content & Marketing",
    icon: <MonitorCog size={18} />,
    points: [
      "Poster and visual design",
      "Social media content creation",
      "Online promotion"
    ]
  },
  {
    id: "additional",
    title: "Additional Skills",
    icon: <SquareTerminal size={18} />,
    points: [
      "Creative development (personal projects, portfolio)",
      "Chess (~1500 Elo, strategic thinking)",
      "Chess.com account: NickTran11"
    ]
  }
];

const projects = [
  {
    title: "Phisher Bait",
    tag: "Interactive Security Game",
    description:
      "A phishing-awareness game with levels, scoring, and realistic scenarios designed to help users spot suspicious emails and social engineering tricks.",
    tech: ["HTML", "CSS", "JavaScript", "Game UX", "Cybersecurity"],
    link: "https://nicktran11.github.io/phisherbait/",
    github: "https://github.com/NickTran11/phisherbait"
  },
  {
    title: "LinuxSecurityUpdate",
    tag: "Phishing / Security Demo",
    description:
      "A class project demonstrating how deceptive update flows and automation can be used in a security-learning context to understand attack behavior and user risk.",
    tech: ["Python", "Linux", "Security Awareness", "Demo Automation"],
    link: "https://github.com/NickTran11/linuxsecurityupdate",
    github: "https://github.com/NickTran11/linuxsecurityupdate"
  },
  {
    title: "IoT Soil Moisture Monitor",
    tag: "Embedded + Cloud",
    description:
      "An IoT project using sensors and cloud dashboards to capture environmental data, display it, and push updates to online services for monitoring.",
    tech: ["Raspberry Pi Pico", "MicroPython", "ThingSpeak", "I2C Sensors"],
    link: "#contact",
    github: "https://github.com/NickTran11"
  },
  {
    title: "Industrial / OT Learning Labs",
    tag: "Networking + Automation",
    description:
      "Hands-on work across malware analysis, network tooling, industrial networking, and OT-focused learning to strengthen the bridge between IT systems and industrial environments.",
    tech: ["Wireshark", "Virtualization", "YARA", "DFIR", "Industrial Networking"],
    link: "#about",
    github: "https://github.com/NickTran11"
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: "easeOut" }
};

function useActiveSection(): { activeSection: string; progress: number } {
  const [activeSection, setActiveSection] = useState<string>("landing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = sectionMeta.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const middle = window.innerHeight * 0.5;
      let currentId = "landing";

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= middle && rect.bottom >= middle) {
          currentId = section.id;
          break;
        }
      }

      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const currentProgress = window.scrollY / maxScroll;

      setActiveSection(currentId);
      setProgress(currentProgress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { activeSection, progress };
}

export default function App() {
  const { activeSection, progress } = useActiveSection();

  const activeFocus = useMemo<FocusKey>(() => {
    return sectionMeta.find((section) => section.id === activeSection)?.focus ?? "none";
  }, [activeSection]);

  const showLandingHint = activeSection === "landing";

  return (
    <div className="app-shell">
      <Scene activeFocus={activeFocus} scrollProgress={progress} />

      {showLandingHint && (
        <div className="landing-scroll-hint">
          <span>Scroll down</span>
        </div>
      )}

      <header className="topbar">
        <a href="#intro" className="brand">
          <span className="brand-dot" />
          Bach (Nick) Tran
        </a>

        <nav className="nav">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#resume">Resume</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="ghost-button desktop-only" href="mailto:nicktranbach@gmail.com">
          Let&apos;s Talk
        </a>
      </header>

      <main>
        <section id="landing" className="screen-section landing-section" aria-label="Landing screen" />

        <section id="intro" className="screen-section intro-section">
          <div className="content-shell hero-shell">
            <motion.div className="hero-copy" {...fadeUp}>
  <h1 className="welcome-title">
    <span>Welcome</span>
  </h1>

  <p className="eyebrow hero-tagline">
    <Sparkles size={14} /> IT Networking • Cybersecurity • Instrumentation
  </p>

  <div className="hero-actions">
    <a className="primary-button" href="#projects">
      View Projects <ChevronRight size={18} />
    </a>
    <a className="secondary-button" href="#resume">
      Resume Preview
    </a>
  </div>

  <div className="social-row">
    <a href="https://www.linkedin.com/in/bach-tran-8b8bbb325/" target="_blank" rel="noreferrer">
      <Linkedin size={18} /> LinkedIn
    </a>
    <a href="https://github.com/NickTran11" target="_blank" rel="noreferrer">
      <Github size={18} /> GitHub
    </a>
    <a href="mailto:nicktranbach@gmail.com">
      <Mail size={18} /> Email
    </a>
  </div>
</motion.div>

            <motion.div className="hero-photo-card" {...fadeUp}>
  <div className="hero-photo-wrap">
    <img src="/profile.png" alt="Nick Tran portrait" className="hero-photo clean-photo" />
  </div>
</motion.div>
          </div>
        </section>

        <section id="about" className="screen-section page-section">
          <motion.div className="content-shell section-stack section-left-clean" {...fadeUp}>
            <div className="section-heading">
              <span className="section-kicker">About Me</span>
              <h2>Strategy, systems, and storytelling.</h2>
            </div>

            <div className="about-grid">
              <div className="glass-card about-copy">
                <p>
                  I come from a mixed background in IT and oil &amp; gas engineering, and I enjoy building things that
                  feel both useful and memorable. My interests sit at the intersection of networking, cybersecurity,
                  industrial technology, data-driven thinking, and creative digital presentation.
                </p>
                <p>
                  Football teaches me momentum, awareness, and teamwork. Chess teaches me structure, patience, and
                  pattern recognition. I bring both into my technical work: move fast when needed, but always think
                  several steps ahead.
                </p>
              </div>

              <div className="highlight-grid">
                {highlights.map((item) => (
                  <div className="glass-card highlight-card" key={item.title}>
                    <div className="icon-badge">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="skills" className="screen-section page-section">
          <motion.div className="content-shell section-stack section-center-wide" {...fadeUp}>
            <div className="section-heading center-heading">
              <span className="section-kicker">Skills / Tools / Tech</span>
              <h2>My current technical stack.</h2>
            </div>

            <div className="skills-wrap glass-card">
              <div className="skills-intro">
                <div className="icon-badge large">
                  <Code2 size={24} />
                </div>
                <div>
                  <h3>Tools I use and concepts I am building on</h3>
                  <p>
                    A mix of frontend creation, networking, security analysis, IoT experimentation, and industrial-tech learning.
                  </p>
                </div>
              </div>

              <div className="chip-grid">
                {skills.map((skill) => (
                  <span className="skill-chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="projects" className="screen-section page-section">
          <motion.div className="content-shell section-stack section-right-offset" {...fadeUp}>
            <div className="section-heading">
              <span className="section-kicker">Projects</span>
              <h2>Selected work and experiments.</h2>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <article className="glass-card project-card" key={project.title}>
                  <div className="project-top">
                    <span className="mini-chip">{project.tag}</span>
                    <BriefcaseBusiness size={18} />
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="tech-row">
                    {project.tech.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a href={project.link} target={project.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      <ExternalLink size={16} /> View
                    </a>
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <Github size={16} /> Code
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="resume" className="screen-section page-section">
          <motion.div className="content-shell section-stack section-left-clean" {...fadeUp}>
            <div className="section-heading">
              <span className="section-kicker">Resume PDF</span>
              <h2>Preview and download my resume.</h2>
            </div>

            <div className="resume-grid">
              <div className="glass-card resume-copy">
                <div className="icon-badge large">
                  <FileText size={24} />
                </div>
                <h3>Drop your PDF into the public folder</h3>
                <p>
                  Put your actual file at <code>public/resume.pdf</code>. After that, the preview below and the
                  download button will work automatically.
                </p>
                <a className="primary-button" href="/resume.pdf" target="_blank" rel="noreferrer">
                  Download Resume
                </a>
              </div>

              <div className="glass-card resume-viewer">
                <iframe title="Nick Tran Resume" src="/resume.pdf#view=FitH" />
              </div>
            </div>
          </motion.div>
        </section>

        <section id="contact" className="screen-section page-section">
          <motion.div className="content-shell section-stack section-right-offset" {...fadeUp}>
            <div className="section-heading">
              <span className="section-kicker">Contact</span>
              <h2>Let&apos;s build something sharp and memorable.</h2>
            </div>

            <div className="contact-grid">
              <div className="glass-card contact-copy">
                <div className="contact-icons">
                  <span className="icon-badge">
                    <Mail size={18} />
                  </span>
                  <span className="icon-badge">
                    <Brain size={18} />
                  </span>
                </div>

                <p>
                  If you&apos;re looking for someone who brings technical curiosity, design energy, and a strategy mindset,
                  I&apos;d love to connect.
                </p>

                <div className="contact-actions">
                  <a className="primary-button" href="mailto:nicktranbach@gmail.com">
                    <Mail size={18} /> Email Me
                  </a>
                  <a
                    className="secondary-button"
                    href="https://www.linkedin.com/in/bach-tran-8b8bbb325/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={18} /> LinkedIn
                  </a>
                </div>
              </div>

              <div className="glass-card final-quote">
                <p>
                  “Good positioning wins in football. Good positioning wins in chess. Good positioning also wins in technology.”
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
