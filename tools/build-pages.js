// Generates the inner pages, reusing the homepage header and footer so they stay in sync.
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

const page = ({ slug, title, desc, body, schema, noindex }) => `<!doctype html>
<html lang="en-IE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${base}/${slug}">`}
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

const item = (name, desc, price, tag) => `        <li><img src="/images/shamrock.svg" alt="" width="30" height="30"><div><h3>${name}${tag ? ` <span class="tag">${tag}</span>` : ''}</h3><p>${desc}</p></div>${price ? `<span class="price">€${price}</span>` : ''}</li>`;

const menuSection = (id, title, note, items) => `    <section class="menu-section" aria-labelledby="${id}">
      <h2 id="${id}">${title}</h2>
      ${note ? `<p class="menu-note">${note}</p>` : ''}
      <ul class="food-list menu-list">
${items.join('\n')}
      </ul>
    </section>`;

const awards = `    <div class="award a1"><span class="award-year">2021</span><span class="award-name">Best Burger<br>in Leinster</span><span class="award-cup" aria-hidden="true">🏆</span></div>
    <div class="award a2"><span class="award-year">2022</span><span class="award-name">Best Gourmet<br>Burger Specialist</span><span class="award-cup" aria-hidden="true">🏆</span></div>`;

const illustration = `    <figure class="story-illo">
      <img src="/images/burger-illustration.svg" alt="Illustrated burger with an Irish flag pick" width="400" height="400" loading="lazy">
    </figure>`;

// PLACEHOLDER menu for the client demo: items beyond those confirmed in reviews, and all prices, must be replaced with the real menu before launch.
const menu = [
  menuSection('m-breakfast', 'Breakfast', 'From 9am (10:30am Sundays)', [
    item('Breakfast Bap', 'Sausage, crispy bacon and a fried egg in a soft bap. Great days start here.', '5.00', 'Special'),
    item('Breakfast Roll', 'Sausage, bacon, egg and pudding in a crusty roll.', '6.50'),
    item('Bacon &amp; Cheese Toastie', 'Crispy bacon and melted Irish cheddar, toasted.', '5.50'),
  ]),
  menuSection('m-burgers', 'Burgers &amp; Subs', 'All burgers served on a toasted brioche bun', [
    item('The Gaelic Classic', 'Irish beef patty, cheddar, lettuce, tomato, pickles and house sauce.', '11.50', 'Award winner'),
    item('Bacon Burger', 'Loaded with crispy bacon and melted cheese. A regular favourite.', '12.95'),
    item('Double Smash', 'Two smashed patties, double cheese, onions and burger sauce.', '14.50'),
    item('Crispy Chicken Burger', 'Buttermilk fried chicken, slaw, pickles and garlic mayo.', '11.95'),
    item('Veggie Burger', 'Spiced veggie patty, cheddar, lettuce, tomato and relish.', '10.95'),
    item('Cheese Steak', 'Our steak sub, stacked high and dripping with cheese.', '13.50'),
  ]),
  menuSection('m-chips', 'Chips &amp; Sides', 'Our chips are cut fresh every day', [
    item('Fresh Cut Chips', 'Homemade, cut fresh and cooked crisp. Generous portions.', '4.00'),
    item('Garlic Chips', 'Fresh-cut chips with garlic sauce.', '5.00'),
    item('Curry Cheese Chips', 'Fresh-cut chips with curry sauce and melted cheese.', '6.00'),
    item('Loaded Fries', 'Fresh-cut chips with cheese, bacon bits, scallions and house sauce.', '8.50'),
    item('Onion Rings', 'Golden, crunchy and made for dipping.', '4.50'),
  ]),
  menuSection('m-drinks', 'Drinks', '', [
    item('Coffee', 'Americano, latte or cappuccino.', '3.50'),
    item('Tea', 'A proper cup of Irish tea.', '2.50'),
    item('Soft Drinks', 'Cans and bottles.', '2.50'),
    item('Milkshake', 'Chocolate, strawberry or vanilla.', '5.50'),
  ]),
].join('\n');

