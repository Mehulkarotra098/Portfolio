export type Project = {
  id: string
  title: string
  year?: string
  role: string
  description: string
  image: string
  techStack: string[]
  liveUrl?: string
  clientOrCompany?: string
}

export const projects: Project[] = [
  {
    id: 'my-country-mobile',
    title: 'My Country Mobile',
    year: '2023',
    role: 'UI/UX Developer, WordPress, Graphics',
    clientOrCompany: 'My Country Mobile',
    description:
      'Worked on UI/UX development, WordPress pages, and visual graphics for the company website and marketing surfaces.',
    image: '/my-country-mobile.png',
    techStack: ['WordPress', 'UI/UX', 'Graphic Design'],
    liveUrl: 'http://mycountrymobile.com/',
  },
  {
    id: 'callmama',
    title: 'Callmama',
    year: '2023',
    role: 'UI/UX Developer, WordPress, Graphics',
    clientOrCompany: 'My Country Mobile',
    description:
      'Contributed to Callmama, an internal product of My Country Mobile, focusing on WordPress implementation, UI/UX, and graphics.',
    image: '/callmama.png',
    techStack: ['WordPress', 'UI/UX', 'Graphic Design'],
    liveUrl: 'https://www.callmama.com/',
  },
  {
    id: 'ordhekdeen',
    title: 'Ordhekdeen',
    role: 'Figma UI Designer',
    description:
      'Designed UI screens for a matrimonial portal focused on profile discovery, trust, and a clean user journey.',
    image: '/matrimony.png',
    techStack: ['Figma', 'UI Design', 'User Flows'],
    liveUrl:
      'https://www.figma.com/design/Kh9i4e3tSF2jTjGySidzk7/Matrimony-Website--Community-?node-id=0-1&p=f',
  },
  {
    id: 'bachira',
    title: 'Bachira',
    role: 'Figma UI Designer',
    description:
      'Created Figma designs for an e-commerce product with a modern shopping experience and clear product presentation.',
    image: '/bachira.png',
    techStack: ['Figma', 'E-commerce UI', 'Visual Design'],
    liveUrl:
      'https://www.figma.com/design/7oYAa78La5UhpkfPoKkJCZ/Bachira-Online-Shop--Community-?node-id=169-249&p=f',
  },
  {
    id: 'luminae',
    title: 'Luminae',
    role: 'Figma UI Designer',
    description:
      'Designed Figma UI for an e-commerce platform with category navigation, product discovery, and a polished retail shopping experience.',
    image: '/luminae.png',
    techStack: ['Figma', 'E-commerce UI', 'Visual Design'],
    liveUrl:
      'https://www.figma.com/design/rnGMe9FnPzGFbIQlFmgfQJ/Ecommerce-UI-Kit--Community-?node-id=0-1&p=f',
  },
  {
    id: 'edutrack',
    title: 'EduTrack',
    role: 'Figma UI Designer',
    description:
      'Designed a school and college management app where students take tests and prepare for exams, and teachers mark attendance, view records, and create assessments.',
    image: '/edutrack.png',
    techStack: ['Figma', 'Mobile UI', 'Education'],
    liveUrl: 'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
  },
]
