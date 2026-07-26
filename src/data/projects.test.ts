import { describe, expect, it } from 'vitest'
import { projects } from './projects'

describe('project catalog', () => {
  it('keeps the exact ten-card grid order', () => {
    expect(projects.map(({ title }) => title)).toEqual([
      'TIS Admissions 2026–27',
      'Antrah Wellness',
      'Roar Arena',
      'GrowCred',
      'My Country Mobile',
      'Callmama',
      'Ordhekdeen',
      'Bachira',
      'Luminae',
      'EduTrack',
    ])
  })

  it('stores the four new projects as conventional live-link records', () => {
    expect(projects.slice(0, 4)).toEqual([
      {
        id: 'tis-admissions',
        title: 'TIS Admissions 2026–27',
        year: '2026',
        role: 'UI/UX Design & Front-end Development',
        description: 'A school admissions website for the 2026–27 academic year.',
        image: '/projects/tis-admissions/cover.webp',
        techStack: ['Figma', 'UI/UX', 'Front-end Development'],
        liveUrl: 'https://tis-school-admissions-2026.vercel.app/',
      },
      {
        id: 'antrah-wellness',
        title: 'Antrah Wellness',
        year: '2026',
        role: 'UI/UX Design & Front-end Development',
        description: 'A wellness event website designed and built in 2026.',
        image: '/projects/antrah-wellness/cover.webp',
        techStack: ['Figma', 'UI/UX', 'Front-end Development'],
        liveUrl: 'https://antrah-wellness.vercel.app/',
      },
      {
        id: 'roar-arena',
        title: 'Roar Arena',
        year: '2026',
        role: 'Web Design & Development',
        description: 'A 2026 website for Roar Arena.',
        image: '/projects/roar-arena/cover.webp',
        techStack: ['UI/UX', 'Front-end Development'],
        liveUrl: 'https://roararenaindia.vercel.app/',
      },
      {
        id: 'growcred',
        title: 'GrowCred',
        year: '2026',
        role: 'Web Design & Development',
        description: 'A 2026 web project for GrowCred.',
        image: '/projects/growcred/cover.webp',
        techStack: ['UI/UX', 'Front-end Development'],
        liveUrl: 'https://greencred.vercel.app/',
      },
    ])
  })

  it('preserves the six original project records exactly', () => {
    expect(projects.slice(4)).toEqual([
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
        liveUrl:
          'https://www.figma.com/design/zcZ6QGU9neTpj7TKYuiE3B/practice2?node-id=0-1&p=f',
      },
    ])
  })
})
