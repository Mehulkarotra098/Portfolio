export const contact = {
  email: 'mehulbitmaster@gmail.com',
  phone: '+91 79773 60142',
  whatsapp: 'https://wa.me/917977360142?text=' + encodeURIComponent("Hi Mehul, I saw your portfolio and I'd like to talk about a project."),
  linkedin: 'https://www.linkedin.com/in/mehulkarotra/',
  github: 'https://github.com/Mehulkarotra098',
  uscale: 'https://uscale.in',
}

export type Project = {
  slug: string
  name: string
  meta: string
  role: string
  text: string
  url: string
  accent: string
  mobile?: boolean
  note?: string
}

// Live work: screenshots in /public/work/<slug>-live.webp, wireframes in <slug>-wire.webp
export const projects: Project[] = [
  {
    slug: 'vidhi', name: 'Vidhi Parmar', meta: 'AI visual artist, Mumbai', role: 'Design and build', accent: '#F0457F', mobile: true,
    text: 'A hire-me portfolio that moves like her films: a showreel hero, selected AI ad films, a four-step process, services and FAQs.',
    url: 'https://www.vidhiparmar.me',
  },
  {
    slug: 'sashe', name: 'Sashe by Prachi', meta: 'Fashion label, Mumbai', role: 'Design and build', accent: '#641F2A', mobile: true,
    text: "A digital flagship for a bespoke fashion label: an editorial hero, signature looks, studio forms and the founder's story. Built mobile-first to the founder's pixel-level bar.",
    url: 'https://sashebyprachi.vercel.app',
  },
  {
    slug: 'uscale', name: 'U Scale', meta: 'My own studio, Mumbai', role: 'Brand, design, build and SEO', accent: '#63B849', mobile: true,
    text: 'The site for my practice: every price published, free tools for local businesses, a blog and pages written to be found by Google and AI search.',
    url: 'https://uscale.in',
  },
  {
    slug: 'tis', name: 'TIS Admissions 2026–27', meta: 'School, Kandivali West', role: 'Concept, design and build', accent: '#FCC513', mobile: true, note: 'Concept',
    text: 'A concept admissions experience for an ICSE school: programmes, campus life and an enquiry flow with no friction.',
    url: 'https://tis-school-admissions-2026.vercel.app',
  },
  {
    slug: 'antrah', name: 'Antrah Wellness', meta: 'Wellness gathering, Mumbai', role: 'Design and build', accent: '#6B2F0A', mobile: true,
    text: 'A launch site for a two-day wellness gathering: five paths to wellbeing in one calm place.',
    url: 'https://antrah-wellness.vercel.app',
  },
  {
    slug: 'roar', name: 'Roar Arena', meta: 'Sports, India', role: 'Design and build', accent: '#FF5428', mobile: true,
    text: "A live match centre and fan community for India's watch-party culture.",
    url: 'https://roararenaindia.vercel.app',
  },
  {
    slug: 'growcred', name: 'GrowCred', meta: 'Climate tech', role: 'Product build', accent: '#22C55E', mobile: true,
    text: 'A climate-tech platform where people plant trees, upload proof and earn TreeCoin.',
    url: 'https://greencred.vercel.app',
  },
  {
    slug: 'brandgen', name: 'BrandGen', meta: 'AI SaaS', role: 'Website and social media', accent: '#F97015',
    text: 'The website and social media for an AI tool that turns one brand reference into on-brand marketing visuals.',
    url: 'https://www.getbrandgen.com',
  },
  {
    slug: 'mcm', name: 'My Country Mobile', meta: 'Telecom, in-house role', role: 'UI/UX and web development', accent: '#3B82F6', note: 'In-house',
    text: 'Interface design and web development for an AI-first cloud phone and contact-centre platform, plus WordPress pages and marketing graphics.',
    url: 'https://mycountrymobile.com',
  },
  {
    slug: 'callmama', name: 'Callmama', meta: 'Telecom, in-house role', role: 'UI/UX and web development', accent: '#1B99F9', note: 'In-house',
    text: 'Product design and the web experience for an international calling brand, built while I was at My Country Mobile.',
    url: 'https://www.callmama.com',
  },
]

export const concepts = [
  { slug: 'matrimony', name: 'Ordhekdeen', text: 'A matrimonial portal designed around profile discovery and trust.', url: 'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f' },
  { slug: 'bachira', name: 'Bachira', text: 'An online shop with a modern, product-first shopping flow.', url: 'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f' },
  { slug: 'luminae', name: 'Luminae', text: 'An e-commerce UI with clear category navigation and product discovery.', url: 'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f' },
  { slug: 'edutrack', name: 'EduTrack', text: 'A school app: students take tests, teachers mark attendance and create assessments.', url: 'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f' },
]

export const journey = [
  { org: 'U Scale', role: 'Founder', note: 'My independent practice for websites, SEO, social and ads.', now: true },
  { org: 'Apex36 Technology Services', role: 'UI/UX Developer', now: true },
  { org: 'My Country Mobile', role: 'UI/UX Designer and Web Developer' },
  { org: 'ApplQ Innovations', role: 'Front-end Developer' },
  { org: 'Threepin Info Tec.', role: 'Junior Web Developer' },
]
