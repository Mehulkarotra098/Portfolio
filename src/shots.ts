// Screens captured at double resolution, and sites that have a recorded loop.
const HI = new Set(['vidhi', 'uscale'])
export const LOOPS: Record<string, { webm: string; mp4: string }> = {
  vidhi: { webm: '/work/vidhi-hero.webm', mp4: '/work/vidhi-hero.mp4' },
}
export type Kind = 'live' | 'page' | 'mobile'
export const shot = (slug: string, kind: Kind) => ({
  src: `/work/${slug}-${kind}.webp`,
  srcSet: HI.has(slug) ? `/work/${slug}-${kind}.webp 1x, /work/${slug}-${kind}@2x.webp 2x` : undefined,
})
export const poster = (slug: string) => (HI.has(slug) ? `/work/${slug}-live@2x.webp` : `/work/${slug}-live.webp`)

