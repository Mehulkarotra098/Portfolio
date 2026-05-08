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
    <div className="fixed bottom-12 right-12 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-14 h-14 bg-primary-container text-on-primary-container flex items-center justify-center rounded-xl hover:bg-primary transition-all hover:-translate-y-1 shadow-2xl"
        >
          <span className="material-symbols-outlined">north</span>
        </button>
      )}
    </div>
  )
}
