export type ProjectLink = {
  label: 'Live site' | 'Figma'
  href: string
}

export type CaseStudyContent = {
  overview: string
  challenge?: string
  approach?: string[]
  outcome?: string
  gallery?: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
}

export type Project = {
  id: string
  slug: string
  title: string
  year?: string
  role: string
  description: string
  image: string
  techStack: string[]
  links: ProjectLink[]
  category: 'featured' | 'supporting' | 'archive'
  internalPath?: `/work/${string}`
  caseStudy?: CaseStudyContent
  liveUrl?: string
  clientOrCompany?: string
}

export const featuredProjects: Project[] = [
  {
    id: 'tis-admissions',
    slug: 'tis-admissions',
    title: 'TIS Admissions 2026–27',
    year: '2026',
    role: 'UI/UX Design & Front-end Development',
    description: 'A school admissions website for the 2026–27 academic year.',
    image: '/projects/tis-admissions/cover.webp',
    techStack: ['Figma', 'UI/UX', 'Front-end Development'],
    links: [
      {
        label: 'Live site',
        href: 'https://tis-school-admissions-2026.vercel.app/',
      },
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/HzBRale6rfopuSuIsPtthh/TIS-Admissions-2026-27-%E2%80%94-UI-UX-Design?node-id=0-1&p=f',
      },
    ],
    category: 'featured',
    internalPath: '/work/tis-admissions',
    caseStudy: {
      overview: 'A school admissions website for the 2026–27 academic year.',
    },
  },
  {
    id: 'antrah-wellness',
    slug: 'antrah-wellness',
    title: 'Antrah Wellness',
    year: '2026',
    role: 'UI/UX Design & Front-end Development',
    description: 'A wellness event website designed and built in 2026.',
    image: '/projects/antrah-wellness/cover.webp',
    techStack: ['Figma', 'UI/UX', 'Front-end Development'],
    links: [
      {
        label: 'Live site',
        href: 'https://antrah-wellness.vercel.app/',
      },
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/46wA5ZJf2vUucsRB6Rysnl/Antrah-Wellness-Event-%E2%80%94-UI-UX-Assignment?node-id=0-1&t=I1tJHwo6VLN88OEd-1',
      },
    ],
    category: 'featured',
    internalPath: '/work/antrah-wellness',
    caseStudy: {
      overview: 'A wellness event website designed and built in 2026.',
    },
  },
  {
    id: 'roar-arena',
    slug: 'roar-arena',
    title: 'Roar Arena',
    year: '2026',
    role: 'Web Design & Development',
    description: 'A 2026 website for Roar Arena.',
    image: '/projects/roar-arena/cover.webp',
    techStack: ['UI/UX', 'Front-end Development'],
    links: [
      {
        label: 'Live site',
        href: 'https://roararenaindia.vercel.app/',
      },
    ],
    category: 'featured',
    internalPath: '/work/roar-arena',
    caseStudy: {
      overview: 'A 2026 website for Roar Arena.',
    },
  },
]

export const supportingProjects: Project[] = [
  {
    id: 'growcred',
    slug: 'growcred',
    title: 'GrowCred',
    year: '2026',
    role: 'Web Design & Development',
    description: 'A 2026 web project for GrowCred.',
    image: '/projects/growcred/cover.webp',
    techStack: ['UI/UX', 'Front-end Development'],
    links: [
      {
        label: 'Live site',
        href: 'https://greencred.vercel.app/',
      },
    ],
    category: 'supporting',
    liveUrl: 'https://greencred.vercel.app/',
  },
]

export const archiveProjects: Project[] = [
  {
    id: 'my-country-mobile',
    slug: 'my-country-mobile',
    title: 'My Country Mobile',
    year: '2023',
    role: 'UI/UX Developer, WordPress, Graphics',
    clientOrCompany: 'My Country Mobile',
    description:
      'Worked on UI/UX development, WordPress pages, and visual graphics for the company website and marketing surfaces.',
    image: '/my-country-mobile.png',
    techStack: ['WordPress', 'UI/UX', 'Graphic Design'],
    links: [{ label: 'Live site', href: 'http://mycountrymobile.com/' }],
    category: 'archive',
    liveUrl: 'http://mycountrymobile.com/',
  },
  {
    id: 'callmama',
    slug: 'callmama',
    title: 'Callmama',
    year: '2023',
    role: 'UI/UX Developer, WordPress, Graphics',
    clientOrCompany: 'My Country Mobile',
    description:
      'Contributed to Callmama, an internal product of My Country Mobile, focusing on WordPress implementation, UI/UX, and graphics.',
    image: '/callmama.png',
    techStack: ['WordPress', 'UI/UX', 'Graphic Design'],
    links: [{ label: 'Live site', href: 'https://www.callmama.com/' }],
    category: 'archive',
    liveUrl: 'https://www.callmama.com/',
  },
  {
    id: 'ordhekdeen',
    slug: 'ordhekdeen',
    title: 'Ordhekdeen',
    role: 'Figma UI Designer',
    description:
      'Designed UI screens for a matrimonial portal focused on profile discovery, trust, and a clean user journey.',
    image: '/matrimony.png',
    techStack: ['Figma', 'UI Design', 'User Flows'],
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f',
      },
    ],
    category: 'archive',
    liveUrl:
      'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f',
  },
  {
    id: 'bachira',
    slug: 'bachira',
    title: 'Bachira',
    role: 'Figma UI Designer',
    description:
      'Created Figma designs for an e-commerce product with a modern shopping experience and clear product presentation.',
    image: '/bachira.png',
    techStack: ['Figma', 'E-commerce UI', 'Visual Design'],
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f',
      },
    ],
    category: 'archive',
    liveUrl:
      'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f',
  },
  {
    id: 'luminae',
    slug: 'luminae',
    title: 'Luminae',
    role: 'Figma UI Designer',
    description:
      'Designed Figma UI for an e-commerce platform with category navigation, product discovery, and a polished retail shopping experience.',
    image: '/luminae.png',
    techStack: ['Figma', 'E-commerce UI', 'Visual Design'],
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f',
      },
    ],
    category: 'archive',
    liveUrl:
      'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f',
  },
  {
    id: 'edutrack',
    slug: 'edutrack',
    title: 'EduTrack',
    role: 'Figma UI Designer',
    description:
      'Designed a school and college management app where students take tests and prepare for exams, and teachers mark attendance, view records, and create assessments.',
    image: '/edutrack.png',
    techStack: ['Figma', 'Mobile UI', 'Education'],
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
      },
    ],
    category: 'archive',
    liveUrl:
      'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
  },
]

export const getProjectBySlug = (slug: string) =>
  featuredProjects.find((project) => project.slug === slug)

// Combined in the order the existing homepage grid should present the work.
export const projects: Project[] = [
  ...featuredProjects,
  ...supportingProjects,
  ...archiveProjects,
]
