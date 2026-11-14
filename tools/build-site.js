// Builds every page of the Gaelic Burger site from one shared layout.
// Edit content here, then run: node tools/build-site.js
// Only real, confirmed business details belong here (Google listing, Facebook, awards, signage).
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const BASE = 'https://gaelic-burger.vercel.app';
const ORDER = 'https://www.just-eat.ie/restaurants-gaelic-burger-kildare/menu';
const EMAIL = 'info@gaelicburger.ie';
const MAPS = 'https://maps.app.goo.gl/uh41q87rJhTMWopP6';
const PHONE = '+353 45 916 090';
const TEL = 'tel:+35345916090';
const SOCIAL = {
  Instagram: 'https://www.instagram.com/gaelicburger',
  TikTok: 'https://www.tiktok.com/@gaelicburger',
  Facebook: 'https://www.facebook.com/Gaelicburger/',
  LinkedIn: 'https://www.linkedin.com/company/gaelic-burger',
  Tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g551559-d23295632-Reviews-Gaelic_Burger_Coffee-Naas_County_Kildare.html',
};
const NAV = [['/', 'Home'], ['/menu', 'Menu'], ['/about', 'Our Story'], ['/events', 'Events'], ['/contact', 'Visit Us']];
const ext = 'target="_blank" rel="noopener"';

const icons = `<svg width="0" height="0" class="defs" aria-hidden="true">
  <defs>
    <path id="leaf" d="M0 0C-7-7-19-15-19-27C-19-35-13-40-7.5-40C-3.5-40 0-37 0-33C0-37 3.5-40 7.5-40C13-40 19-35 19-27C19-15 7-7 0 0Z"/>
    <symbol id="shamrock" viewBox="-44 -44 88 88"><use href="#leaf"/><use href="#leaf" transform="rotate(120)"/><use href="#leaf" transform="rotate(240)"/></symbol>
    <symbol id="phone" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></symbol>
    <symbol id="pin" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></symbol>
    <symbol id="bag" viewBox="0 0 24 24"><path d="M7 7V6a5 5 0 0 1 10 0v1h3l-1 14H5L4 7zm2 0h6V6a3 3 0 0 0-6 0z"/></symbol>
    <symbol id="info" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z"/></symbol>
  </defs>
</svg>`;

const restaurant = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': BASE + '/#restaurant',
  name: 'Gaelic Burger',
  url: BASE + '/',
  logo: BASE + '/images/logo.png',
  image: BASE + '/images/og-image.jpg',
  telephone: PHONE,
  servesCuisine: ['Burgers', 'Irish'],
  address: { '@type': 'PostalAddress', streetAddress: 'Newhall', addressLocality: 'Naas', addressRegion: 'Co. Kildare', postalCode: 'W91 VK8P', addressCountry: 'IE' },
  geo: { '@type': 'GeoCoordinates', latitude: 53.2139873, longitude: -6.7221412 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '09:00', closes: '20:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:30', closes: '19:00' },
  ],
  email: EMAIL,
  hasMenu: BASE + '/menu',
  hasMap: MAPS,
  award: ['Best Burger in Leinster 2021', 'Best Gourmet Burger Specialist 2022'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.7, reviewCount: 454 },
  potentialAction: { '@type': 'OrderAction', target: ORDER },
  sameAs: Object.values(SOCIAL),
};
const crumbs = (name, slug) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
    { '@type': 'ListItem', position: 2, name, item: `${BASE}/${slug}` },
  ],
});

const header = (current) => `<header class="topbar">
    <a href="/" class="brand" aria-label="Gaelic Burger home">
      <img src="/images/logo.webp" alt="" width="48" height="48">
      <span>Gaelic<b>Burger</b></span>
    </a>
    <nav class="nav" aria-label="Main">
${NAV.map(([href, label]) => `      <a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('\n')}
    </nav>
    <div class="topbar-right">
      <a class="icon-btn" href="${TEL}" aria-label="Call ${PHONE}"><svg><use href="#phone"/></svg></a>
      <a class="pill pill-leaf" href="${ORDER}" ${ext}>Order Online</a>
      <details class="mnav">
        <summary aria-label="Open menu"><span></span><span></span><span></span></summary>
        <nav aria-label="Mobile">
