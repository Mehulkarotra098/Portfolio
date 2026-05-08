# Portfolio Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio layout to dramatically improve visual hierarchy and first impression through breathing space, visual rhythm, and strategic accents.

**Architecture:** Update core styling system and component-level Framer Motion animations. Enhance CSS with gradients and glow effects. Implement GSAP ScrollTrigger parallax. Maintain existing component structure and aesthetic (dark theme, Material Design 3 colors).

**Tech Stack:** React 19.2.5, TypeScript, Tailwind CSS 4.2.4, Framer Motion 11.0.0, GSAP 3.15.0

---

## File Structure Overview

**Core Styling:**
- `src/index.css` — Enhanced CSS with gradients, spacing, and visual effects
- `tailwind.config.ts` — Update spacing variables for larger gaps

**Layout & Container:**
- `src/App.tsx` — Update main layout structure and section spacing

**Components (Redesigned):**
- `src/components/Nav.tsx` — Framer Motion entrance animations
- `src/components/Hero.tsx` — Enhance typography, add 3D effects, Framer Motion
- `src/components/SelectedWorks.tsx` — Implement full-width layout, GSAP parallax
- `src/components/Philosophy.tsx` — Constrain width, enhance animations
- `src/components/Skills.tsx` — Sticky layout, Framer Motion card animations
- `src/components/Contact.tsx` — Enhanced form styling, Framer Motion
- `src/components/Footer.tsx` — Framer Motion entrance animations

**Documentation:**
- `docs/superpowers/specs/2026-05-08-portfolio-layout-redesign.md` — Design specification (reference)

---

## Implementation Tasks

### Task 1: Update Tailwind Config with New Spacing Variables

**Files:**
- Modify: `tailwind.config.ts` (entire file)

- [ ] **Step 1: Read current Tailwind config**

Current config has basic spacing. We need to add explicit variables for section gaps.

