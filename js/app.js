/* UI layer: hash router, views, event delegation. */
const $=(s,e=document)=>e.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const F={cat:'All',q:'',sort:'featured'};
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)};

const card=p=>`<article class="card glass"><div class="emo" aria-hidden="true">${esc(p.emoji)}</div><span class="tag">${esc(p.category)}</span>
<h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="row"><b>${money(p.price)}</b>
<button class="btn" data-act="add" data-id="${p.id}" ${p.stock<1?'disabled':''}>${p.stock<1?'Sold out':'Add'}</button></div>
<small class="mono">${p.stock>0?p.stock+' in stock':'Out of stock'}</small></article>`;

function grid(){
  let l=Store.products().filter(p=>(F.cat==='All'||p.category===F.cat)&&(p.name+p.desc).toLowerCase().includes(F.q.toLowerCase()));
  if(F.sort==='low')l.sort((a,b)=>a.price-b.price);if(F.sort==='high')l.sort((a,b)=>b.price-a.price);if(F.sort==='name')l.sort((a,b)=>a.name.localeCompare(b.name));
  $('#grid').innerHTML=l.length?l.map(card).join(''):'<p class="empty">No products match your filters.</p>';
}
const chips=()=>Store.categories().map(c=>`<button class="chip ${c===F.cat?'on':''}" data-act="cat" data-v="${esc(c)}" aria-pressed="${c===F.cat}">${esc(c)}</button>`).join('');

const views={
  shop:()=>`<section class="hero glass"><h1>Gear up with ShopSphere</h1><p>Capstone storefront — browse, filter, add to cart and place orders.</p></section>
  <div class="toolbar"><input id="q" type="search" placeholder="Search products…" aria-label="Search products" value="${esc(F.q)}">
  <select id="sort" aria-label="Sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option></select></div>
  <div class="chips" id="chips">${chips()}</div><div class="grid" id="grid"></div>`,
  login:()=>`<section class="panel glass"><h2 id="ft">Sign in</h2><form class="form" id="auth" novalidate>
  <label id="nl" hidden>Name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email" required></label>
  <label>Password<input name="pw" type="password" autocomplete="current-password" required></label><div class="err" id="err" role="alert"></div>
  <button class="btn">Continue</button><button type="button" class="btn ghost" data-act="mode">Create an account instead</button></form>
  <p class="mono" style="margin-top:1rem;color:var(--mu)">Demo → demo@shop.dev / demo123 · Admin → admin@shop.dev / admin123</p></section>`,
  orders(){const u=Auth.current();const o=Store.orders().filter(x=>u.role==='admin'||x.email===u.email);
    return `<section class="panel glass"><h2>${u.role==='admin'?'All orders':'My orders'}</h2>`+(o.length?o.map(x=>`<div class="line"><div><b class="mono">${x.id}</b><br><small>${new Date(x.date).toLocaleString()} · ${esc(x.email)}</small><br><small>${x.items.map(i=>esc(i.name)+' ×'+i.qty).join(', ')}</small></div><b>${money(x.total)}</b></div>`).join(''):'<p class="empty">No orders yet.</p>')+'</section>'},
  admin:()=>`<section class="panel glass"><h2 id="fh">Add product</h2><form class="form wide" id="pf" novalidate><input type="hidden" name="id">
  <label>Name<input name="name" required></label><label>Category<input name="category" required></label><label>Price (₹)<input name="price" type="number" min="1" required></label>
  <label>Stock<input name="stock" type="number" min="0" required></label><label>Emoji<input name="emoji" maxlength="4" value="📦"></label><label>Description<input name="desc"></label>
  <div class="err" id="err" role="alert"></div><div class="row"><button class="btn">Save product</button><button type="button" class="btn ghost" data-act="reset">Clear</button></div></form></section>
  <section class="panel glass tw"><h2>Inventory</h2><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
  ${Store.products().map(p=>`<tr><td>${esc(p.emoji)} ${esc(p.name)}</td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td>${p.stock}</td>
  <td><button class="btn ghost" data-act="edit" data-id="${p.id}">Edit</button> <button class="btn danger" data-act="del" data-id="${p.id}">Delete</button></td></tr>`).join('')}</tbody></table></section>`
};

