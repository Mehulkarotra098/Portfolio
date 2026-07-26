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
    <div className="bg-background text-on-surface">
      <Nav />
      <main ref={mainRef} className="overflow-x-hidden">
        <section>
          <Hero />
        </section>

        <div className="h-16 sm:h-24 md:h-section-gap-md lg:h-section-gap-lg" />

        <section>
          <SelectedWorks />
        </section>

        <section>
          <Philosophy />
        </section>

        <section>
          <Skills />
        </section>

        <section>
          <Contact />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
