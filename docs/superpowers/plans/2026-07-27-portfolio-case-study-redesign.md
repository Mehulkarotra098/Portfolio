# Flagship Portfolio and Case-Study Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Mehul Karotra's portfolio into an editorial designer-developer showcase with three internal flagship case studies, one supporting project, and a preserved archive.

**Architecture:** Keep the existing React, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, and theme-token foundation. Add a typed project content model, React Router routes, reusable homepage project compositions, a reusable case-study template, local optimized project media, and a Vercel SPA fallback.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7, Framer Motion 11, GSAP 3, Vitest, Testing Library.

## Global Constraints

- Featured order is TIS Admissions 2026–27, Antrah Wellness, then Roar Arena.
- GrowCred is supporting work and must use the verified product name shown by its live website.
- Preserve all six existing projects in a compact earlier-work archive.
- Keep the existing violet brand foundation, Geist, Newsreader, JetBrains Mono, and light/dark themes; dark remains the default art-directed presentation.
- Use real local project visuals captured from the supplied live sites or accessible Figma sources; do not hotlink project screenshots.
- Do not invent business metrics, research findings, or outcomes.
- Keep existing email and WhatsApp contact actions.
- Respect reduced-motion preferences, keyboard access, visible focus, contrast, responsive reflow, and meaningful image alt text.
- Work on `codex/portfolio-case-study-redesign`; use a Vercel preview before production.

---

### Task 1: Establish Test Harness, Typed Project Model, and Routing

**Files:**
- Modify: `package.json`
- Create: `src/data/projects.test.ts`
- Replace: `src/data/projects.ts`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/CaseStudyPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Create: `src/components/RouteScrollManager.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Create: `vercel.json`

**Interfaces:**
- Produce `Project`, `CaseStudyContent`, `ProjectLink`, `featuredProjects`, `supportingProjects`, `archiveProjects`, and `getProjectBySlug`.
- Produce routes `/`, `/work/tis-admissions`, `/work/antrah-wellness`, `/work/roar-arena`, and `*`.

- [ ] Add Vitest, Testing Library, jsdom, and test scripts.
- [ ] Write failing tests for ordering, exact project links, archive preservation, lookup, and unknown slugs.
- [ ] Implement the typed project model and pass the data tests.
- [ ] Write failing route tests for home, flagship case study, and not-found rendering.
- [ ] Implement routing, route scroll management, and the Vercel SPA rewrite.
- [ ] Run focused tests, lint, and build.

### Task 2: Capture and Optimize Real Project Media

**Files:**
- Create: `public/projects/tis-admissions/*`
- Create: `public/projects/antrah-wellness/*`
- Create: `public/projects/roar-arena/*`
- Create: `public/projects/growcred/*`

**Interfaces:**
- Each project provides a 1600×1000 WebP cover and at least two gallery images where an internal case study exists.

- [ ] Capture stable desktop and mobile views from each supplied live site.
- [ ] Crop art-directed covers without stretching or fake device artwork.
- [ ] Convert captures to optimized WebP files with explicit dimensions.
- [ ] Confirm every asset opens correctly and remains reasonably sized.

### Task 3: Rebuild the Global Shell and Homepage Hero

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/Nav.tsx`
- Replace: `src/components/Hero.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/pages/HomePage.tsx`

**Interfaces:**
- Homepage hero copy and CTA labels must match the approved specification.

- [ ] Write failing component tests for the hero content, primary CTAs, navigation, and theme control.
- [ ] Refine global tokens, focus styles, reduced-motion behavior, and editorial layout utilities.
- [ ] Implement the redesigned navigation, hero, footer, and responsive shell.
- [ ] Run focused tests, lint, and build.

### Task 4: Build Featured Work, Supporting Work, and Archive

**Files:**
- Replace: `src/components/SelectedWorks.tsx`
- Replace: `src/components/projects/ProjectCard.tsx`
- Modify: `src/components/projects/SectionHeading.tsx`
- Create: `src/components/projects/FeaturedProject.tsx`
- Create: `src/components/projects/SupportingProject.tsx`
- Create: `src/components/projects/ArchiveProject.tsx`

**Interfaces:**
- Featured entries route internally; supporting and archive entries use their verified external links.

- [ ] Write failing tests for featured order, internal links, GrowCred placement, and six archive entries.
- [ ] Implement alternating editorial featured compositions.
- [ ] Implement the supporting GrowCred card and compact earlier-work archive.
- [ ] Add lazy loading, explicit image dimensions, alt text, focus states, and reduced-motion-safe interactions.
- [ ] Run focused tests, lint, and build.

### Task 5: Build and Populate the Reusable Case-Study Experience

**Files:**
- Replace: `src/pages/CaseStudyPage.tsx`
- Create: `src/components/case-study/CaseStudyHero.tsx`
- Create: `src/components/case-study/CaseStudySection.tsx`
- Create: `src/components/case-study/CaseStudyGallery.tsx`
- Create: `src/components/case-study/CaseStudyNavigation.tsx`

**Interfaces:**
- Render each flagship case study entirely from the typed project content model.
- Provide live/Figma actions, previous/next navigation, and a contact CTA.

- [ ] Write failing tests for all three case studies, action links, section content, gallery alt text, and previous/next navigation.
- [ ] Implement the reusable case-study template.
- [ ] Populate factual TIS, Antrah, and Roar Arena narratives without invented metrics.
- [ ] Add project-scoped accent styling and responsive gallery composition.
- [ ] Run focused tests, lint, and build.

### Task 6: Condense Supporting Sections, SEO, Accessibility, and Release

**Files:**
- Modify: `src/components/Philosophy.tsx`
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: `index.html`
- Create or modify: homepage social preview asset and static metadata files as required.

**Interfaces:**
- Preserve factual employment, email, WhatsApp, LinkedIn, and GitHub details.

- [ ] Write failing tests for supporting-section headings and contact actions.
- [ ] Condense About, experience, capabilities, and contact into proof-oriented sections.
- [ ] Add title, description, Open Graph, and canonical metadata.
- [ ] Run the full test suite, lint, build, and dependency audit.
- [ ] Verify `/`, all three case studies, and unknown routes at 1440×900, 768×1024, and 390×844.
- [ ] Verify keyboard navigation, theme persistence, reduced motion, focus visibility, links, image loading, direct-route refresh, and console output.
- [ ] Push the branch, inspect the Vercel preview, compare screenshots, and fix visible regressions.
- [ ] Merge to `main` only after preview approval and verify the connected production deployment is READY.
