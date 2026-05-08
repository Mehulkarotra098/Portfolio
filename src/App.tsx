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
