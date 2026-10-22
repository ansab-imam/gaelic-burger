// Generates menu/about/contact pages, reusing the homepage header and footer so they stay in sync.
// Run: node tools/build-pages.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const header = home.slice(home.indexOf('<a class="skip"'), home.indexOf('</header>') + 9);
const footer = home.slice(home.indexOf('<footer'), home.indexOf('</footer>') + 9);
const base = 'https://gaelic-burger.vercel.app';
const DELIVEROO = 'https://deliveroo.ie/menu/naas/naas/gaelic-burger-naas';
const MAPS = 'https://maps.app.goo.gl/uh41q87rJhTMWopP6';

const page = ({ slug, title, desc, body, schema }) => `<!doctype html>
<html lang="en-IE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${base}/${slug}">
<meta name="theme-color" content="#123d2b">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Gaelic Burger">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${base}/${slug}">
<meta property="og:image" content="${base}/images/og-image.jpg">
<meta property="og:locale" content="en_IE">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
<link rel="icon" type="image/png" sizes="48x48" href="/images/favicon.png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Caveat+Brush&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>
${header.replace(`href="/${slug}"`, `href="/${slug}" aria-current="page"`)}

<main id="main">
${body}
</main>

${footer}
</body>
</html>
`;

const crumbs = (name, slug) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: base + '/' },
    { '@type': 'ListItem', position: 2, name, item: `${base}/${slug}` },
  ],
});

const pageHero = (scribble, h1, lead) => `  <section class="page-hero">
    <img class="float f1" src="/images/shamrock.svg" alt="" width="70" height="70">
    <img class="float f2" src="/images/shamrock-outline.svg" alt="" width="44" height="44">
    <p class="scribble scribble-light">${scribble}</p>
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
  </section>`;

const item = (name, desc, tag) => `        <li><img src="/images/shamrock.svg" alt="" width="30" height="30"><div><h3>${name}${tag ? ` <span class="tag">${tag}</span>` : ''}</h3><p>${desc}</p></div></li>`;

const menuSection = (id, title, note, items) => `    <section class="menu-section" aria-labelledby="${id}">
      <h2 id="${id}">${title}</h2>
      ${note ? `<p class="menu-note">${note}</p>` : ''}
      <ul class="food-list">
${items.join('\n')}
      </ul>
    </section>`;

