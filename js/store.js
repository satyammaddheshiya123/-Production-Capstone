/* Data layer: products (CRUD), cart, orders — all persisted in localStorage. */
const Store = (() => {
  const K={p:'ss.products',c:'ss.cart',o:'ss.orders'};
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const products=()=>{let p=read(K.p,null);if(!p){p=SEED_PRODUCTS;write(K.p,p)}return p};
  const cart=()=>read(K.c,[]);
  return {
    products,cart,orders:()=>read(K.o,[]),
    product:id=>products().find(p=>p.id===id),
    categories:()=>['All',...new Set(products().map(p=>p.category))],
    save(p){const all=products();const i=all.findIndex(x=>x.id===p.id);
      if(i<0){p.id='p'+Date.now();all.push(p)}else all[i]=p;write(K.p,all);return p},
    remove(id){write(K.p,products().filter(p=>p.id!==id));write(K.c,cart().filter(i=>i.id!==id))},
    add(id,d=1){const p=this.product(id),c=cart();let l=c.find(i=>i.id===id);
      if(!l){l={id,qty:0};c.push(l)} l.qty=Math.max(0,Math.min(p.stock,l.qty+d));
      write(K.c,c.filter(i=>i.qty>0))},
    count:()=>cart().reduce((n,i)=>n+i.qty,0),
    total:()=>cart().reduce((n,i)=>n+i.qty*(Store.product(i.id)?.price||0),0),
    checkout(user){
      const items=cart().map(i=>({...i,...Store.product(i.id)})); if(!items.length) throw new Error('Cart is empty.');
      const all=products(); items.forEach(i=>{all.find(p=>p.id===i.id).stock-=i.qty}); write(K.p,all);
      const o={id:'ORD-'+Date.now().toString().slice(-6),email:user.email,date:new Date().toISOString(),
        items:items.map(i=>({name:i.name,price:i.price,qty:i.qty})),total:items.reduce((n,i)=>n+i.price*i.qty,0)};
      write(K.o,[o,...this.orders()]);write(K.c,[]);return o;
    }
  };
})();
