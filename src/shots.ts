// Screens captured at double resolution, and sites that have a recorded loop.
const HI = new Set(['vidhi', 'uscale'])
// Phone screens with a 2x file (sharp on modern phones).
const HI_MOBILE = new Set(['vidhi', 'uscale', 'sashe', 'tis', 'antrah', 'roar'])
// Each loop comes in a 1440px cut for large screens and a 960px cut for phones, as WebM and MP4.
// w × h is the recorded area: the whole hero, so it lines up with the full-page screenshot under it.
export const LOOPS: Record<string, { base: string; w: number; h: number }> = {
  vidhi: { base: '/work/vidhi-hero', w: 1440, h: 1008 },
}
export type Kind = 'live' | 'page' | 'mobile'
export const shot = (slug: string, kind: Kind) => ({
  src: `/work/${slug}-${kind}.webp`,
  srcSet: (kind === 'mobile' ? HI_MOBILE : HI).has(slug) ? `/work/${slug}-${kind}.webp 1x, /work/${slug}-${kind}@2x.webp 2x` : undefined,
})
export const poster = (slug: string) => (HI.has(slug) ? `/work/${slug}-live@2x.webp` : `/work/${slug}-live.webp`)


// Phone status bar colours: each site's own header colour, with dark or light icons on it.
export const STATUS: Record<string, { bg: string; fg: 'dark' | 'light' }> = {
  vidhi: { bg: '#212121', fg: 'light' },
  sashe: { bg: '#f5efe8', fg: 'dark' },
  uscale: { bg: '#fafafc', fg: 'dark' },
  tis: { bg: '#fffaf0', fg: 'dark' },
  antrah: { bg: '#f4f2e3', fg: 'dark' },
  roar: { bg: '#060606', fg: 'light' },
  growcred: { bg: '#f6fcf3', fg: 'dark' },
}