const pages = [
  {
    slug: 'menu',
    title: 'Menu | Gaelic Burger, Naas',
    desc: 'Gourmet burgers, cheese steak, breakfast baps, fresh-cut chips, loaded fries and coffee at Gaelic Burger, Newhall, Naas. Order online for delivery.',
    schema: crumbs('Menu', 'menu'),
    body: `${pageHero("What's cooking", 'The <span class="hl">Menu</span>', "Everything is cooked to order. For today's full menu and prices, order online and we'll have it ready.")}
  <div class="menu-wrap">
${menuSection('m-breakfast', 'Breakfast', 'From 9am (10:30am Sundays)', [
  item('Breakfast Bap', 'Sausage, crispy bacon and a fried egg in a soft bap. Great days start here.'),
  item('Coffee', 'Freshly made to go with your bap, or on its own.'),
])}
${menuSection('m-burgers', 'Burgers &amp; Subs', '', [
  item('Gourmet Burgers', 'Brioche buns, stacked high and cooked to order.', 'Award winner'),
  item('Bacon Burger', 'Loaded with crispy bacon and melted cheese. A regular favourite.'),
  item('Cheese Steak', 'Our steak sub, stacked high and dripping with cheese.'),
])}
${menuSection('m-chips', 'Chips &amp; Sides', '', [
  item('Fresh Cut Chips', 'Homemade, cut fresh and cooked crisp. Generous portions.'),
  item('Garlic Chips', 'Fresh-cut chips with garlic.'),
  item('Curry Cheese Chips', 'Fresh-cut chips with curry sauce and melted cheese.'),
  item('Loaded Fries', 'Fresh-cut chips loaded up with the good stuff.'),
])}
${menuSection('m-drinks', 'Drinks', '', [
  item('Coffee', 'Hot and fresh, all day.'),
  item('Soft Drinks', 'A cold one with your burger.'),
])}
    <aside class="order-card">
      <h2>Hungry now?</h2>
      <p>See today's full menu and prices, and get it delivered.</p>
      <div class="actions">
        <a class="btn" href="${DELIVEROO}" target="_blank" rel="noopener">Order Online</a>
        <a class="btn btn-ghost-dark" href="tel:+35345916090">Call +353 45 916 090</a>
      </div>
    </aside>
  </div>`,
  },
  {
    slug: 'about',
    title: 'Our Story | Gaelic Burger, Naas',
    desc: '100% Irish owned with a farm-to-fork approach. Gaelic Burger in Newhall, Naas was named Best Burger in Leinster 2021 and Best Gourmet Burger Specialist 2022.',
    schema: crumbs('Our Story', 'about'),
    body: `${pageHero('Our story', 'Follow the <span class="hl">rainbow.</span>', "Ireland's most enchanting burger experience, right here in Newhall, Naas.")}
  <section class="about-grid">
    <figure class="polaroid tilt-l">
      <img src="/images/green-wall.webp" alt="Gaelic Burger sign on a living green wall" width="600" height="522" loading="lazy">
      <figcaption>Our green wall</figcaption>
    </figure>
    <div>
      <h2>100% Irish owned. <span class="hl">Farm to fork.</span></h2>
      <p>Gaelic Burger is Irish owned from top to bottom. We believe a great burger starts with great Irish produce, so we keep things farm to fork: good ingredients, cooked to order and served without shortcuts.</p>
      <p>Our chips are cut fresh, our portions are generous, and every burger is built the way we'd want it ourselves.</p>
    </div>
  </section>

  <section class="awards" aria-label="Awards">
    <div class="award a1"><span class="award-year">2021</span><span class="award-name">Best Burger<br>in Leinster</span><span class="award-cup" aria-hidden="true">🏆</span></div>
    <div class="award a2"><span class="award-year">2022</span><span class="award-name">Best Gourmet<br>Burger Specialist</span><span class="award-cup" aria-hidden="true">🏆</span></div>
    <div class="award a1"><span class="award-year">4.7★</span><span class="award-name">From 450+<br>Google reviews</span></div>
  </section>

  <section class="about-grid reverse">
    <figure class="polaroid tilt-r">
      <picture>
        <source srcset="/images/truck-day.webp" type="image/webp">
        <img src="/images/truck-day.jpg" alt="The Gaelic Burger truck in Newhall, Naas" width="640" height="480" loading="lazy">
      </picture>
      <figcaption>Home in Newhall</figcaption>
    </figure>
    <div>
      <h2>A spot worth the <span class="hl">journey.</span></h2>
      <p>You'll find us in Newhall, just outside Naas, with outdoor seating and a proper welcome. We open from 9am for breakfast baps and coffee, then keep the grill going for burgers, steak subs and chips until evening.</p>
      <p>We also bring the truck to events, so keep an eye on our socials for where we're popping up next.</p>
      <div class="actions">
        <a class="btn" href="/menu">See the menu</a>
        <a class="btn btn-ghost-dark" href="/contact">Find us</a>
      </div>
    </div>
  </section>`,
  },
  {
    slug: 'contact',
    title: 'Find Us | Opening Hours & Directions | Gaelic Burger, Naas',
    desc: 'Gaelic Burger, Newhall, Naas, Co. Kildare, W91 VK8P. Open 7 days. Call +353 45 916 090. Opening hours, directions and accessibility info.',
    schema: crumbs('Find Us', 'contact'),
    body: `${pageHero('Find us', 'Come <span class="hl">hungry.</span>', 'Newhall, Naas, Co. Kildare. Open seven days a week.')}
  <section class="contact-grid">
    <div class="info-card">
      <h2>Opening hours</h2>
      <table class="hours">
        <tr><th>Monday</th><td>9:00am – 6:30pm</td></tr>
        <tr><th>Tuesday</th><td>9:00am – 6:30pm</td></tr>
        <tr><th>Wednesday</th><td>9:00am – 6:30pm</td></tr>
        <tr><th>Thursday</th><td>9:00am – 6:30pm</td></tr>
        <tr><th>Friday</th><td>9:00am – 8:30pm</td></tr>
        <tr><th>Saturday</th><td>9:00am – 8:30pm</td></tr>
        <tr><th>Sunday</th><td>10:30am – 7:00pm</td></tr>
      </table>
      <p class="small-note">Hours may differ on bank holidays.</p>
    </div>
    <div class="info-card">
      <h2>Get in touch</h2>
      <address>
        <strong>Gaelic Burger</strong><br>
        Newhall, Naas<br>
        Co. Kildare, W91 VK8P
      </address>
      <p><a class="phone" href="tel:+35345916090">+353 45 916 090</a></p>
      <div class="actions">
        <a class="btn" href="${MAPS}" target="_blank" rel="noopener">Get Directions</a>
        <a class="btn btn-ghost-dark" href="${DELIVEROO}" target="_blank" rel="noopener">Order Online</a>
      </div>
      <h3>Good to know</h3>
      <ul class="ticks">
        <li>Outdoor seating</li>
        <li>Wheelchair accessible entrance, parking, seating and toilet</li>
        <li>Breakfast from 9am</li>
      </ul>
    </div>
  </section>
  <section class="map-wrap">
    <iframe title="Map showing Gaelic Burger, Newhall, Naas" src="https://www.google.com/maps?q=Gaelic+Burger,+Newhall,+Naas,+W91+VK8P&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </section>`,
  },
];

for (const p of pages) fs.writeFileSync(path.join(root, p.slug + '.html'), page(p));
console.log('built', pages.map(p => p.slug).join(', '));
