import { useState, useEffect } from 'react'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="button-ripple w-12 h-12 sm:w-14 sm:h-14 bg-primary-container text-on-primary-container flex items-center justify-center rounded-xl hover:bg-primary transition-all hover:-translate-y-1 shadow-2xl"
        >
          <span className="relative z-10 material-symbols-outlined">north</span>
        </button>
      )}
    </div>
  )
}
