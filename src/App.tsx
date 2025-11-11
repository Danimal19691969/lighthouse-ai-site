import { Sparkles, Users, Briefcase, GraduationCap, Zap, ArrowRight, ArrowDown, Code, Video, Palette, Bot, Rocket, TrendingUp, Target, Award } from 'lucide-react';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import ContactModal from './components/ContactModal';
import BookingModal from './components/BookingModal';
import MobileMenu from './components/MobileMenu';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import FAQ from './components/FAQ';
import SparklesCursor from './components/SparklesCursor';
import SparkleControls, { SparkleSettings } from './components/SparkleControls';
import GradientBackground from './components/GradientBackground';
import ParticleSettings, { ParticleSettingsState } from './components/ParticleSettings';
import MusicPlayer from './components/MusicPlayer';

const ThreeParticleGalaxy = lazy(() => import('./components/ThreeParticleGalaxy'));

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isParticleSettingsOpen, setIsParticleSettingsOpen] = useState(false);
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const particleClickAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isMobile] = useState(() => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);

  // Music player state
  const [musicPlayerPowerOn, setMusicPlayerPowerOn] = useState(false);
  const [musicPlayerPlaying, setMusicPlayerPlaying] = useState(false);
  const [musicPlayerSongIndex, setMusicPlayerSongIndex] = useState(0);
  const [musicPlayerVolume, setMusicPlayerVolume] = useState(0.5);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const [particleSettingsState, setParticleSettingsState] = useState<ParticleSettingsState>({
    cursorInteractive: false,
    brightness: 80,
    speed: 13,
    size: 10,
    blur: 0,
    color: '#5eee20',
    secondaryColor: '#c026d3',
    rotationSpeed: 50,
    shape: 'oceanWaves',
    motionMode: 'rotate',
    motionSpeed: 1,
    motionIntensity: 0.5
  });
  const [sparkleSettings, setSparkleSettings] = useState<SparkleSettings>({
    enabled: false,
    particleSize: 2,
    speed: 1.5,
    opacity: 1,
    brightness: 70,
    hueShift: 180,
    particleBlur: 0,
    color: '#22d3ee',
    secondaryColor: '#3b82f6',
  });
  const [imageScale, setImageScale] = useState(1);
  const [imageScale2, setImageScale2] = useState(1);
  const [imageScale3, setImageScale3] = useState(1);
  const [imageScale4, setImageScale4] = useState(1);
  const [visionScale, setVisionScale] = useState(0.8);
  const [parallaxStars, setParallaxStars] = useState(0);
  const [parallaxOcean, setParallaxOcean] = useState(0);
  const [parallaxPorthole, setParallaxPorthole] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageRef2 = useRef<HTMLDivElement>(null);
  const imageRef3 = useRef<HTMLDivElement>(null);
  const imageRef4 = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const sonarAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSonarSound = () => {
    if (!sonarAudioRef.current) {
      sonarAudioRef.current = new Audio('/submarine-sonar-ping.mp3');
      sonarAudioRef.current.volume = 0.5;
    }
    sonarAudioRef.current.currentTime = 0;
    sonarAudioRef.current.play().catch(err => console.log('Audio play failed:', err));
  };

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (!isMobile) {
        setParallaxStars(scrollY * -0.15);
        setParallaxOcean(scrollY * -0.4);
        setParallaxPorthole(scrollY * -0.1);
      }

      const refs = [
        { ref: imageRef, setter: setImageScale },
        { ref: imageRef2, setter: setImageScale2 },
        { ref: imageRef3, setter: setImageScale3 },
        { ref: imageRef4, setter: setImageScale4 },
        { ref: visionRef, setter: setVisionScale }
      ];

      refs.forEach(({ ref, setter }) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const screenCenter = windowHeight / 2;

        const distance = Math.abs(elementCenter - screenCenter);
        const maxDistance = windowHeight;

        const scale = isMobile ? 1 : 1.2 - (distance / maxDistance) * 0.4;
        setter(isMobile ? 1 : Math.max(0.8, Math.min(1.2, scale)));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white relative" style={{ position: 'relative' }}>
      {/* Gradient Background - Behind everything */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <GradientBackground />
      </div>

      {/* Three.js Particle Galaxy */}
      <Suspense fallback={null}>
        <ThreeParticleGalaxy settings={particleSettingsState} />
      </Suspense>

      <SparklesCursor settings={sparkleSettings} />
      {isMusicPlayerOpen && (
        <MusicPlayer
          songs={[
            { id: 1, name: "1940's Jazz Attack", url: '/1940s-jazz-attack.mp3' },
            { id: 2, name: "60's Psychadelia", url: '/60s-psychadelia.mp3' },
            { id: 3, name: 'Innovation Indeed', url: '/innovation-indeed.mp3' },
            { id: 4, name: 'Spoon-Austin', url: '/new-song-4.mp3' },
            { id: 5, name: 'Storm Like Spoon', url: '/storm-like-spoon.mp3' },
            { id: 6, name: "It's a Campfire", url: '/its-a-campfire.mp3' },
          ]}
          onClose={() => setIsMusicPlayerOpen(false)}
          isPowerOn={musicPlayerPowerOn}
          setIsPowerOn={setMusicPlayerPowerOn}
          isPlaying={musicPlayerPlaying}
          setIsPlaying={setMusicPlayerPlaying}
          currentSongIndex={musicPlayerSongIndex}
          setCurrentSongIndex={setMusicPlayerSongIndex}
          volume={musicPlayerVolume}
          setVolume={setMusicPlayerVolume}
          audioRef={musicAudioRef}
        />
      )}
      {!isMobileMenuOpen && <SparkleControls onSettingsChange={setSparkleSettings} onMusicPlayerToggle={() => setIsMusicPlayerOpen(!isMusicPlayerOpen)} />}
      <ScrollProgress />

      {/* Particle Settings Button */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => {
            setIsParticleSettingsOpen(true);
            if (!particleClickAudioRef.current) {
              particleClickAudioRef.current = new Audio('/particle-click.mp3');
              particleClickAudioRef.current.volume = 0.3;
            }
            particleClickAudioRef.current.currentTime = 0;
            particleClickAudioRef.current.play().catch(() => {});
          }}
          className="fixed bottom-[5.5rem] right-8 z-40 bg-slate-900/90 border-2 border-cyan-500/40 p-3 rounded-full hover:bg-slate-800/90 hover:border-cyan-400 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          aria-label="Particle Settings"
        >
          <motion.div
            animate={isMobile ? {} : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Zap size={24} className="text-cyan-400" />
          </motion.div>
        </button>
      )}
      {!isMobileMenuOpen && <BackToTop />}

      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header id="home" className="fixed top-0 w-full bg-white/10 backdrop-blur-2xl border-b border-white/20" style={{ perspective: '1000px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 50 }}>
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between" aria-label="Main navigation">
          <a
            href="#home"
            className="flex items-start gap-3 group cursor-pointer"
            onMouseEnter={playSonarSound}
            onClick={playSonarSound}
            aria-label="Sacred Machines - Home"
          >
            <div className="relative">
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 bg-cyan-400/15 blur-2xl rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              <motion.img
                src="/New Logo 2.png"
                alt="Sacred Machines"
                loading="eager"
                className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-500"
                whileHover={isMobile ? {} : { rotate: [0, -5, 5, -5, 5, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent mt-7">
              Sacred Machines
            </span>
          </a>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-300 hover:text-white transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#capabilities" className="text-gray-300 hover:text-white transition-colors relative group">
              Capabilities
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors relative group">
              Portfolio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
            <button onClick={() => setIsBookingModalOpen(true)} className="relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium card-3d-subtle button-hover-lift" aria-label="Get started with Sacred Machines">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white hover:text-cyan-400 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              onContactClick={() => setIsContactModalOpen(true)}
              onBookingClick={() => setIsBookingModalOpen(true)}
            />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="main-content" className="relative pt-56 pb-32 px-6" aria-label="Hero section">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={isMobile ? false : { opacity: 0, y: 20 }}
              animate={isMobile ? false : { opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
            >
              <span className="text-white">
                Imagine. Build.
              </span>
              <br />
              <span className="text-white">
                Empower.
              </span>
            </motion.h1>

            <motion.p
              initial={isMobile ? false : { opacity: 0, y: 20 }}
              animate={isMobile ? false : { opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-100 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Expert guidance to help individuals and companies leverage AI — without falling behind or feeling overwhelmed. From app development to video to automation, we'll <span className="text-blue-400 font-bold">build it</span> for you or <span className="text-white font-bold">teach you how</span>.
            </motion.p>

            <motion.div
              initial={isMobile ? false : { opacity: 0, y: 20 }}
              animate={isMobile ? false : { opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center items-center"
              style={{ perspective: '1000px' }}
            >
              <button
                onClick={() => {
                  const nextSection = document.querySelector('section:nth-of-type(2)');
                  if (nextSection) {
                    const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-md border-2 border-cyan-400/30 text-white font-semibold text-sm hover:bg-white/20 hover:border-cyan-400 transition-all card-3d button-hover-lift w-56 h-12 flex items-center justify-center"
                style={{ borderRadius: '100px', boxShadow: '0 8px 32px rgba(6, 182, 212, 0.1)' }}
                aria-label="Explore our services"
              >
                <div className="flex items-center justify-center gap-2 px-5 text-center">
                  <span className="leading-tight">Let's Explore...</span>
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div
            ref={visionRef}
            className="text-center transition-all duration-300 ease-out px-4"
            style={{
              transform: `scale(${visionScale})`,
              opacity: Math.max(0.3, Math.min(1, (visionScale - 0.7) / 0.5))
            }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              <span
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 bg-clip-text text-transparent"
                style={{
                  filter: `brightness(${Math.max(0.7, Math.min(1.3, visionScale * 1.2))})`
                }}
              >
                Our vision is to bridge creativity and intelligence
              </span>
              <span
                className="block mt-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent"
                style={{
                  filter: `brightness(${Math.max(0.7, Math.min(1.5, visionScale * 1.3))}) contrast(${Math.max(1, Math.min(1.5, visionScale * 1.2))})`
                }}
              >
                — empowering people and brands to harness AI as a tool for imagination, efficiency, and transformation.
              </span>
            </h2>
          </div>
        </div>
      </section>

      {/* Services Split */}
      <section id="services" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/50 px-4 py-2 rounded-full mb-4">
              <Target className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium text-gray-300">Two Paths to Success</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-100 via-white to-slate-200 bg-clip-text text-transparent mb-5">
              Choose Your Journey
            </h2>
            <p className="text-xl text-gray-300">The approach that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto" style={{ perspective: '1200px' }}>
            {/* Hire Us */}
            <div className="group relative card-3d">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl p-10 border border-white/20 group-hover:border-cyan-400/50 transition-all hover:scale-[1.02]">
                <div className="relative inline-flex mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-md opacity-50" />
                  <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl">
                    <Briefcase className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-white mb-5 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Hire Us to Build It
                </h3>

                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  Get AI-powered solutions crafted for you. Apps, automation, videos, websites — built with deep expertise in traditional media and cutting-edge AI.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: Code, text: 'Custom app development' },
                    { icon: Zap, text: 'AI automation & efficiency solutions' },
                    { icon: Video, text: 'Video production & animation' },
                    { icon: Palette, text: 'Web design & multimedia' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-400 rounded-lg blur-sm opacity-0 group-hover/item:opacity-50 transition-opacity" />
                        <div className="relative bg-white/5 p-2 rounded-lg border border-white/10 group-hover/item:border-cyan-400/50 transition-colors">
                          <item.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                      </div>
                      <span className="text-gray-200 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button onClick={() => setIsBookingModalOpen(true)} className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all group/btn button-hover-lift w-56 h-16 flex items-center justify-center" style={{ borderRadius: '100px' }} aria-label="Hire us to build for you">
                    <div className="flex items-center justify-center gap-2 px-6 text-center">
                      <span className="relative z-10 leading-tight">Start Your Project</span>
                      <Rocket className="w-5 h-5 group-hover/btn:translate-y-[-2px] transition-transform relative z-10" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>

            {/* Learn From Us */}
            <div className="group relative card-3d">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl p-10 border border-white/20 group-hover:border-teal-400/50 transition-all hover:scale-[1.02]">
                <div className="relative inline-flex mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl blur-md opacity-50" />
                  <div className="relative bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl">
                    <GraduationCap className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-white mb-5 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Learn From Us
                </h3>

                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  Master AI tools and techniques through personalized training. For companies, teams, individuals, or youth — tailored to your skill level and goals.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: TrendingUp, text: 'Corporate AI training & workshops' },
                    { icon: Users, text: '1-on-1 coaching & mentorship' },
                    { icon: Sparkles, text: 'Youth education in app building & animation' },
                    { icon: Award, text: 'Team upskilling programs' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="relative">
                        <div className="absolute inset-0 bg-teal-400 rounded-lg blur-sm opacity-0 group-hover/item:opacity-50 transition-opacity" />
                        <div className="relative bg-white/5 p-2 rounded-lg border border-white/10 group-hover/item:border-teal-400/50 transition-colors">
                          <item.icon className="w-5 h-5 text-teal-400" />
                        </div>
                      </div>
                      <span className="text-gray-200 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button onClick={() => setIsBookingModalOpen(true)} className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 transition-all group/btn button-hover-lift w-56 h-16 flex items-center justify-center" style={{ borderRadius: '100px' }} aria-label="Book learning session">
                    <div className="flex items-center justify-center gap-2 px-6 text-center">
                      <span className="relative z-10 leading-tight">Book a Session</span>
                      <GraduationCap className="w-5 h-5 group-hover/btn:rotate-12 transition-transform relative z-10" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative py-24 px-6 overflow-visible">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 overflow-visible">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Full Stack Expertise</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-5 pb-2">
              Wide-Ranging Capabilities
            </h2>
            <p className="text-xl text-gray-300">Traditional expertise meets AI innovation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1200px' }}>
            {[
              { icon: Code, title: 'App Development', desc: 'Custom web & mobile applications with AI integration', gradient: 'from-cyan-500 to-blue-600' },
              { icon: Bot, title: 'AI Automation', desc: 'Streamline workflows & reduce overhead w/ intelligent automation', gradient: 'from-blue-500 to-violet-600' },
              { icon: Video, title: 'Video Production', desc: 'Shooting, editing, sound design, and AI-enhanced video content', gradient: 'from-violet-500 to-purple-600' },
              { icon: Palette, title: 'Animation & Design', desc: 'Adobe Creative Suite mastery, 3D design, and motion graphics', gradient: 'from-purple-500 to-pink-600' }
            ].map((item, idx) => (
              <div key={idx} className="group relative card-3d">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all`} />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 group-hover:border-white/30 transition-all">
                  <div className="relative inline-flex mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl blur-md opacity-50`} />
                    <div className={`relative bg-gradient-to-br ${item.gradient} p-3 rounded-xl`}>
                      <item.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work - Portfolio Showcase */}
      <section id="portfolio" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-400/30 px-5 py-2.5 rounded-full mb-6">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Featured Work</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-6">
              Work That Speaks
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              From <span className="text-cyan-400">video game design</span> to <span className="text-purple-400">global brands</span>, decades of creative innovation now powered by AI
            </p>
          </div>

          {/* Featured Projects Grid */}
          <div className="space-y-20" style={{ perspective: '1500px' }}>
            {/* Project 1 - App Building (Reversed) */}
            <div className="group relative card-3d-subtle">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-3xl blur-3xl group-hover:blur-[80px] transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-violet-400/50 transition-all">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Content - Left side now */}
                  <div className="p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-400/30 px-4 py-2 rounded-full mb-6 w-fit">
                      <Code className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-bold text-violet-300">APP DEVELOPMENT</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      Making an App: Design. Code. Storyboard. Develop.
                    </h3>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      We just wrapped a project that blends everything we love—creativity, AI automation, and storytelling. Built with Claude Code, Adobe After Effects, Illustrator/XD, Udio, and ElevenLabs voice modeling, it shows how design, storytelling, and AI can work in harmony. Thanks to modern AI-powered tools, full-stack web applications with intelligent automation and responsive design can now be built in weeks—or even days—instead of months or years, making custom apps accessible for nearly any budget.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">Claude Code</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">After Effects</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">Illustrator/XD</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">Udio</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">ElevenLabs</span>
                    </div>
                  </div>

                  {/* Video Area - Right side now */}
                  <div className="relative h-96 lg:h-auto bg-slate-900 overflow-hidden order-1 lg:order-2">
                    <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                      <iframe
                        src="https://player.vimeo.com/video/1127354530?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        title="Making an App: Design. Code. Storyboard. Develop"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2 - AI Video Pipelines */}
            <div className="group relative card-3d-subtle">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-3xl group-hover:blur-[80px] transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-cyan-400/50 transition-all">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Video Area */}
                  <div className="relative h-96 lg:h-auto bg-slate-900 overflow-hidden">
                    <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                      <iframe
                        src="https://player.vimeo.com/video/1080359548?badge=0&autopause=0&player_id=0&app_id=58479"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Static to Agentic AI - A Journey Through the Evolution of AI"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 px-4 py-2 rounded-full mb-6 w-fit">
                      <Video className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-300">AI-ENHANCED VIDEO</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      AI-Driven Video
                    </h3>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      For <span className="text-cyan-400 font-semibold">NTT DATA</span>, we co-directed a cinematic short film that reimagines a slide deck as a live demonstration of AI's evolution—from static concepts to dynamic systems. Using tools like Runway, Kling, and ElevenLabs, we transformed a single visual into an AI-powered narrative, shaped by deep collaboration with Raleigh Murch, whose creative direction and enterprise AI expertise pushed the project further. A storytelling experiment in using AI to show what AI can do.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">Kling AI</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">Runway</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">ElevenLabs</span>
                      <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">After Effects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects 2 & 3 - Two Column */}
            <div className="grid md:grid-cols-2 gap-8" style={{ perspective: '1200px' }}>
              {/* Project 2 - Motion Graphics & 3D */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-amber-400/50 transition-all h-full">
                  {/* Visual Area */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 to-blue-900/30" />
                    <div ref={imageRef} className="absolute inset-0 flex items-end justify-center -mb-32 sm:-mb-48 md:-mb-64">
                      <img
                        src="/lighthouse-isometric-1.png"
                        alt="Motion Graphics & 3D Work"
                        loading="lazy"
                        className="w-[120%] sm:w-[130%] md:w-[140%] h-[120%] sm:h-[130%] md:h-[140%] object-contain transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${imageScale})` }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-300">ANIMATION & DESIGN</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Motion Graphics & 3D
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Adobe Creative Suite mastery combined with AI tools. Animation, motion graphics, 3D design, and brand storytelling.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Illustrator</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">After Effects</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Cinema 4D</span>
                    </div>
                    <a href="https://danmeyersdesign.myportfolio.com/" target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors text-sm">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 3 - AI Automations */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-violet-400/50 transition-all h-full">
                  {/* Visual Area */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-600/20" />
                    <div ref={imageRef2} className="absolute inset-0 flex items-end justify-center -mb-32 sm:-mb-48 md:-mb-64">
                      <img
                        src="/n8n-workflow-example-2.png"
                        alt="AI Automation Workflow Example"
                        loading="lazy"
                        className="w-[120%] sm:w-[130%] md:w-[140%] h-[120%] sm:h-[130%] md:h-[140%] object-contain transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${imageScale2})` }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-400/30 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Code className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs font-bold text-violet-300">WORKFLOW AUTOMATION</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      AI Automations
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Intelligent workflow automation that connects your tools and streamlines operations. From simple task automation to complex multi-step processes, we build systems that handle repetitive work, integrate APIs, and orchestrate AI agents to transform how your business operates—saving time, reducing errors, and scaling effortlessly.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">n8n</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Make</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Zapier</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Claude Code</span>
                    </div>
                    <a href="https://danmeyersdesign.myportfolio.com/" target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold transition-colors text-sm">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects 4 & 5 - Social Media & Brand Strategy */}
            <div className="grid md:grid-cols-2 gap-8" style={{ perspective: '1200px' }}>
              {/* Project 4 - Social Media */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-pink-400/50 transition-all h-full">
                  {/* Visual Area */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-600/20" />
                    <div ref={imageRef3} className="absolute inset-0 flex items-end justify-center -mb-32 sm:-mb-48 md:-mb-64">
                      <img
                        src="/social-media-for-website.png"
                        alt="Social Media Portfolio"
                        loading="lazy"
                        className="w-[120%] sm:w-[130%] md:w-[140%] h-[120%] sm:h-[130%] md:h-[140%] object-contain transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${imageScale3})` }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-400/30 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Video className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs font-bold text-pink-300">SOCIAL CONTENT</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Social Media
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Storytelling reels and short-form videos for Instagram, YouTube, TikTok, and LinkedIn that entertain, educate, and inspire. Our latest client, Mount Hood Brewing Co., saw a <span className="text-pink-400 font-semibold">1326% increase in engagement</span> after we took over their social content—proving that when you deliver genuine value instead of just selling, audiences respond.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Instagram</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">TikTok</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">YouTube</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">LinkedIn</span>
                    </div>
                    <a href="https://danmeyersdesign.myportfolio.com/" target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold transition-colors text-sm">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 5 - Content Strategy */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-teal-400/50 transition-all h-full">
                  {/* Visual Area */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-600/10" />
                    <div ref={imageRef4} className="absolute inset-0 flex items-end justify-center -mb-32 sm:-mb-48 md:-mb-64">
                      <img
                        src="/brands-for-content-strategy-website.png"
                        alt="Content Strategy Portfolio"
                        loading="lazy"
                        className="w-[120%] sm:w-[130%] md:w-[140%] h-[120%] sm:h-[130%] md:w-[140%] object-contain transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${imageScale4})` }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-400/30 px-3 py-1.5 rounded-full mb-4 w-fit">
                      <Target className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-xs font-bold text-teal-300">STRATEGY & MANAGEMENT</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                      Content Strategy
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Comprehensive brand management, content strategy, and marketing campaigns that drive results. From Fortune 500 companies to emerging startups, we develop cohesive brand identities, strategic messaging frameworks, and omnichannel content strategies that align business objectives with audience needs and market opportunities.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Brand Identity</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Content Strategy</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">Campaigns</span>
                    </div>
                    <a href="https://danmeyersdesign.myportfolio.com/" target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors text-sm">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Video Work */}
            <div className="grid md:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
              {/* AI Short */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all" />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group-hover:border-violet-400/50 transition-all">
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900" style={{ padding: '56.25% 0 0 0' }}>
                    <iframe
                      src="https://player.vimeo.com/video/1094203077?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      title="A Little Too Real"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-400/30 px-3 py-1.5 rounded-full mb-3 w-fit">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs font-bold text-violet-300">AI SHORT</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">AI Short</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">This cinematic AI short, created with VEO 3, Kling 2.1, Hedra, and Eleven Labs (final editing in Premiere Pro), explores jungle suspense and AI storytelling. This personal project was done right when VEO 3 dropped, as an exercise to explore the new tool.</p>
                  </div>
                </div>
              </div>

              {/* Book Promo */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all" />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group-hover:border-rose-400/50 transition-all">
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900" style={{ padding: '56.25% 0 0 0' }}>
                    <iframe
                      src="https://player.vimeo.com/video/1119569228?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      title="Our Name is Dare 21"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-400/30 px-3 py-1.5 rounded-full mb-3 w-fit">
                      <Video className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs font-bold text-rose-300">BOOK PROMO</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Book Promo</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">We're excited to share the official book trailer for Our Name Is Dare by author Kev Coleman. We crafted it using chiaroscuro portraiture, protest archive footage, and original sound design to reflect the novel's tense, poetic tone. The result is a cinematic glimpse into a crumbling world, echoing more Dostoevsky than a standard thriller.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Video */}
              <div className="group relative card-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all" />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group-hover:border-amber-400/50 transition-all">
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900" style={{ padding: '56.25% 0 0 0' }}>
                    <iframe
                      src="https://player.vimeo.com/video/941437250?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      title="Atomic Highway"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 px-3 py-1.5 rounded-full mb-3 w-fit">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">INTERACTIVE VIDEO</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Interactive Video</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">Exploring the fusion of AI art and app design, we built a doomsday escape room prototype using Justinmind, set in a decaying diner in the New Mexico desert. The visuals were created with Dreamstudio.ai, inspired by a recent trip and the history of Los Alamos. The interactive portion unfolds inside the diner itself.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Full Portfolio CTA */}
          <div className="mt-20 text-center">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <a href="https://danmeyersdesign.myportfolio.com/" target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/30 to-violet-600/30 backdrop-blur-xl border-2 border-purple-400/40 px-10 py-5 rounded-2xl font-semibold text-lg text-white shadow-2xl hover:scale-105 hover:border-purple-300/60 transition-all">
                View Complete Portfolio
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
            <p className="mt-6 text-gray-200">Explore 20+ years of creative innovation</p>
          </div>
        </div>
      </section>

      {/* FAQ - Hidden for now */}
      {false && <FAQ />}

      {/* Who We Serve */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-400/30 px-4 py-2 rounded-full mb-4">
              <Users className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300">Diverse Clientele</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-5">
              Who We Serve
            </h2>
            <p className="text-xl text-gray-300">From Fortune 500s to aspiring young creators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10" style={{ perspective: '1200px' }}>
            {[
              { icon: Briefcase, title: 'Companies', desc: 'Help your team catch up with AI, deploy efficiency solutions, and stay competitive. Corporate training or done-for-you implementation.', gradient: 'from-cyan-500 to-blue-600' },
              { icon: Users, title: 'Individuals', desc: 'Build your AI skills, create your own apps, or hire us to bring your ideas to life. Personalized coaching at your pace.', gradient: 'from-teal-500 to-emerald-600' },
              { icon: GraduationCap, title: 'Young Creators', desc: 'Teach kids and teens to build apps, create animations, and explore technology in any direction they\'re passionate about.', gradient: 'from-violet-500 to-purple-600' }
            ].map((item, idx) => (
              <div key={idx} className="group text-center card-3d-subtle">
                <div className="relative inline-flex mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className={`relative bg-gradient-to-br ${item.gradient} p-5 rounded-3xl`}>
                    <item.icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-5">
              Deep Roots, Forward Vision
            </h2>
          </div>

          <div className="relative group card-3d-subtle" style={{ perspective: '1200px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20 overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-8 lg:items-start items-center">
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed flex-1">
                  <p>
                    We bring together <span className="text-cyan-400 font-semibold">decades of traditional media expertise</span> — Adobe Creative Suite, video production, sound design, 3D work — with <span className="text-blue-400 font-semibold">cutting-edge AI capabilities</span>. From early video game design to patented sports products to global marketing campaigns, we've built a career at the intersection of creativity and technology.
                  </p>
                  <p>
                    Today, AI has transformed what's possible. We help people and organizations <span className="text-teal-400 font-semibold">navigate this shift without overwhelm</span>, whether that means building custom solutions, teaching new skills, or providing strategic consultation.
                  </p>
                  <p>
                    Solo consultant with team access when deeper expertise is needed. <span className="text-white font-semibold">Flexible, practical, and always focused on real-world results.</span>
                  </p>
                </div>

                <div className="lg:w-80 flex-shrink-0">
                  <div className="relative group/img">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-2xl blur-xl group-hover/img:blur-2xl transition-all" />
                    <img
                      src="/about-image-of-dan.png"
                      alt="Dan Meyers"
                      loading="lazy"
                      className="relative rounded-2xl border border-white/20 shadow-2xl group-hover/img:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-5 justify-center">
                <a href="https://www.linkedin.com/in/dan-meyers-content-strategist" target="_blank" rel="noopener noreferrer" className="group/link relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105">
                  <span className="flex items-center gap-2 text-white">
                    View LinkedIn Profile
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </span>
                </a>
                <a href="https://danmeyersdesign.myportfolio.com/" target="_blank" rel="noopener noreferrer" className="group/link relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Portfolio Gallery
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-2xl mb-10 text-white/90">
            Let's discuss how we can help you build, learn, or transform with AI.
          </p>
          <button onClick={() => setIsBookingModalOpen(true)} className="group relative overflow-hidden bg-white/20 backdrop-blur-xl border-2 border-white/40 text-white px-12 py-5 rounded-2xl font-semibold text-lg shadow-2xl hover:scale-105 hover:bg-white/30 hover:border-white/60 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all button-hover-lift" aria-label="Contact us to get started">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Schedule a Consultation
              <Rocket className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onMouseEnter={playSonarSound}
              onClick={playSonarSound}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/30 blur-2xl transition-all duration-500 rounded-full" />
                <motion.img
                  src="/New Logo 2.png"
                  alt="Sacred Machines"
                  loading="lazy"
                  className="w-16 h-16 object-contain relative z-10 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-500"
                  whileHover={isMobile ? {} : { rotate: [0, -5, 5, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Sacred Machines
              </span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/sacredmachines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-all" />
                  <div className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:border-pink-400/50 flex items-center justify-center transition-all group-hover:scale-110">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>

                <a
                  href="https://www.tiktok.com/@sacredmachines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="TikTok"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-all" />
                  <div className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/50 flex items-center justify-center transition-all group-hover:scale-110">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                </a>

                <a
                  href="https://x.com/sacredmachines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="X (Twitter)"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500 to-slate-700 opacity-0 group-hover:opacity-20 blur-xl transition-all" />
                  <div className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:border-slate-400/50 flex items-center justify-center transition-all group-hover:scale-110">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </a>
              </div>

              <p className="text-sm text-gray-400">© 2025 Sacred Machines. Navigate AI without overwhelm.</p>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
      <ParticleSettings
        isOpen={isParticleSettingsOpen}
        onClose={() => setIsParticleSettingsOpen(false)}
        onSettingsChange={setParticleSettingsState}
        settings={particleSettingsState}
      />
    </div>
  );
}

export default App;