- [ ] **Step 2: Add section spacing variables**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'section-gap-sm': '60px',      // Mobile sections
        'section-gap-md': '100px',     // Tablet sections
        'section-gap-lg': '120px',     // Desktop sections
        'section-gap-hero': '40px',    // Hero padding bottom
        'breathing': '80px',            // Visual breathing room
      },
      fontSize: {
        'display-xl': ['128px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(46, 98, 255, 0.2)',
        'glow-primary-lg': '0 0 40px rgba(46, 98, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(0, 217, 255, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 3: Verify config syntax**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts
git commit -m "chore: add spacing and effect variables to Tailwind config"
```

---

### Task 2: Enhance CSS with Gradients and Visual Effects

**Files:**
- Modify: `src/index.css` (entire file)

- [ ] **Step 1: Enhance index.css with premium effects**

Replace entire `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

@import "tailwindcss";

:root {
  --color-background: #0a0a0a;
  --color-on-surface: #e5e2e1;
  --color-primary-container: #2e62ff;
  --color-on-primary-container: #f7f6ff;
  --color-primary: #b7c4ff;
  --color-on-surface-variant: #c3c5d8;
  --color-accent: #00d9ff;
  --color-accent-dark: #0088cc;
}

* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

body {
  background: linear-gradient(135deg, #0a0a0a 0%, #0f0f1a 100%);
  color: var(--color-on-surface);
  position: relative;
  overflow-x: hidden;
}

/* Premium background overlay effects */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 20% 50%, rgba(46, 98, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(0, 217, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Project card hover enhancement */
.project-card {
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(46, 98, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover img {
  transform: scale(1.06);
}

/* Editorial line with glow */
.editorial-line {
  height: 2px;
  background: linear-gradient(90deg, #2e62ff 0%, #00d9ff 50%, transparent 100%);
  box-shadow: 0 0 20px rgba(46, 98, 255, 0.4);
  position: relative;
}

/* Text reveal animation */
.text-reveal {
  background: linear-gradient(to right, #b7c4ff 50%, #8d90a2 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background-position 0.6s ease;
}

.text-reveal:hover {
  background-position: 0 0;
}

/* Skill card premium effect */
.skill-card {
  position: relative;
  background: linear-gradient(135deg, #1c1b1b 0%, #201f1f 100%);
  border: 1px solid rgba(67, 70, 86, 0.3);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(46, 98, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.skill-card:hover::before {
  left: 100%;
}

.skill-card:hover {
  border-color: rgba(46, 98, 255, 0.5);
  box-shadow: 0 0 30px rgba(46, 98, 255, 0.2);
  transform: translateY(-4px);
}

/* Navigation premium styling */
nav {
  background: linear-gradient(180deg, rgba(19, 19, 19, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(46, 98, 255, 0.1);
}

/* Button enhanced states */
button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

button:hover::before {
  width: 300px;
  height: 300px;
}

/* Form field enhanced styling */
input, textarea {
  position: relative;
  background: transparent;
  transition: all 0.4s ease;
}

input:focus, textarea:focus {
  background: rgba(46, 98, 255, 0.05);
  border-color: #2e62ff !important;
  box-shadow: 0 0 20px rgba(46, 98, 255, 0.2);
}

/* Link hover effects */
a {
  position: relative;
  text-decoration: none;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #2e62ff, #00d9ff);
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

a:hover::after {
  width: 100%;
}

/* Selection styling */
::selection {
  background: linear-gradient(135deg, #2e62ff 0%, #00d9ff 100%);
  color: var(--color-on-primary-container);
}

/* Premium dividers */
hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(46, 98, 255, 0.3), transparent);
}
```

- [ ] **Step 2: Verify CSS loads without errors**

Open browser dev tools and check console for CSS errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: enhance CSS with gradients, glows, and premium effects"
```

---

### Task 3: Update App.tsx Layout Structure and Spacing

**Files:**
- Modify: `src/App.tsx` (entire file)

- [ ] **Step 1: Update App.tsx with new spacing structure**

Replace entire `src/App.tsx` with:

```tsx
import { useEffect, useRef } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SelectedWorks } from './components/SelectedWorks'
import { Philosophy } from './components/Philosophy'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'

function App() {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="bg-background text-on-surface">
      <Nav />
      <main ref={mainRef} className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="pt-40 md:pt-60">
          <Hero />
        </section>

        {/* Breathing Space */}
        <div className="h-section-gap-lg md:h-section-gap-lg" />

        {/* Selected Works Section */}
        <section className="px-margin-x max-w-container-max mx-auto">
          <SelectedWorks />
        </section>

        {/* Breathing Space */}
        <div className="h-section-gap-lg md:h-section-gap-lg" />

        {/* Philosophy Section */}
        <section className="px-margin-x max-w-container-max mx-auto">
          <Philosophy />
        </section>

        {/* Breathing Space */}
        <div className="h-section-gap-lg md:h-section-gap-lg" />

        {/* Skills Section */}
        <section className="px-margin-x max-w-container-max mx-auto">
          <Skills />
        </section>

        {/* Breathing Space */}
        <div className="h-section-gap-lg md:h-section-gap-lg" />

        {/* Contact Section */}
        <section className="px-margin-x max-w-container-max mx-auto pb-32">
          <Contact />
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
```

- [ ] **Step 2: Verify App loads without errors**

Run: `npm run dev`
Expected: Dev server starts, no console errors

- [ ] **Step 3: Visual check in browser**

Open `http://localhost:5180` and verify:
- Large spacing between sections
- No layout shifts
- All components visible
- Responsive on mobile

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: update App layout structure with generous section spacing"
```

---

### Task 4: Redesign Nav Component with Framer Motion

**Files:**
- Modify: `src/components/Nav.tsx` (entire file)

- [ ] **Step 1: Update Nav.tsx with Framer Motion animations**

Replace entire `src/components/Nav.tsx` with:

```tsx
import { motion } from 'framer-motion'

export const Nav = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 transition-all duration-600 ease-out h-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-x h-full">
        <motion.a
          className="font-display-xl text-body-lg font-bold tracking-tighter text-on-surface group"
          href="#"
          variants={itemVariants}
          whileHover={{ x: -4 }}
        >
          <motion.span
            className="inline-block transition-transform duration-300 group-hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
          >
            Mehul Karotra
          </motion.span>
        </motion.a>

        <motion.div className="hidden md:flex items-center space-x-12 font-label-sm uppercase" variants={containerVariants}>
          {['Work', 'Philosophy', 'Experience', 'Contact'].map((link, idx) => (
            <motion.a
              key={link}
              className={`transition-colors duration-300 ${idx === 0 ? 'text-on-surface border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'}`}
              href={`#${link.toLowerCase()}`}
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              {link}
            </motion.a>
          ))}
        </motion.div>

        <motion.button
          className="bg-primary-container text-on-primary-container px-8 py-3 font-label-sm uppercase hover:bg-inverse-primary hover:text-on-primary transition-colors duration-300 rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(46, 98, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Hire Me
        </motion.button>
      </div>
    </motion.nav>
  )
}
```

- [ ] **Step 2: Test in browser**

Open `http://localhost:5180` and verify:
- Nav animates smoothly on load
- Links have hover effects
- Button scales on hover
- Animation is smooth (60fps in DevTools)

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: add Framer Motion animations to Nav component"
```

---

### Task 5: Enhance Hero Component with 3D Effects and Larger Typography

**Files:**
- Modify: `src/components/Hero.tsx` (entire file)

- [ ] **Step 1: Update Hero.tsx with enhanced typography and animations**

Replace entire `src/components/Hero.tsx` with:

```tsx
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

gsap.registerPlugin(useGSAP)

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Smooth parallax effect using GSAP ScrollTrigger
      gsap.to('.hero-accent-line', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        scaleX: 0.5,
        opacity: 0.3,
        ease: 'none',
      })
    },
    { scope: containerRef }
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        delay: 0.1,
      },
    },
  }

  const headlineVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section
      ref={containerRef}
      className="pt-40 pb-20 md:pt-60 md:pb-40 px-margin-x max-w-container-max mx-auto relative overflow-hidden"
      id="hero"
      style={{ perspective: '1200px' }}
    >
      {/* Animated accent line */}
      <motion.div
        className="absolute top-40 right-0 w-1/3 h-px bg-gradient-to-l from-primary-container via-accent to-transparent hidden lg:block hero-accent-line origin-right"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div
        className="grid grid-cols-12 gap-gutter relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="col-span-12 lg:col-span-10">
          <motion.span
            className="font-label-sm text-primary-container block mb-8 tracking-[0.4em] uppercase"
            variants={itemVariants}
          >
            UI/UX Developer & Designer
          </motion.span>

          <motion.h1
            className="text-[56px] md:text-[100px] lg:text-[128px] leading-[0.95] mb-16 font-bold"
            style={{ perspective: '1000px' }}
          >
            <motion.div className="headline-line" variants={headlineVariants}>
              Crafting{' '}
              <motion.span
                className="italic font-light text-primary"
                whileHover={{
                  scale: 1.1,
                  textShadow: '0 0 20px rgba(183, 196, 255, 0.5)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Seamless
              </motion.span>
            </motion.div>
            <motion.div className="headline-line" variants={headlineVariants}>
              Digital{' '}
              <span className="text-on-surface-variant font-light">Interfaces.</span>
            </motion.div>
          </motion.h1>
        </div>

        <motion.div className="col-span-12 lg:col-span-5 lg:col-start-7" variants={itemVariants}>
          <motion.p
            className="font-body-lg text-on-surface-variant leading-relaxed border-l border-primary-container/30 pl-8"
            whileInView={{ borderColor: 'rgba(46, 98, 255, 0.6)' }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            Mehul Karotra is a Mumbai-based developer specializing in the intersection of design and technology. Currently
            scaling products at Apex36 Technology Services.
          </motion.p>

          <motion.div className="mt-12 flex gap-8 items-center" variants={containerVariants}>
            <motion.a
              className="font-label-sm text-primary border-b border-primary-container pb-1"
              href="#work"
              variants={ctaVariants}
              whileHover="hover"
            >
              EXPLORE WORK
            </motion.a>
            <motion.span className="w-12 h-px bg-outline-variant" variants={itemVariants} />
            <motion.span
              className="font-label-sm text-[10px] text-on-surface-variant"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            >
              SCROLL TO DISCOVER
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Test in browser**

Open `http://localhost:5180` and verify:
- Typography is larger (128px headline)
- 3D perspective effect on headline
- Accent line parallax effect on scroll
- Scroll indicator bounces continuously
- All animations are smooth

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: enhance Hero with 3D effects, larger typography, and parallax"
```

---

### Task 6: Redesign SelectedWorks with Full-Width Layout and Parallax

**Files:**
- Modify: `src/components/SelectedWorks.tsx` (entire file)

- [ ] **Step 1: Update SelectedWorks.tsx with parallax and full-width layout**

Replace entire `src/components/SelectedWorks.tsx` with:

```tsx
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

gsap.registerPlugin(ScrollTrigger)

export const SelectedWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Parallax effect for project images
      gsap.utils.toArray<HTMLElement>('[data-clip="project-image"]').forEach((image) => {
        gsap.to(image, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    },
    { scope: containerRef }
  )

  const projects = [
    {
      id: 1,
      title: 'My Country Mobile',
      category: 'WordPress • Figma • UI/UX',
      description: 'A comprehensive redesign for a global VoIP leader, focusing on clarity and conversion-centric user flows.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAlzjwdvRL2Vtr_cIviRlf7Sh7jg670G7_YNKrPejTPOC8bDnkPPuqQDsxx__GHmiFHaTBQkCQ83ZTo8M24FiAYfB-KV_t-wOGMD2UGuN1bEffllIlQldXr3hDtpdZxNkRDl-2oV1ukpD7mnDS9zpTsE3qhyxt6c34hTyCs_z3Fytb_vIgi5S2vWnFu9u4ZeVeQctYtXgWD_rtM1B7g56L2VUN0Xi0dzlFv3ORTk57hcrs5K6sF8tc_xE3P6OcbFnM0J7Yg9-J6ucXG',
      featured: true,
      featured_text: '01 / Featured',
    },
    {
      id: 2,
      title: 'Callmama',
      category: 'B2C Product • UI/UX',
      description: 'Simplifying international communication through a minimal and accessible interface.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDqli4xHIUkOXNNn-n8M8JoUVUYYLSYvYRBxILcGX7bblzGs4MCauRcaRg1yte87SAXgrxVwevk3v_J_hBe_A53_43AD3ecsw5wGbTZtJXR6hzoBzhoqQ8OEG1gB9Q7ruAddFrVewjvfO73jCJDgUNhsi6iOtU_xNG8E0pGhIruybTdZm5uc7ILgk5kre1lnLl9FQ5F3w03alni82xFqwLTnbZV1_asFTMJXe37-XqjNy3TLMkaxTtt8aG_i5zKqXSCoTzt9QYseDhi',
      featured: false,
    },
    {
      id: 3,
      title: 'Teloz Communication',
      category: 'Enterprise Platform',
      description:
        'Reimagining enterprise SaaS with a focus on information density and cognitive ease for high-volume users.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QWhhzusWMFYdWGwZeHFyNC4k8oJnxVPrY3EjnpPkY8_0EdFvGFlNc2-5QgQtTiIef8I9nVVLolW_q9h9A7NPZhgOxvZuAe8ZYKFUmsknF6proj60L1EPrfpUSBJ3hku8BKQRQNzqH2TGFeFyz17hjBlk6I_p5Klai0mTQk02akqds04gNN2s53J7qsMFQRznxlp9cynNN5ShHWCP0eRVDpR7V4D0NzAb1itmYQx_tfzKwMwbg1gbapIebDJxKKKlVqg16i1pZ6WL',
      featured: false,
    },
    {
      id: 4,
      title: 'Ringflow',
      category: 'Product Design',
      description:
        'A React-driven interface for modern contact centers, prioritizing real-time data visualization.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAxSlsLPNp56fY6A9HJAEi7JA7xcm137qljGZ-Uelw1DPbIX93cKpa-2XpoMvTg2n9ot5K8AmaLFse76mjjCZ8JXQF52wXjI0ltity3gOj4-0ydCaNwO-nWrQgjfoywFh-swDexq-txN23w7w0VdCn3MLg7AZX5nYDZcSyEbf2lJIPmPWIU3MaBEOWEzXeiSr-NcSRpDpeq8sf7rJ3J5eS5uIBtaLMQ7rButNmsM4PPmTmdg1Yxi2SdPNlanIX_yoqjyr06-yoS2VMS',
      featured: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 20,
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  }

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: 0.2,
      },
    },
  }

  return (
    <section className="w-full" id="work" ref={containerRef}>
      {/* Section Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div>
          <h2 className="text-6xl md:text-8xl mb-4 text-on-surface font-bold">
            <motion.div variants={headingVariants}>Selected</motion.div>
            <motion.div variants={headingVariants}>
              <span className="italic ml-8 md:ml-16 text-primary">Creations</span>
            </motion.div>
          </h2>
        </div>
        <motion.div className="text-right" variants={headingVariants}>
          <span className="font-label-sm text-on-surface-variant block tracking-widest mb-2 uppercase">Archive</span>
          <span className="text-2xl text-on-surface">2022 — 2024</span>
        </motion.div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        className="grid grid-cols-12 gap-y-64 md:gap-x-12 lg:gap-x-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Project 01 */}
        <motion.div className="col-span-12 md:col-span-7 group" variants={cardVariants} whileHover="hover">
          <div className="relative overflow-hidden mb-12 bg-surface-container-low aspect-[16/10] rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
            <motion.img
              alt={projects[0].title}
              className="w-full h-full object-cover"
              src={projects[0].image}
              variants={imageVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
              data-clip="project-image"
            />
            <div className="absolute top-6 left-6 bg-surface-container-highest/90 backdrop-blur-sm px-4 py-2 text-[10px] font-label-sm tracking-widest uppercase text-on-surface">
              {projects[0].featured_text}
            </div>
          </div>
          <div className="max-w-lg px-2">
            <span className="font-label-sm text-[10px] tracking-[0.2em] text-primary uppercase mb-4 block">
              {projects[0].category}
            </span>
            <h3 className="text-4xl mb-6 text-reveal inline-block cursor-default font-bold">{projects[0].title}</h3>
            <p className="font-body-md text-on-surface-variant mb-10">{projects[0].description}</p>
            <motion.a
              className="inline-flex items-center gap-4 group/link text-primary"
              href="#"
              whileHover={{ x: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="font-label-sm border-b border-primary-container pb-1 group-hover/link:border-transparent transition-all">
                VIEW CASE STUDY
              </span>
              <motion.span
                className="material-symbols-outlined transition-transform group-hover/link:translate-x-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                arrow_forward
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* Project 02 */}
        <motion.div className="col-span-12 md:col-span-4 md:col-start-9 group md:mt-48" variants={cardVariants} whileHover="hover">
          <div className="relative overflow-hidden mb-12 bg-surface-container aspect-[4/5] rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
            <motion.img
              alt={projects[1].title}
              className="w-full h-full object-cover"
              src={projects[1].image}
              variants={imageVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
              data-clip="project-image"
            />
          </div>
          <div className="px-2">
            <span className="font-label-sm text-[10px] tracking-[0.2em] text-primary uppercase mb-4 block">
              {projects[1].category}
            </span>
            <h3 className="text-3xl mb-4 text-on-surface font-bold">{projects[1].title}</h3>
            <p className="font-body-md text-on-surface-variant">{projects[1].description}</p>
          </div>
        </motion.div>

        {/* Project 03 */}
        <motion.div className="col-span-12 lg:col-span-10 lg:col-start-2 group" variants={cardVariants} whileHover="hover">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center px-4">
            <div className="order-2 md:order-1">
              <span className="font-label-sm text-[10px] tracking-[0.2em] text-primary uppercase mb-4 block">
                {projects[2].category}
              </span>
              <h3 className="text-4xl mb-8 text-on-surface font-bold">{projects[2].title}</h3>
              <p className="text-on-surface-variant mb-10 text-lg">{projects[2].description}</p>
              <ul className="space-y-6 mb-10">
                {['Information Architecture', 'Visual Design System'].map((item) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-4 font-body-md text-on-surface-variant"
                    whileHover={{ x: 8 }}
                  >
                    <motion.span className="w-8 h-px bg-primary-container" animate={{ scaleX: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2 relative overflow-hidden bg-surface-container aspect-square rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
              <motion.img
                alt={projects[2].title}
                className="w-full h-full object-cover"
                src={projects[2].image}
                variants={imageVariants}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
                data-clip="project-image"
              />
            </div>
          </div>
        </motion.div>

        {/* Project 04 */}
        <motion.div className="col-span-12 md:col-span-5 group md:mt-24" variants={cardVariants} whileHover="hover">
          <div className="relative overflow-hidden mb-12 bg-surface-container aspect-[3/4] rounded-xl border border-outline-variant/10 group-hover:border-primary-container/50 transition-all">
            <motion.img
              alt={projects[3].title}
              className="w-full h-full object-cover"
              src={projects[3].image}
              variants={imageVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
              data-clip="project-image"
            />
          </div>
          <div className="px-2">
            <h3 className="text-3xl mb-4 text-on-surface font-bold">{projects[3].title}</h3>
            <p className="font-body-md text-on-surface-variant">{projects[3].description}</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Test in browser**

Open `http://localhost:5180`, scroll to SelectedWorks and verify:
- Parallax effect on images (-50px on scroll)
- Cards animate in with stagger
- Hover effects work smoothly
- Layout is full-width and responsive

- [ ] **Step 3: Commit**

```bash
git add src/components/SelectedWorks.tsx
git commit -m "feat: implement full-width layout and parallax effects for projects"
```

---

### Task 7: Redesign Philosophy Component with Constrained Layout

**Files:**
- Modify: `src/components/Philosophy.tsx` (entire file)

- [ ] **Step 1: Update Philosophy.tsx with constrained layout and animations**

Replace entire `src/components/Philosophy.tsx` with:

```tsx
import { motion } from 'framer-motion'

export const Philosophy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const journeyItemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
    hover: {
      x: 8,
      backgroundColor: 'rgba(46, 98, 255, 0.05)',
      transition: { duration: 0.3 },
    },
  }

  const journeyData = [
    { company: 'Apex36 Technology Services', role: 'UI/UX Developer (Present)', location: 'MUMBAI, IN' },
    { company: 'My Country Mobile', role: 'UI/UX Designer & Web Developer', location: 'DUBAI/GLOBAL' },
    { company: 'ApplQ Innovations', role: 'Front-end Developer', location: 'REMOTE' },
    { company: 'Threepin Info Tec.', role: 'Junior Web Developer', location: 'MUMBAI, IN' },
  ]

  return (
    <section className="bg-surface-container py-32" id="about">
      <div className="px-margin-x max-w-container-max mx-auto">
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left Column */}
          <motion.div
            className="col-span-12 lg:col-span-5 mb-24 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span className="font-label-sm text-primary mb-8 block uppercase tracking-[0.4em]" variants={itemVariants}>
              The Philosophy
            </motion.span>
            <motion.h2 className="text-5xl md:text-7xl mb-12 italic leading-tight text-on-surface font-bold" variants={itemVariants}>
              Human-Centric <br />
              <motion.span
                className="text-primary-container"
                whileHover={{ scale: 1.05, color: '#00d9ff' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                by Design.
              </motion.span>
            </motion.h2>
            <motion.p className="font-body-lg text-on-surface-variant mb-8 max-w-md" variants={itemVariants}>
              I believe digital products should be as intuitive as a physical object. My approach blends systematic thinking
              with artistic intuition to create experiences that feel both familiar and futuristic.
            </motion.p>

            <motion.div className="space-y-12 mt-20" variants={containerVariants}>
              {[
                {
                  label: 'Education',
                  title: 'Bachelor of Science',
                  subtitle: 'Information Technology',
                },
                {
                  label: 'Notable Achievement',
                  title: 'Led the front-end architecture',
                  subtitle: 'for a platform scaling to 1M+ active monthly users across global regions.',
                },
              ].map((item, idx) => (
                <motion.div key={idx} variants={itemVariants} whileHover={{ x: 8 }}>
                  <span className="font-label-sm text-[10px] text-primary/40 block mb-4 uppercase tracking-widest">
                    {item.label}
                  </span>
                  <h4 className="font-headline-md text-xl mb-1 text-on-surface font-bold">{item.title}</h4>
                  <p className="font-body-md text-on-surface-variant italic">{item.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Experience */}
          <motion.div
            className="col-span-12 lg:col-span-6 lg:col-start-7"
            id="experience"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span className="font-label-sm text-primary mb-12 block uppercase tracking-[0.4em]" variants={itemVariants}>
              The Journey
            </motion.span>
            <div className="space-y-0">
              {journeyData.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="group border-t border-outline-variant/20 py-10 transition-colors px-4 -mx-4"
                  variants={journeyItemVariants}
                  whileHover="hover"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <motion.h3
                        className="text-2xl text-on-surface group-hover:text-primary transition-colors duration-500 font-bold"
                        whileHover={{ x: 4 }}
                      >
                        {item.company}
                      </motion.h3>
                      <p className="font-body-md text-on-surface-variant">{item.role}</p>
                    </div>
                    <motion.span className="font-label-sm text-[11px] tracking-widest text-primary" whileHover={{ scale: 1.1 }}>
                      {item.location}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Test in browser**

Scroll to Philosophy section and verify:
- Left column is properly constrained
- Journey timeline animates correctly
- Hover effects work smoothly
- Typography is clear and readable

- [ ] **Step 3: Commit**

```bash
git add src/components/Philosophy.tsx
git commit -m "feat: enhance Philosophy with constrained layout and improved animations"
```

---

### Task 8: Redesign Skills Component with Sticky Layout and Card Effects

**Files:**
- Modify: `src/components/Skills.tsx` (entire file)

- [ ] **Step 1: Update Skills.tsx with sticky layout and card effects**

Replace entire `src/components/Skills.tsx` with:

```tsx
import { motion } from 'framer-motion'

export const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(46, 98, 255, 0.15)',
      transition: { duration: 0.3 },
    },
  }

  const skillItems = [
    {
      number: '01',
      title: 'UI/UX Design',
      skills: [
        { label: 'Strategy & Ideation', value: 'User Research, Wireframing' },
        { label: 'Execution & Scale', value: 'Prototyping, Design Systems' },
      ],
    },
    {
      number: '02',
      title: 'Front-End',
      skills: [
        { label: 'Core & Logic', value: 'HTML5, CSS3, React.js' },
        { label: 'Styling & Interaction', value: 'Tailwind CSS, JS (ES6+)' },
      ],
    },
    {
      number: '03',
      title: 'Tools & Technologies',
      isFullWidth: true,
      tools: [
        { category: 'Design', items: 'Figma, Photoshop' },
        { category: 'Engineering', items: 'VS Code, Git' },
        { category: 'CMS', items: 'WordPress' },
      ],
    },
    {
      number: '04',
      title: 'Specialized Capabilities',
      isFullWidth: true,
      description:
        'Information Architecture, Search Engine Optimization (SEO), Responsive Design Patterns, and Accessibility Compliance.',
    },
  ]

  return (
    <section className="py-section-gap bg-background overflow-hidden" id="skills">
      <div className="px-margin-x max-w-container-max mx-auto">
        <div className="grid grid-cols-12 gap-gutter border-b border-outline-variant/20 pb-24">
          {/* Left Sticky */}
          <motion.div
            className="col-span-12 lg:col-span-4 sticky top-40 h-fit mb-24 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span className="font-label-sm text-primary mb-8 block uppercase tracking-[0.4em]" variants={headingVariants}>
              Expertise
            </motion.span>
            <motion.h2 className="text-6xl md:text-8xl text-on-surface leading-none mb-8 font-bold" variants={headingVariants}>
              Creative
              <br />
              <span className="italic text-primary">Arsenal</span>
            </motion.h2>
            <motion.p className="font-body-lg text-on-surface-variant max-w-sm" variants={headingVariants}>
              Merging deep technical proficiency with an eye for detail and user-first methodology.
            </motion.p>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-32"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skillItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`group bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 hover:border-primary-container/30 transition-all duration-500 flex flex-col h-full ${
                    item.isFullWidth ? 'col-span-1 md:col-span-2' : ''
                  }`}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <motion.span
                      className="font-label-sm text-primary-container text-lg italic"
                      whileHover={{ scale: 1.2, color: '#2e62ff' }}
                    >
                      {item.number}
                    </motion.span>
                    <motion.h3
                      className="text-3xl text-on-surface group-hover:text-primary transition-colors font-bold"
                      whileHover={{ x: 4 }}
                    >
                      {item.title}
                    </motion.h3>
                  </div>

                  {/* Standard skill layout */}
                  {!item.isFullWidth && 'skills' in item && (
                    <motion.div className="grid grid-cols-1 gap-y-6" variants={containerVariants}>
                      {item.skills.map((skill, skillIdx) => (
                        <motion.div
                          key={skillIdx}
                          className="border-l-2 border-primary-container/20 pl-4 group/skill"
                          whileHover={{ x: 4 }}
                          variants={cardVariants}
                        >
                          <h4 className="font-label-sm text-[10px] uppercase text-primary/60 tracking-widest mb-1 group-hover/skill:text-primary transition-colors">
                            {skill.label}
                          </h4>
                          <p className="text-xl text-on-surface font-bold">{skill.value}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Tools layout */}
                  {'tools' in item && (
                    <div className="flex flex-wrap gap-x-12 gap-y-6">
                      {item.tools?.map((tool, toolIdx) => (
                        <motion.div key={toolIdx} whileHover={{ y: -4 }} className="min-w-[140px]">
                          <h4 className="font-label-sm text-[10px] uppercase text-primary/60 tracking-widest mb-1">
                            {tool.category}
                          </h4>
                          <p className="text-xl text-on-surface font-bold">{tool.items}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Description layout */}
                  {'description' in item && <p className="font-body-lg text-on-surface-variant italic leading-relaxed">{item.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Test in browser**

Scroll to Skills section and verify:
- Sticky heading works correctly
- Skill cards animate with stagger
- Hover effects work smoothly
- Card glow effect appears on hover
- Layout is responsive

- [ ] **Step 3: Commit**

```bash
git add src/components/Skills.tsx
git commit -m "feat: implement sticky layout and premium card effects for Skills"
```

---

### Task 9: Enhance Contact Component with Form Focus Effects

**Files:**
- Modify: `src/components/Contact.tsx` (entire file)

- [ ] **Step 1: Update Contact.tsx with form focus effects**

Replace entire `src/components/Contact.tsx` with:

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [focused, setFocused] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.currentTarget
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
    focus: {
      boxShadow: '0 0 20px rgba(46, 98, 255, 0.2)',
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(46, 98, 255, 0.3)',
    },
    tap: {
      scale: 0.98,
    },
  }

  return (
    <section className="px-margin-x max-w-container-max mx-auto mb-32" id="contact">
      <motion.div
        className="editorial-line mb-32"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        style={{ originX: 0 }}
      />

      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Section - Sticky */}
        <motion.div
          className="col-span-12 lg:col-span-6 lg:sticky lg:top-40 h-fit"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span className="font-label-sm text-primary mb-8 block uppercase tracking-[0.4em]" variants={headingVariants}>
            Get in touch
          </motion.span>
          <motion.h2 className="text-[56px] md:text-[80px] leading-[0.9] mb-12 text-on-surface font-bold" variants={headingVariants}>
            Let's build the{' '}
            <motion.span
              className="italic text-primary"
              whileHover={{
                scale: 1.1,
                textShadow: '0 0 20px rgba(183, 196, 255, 0.5)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              next
            </motion.span>{' '}
            big thing.
          </motion.h2>
          <motion.div className="flex flex-col gap-6" variants={containerVariants}>
            <motion.a
              className="text-3xl md:text-4xl text-primary-container transition-all inline-block w-fit font-bold"
              href="mailto:mkarotra369@gmail.com"
              whileHover={{ x: 8, letterSpacing: '0.05em' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              variants={headingVariants}
            >
              mkarotra369@gmail.com
            </motion.a>
            <motion.p className="font-body-lg text-on-surface-variant" variants={headingVariants}>
              Based in Mumbai, Maharashtra, India. <br />
              Open to global collaborations.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          className="col-span-12 lg:col-span-5 lg:col-start-8 mt-20 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <form className="space-y-16" onSubmit={handleSubmit}>
            {/* Name Input */}
            <motion.div className="relative group" variants={inputVariants}>
              <motion.input
                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-6 focus:border-primary focus:ring-0 transition-colors outline-none text-2xl peer placeholder-transparent text-on-surface font-bold"
                id="name"
                placeholder="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.label
                className="absolute left-0 top-0 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px]"
                htmlFor="name"
                animate={focused === 'name' ? { color: '#b7c4ff' } : { color: '#c3c5d8' }}
              >
                Full Name
              </motion.label>
            </motion.div>

            {/* Email Input */}
            <motion.div className="relative group" variants={inputVariants}>
              <motion.input
                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-6 focus:border-primary focus:ring-0 transition-colors outline-none text-2xl peer placeholder-transparent text-on-surface font-bold"
                id="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.label
                className="absolute left-0 top-0 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px]"
                htmlFor="email"
                animate={focused === 'email' ? { color: '#b7c4ff' } : { color: '#c3c5d8' }}
              >
                Email Address
              </motion.label>
            </motion.div>

            {/* Message Input */}
            <motion.div className="relative group" variants={inputVariants}>
              <motion.textarea
                className="w-full bg-transparent border-b-2 border-outline-variant/30 py-6 focus:border-primary focus:ring-0 transition-colors outline-none text-2xl resize-none h-40 peer placeholder-transparent text-on-surface font-bold"
                id="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.label
                className="absolute left-0 top-0 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-[10px]"
                htmlFor="message"
                animate={focused === 'message' ? { color: '#b7c4ff' } : { color: '#c3c5d8' }}
              >
                Your Project Brief
              </motion.label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              className="group relative inline-flex items-center gap-6 bg-primary-container text-on-primary-container px-12 py-6 overflow-hidden rounded-lg hover:text-on-primary transition-colors font-bold uppercase"
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span className="relative z-10 font-label-sm tracking-[0.2em]" whileHover={{ letterSpacing: '0.3em' }}>
                Send Message
              </motion.span>
              <motion.span className="relative z-10 material-symbols-outlined transition-transform group-hover:translate-x-2" animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                arrow_forward
              </motion.span>
              <motion.div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Test in browser**

Scroll to Contact section and verify:
- Form fields animate in correctly
- Labels animate smoothly on focus
- Input fields have glow effect on focus
- Button has hover and tap effects
- All animations are smooth

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: enhance Contact form with focus effects and animations"
```

---

### Task 10: Enhance Footer with Framer Motion Animations

**Files:**
- Modify: `src/components/Footer.tsx` (entire file)

- [ ] **Step 1: Update Footer.tsx with Framer Motion animations**

Replace entire `src/components/Footer.tsx` with:

```tsx
import { motion } from 'framer-motion'

export const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      x: 4,
      color: '#2e62ff',
    },
  }

  const footerLinks = [
    {
      category: 'Connect',
      links: [
        { label: 'LinkedIn', href: 'https://linkedin.com/in/mehul-karotra-a71a97276' },
        { label: 'GitHub', href: 'https://github.com/mehulkarotra' },
      ],
    },
    {
      category: 'Navigation',
      links: [
        { label: 'Work', href: '#work' },
        { label: 'About', href: '#about' },
      ],
    },
  ]

  return (
    <motion.footer
      className="bg-surface-container-lowest border-t border-outline-variant/10 pt-32 pb-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-container-max mx-auto px-margin-x">
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-24">
          {/* About */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-3xl font-bold mb-8 text-on-surface"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Mehul Karotra
            </motion.h3>
            <p className="font-body-md text-on-surface-variant max-w-xs">
              A digital artisan focused on the marriage of function and beauty.
            </p>
          </motion.div>

          {/* Links Grid */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-12" variants={containerVariants}>
            {footerLinks.map((group) => (
              <motion.div key={group.category} className="flex flex-col gap-4" variants={itemVariants}>
                <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest">{group.category}</span>
                {group.links.map((link) => (
                  <motion.a
                    key={link.label}
                    className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 gap-4"
          variants={itemVariants}
        >
          <motion.span
            className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest"
            whileHover={{ scale: 1.05 }}
          >
            © 2024 MEHUL KAROTRA — ALL RIGHTS RESERVED.
          </motion.span>
          <motion.span
            className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest italic"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            MADE WITH INTENTION IN MUMBAI
          </motion.span>
        </motion.div>
      </div>
    </motion.footer>
  )
}
```

- [ ] **Step 2: Test in browser**

Scroll to footer and verify:
- Content animates in with stagger
- Links have hover animations
- "Made with Intention" pulsates
- All transitions are smooth

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Framer Motion animations to Footer component"
```

---

### Task 11: Performance Testing and 60fps Verification

**Files:**
- Browser DevTools (no files modified)

- [ ] **Step 1: Open browser DevTools**

1. Open `http://localhost:5180` in Chrome/Firefox
2. Open DevTools (F12)
3. Go to Performance tab

- [ ] **Step 2: Test scrolling performance**

1. Press Record (Ctrl+Shift+E)
2. Slowly scroll from top to bottom
3. Stop recording
4. Check for dropped frames (should be > 55fps average)
5. Look for jank or stuttering in the flame chart

Expected: FPS stays above 55 during all scrolling

- [ ] **Step 3: Test animation performance**

1. Record a page load
2. Watch the FPS meter while animations play
3. Verify no drops below 50fps during entrance animations

Expected: Smooth 60fps animations on load

- [ ] **Step 4: Check mobile performance**

1. Toggle device toolbar (Ctrl+Shift+M)
2. Select iPhone 12
3. Repeat scroll test
4. Watch for frame drops

Expected: Consistent performance on mobile

- [ ] **Step 5: Commit performance verification notes**

```bash
git add -A
git commit -m "perf: verify 60fps animations and smooth scroll performance"
```

---

### Task 12: Final Verification and Testing

**Files:**
- Browser inspection (visual testing)

- [ ] **Step 1: Full visual review**

Reload page and verify:
- [ ] Hero section is dramatic (500px height, large typography)
- [ ] Spacing between sections is generous (120px gaps)
- [ ] Typography hierarchy is clear (larger headings)
- [ ] Accent colors guide focus (gradients, glows)
- [ ] Animations are smooth and natural
- [ ] Hover effects work on all interactive elements
- [ ] Form inputs have focus effects
- [ ] Mobile layout is responsive

- [ ] **Step 2: Cross-browser testing**

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)

Expected: Consistent appearance and performance

- [ ] **Step 3: Accessibility check**

Verify:
- [ ] Color contrast is sufficient (WCAG AA)
- [ ] Focus states are visible
- [ ] Navigation is keyboard accessible
- [ ] All text is readable

- [ ] **Step 4: Final commit**

```bash
git status
```

If there are any uncommitted changes, commit them:

```bash
git add -A
git commit -m "test: complete visual and performance verification"
```

---

## Success Criteria Validation

After completing all tasks, verify:

✅ **Visual Hierarchy** — Hero section dominates with larger typography and dramatic spacing  
✅ **Breathing Space** — 120px gaps between major sections create visual rhythm  
✅ **Typography** — Heading sizes range from 128px (hero) to 48px (subsections)  
✅ **Accent Elements** — Gradients, glows, and borders guide focus strategically  
✅ **Animations** — All entrance and scroll animations run at 60fps  
✅ **Mobile Responsiveness** — Layout adapts beautifully to all screen sizes  
✅ **Accessibility** — WCAG AA compliant with visible focus states  
✅ **Premium Feel** — Overall aesthetic feels refined and intentional  

---

## Cleanup & Finalization

- [ ] Remove any console errors (check DevTools)
- [ ] Verify no unused imports in components
- [ ] Review all commits for clear messages
- [ ] Final git log to see clean commit history

```bash
git log --oneline | head -15
```

---

**Plan Status:** ✅ Ready for Execution

**Estimated Duration:** 3-4 hours for full implementation and testing

**Next Steps:** Execute tasks in order using subagent-driven development or inline execution with checkpoints.

