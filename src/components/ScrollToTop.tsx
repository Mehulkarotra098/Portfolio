import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button, buttonHoverAccent } from './ui/button'
import { cn } from '@/lib/utils'

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
        <Button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          size="icon-lg"
          className={cn(
            'h-12 w-12 rounded-xl bg-primary-container text-on-primary-container shadow-2xl transition-all hover:-translate-y-1 sm:h-14 sm:w-14',
            buttonHoverAccent
          )}
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
