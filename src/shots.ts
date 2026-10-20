// Screens captured at double resolution, and sites that have a recorded loop.
const HI = new Set(['vidhi', 'uscale'])
// Each loop comes in a 1440px cut for large screens and a 960px cut for phones, as WebM and MP4.
// w × h is the recorded area: the whole hero, so it lines up with the full-page screenshot under it.
export const LOOPS: Record<string, { base: string; w: number; h: number }> = {
  vidhi: { base: '/work/vidhi-hero', w: 1440, h: 900 },
}
export type Kind = 'live' | 'page' | 'mobile'
export const shot = (slug: string, kind: Kind) => ({
  src: `/work/${slug}-${kind}.webp`,
  srcSet: HI.has(slug) ? `/work/${slug}-${kind}.webp 1x, /work/${slug}-${kind}@2x.webp 2x` : undefined,
})
export const poster = (slug: string) => (HI.has(slug) ? `/work/${slug}-live@2x.webp` : `/work/${slug}-live.webp`)

