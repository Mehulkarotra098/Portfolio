import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

type AnimationCallback = (ctx: gsap.Context) => void

export const useGSAPAnimation = (callback: AnimationCallback, deps: React.DependencyList = []) => {
  const contextRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    contextRef.current = gsap.context(() => {
      callback(contextRef.current!)
    })

    return () => {
      contextRef.current?.revert()
    }
  }, deps)
}
