// Screens captured at double resolution, and sites that have a recorded loop.
const HI = new Set(['vidhi', 'uscale'])
// Each loop comes in a 1440px cut for large screens and a 960px cut for phones, as WebM and MP4.
export const LOOPS: Record<string, { base: string }> = {
  vidhi: { base: '/work/vidhi-hero' },
}
export type Kind = 'live' | 'page' | 'mobile'
export const shot = (slug: string, kind: Kind) => ({
  src: `/work/${slug}-${kind}.webp`,
  srcSet: HI.has(slug) ? `/work/${slug}-${kind}.webp 1x, /work/${slug}-${kind}@2x.webp 2x` : undefined,
})
export const poster = (slug: string) => (HI.has(slug) ? `/work/${slug}-live@2x.webp` : `/work/${slug}-live.webp`)

