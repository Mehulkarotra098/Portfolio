// Build-time SEO: renders the page's real content into index.html as plain HTML (so search engines and
// AI assistants can read it without running JavaScript) and writes the structured data from the same source.
import type { Plugin } from 'vite'
import { concepts, contact, journey, projects } from './src/data'
import { faq } from './src/faq'

export const SITE = 'https://mehulpatel.vercel.app'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function jsonLd() {
  const person = {
    '@type': 'Person',
    '@id': `${SITE}/#mehul`,
    name: 'Mehul Karotra',
    jobTitle: 'UI/UX designer and developer',
    description: 'UI/UX designer and developer in Mumbai who designs websites in Figma and builds them in code.',
    url: `${SITE}/`,
    image: `${SITE}/mehul.webp`,
    email: `mailto:${contact.email}`,
    telephone: contact.phone.replace(/\s/g, ''),
    address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
    worksFor: [
      { '@type': 'Organization', name: 'U Scale', url: contact.uscale, description: 'Mehul Karotra\'s practice for websites, SEO, social media and ads in Mumbai.' },
      { '@type': 'Organization', name: 'Apex36 Technologies' },
    ],
    knowsAbout: ['UI/UX design', 'Web design', 'Figma', 'Design systems', 'Front-end development', 'React', 'TypeScript', 'Tailwind CSS', 'WordPress', 'SEO', 'Local SEO'],
    sameAs: [contact.linkedin, contact.github, `${contact.uscale}/about`],
  }
  const graph = [
    { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: 'Mehul Karotra', inLanguage: 'en-IN', publisher: { '@id': `${SITE}/#mehul` } },
    { '@type': 'ProfilePage', '@id': `${SITE}/#page`, url: `${SITE}/`, name: 'Mehul Karotra | UI/UX designer and developer in Mumbai', isPartOf: { '@id': `${SITE}/#site` }, mainEntity: { '@id': `${SITE}/#mehul` }, dateModified: new Date().toISOString().slice(0, 10) },
    person,
    {
      '@type': 'ItemList', '@id': `${SITE}/#work`, name: 'Selected work by Mehul Karotra',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'CreativeWork', name: p.name, url: p.url, description: p.text, genre: p.meta, creator: { '@id': `${SITE}/#mehul` } },
      })),
    },
    { '@type': 'FAQPage', '@id': `${SITE}/#faq`, mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ]
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function staticBody() {
  const li = (s: string) => `<li>${s}</li>`
  return `<div class="pre">
<header><p>Mehul Karotra, UI/UX designer and developer in Mumbai</p>
<h1>I design it. Then I build it.</h1>
<p>Every site starts as a frame in Figma, and I write the code that takes it live. One person from the first sketch to launch, so nothing gets lost on the way.</p>
<p><a href="${esc(contact.whatsapp)}">WhatsApp me</a> · <a href="mailto:${contact.email}">${contact.email}</a></p></header>
<section id="work"><h2>Selected work</h2><ul>
${projects.slice(0, 6).map((p) => li(`<h3><a href="${esc(p.url)}">${esc(p.name)}</a></h3><p>${esc(p.meta)}. ${esc(p.role)}.</p><p>${esc(p.text)}</p>`)).join('\n')}
</ul></section>
<section id="more"><h2>More work</h2><ul>
${projects.slice(6).map((p) => li(`<h3><a href="${esc(p.url)}">${esc(p.name)}</a></h3><p>${esc(p.meta)}. ${esc(p.text)}</p>`)).join('\n')}
</ul></section>
<section id="sketchbook"><h2>From the sketchbook</h2><ul>
${concepts.map((c) => li(`<a href="${esc(c.url)}">${esc(c.name)}</a>: ${esc(c.text)}`)).join('\n')}
</ul></section>
<section id="services"><h2>What I do</h2><ul>
<li><h3>Design</h3><p>Research, flows and wireframes, then real screens in Figma, with a design system your team can keep using.</p></li>
<li><h3>Build</h3><p>The approved design, coded to match: responsive, fast and accessible, with forms and analytics wired in.</p></li>
<li><h3>Grow</h3><p>Through <a href="${contact.uscale}/services">U Scale</a>: Google Business Profile, SEO, social media and ads, with a report every month.</p></li>
</ul></section>
<section id="about"><h2>About Mehul</h2><p>I'm a UI/UX designer and developer from Mumbai. I like the whole journey of a product: the first sketch, the Figma file, the code, and the day it goes live.</p><ul>
${journey.map((j) => li(`${esc(j.org)}: ${esc(j.role)}${j.now ? ' (current)' : ''}`)).join('\n')}
</ul><p>Bachelor of Computer Applications, Information Technology.</p></section>
<section id="faq"><h2>Questions</h2>
${faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('\n')}
</section>
<section id="contact"><h2>Your turn.</h2><p>Tell me what you're building. I usually reply the same day.</p>
<p><a href="mailto:${contact.email}">${contact.email}</a> · <a href="${esc(contact.whatsapp)}">WhatsApp ${contact.phone}</a> · <a href="${contact.linkedin}">LinkedIn</a> · <a href="${contact.github}">GitHub</a></p></section>
</div>`
}

export function seo(): Plugin {
  return {
    name: 'mehul-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace('<!--ld-->', `<script type="application/ld+json">${jsonLd()}</script>`)
          .replace('<div id="root"></div>', `<div id="root">${staticBody()}</div>`)
      },
    },
  }
}
