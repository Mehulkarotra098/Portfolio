import { useRef } from 'react'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Nav } from '../components/Nav'
import { Philosophy } from '../components/Philosophy'
import { ScrollToTop } from '../components/ScrollToTop'
import { SelectedWorks } from '../components/SelectedWorks'
import { Skills } from '../components/Skills'

export const HomePage = () => {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Nav />
      <main ref={mainRef} className="overflow-x-clip" id="main-content">
        <Hero />

        <div className="h-16 sm:h-24 md:h-section-gap-md lg:h-section-gap-lg" />

        <SelectedWorks />
        <Philosophy />
        <Skills />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