${NAV.map(([href, label]) => `          <a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('\n')}
          <a href="${TEL}">Call ${PHONE}</a>
        </nav>
      </details>
    </div>
  </header>`;

const orderBand = `<section class="wrap" aria-label="Order">
    <div class="order-band">
      <svg aria-hidden="true"><use href="#shamrock"/></svg>
      <div>
        <h2>Hungry? <em>Sorted.</em></h2>
        <p>Order online for delivery, or call us on ${PHONE}.</p>
      </div>
      <div class="cta">
        <a class="pill pill-leaf" href="${ORDER}" ${ext}>Order Online</a>
        <a class="call call-light" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>Call us</a>
      </div>
    </div>
  </section>`;

const footer = `<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a href="/" class="brand" aria-label="Gaelic Burger home">
          <img src="/images/logo.webp" alt="" width="44" height="44" loading="lazy">
          <span>Gaelic<b>Burger</b></span>
        </a>
        <p>100% Irish owned gourmet burgers in Newhall, Naas. Best Burger in Ireland 2021 and Best Gourmet Burger Specialist 2022.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
${NAV.slice(1).map(([href, label]) => `          <li><a href="${href}">${label}</a></li>`).join('\n')}
          <li><a href="${ORDER}" ${ext}>Order Online</a></li>
        </ul>
      </div>
      <div>
        <h2>Visit</h2>
        <address>Newhall, Naas<br>Co. Kildare, W91 VK8P<br><a href="${TEL}">${PHONE}</a><br><a href="mailto:${EMAIL}">${EMAIL}</a></address>
        <ul class="foot-hours">
          <li>Mon – Thu: 9am – 6:30pm</li>
          <li>Fri – Sat: 9am – 8:30pm</li>
          <li>Sun: 10:30am – 7pm</li>
        </ul>
      </div>
      <div>
        <h2>Follow</h2>
        <ul>
${Object.entries(SOCIAL).map(([name, url]) => `          <li><a href="${url}" ${ext}>${name}</a></li>`).join('\n')}
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <p>&copy; 2026 Gaelic Burger &middot; 100% Irish Owned</p>
      <nav aria-label="Legal"><a href="/allergens">Allergens</a><a href="/privacy">Privacy</a></nav>
    </div>
  </div>
</footer>`;

const layout = ({ slug, title, desc, schema, top, body, noindex, preload }) => {
  const url = slug ? `${BASE}/${slug}` : BASE + '/';
  return `<!doctype html>
<html lang="en-IE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#0b4a28">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Gaelic Burger">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/images/og-image.jpg">
<meta property="og:locale" content="en_IE">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
<link rel="icon" type="image/png" sizes="48x48" href="/images/favicon.png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
${preload ? `<link rel="preload" as="image" href="${preload}" type="image/webp">\n` : ''}<link rel="stylesheet" href="/site.css">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${icons}

<div class="top wrap">
  <span class="glow glow-a" aria-hidden="true"></span>
  <span class="glow glow-b" aria-hidden="true"></span>
  ${header(slug ? '/' + slug : '/')}
${top}
</div>

<main id="main">
${body}
</main>

${footer}
</body>
</html>
`;
};

// ---------- reusable bits ----------
const pic = (name, alt, w, h, cls = '', lazy = true) => `<picture>
        <source srcset="/images/${name}.webp" type="image/webp">
        <img${cls ? ` class="${cls}"` : ''} src="/images/${name}.jpg" alt="${alt}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''}>
      </picture>`;
const crumbs3 = '<span class="crumbs" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
const stamp = `<div class="stamp" role="img" aria-label="Ireland's Best Burger"><span><small>Best in</small><b>Ireland</b><small>Burger</small></span></div>`;
const pageHero = ({ name, kicker, h1, lede, art, cta }) => `  <section class="page-hero">
    <div class="hero-copy">
      <p class="crumb-trail"><a href="/">Home</a><span aria-hidden="true">/</span><span>${name}</span></p>
      <p class="kicker">${kicker}</p>
      <h1>${h1}</h1>
      <p class="lede">${lede}</p>
      <div class="cta">${cta || `
        <a class="pill pill-leaf" href="${ORDER}" ${ext}>Order Online</a>
        <a class="call" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>${PHONE}</a>`}
      </div>
    </div>
    <div class="ph-art">
      ${art}
      ${crumbs3}
      ${stamp}
    </div>
  </section>`;
const awards = `<div class="awards">
      <div class="award"><svg aria-hidden="true"><use href="#shamrock"/></svg><span class="yr">2021</span><p>Best Burger in Leinster<small>Leinster, 2021</small></p></div>
      <div class="award"><svg aria-hidden="true"><use href="#shamrock"/></svg><span class="yr">2022</span><p>Best Gourmet Burger Specialist<small>Two years in a row</small></p></div>
    </div>`;
const ratingBand = `<div class="rating-band">
      <span class="score">4.7</span>
      <div><span class="stars" aria-hidden="true">★★★★★</span><strong>Rated 4.7 from 454 Google reviews</strong><p>See what people are saying, then come and judge for yourself.</p></div>
      <a class="pill pill-line" href="${MAPS}" ${ext}>Read the reviews</a>
    </div>`;
const hoursRows = `<tr><th scope="row">Mon – Thu</th><td>9am – 6:30pm</td></tr>
        <tr><th scope="row">Fri – Sat</th><td>9am – 8:30pm</td></tr>
        <tr><th scope="row">Sunday</th><td>10:30am – 7pm</td></tr>`;
const visitBlock = `<section class="wrap section section-tight" aria-labelledby="visit-h">
    <div class="visit">
      <div>
        <p class="kicker kicker-light">Come say hello</p>
        <h2 id="visit-h">Follow the rainbow to <em>Newhall.</em></h2>
        <p class="addr"><svg aria-hidden="true"><use href="#pin"/></svg>Newhall, Naas, Co. Kildare, W91 VK8P</p>
        <table class="hours">
        ${hoursRows}
        </table>
        <div class="cta">
          <a class="pill pill-leaf" href="${MAPS}" ${ext}>Get Directions</a>
          <a class="call call-light" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>${PHONE}</a>
        </div>
      </div>
      <div class="visit-art">
      ${pic('truck-day', 'Customers ordering at the Gaelic Burger truck in Newhall, Naas', 640, 480)}
      </div>
    </div>
  </section>`;
const sham = '<span class="ico"><svg aria-hidden="true"><use href="#shamrock"/></svg></span>';

// ---------- menu (confirmed items only, no prices: prices live on Just Eat) ----------
const menuCats = [
  { id: 'burgers', title: 'Burgers &amp; Subs', note: 'Cooked to order and served hot off the grill.', img: ['burger', 'Gaelic Burger bacon cheeseburger', 300, 320], items: [
    ['Gourmet Burgers', 'Our award-winning burgers, stacked high on a soft brioche bun.', 'Award winner'],
    ['Bacon Burger', 'Crispy bacon and melted cheese. A regulars\' favourite.'],
    ['Cheese Steak', 'Our steak sub, loaded and melting with cheese.'],
  ] },
  { id: 'chips', title: 'Chips &amp; Sides', note: 'Cut fresh to order from Irish grown potatoes.', img: ['fries', 'Loaded chips with cheese and curry sauce', 400, 600], items: [
    ['Fresh-Cut Chips', 'Cut fresh to order from Irish grown potatoes and cooked crisp.'],
    ['Garlic Chips', 'Fresh-cut chips with garlic sauce.'],
    ['Curry Cheese Chips', 'Fresh-cut chips with curry sauce and melted cheese.'],
    ['Loaded Fries', 'Fresh-cut chips piled high with toppings.'],
  ] },
  { id: 'breakfast', title: 'Breakfast', note: 'Served all day, 7 days a week.', items: [
    ['Breakfast Bap', 'A proper breakfast in a soft bap, served all day, 7 days a week.'],
  ] },
  { id: 'drinks', title: 'Coffee &amp; Drinks', note: 'Something to wash it all down.', items: [
    ['Coffee', 'Freshly made, to start the day or finish the meal.'],
    ['Soft Drinks', 'Cold cans and bottles.'],
  ] },
];
const menuHtml = menuCats.map((c) => `    <section class="menu-cat" id="${c.id}" aria-labelledby="${c.id}-h">
      <div class="cat-head">
        <div><h2 id="${c.id}-h">${c.title}</h2><p>${c.note}</p></div>${c.img ? `
        <img src="/images/${c.img[0]}.webp" alt="${c.img[1]}" width="${c.img[2]}" height="${c.img[3]}" loading="lazy">` : ''}
      </div>
      <ul class="items">
${c.items.map(([n, d, t]) => `        <li class="item">${sham}<div><h3>${n}${t ? ` <span class="tag">${t}</span>` : ''}</h3><p>${d}</p></div></li>`).join('\n')}
      </ul>
    </section>`).join('\n');

// ---------- pages ----------
const pages = [
  {
    slug: '',
    title: 'Gaelic Burger | Award-Winning Gourmet Burgers in Naas, Co. Kildare',
    desc: `100% Irish owned gourmet burgers in Newhall, Naas. Best Burger in Ireland 2021 and Best Gourmet Burger Specialist 2022. Order online or call ${PHONE}.`,
    schema: restaurant,
    preload: '/images/burger-stack.webp',
    top: `  <section class="hero">
    <div class="hero-copy">
      <p class="kicker">Farm to fork &middot; Naas, Co. Kildare</p>
      <h1>Ireland's Best Burger is <em>Right Here!</em></h1>
      <p class="lede">100% Irish owned and cooked to order in Newhall. Gourmet burgers, fresh-cut chips and coffee, open seven days a week.</p>
      <div class="cta">
        <a class="pill pill-leaf" href="${ORDER}" ${ext}>Order Now</a>
        <a class="call" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>${PHONE}</a>
      </div>
    </div>
    <div class="hero-art">
      <div class="panel" aria-hidden="true"><svg class="panel-leaf"><use href="#shamrock"/></svg></div>
      <img class="stack" src="/images/burger-stack.webp" alt="Gourmet burger with bacon, melted cheese, beef patties, burger sauce, lettuce and red onion" width="720" height="1292" fetchpriority="high">
      <span class="crumbs" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      ${stamp}
    </div>
    <article class="dish-pill dish-left">
      <img src="/images/burger.webp" alt="Gaelic Burger bacon cheeseburger" width="300" height="320" loading="lazy">
      <div>
        <h2>Bacon Burger</h2>
        <p>Crispy bacon and melted cheese on a soft brioche bun. A regulars' favourite.</p>
        <span class="mini"><b>4.7</b> ★ on Google</span>
      </div>
    </article>
    <article class="dish-pill dish-right">
      <div>
        <h2>Curry Cheese Chips</h2>
        <p>Fresh-cut chips with melted cheese and curry sauce.</p>
      </div>
      <img src="/images/fries.webp" alt="Loaded chips with cheese and curry sauce" width="400" height="600" loading="lazy">
    </article>
  </section>`,
    body: `<div class="band" aria-hidden="true">
  <div class="band-track">
${[1, 2].map(() => ['Best Burger in Leinster 2021', 'Best Gourmet Burger Specialist 2022', '100% Irish Owned', 'Farm to Fork', 'Open 7 Days'].map((t) => `    <span>${t}</span><svg><use href="#shamrock"/></svg>`).join('\n')).join('\n')}
  </div>
</div>

  <section class="wrap section center" aria-labelledby="fav-h">
    <div class="head">
      <p class="kicker">Fan favourites</p>
      <h2 id="fav-h">The ones people <em>drive out for.</em></h2>
    </div>
    <ol class="dishes">
      <li>${sham}<h3>Gourmet Burgers</h3><p>Stacked high and cooked to order.</p></li>
      <li>${sham}<h3>Bacon Burger</h3><p>Crispy bacon and melted cheese.</p></li>
      <li>${sham}<h3>Cheese Steak</h3><p>Loaded, melting and best eaten hot.</p></li>
      <li>${sham}<h3>Loaded Fries</h3><p>Fresh-cut and piled with toppings.</p></li>
      <li>${sham}<h3>Curry Cheese Chips</h3><p>Homemade chips, cheese and curry sauce.</p></li>
      <li>${sham}<h3>Breakfast Bap</h3><p>Served all day, 7 days a week. Great with a hot coffee.</p></li>
    </ol>
    <a class="pill pill-bottle" href="/menu">See the full menu</a>
  </section>

  <section class="wrap section section-tight" aria-labelledby="story-h">
    <div class="split">
      <div class="split-art">
      ${pic('truck-night', 'Customers queuing at the Gaelic Burger truck at a night event', 467, 428, 'pos-r')}
        <span class="badge-round">100%<br>Irish<br>Owned</span>
      </div>
      <div class="split-copy">
        <p class="kicker">Our story</p>
        <h2 id="story-h">Passion, quality, <em>farm to fork.</em></h2>
        <p>Gaelic Burger is 100% Irish owned and serves gourmet burgers cooked to order. Sit out in the fresh air at Newhall, or catch the truck at events.</p>
        <ul class="stats">
          <li><b>2021</b><span>Best Burger in Leinster</span></li>
          <li><b>2022</b><span>Best Gourmet Burger Specialist</span></li>
          <li><b>4.7★</b><span>454 Google reviews</span></li>
        </ul>
        <div class="cta"><a class="pill pill-line" href="/about">Read our story</a></div>
      </div>
    </div>
  </section>

  <section class="wrap section section-tight" aria-labelledby="fresh-h">
    <div class="split flip">
      <div class="split-art video">
        <iframe src="https://www.tiktok.com/player/v1/7592948758321663254?music_info=1&amp;description=1&amp;muted=1" title="Gaelic Burger set-up video on TikTok" allow="encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="split-copy">
        <p class="kicker">See our set-up</p>
        <h2 id="fresh-h">Chips cut fresh <em>to order.</em></h2>
        <p>Our chips are cut fresh to order from Irish grown potatoes. Here's a look at our set-up in Newhall.</p>
        <ul class="ticks">
          <li>Cut fresh to order, every time</li>
          <li>Irish grown potatoes</li>
          <li>Come visit Paddy the Leprechaun</li>
        </ul>
        <div class="cta"><a class="pill pill-leaf" href="https://www.tiktok.com/@gaelicburger/video/7592948758321663254" ${ext}>Watch on TikTok</a></div>
      </div>
    </div>
  </section>

  <section class="wrap section section-tight center" aria-labelledby="how-h">
    <div class="head">
      <p class="kicker">Three ways to get your fix</p>
      <h2 id="how-h">However you like it, <em>we've got you.</em></h2>
    </div>
    <ol class="grid3">
      <li class="card step"><span class="num" aria-hidden="true">01</span><span class="ico"><svg aria-hidden="true"><use href="#bag"/></svg></span><h3>Order online</h3><p>Get it delivered to your door through Just Eat.</p><a href="${ORDER}" ${ext}>Order on Just Eat →</a></li>
      <li class="card step"><span class="num" aria-hidden="true">02</span><span class="ico"><svg aria-hidden="true"><use href="#pin"/></svg></span><h3>Visit us</h3><p>Grab a seat outside at Newhall, Naas, and come visit Paddy the Leprechaun. Open seven days a week.</p><a href="/contact">Hours &amp; directions →</a></li>
      <li class="card step"><span class="num" aria-hidden="true">03</span><span class="ico"><svg aria-hidden="true"><use href="#phone"/></svg></span><h3>Give us a call</h3><p>Questions, allergies or anything else, we're happy to help.</p><a href="${TEL}">${PHONE} →</a></li>
    </ol>
  </section>

  <section class="wrap section section-tight" aria-label="Google rating">
    ${ratingBand}
  </section>

${visitBlock}

${orderBand}`,
  },
  {
    slug: 'menu',
    title: 'Menu | Gourmet Burgers, Chips &amp; Breakfast | Gaelic Burger, Naas',
    desc: 'Gourmet burgers, bacon burgers, cheese steak, fresh-cut chips, curry cheese chips, loaded fries, breakfast baps and coffee at Gaelic Burger, Newhall, Naas.',
    schema: crumbs('Menu', 'menu'),
    top: pageHero({
      name: 'Menu',
      kicker: 'What\'s cooking',
      h1: 'Our <em>Menu</em>',
      lede: 'Award-winning burgers, fresh-cut chips and a proper breakfast, all cooked to order. See live prices and order on Just Eat.',
      art: `<img class="capsule" src="/images/burger.webp" alt="Gaelic Burger bacon cheeseburger" width="300" height="320">`,
    }),
    body: `  <div class="wrap section section-tight">
    <nav class="menu-nav" aria-label="Menu sections">
${menuCats.map((c) => `      <a href="#${c.id}">${c.title}</a>`).join('\n')}
    </nav>
${menuHtml}
    <p class="note"><svg aria-hidden="true"><use href="#info"/></svg><span>Prices and the full range are on <a href="${ORDER}" ${ext}>Just Eat</a>. Got an allergy? Please tell us before you order. <a href="/allergens">Allergen info</a></span></p>
  </div>

${orderBand}`,
  },
  {
    slug: 'about',
    title: 'Our Story | 100% Irish Owned | Gaelic Burger, Naas',
    desc: 'Gaelic Burger is 100% Irish owned with a farm to fork approach. Best Burger in Leinster 2021 and Best Gourmet Burger Specialist 2022, in Newhall, Naas.',
    schema: crumbs('Our Story', 'about'),
    top: pageHero({
      name: 'Our Story',
      kicker: 'Our story',
      h1: 'Follow the <em>rainbow.</em>',
      lede: 'Ireland\'s most enchanting burger experience, right here in Newhall, Naas. 100% Irish owned and proud of it.',
      art: `<div class="capsule capsule-green"><img src="/images/burger-stack.webp" alt="Gourmet burger with bacon, melted cheese, beef patties, lettuce and burger sauce" width="720" height="1292"></div>`,
      cta: `
        <a class="pill pill-leaf" href="/menu">See the menu</a>
        <a class="pill pill-line" href="/contact">Find us</a>`,
    }),
    body: `  <section class="wrap section section-tight" aria-labelledby="who-h">
    <div class="split">
      <div class="split-art">
      ${pic('truck-day', 'The Gaelic Burger truck in Newhall, Naas', 640, 480)}
        <span class="badge-round">Farm<br>to<br>fork</span>
      </div>
      <div class="split-copy">
        <p class="kicker">Who we are</p>
        <h2 id="who-h">100% Irish owned. <em>Farm to fork.</em></h2>
        <p>Gaelic Burger is Irish owned from top to bottom. We keep things farm to fork: good ingredients, cooked to order and served hot.</p>
        <p>You'll find us in Newhall, just outside Naas, with outdoor seating and a proper welcome. Our breakfast bap is served all day, 7 days a week, alongside burgers, cheese steak and chips cut fresh to order from Irish grown potatoes.</p>
      </div>
    </div>
  </section>

  <section class="wrap section section-tight center" aria-labelledby="values-h">
    <div class="head">
      <p class="kicker">Written on the truck</p>
      <h2 id="values-h">Gourmet burgers. Passion. <em>Quality.</em></h2>
      <p>Three words on the side of our truck, and the way we run the place.</p>
    </div>
    <ul class="grid3">
      <li class="card">${sham}<h3>Gourmet Burgers</h3><p>Burgers built properly, cooked to order and served hot.</p></li>
      <li class="card">${sham}<h3>Passion</h3><p>We love what we do, and we think you can taste it.</p></li>
      <li class="card">${sham}<h3>Quality</h3><p>Good ingredients, chips cut fresh to order from Irish grown potatoes, and no shortcuts.</p></li>
    </ul>
  </section>

  <section class="wrap section section-tight" aria-labelledby="awards-h">
    <div class="head">
      <p class="kicker">Recognition</p>
      <h2 id="awards-h">Award-winning, <em>two years running.</em></h2>
    </div>
    ${awards}
  </section>

  <section class="wrap section section-tight" aria-label="Google rating">
    ${ratingBand}
  </section>

  <section class="wrap section section-tight" aria-labelledby="gal-h">
    <div class="head">
      <p class="kicker">Around Gaelic Burger</p>
      <h2 id="gal-h">Come and see <em>for yourself.</em></h2>
    </div>
    <div class="gallery">
      <img class="g1" src="/images/green-wall.webp" alt="The Gaelic Burger sign on a green plant wall" width="600" height="522" loading="lazy">
      <img class="g2" src="/images/burger.webp" alt="Bacon cheeseburger from Gaelic Burger" width="300" height="320" loading="lazy">
      ${pic('truck-night', 'The Gaelic Burger truck lit up at a night event', 467, 428, 'g3')}
    </div>
  </section>

${orderBand}`,
  },
  {
    slug: 'events',
    title: 'Events | Find the Gaelic Burger Truck | Naas, Co. Kildare',
    desc: 'The Gaelic Burger truck pops up at events. Follow us on Facebook, Instagram and TikTok to see where we\'ll be next, or call or email us to book the truck.',
    schema: crumbs('Events', 'events'),
    top: pageHero({
      name: 'Events',
      kicker: 'On the road',
      h1: 'Catch the <em>truck.</em>',
      lede: 'When we\'re not in Newhall, you might spot the Gaelic Burger truck at an event near you.',
      art: `<picture><source srcset="/images/truck-night.webp" type="image/webp"><img class="capsule" src="/images/truck-night.jpg" alt="Queue at the Gaelic Burger truck at a night event" width="467" height="428"></picture>`,
      cta: `
        <a class="pill pill-leaf" href="${SOCIAL.Facebook}" ${ext}>Follow on Facebook</a>
        <a class="call" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>${PHONE}</a>`,
    }),
    body: `  <section class="wrap section section-tight" aria-labelledby="where-h">
    <div class="split flip">
      <div class="split-art">
      <img src="/images/burger.webp" alt="Gaelic Burger bacon cheeseburger" width="300" height="320" loading="lazy">
        <span class="badge-round">On the<br>road</span>
      </div>
      <div class="split-copy">
        <p class="kicker">Where we'll be</p>
        <h2 id="where-h">Follow us to <em>find us.</em></h2>
        <p>Follow Gaelic Burger on Facebook, Instagram and TikTok for our latest news, specials and where to find the truck.</p>
        <ul class="ticks">
          <li>The same award-winning burgers, cooked fresh on the spot</li>
          <li>Latest news on Facebook, Instagram and TikTok</li>
        </ul>
        <div class="cta">
          <a class="pill pill-bottle" href="${SOCIAL.Instagram}" ${ext}>Instagram</a>
          <a class="pill pill-line" href="${SOCIAL.Facebook}" ${ext}>Facebook</a>
          <a class="pill pill-line" href="${SOCIAL.TikTok}" ${ext}>TikTok</a>
        </div>
      </div>
    </div>
  </section>

  <section class="wrap section section-tight center" aria-labelledby="plan-h">
    <div class="head">
      <p class="kicker">Planning something?</p>
      <h2 id="plan-h">Thinking of us for <em>your event?</em></h2>
      <p>Call or email us with your date, location and rough numbers, and we'll let you know if the truck is free.</p>
    </div>
    <div class="cta">
      <a class="pill pill-leaf" href="${TEL}">Call ${PHONE}</a>
      <a class="pill pill-line" href="mailto:${EMAIL}?subject=Food%20truck%20booking">Email ${EMAIL}</a>
    </div>
  </section>

  <section class="wrap section section-tight" aria-labelledby="ev-awards-h">
    <div class="head"><p class="kicker">Why people queue</p><h2 id="ev-awards-h">Award-winning burgers, <em>on the road.</em></h2></div>
    ${awards}
  </section>

${orderBand}`,
  },
  {
    slug: 'contact',
    title: 'Visit Us | Opening Hours &amp; Directions | Gaelic Burger, Naas',
    desc: `Gaelic Burger, Newhall, Naas, Co. Kildare, W91 VK8P. Open 7 days. Call ${PHONE}. Opening hours, directions and accessibility information.`,
    schema: crumbs('Visit Us', 'contact'),
    top: pageHero({
      name: 'Visit Us',
      kicker: 'Find us',
      h1: 'Come <em>hungry.</em>',
      lede: 'Newhall, Naas, Co. Kildare. Open seven days a week, from breakfast to dinner.',
      art: `<picture><source srcset="/images/truck-day.webp" type="image/webp"><img class="capsule" src="/images/truck-day.jpg" alt="The Gaelic Burger truck in Newhall, Naas" width="640" height="480"></picture>`,
      cta: `
        <a class="pill pill-leaf" href="${MAPS}" ${ext}>Get Directions</a>
        <a class="call" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>${PHONE}</a>`,
    }),
    body: `  <section class="wrap section section-tight" aria-label="Opening hours and contact details">
    <div class="info-grid">
      <div class="card">
        <h2>Opening hours</h2>
        <table class="hours">
          <tr><th scope="row">Monday</th><td>9:00am – 6:30pm</td></tr>
          <tr><th scope="row">Tuesday</th><td>9:00am – 6:30pm</td></tr>
          <tr><th scope="row">Wednesday</th><td>9:00am – 6:30pm</td></tr>
          <tr><th scope="row">Thursday</th><td>9:00am – 6:30pm</td></tr>
          <tr><th scope="row">Friday</th><td>9:00am – 8:30pm</td></tr>
          <tr><th scope="row">Saturday</th><td>9:00am – 8:30pm</td></tr>
          <tr><th scope="row">Sunday</th><td>10:30am – 7:00pm</td></tr>
        </table>
        <p class="small">Hours may differ on bank holidays. Check our Facebook page for updates.</p>
      </div>
      <div class="card">
        <h2>Get in touch</h2>
        <address><strong>Gaelic Burger</strong><br>Newhall, Naas<br>Co. Kildare, W91 VK8P</address>
        <a class="big-phone" href="${TEL}">${PHONE}</a>
        <a class="big-mail" href="mailto:${EMAIL}">${EMAIL}</a>
        <div class="cta">
          <a class="pill pill-leaf" href="${MAPS}" ${ext}>Directions</a>
          <a class="pill pill-line" href="${ORDER}" ${ext}>Order Online</a>
        </div>
        <h3>Good to know</h3>
        <ul class="ticks">
          <li>Outdoor seating</li>
          <li>Wheelchair accessible entrance, parking, seating and toilet</li>
          <li>Breakfast bap served all day, 7 days a week</li>
          <li>Come visit Paddy the Leprechaun</li>
        </ul>
      </div>
    </div>
    <div class="map">
      <iframe title="Map showing Gaelic Burger, Newhall, Naas" src="https://www.google.com/maps?q=Gaelic+Burger,+Newhall,+Naas,+W91+VK8P&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </section>

${orderBand}`,
  },
  {
    slug: 'allergens',
    title: 'Allergen Information | Gaelic Burger, Naas',
    desc: 'Allergen information for Gaelic Burger, Naas. Please tell our team about any allergies before ordering.',
    schema: crumbs('Allergens', 'allergens'),
    top: pageHero({
      name: 'Allergens',
      kicker: 'Eat safe',
      h1: 'Allergen <em>info</em>',
      lede: 'Got an allergy or intolerance? Talk to us before you order and we\'ll help you choose.',
      art: `<img class="capsule" src="/images/fries.webp" alt="Loaded chips with cheese and curry sauce" width="400" height="600">`,
      cta: `
        <a class="call" href="${TEL}"><span class="call-dot"><svg aria-hidden="true"><use href="#phone"/></svg></span>Ask us: ${PHONE}</a>`,
    }),
    body: `  <section class="wrap section section-tight">
    <div class="prose">
      <p>Our food is prepared in a kitchen that may handle any of the 14 major allergens. We take care to avoid cross-contamination, but we cannot guarantee that any dish is completely free from allergens.</p>
      <p>Please ask our team in person, or call <a href="${TEL}">${PHONE}</a>, before you order. If you order online, check the allergen details shown with each item on Just Eat.</p>
      <h2>The 14 allergens</h2>
      <ul class="chips">
        <li>Cereals containing gluten</li><li>Crustaceans</li><li>Eggs</li><li>Fish</li><li>Peanuts</li><li>Soybeans</li><li>Milk</li><li>Tree nuts</li><li>Celery</li><li>Mustard</li><li>Sesame</li><li>Sulphites</li><li>Lupin</li><li>Molluscs</li>
      </ul>
      <p>Recipes and suppliers can change, so please check with us every time you order.</p>
    </div>
  </section>`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy | Gaelic Burger',
    desc: 'How the Gaelic Burger website handles your information.',
    schema: crumbs('Privacy Policy', 'privacy'),
    top: pageHero({
      name: 'Privacy',
      kicker: 'The small print',
      h1: 'Privacy <em>policy</em>',
      lede: 'Short and simple: this website does not collect your personal information.',
      art: `<div class="capsule capsule-green"><img src="/images/burger-stack.webp" alt="Gourmet burger with bacon, melted cheese, beef patties, lettuce and burger sauce" width="720" height="1292"></div>`,
      cta: ' ',
    }),
    body: `  <section class="wrap section section-tight">
    <div class="prose">
      <p><em>Last updated: 10 November 2026</em></p>
      <h2>What we collect</h2>
      <p>This website does not ask for, collect or store any personal information. There are no forms, no accounts and no tracking or advertising cookies.</p>
      <h2>Third-party services</h2>
      <ul>
        <li><strong>Google Fonts</strong> loads the fonts on this site. Google may receive your IP address when the fonts load.</li>
        <li><strong>Google Maps</strong> is embedded on our Visit Us page and may set its own cookies when it loads.</li>
        <li><strong>Online ordering</strong> happens on Just Eat, which has its own privacy policy.</li>
        <li><strong>Social links</strong> take you to Facebook, Instagram, TikTok, LinkedIn and Tripadvisor, each with its own policy.</li>
      </ul>
      <h2>Hosting</h2>
      <p>This site is hosted by Vercel, which keeps basic server logs (such as IP addresses) for security and performance.</p>
      <h2>Your rights</h2>
      <p>Under GDPR you have the right to access, correct or delete personal data held about you. As this site collects none, there is usually nothing to request, but you can contact us on <a href="${TEL}">${PHONE}</a> or <a href="mailto:${EMAIL}">${EMAIL}</a> with any questions.</p>
    </div>
  </section>`,
  },
  {
    slug: '404',
    noindex: true,
    title: 'Page not found | Gaelic Burger',
    desc: 'This page could not be found.',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Page not found' },
    top: '',
    body: `  <section class="wrap notfound">
    <img src="/images/burger-stack.webp" alt="" width="720" height="1292">
    <h1>Ah, <em>feck.</em></h1>
    <p>That page has wandered off. Let's get you back to the burgers.</p>
    <div class="cta">
      <a class="pill pill-leaf" href="/">Back home</a>
      <a class="pill pill-line" href="/menu">See the menu</a>
    </div>
  </section>`,
  },
];

for (const p of pages) fs.writeFileSync(path.join(root, (p.slug || 'index') + '.html'), layout(p));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${BASE}/${p.slug}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log('built', pages.map((p) => p.slug || 'index').join(', '));
