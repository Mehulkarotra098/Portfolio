import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SelectedWorks } from './components/SelectedWorks'
import { Philosophy } from './components/Philosophy'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'

function App() {
  return (
    <div className="bg-background text-on-surface">
      <Nav />
      <main className='p-10'>
        <Hero />
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

export default App