function route(){
  const r=(location.hash.replace('#/','')||'shop').split('?')[0],u=Auth.current();
  let v=views[r]?r:'shop';
  if(v==='orders'&&!u)v='login';
  if(v==='admin'&&(!u||u.role!=='admin')){toast('Admin access only');v=u?'shop':'login'}
  $('#app').innerHTML=views[v]();document.title=`ShopSphere — ${v[0].toUpperCase()+v.slice(1)}`;
  $('#nav').innerHTML=[['shop','Shop'],...(u?[['orders','Orders']]:[]),...(u?.role==='admin'?[['admin','Admin']]:[]),...(u?[]:[['login','Sign in']])]
    .map(([k,l])=>`<a href="#/${k}" class="${k===v?'on':''}">${l}</a>`).join('')+(u?`<a href="#" data-act="logout">Sign out (${esc(u.name)})</a>`:'');
  if(v==='shop'){$('#sort').value=F.sort;grid()}
  cartUI();
}
function cartUI(){
  const c=Store.cart();$('#count').textContent=Store.count();
  $('#drawer').innerHTML=`<div class="row"><h2>Your cart</h2><button class="icon" data-act="cart" aria-label="Close cart">✕</button></div>`+
  (c.length?c.map(i=>{const p=Store.product(i.id);return `<div class="line"><div>${esc(p.emoji)} ${esc(p.name)}<br><small>${money(p.price)}</small></div>
  <div class="qty"><button data-act="dec" data-id="${i.id}" aria-label="Decrease">−</button><span>${i.qty}</span><button data-act="inc" data-id="${i.id}" aria-label="Increase">+</button></div></div>`}).join('')
  +`<div class="row" style="margin:1rem 0"><b>Total</b><b>${money(Store.total())}</b></div><button class="btn" style="width:100%" data-act="checkout">Place order</button>`
  :'<p class="empty">Your cart is empty.</p>');
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id;
  if(a==='theme'){const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('ss.theme',t)}catch{}}
  else if(a==='cart')$('#drawer').classList.toggle('open');
  else if(a==='cat'){F.cat=b.dataset.v;$('#chips').innerHTML=chips();grid()}
  else if(a==='add'){Store.add(id);cartUI();toast('Added to cart')}
  else if(a==='inc'||a==='dec'){Store.add(id,a==='inc'?1:-1);cartUI()}
  else if(a==='logout'){e.preventDefault();Auth.logout();location.hash='#/shop';route();toast('Signed out')}
  else if(a==='mode'){const reg=$('#nl').hidden;$('#nl').hidden=!reg;$('#ft').textContent=reg?'Create account':'Sign in';b.textContent=reg?'I already have an account':'Create an account instead';$('#auth').dataset.reg=reg?'1':''}
  else if(a==='checkout'){const u=Auth.current();if(!u){$('#drawer').classList.remove('open');location.hash='#/login';return toast('Sign in to checkout')}
    try{const o=Store.checkout(u);$('#drawer').classList.remove('open');toast('Order '+o.id+' placed!');location.hash='#/orders';route()}catch(x){toast(x.message)}}
  else if(a==='edit'){const p=Store.product(id),f=$('#pf');Object.keys(p).forEach(k=>f.elements[k]&&(f.elements[k].value=p[k]));$('#fh').textContent='Edit product';f.scrollIntoView({behavior:'smooth'})}
  else if(a==='del'){if(confirm('Delete this product?')){Store.remove(id);route();toast('Product deleted')}}
  else if(a==='reset'){$('#pf').reset();$('#pf').elements.id.value='';$('#fh').textContent='Add product'}
});
document.addEventListener('input',e=>{if(e.target.id==='q'){F.q=e.target.value;grid()}});
document.addEventListener('change',e=>{if(e.target.id==='sort'){F.sort=e.target.value;grid()}});
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f)),err=$('#err');
  try{
    if(f.id==='auth'){f.dataset.reg?Auth.register(d.name||'',d.email,d.pw):Auth.login(d.email,d.pw);location.hash='#/shop';route();toast('Welcome!')}
    if(f.id==='pf'){const price=+d.price,stock=+d.stock;
      if(!d.name.trim()||!d.category.trim()) throw new Error('Name and category are required.');
      if(!(price>0)||!(stock>=0)||!Number.isInteger(stock)) throw new Error('Enter a valid price and stock.');
      Store.save({id:d.id,name:d.name.trim(),category:d.category.trim(),price,stock,emoji:d.emoji||'📦',desc:d.desc.trim()});route();toast('Product saved')}
  }catch(x){err.textContent=x.message}
});
addEventListener('hashchange',route);route();
