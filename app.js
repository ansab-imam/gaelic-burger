const MENU = [
  { id: 'classic', name: 'The Classic Gael', desc: 'Irish beef, Dubliner cheddar, lettuce, tomato, house sauce.', price: 11.5, emoji: '🍔' },
  { id: 'guinness', name: 'The Guinness Glaze', desc: 'Beef patty, Guinness-onion jam, smoked bacon, Irish cheddar.', price: 13.5, emoji: '🍺' },
  { id: 'emerald', name: 'The Emerald Isle', desc: 'Crispy chicken, herb mayo, pickles, shredded cabbage.', price: 12, emoji: '🍗' },
  { id: 'veggie', name: 'The Shamrock Veg', desc: 'Potato & leek patty, pesto, rocket, goat cheese.', price: 11, emoji: '☘️' },
  { id: 'chips', name: 'Chunky Chips', desc: 'Thick-cut Irish rooster potato chips, sea salt.', price: 4, emoji: '🍟' },
  { id: 'shake', name: 'Mint Shake', desc: 'Creamy mint milkshake, as green as the hills.', price: 5, emoji: '🥤' },
];
const cart = {};
const $ = id => document.getElementById(id);
const eur = n => '€' + n.toFixed(2);

$('menuGrid').innerHTML = MENU.map(m => `
  <div class="card"><div class="emoji">${m.emoji}</div><h3>${m.name}</h3><p>${m.desc}</p>
  <div class="row"><span class="price">${eur(m.price)}</span><button class="add" data-id="${m.id}">Add</button></div></div>`).join('');

function render() {
  const ids = Object.keys(cart);
  $('cartCount').textContent = ids.reduce((s, id) => s + cart[id], 0);
  $('cartItems').innerHTML = ids.length ? ids.map(id => {
    const m = MENU.find(x => x.id === id);
    return `<div class="line"><span>${m.name}<br><small>${eur(m.price * cart[id])}</small></span>
      <span class="qty"><button data-dec="${id}">−</button> ${cart[id]} <button data-inc="${id}">+</button></span></div>`;
  }).join('') : '<p>Your basket is empty.</p>';
  $('cartTotal').textContent = eur(ids.reduce((s, id) => s + MENU.find(x => x.id === id).price * cart[id], 0));
}

const toggle = open => { $('cart').classList.toggle('open', open); $('overlay').classList.toggle('show', open); };
document.addEventListener('click', e => {
  const t = e.target.dataset;
  if (t.id) { cart[t.id] = (cart[t.id] || 0) + 1; render(); toggle(true); }
  if (t.inc) { cart[t.inc]++; render(); }
  if (t.dec) { if (--cart[t.dec] <= 0) delete cart[t.dec]; render(); }
});
$('openCart').onclick = () => toggle(true);
$('closeCart').onclick = $('overlay').onclick = () => toggle(false);
$('checkout').onsubmit = e => {
  e.preventDefault();
  if (!Object.keys(cart).length) return alert('Add a burger first!');
  // TODO: send order to the shop (email / WhatsApp / payment) once a channel is chosen
  for (const k in cart) delete cart[k];
  e.target.reset(); render(); toggle(false); $('done').hidden = false;
};
$('closeDone').onclick = () => $('done').hidden = true;
$('yr').textContent = new Date().getFullYear();
render();
