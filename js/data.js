/* Seed data — loaded only on first run; afterwards localStorage is the source of truth. */
window.SEED_PRODUCTS = [
  {id:'p1',name:'Aero Wireless Headphones',category:'Audio',price:4999,stock:12,emoji:'🎧',desc:'40-hour battery, active noise cancelling.'},
  {id:'p2',name:'Pulse Smartwatch',category:'Wearables',price:6499,stock:8,emoji:'⌚',desc:'AMOLED display, heart-rate and sleep tracking.'},
  {id:'p3',name:'Nimbus Mechanical Keyboard',category:'Accessories',price:3299,stock:15,emoji:'⌨️',desc:'Hot-swappable switches with teal backlight.'},
  {id:'p4',name:'Orbit Bluetooth Speaker',category:'Audio',price:2799,stock:20,emoji:'🔊',desc:'Waterproof 360° sound, 12-hour playtime.'},
  {id:'p5',name:'Vertex Gaming Mouse',category:'Accessories',price:1899,stock:0,emoji:'🖱️',desc:'16K DPI optical sensor, ultra-light shell.'},
  {id:'p6',name:'Lumen Desk Lamp',category:'Home',price:1499,stock:25,emoji:'💡',desc:'Dimmable LED with wireless charging base.'},
  {id:'p7',name:'Stride Fitness Band',category:'Wearables',price:1999,stock:30,emoji:'📿',desc:'Lightweight tracker with 14-day battery.'},
  {id:'p8',name:'Brew Smart Mug',category:'Home',price:2299,stock:9,emoji:'☕',desc:'Keeps drinks at your chosen temperature.'}
];
window.SEED_USERS = [
  {name:'Admin',email:'admin@shop.dev',password:'admin123',role:'admin'},
  {name:'Demo User',email:'demo@shop.dev',password:'demo123',role:'customer'}
];
