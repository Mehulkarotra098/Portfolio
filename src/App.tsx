import { useRef } from 'react'
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
        <section>
          <Hero />
        </section>

        {/* Breathing Space */}
        <div className="h-16 sm:h-24 md:h-section-gap-md lg:h-section-gap-lg" />

        {/* Selected Works Section */}
        <section>
          <SelectedWorks />
        </section>

        {/* Breathing Space */}
        <div className="h-16 sm:h-24 md:h-section-gap-md lg:h-section-gap-lg" />

        {/* Philosophy Section */}
        <section>
          <Philosophy />
        </section>

        {/* Breathing Space */}
        <div className="h-16 sm:h-24 md:h-section-gap-md lg:h-section-gap-lg" />

        {/* Skills Section */}
        <section>
          <Skills />
        </section>

        {/* Breathing Space */}
        <div className="h-16 sm:h-24 md:h-section-gap-md lg:h-section-gap-lg" />

        {/* Contact Section */}
        <section>
          <Contact />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