const pages = [
  {
    slug: 'menu',
    title: 'Menu | Gaelic Burger, Naas',
    desc: 'Gourmet burgers, cheese steak, breakfast baps, fresh-cut chips, loaded fries and coffee at Gaelic Burger, Newhall, Naas. Order online for delivery.',
    schema: crumbs('Menu', 'menu'),
    body: `${pageHero("What's cooking", 'The <span class="hl">Menu</span>', "Everything is cooked to order. Order online for delivery, or call ahead and we'll have it ready.")}
  <div class="menu-wrap">
${menu}
    <p class="menu-note">Please tell us about any allergies before ordering. <a href="/allergens">Allergen info</a></p>
    <aside class="order-card">
      <h2>Hungry now?</h2>
      <p>Order online for delivery, or give us a call.</p>
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
${illustration}
    <div>
      <h2>100% Irish owned. <span class="hl">Farm to fork.</span></h2>
      <p>Gaelic Burger is Irish owned from top to bottom. We believe a great burger starts with great Irish produce, so we keep things farm to fork: good ingredients, cooked to order and served without shortcuts.</p>
      <p>Our chips are cut fresh, our portions are generous, and every burger is built the way we'd want it ourselves.</p>
    </div>
  </section>

  <section class="awards" aria-label="Awards">
${awards}
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
    slug: 'events',
    title: 'Events & Catering | Gaelic Burger Food Truck, Kildare',
    desc: 'Book the award-winning Gaelic Burger truck for festivals, weddings, parties and corporate events across Kildare and Leinster. Call +353 45 916 090.',
    schema: crumbs('Events & Catering', 'events'),
    body: `${pageHero('Bring the truck', 'Events &amp; <span class="hl">Catering</span>', 'Award-winning burgers, cooked fresh on site at your festival, wedding, party or work do.')}
  <section class="about-grid">
    <figure class="polaroid tilt-l">
      <picture>
        <source srcset="/images/truck-night.webp" type="image/webp">
        <img src="/images/truck-night.jpg" alt="Queue at the Gaelic Burger truck at a night event" width="467" height="428" loading="lazy">
      </picture>
      <figcaption>Feeding the crowd</figcaption>
    </figure>
    <div>
      <h2>We'll feed the <span class="hl">whole crowd.</span></h2>
      <p>The Gaelic Burger truck is fully self-contained, so we can set up almost anywhere. We serve gourmet burgers, fresh-cut chips, loaded fries and soft drinks, cooked to order right in front of your guests.</p>
      <ul class="ticks">
        <li>Festivals and outdoor events</li>
        <li>Weddings and private parties</li>
        <li>Corporate and staff events</li>
        <li>Sports clubs and community days</li>
      </ul>
      <div class="actions">
        <a class="btn" href="tel:+35345916090">Call to book</a>
        <a class="btn btn-ghost-dark" href="/menu">See the menu</a>
      </div>
    </div>
  </section>
  <section class="awards" aria-label="Awards">
${awards}
  </section>
  <section class="prose">
    <h2>How booking works</h2>
    <p>Give us a call on <a href="tel:+35345916090">+353 45 916 090</a> with your date, location and rough guest numbers. We'll talk through the menu and put together a quote for your event.</p>
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
  {
    slug: 'allergens',
    title: 'Allergen Information | Gaelic Burger, Naas',
    desc: 'Allergen information for Gaelic Burger, Naas. Tell our team about any allergies before ordering and we will help you choose.',
    schema: crumbs('Allergens', 'allergens'),
    body: `${pageHero('Eat safe', 'Allergen <span class="hl">Info</span>', 'Got an allergy or intolerance? Talk to us before you order and we will look after you.')}
  <section class="prose">
    <p>Our food is prepared in a kitchen that handles all 14 major allergens. While we take care to prevent cross-contamination, we cannot guarantee any dish is completely free from allergens.</p>
    <p>Full allergen details for every item are available from our team. Please ask in person, or call <a href="tel:+35345916090">+353 45 916 090</a> before you order. If you order online, check the allergen details shown with each item.</p>
    <h2>The 14 allergens</h2>
    <ul class="allergen-grid">
      <li>Cereals containing gluten</li><li>Crustaceans</li><li>Eggs</li><li>Fish</li><li>Peanuts</li><li>Soybeans</li><li>Milk</li><li>Nuts</li><li>Celery</li><li>Mustard</li><li>Sesame</li><li>Sulphites</li><li>Lupin</li><li>Molluscs</li>
    </ul>
    <p>Recipes and suppliers can change, so please check with us every time you order.</p>
  </section>`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy | Gaelic Burger',
    desc: 'How the Gaelic Burger website handles your information.',
    schema: crumbs('Privacy Policy', 'privacy'),
    body: `${pageHero('The small print', 'Privacy <span class="hl">Policy</span>', 'Short and simple.')}
  <section class="prose">
    <p><em>Last updated: 22 October 2026</em></p>
    <h2>What we collect</h2>
    <p>This website does not ask for, collect or store any personal information. There are no forms, no accounts and no tracking or advertising cookies.</p>
    <h2>Third-party services</h2>
    <ul>
      <li><strong>Google Fonts</strong> loads the fonts on this site. Google may receive your IP address when fonts load.</li>
      <li><strong>Google Maps</strong> is embedded on our Find Us page and may set its own cookies when it loads.</li>
      <li><strong>Online ordering</strong> takes place on Deliveroo, which has its own privacy policy.</li>
      <li><strong>Social links</strong> take you to Facebook, Instagram, LinkedIn and Tripadvisor, each with their own policies.</li>
    </ul>
    <h2>Hosting</h2>
    <p>This site is hosted by Vercel, which keeps basic server logs (such as IP addresses) for security and performance.</p>
    <h2>Your rights</h2>
    <p>Under GDPR you have the right to access, correct or delete personal data we hold about you. As this site collects none, there is usually nothing to request, but you can contact us on <a href="tel:+35345916090">+353 45 916 090</a> with any questions.</p>
  </section>`,
  },
  {
    slug: '404',
    noindex: true,
    title: 'Page not found | Gaelic Burger',
    desc: 'This page could not be found.',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Page not found' },
    body: `  <section class="notfound">
    <img src="/images/burger-illustration.svg" alt="" width="400" height="400">
    <h1>Ah, <span class="hl">feck.</span></h1>
    <p>That page has wandered off. Let's get you back to the burgers.</p>
    <div class="actions">
      <a class="btn" href="/">Back home</a>
      <a class="btn btn-ghost-dark" href="/menu">See the menu</a>
    </div>
  </section>`,
  },
];

for (const p of pages) fs.writeFileSync(path.join(root, p.slug + '.html'), page(p));
console.log('built', pages.map(p => p.slug).join(', '));
