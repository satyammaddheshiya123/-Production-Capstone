/* Simulated authentication. NOT secure — passwords live in localStorage for demo only. */
const Auth = (() => {
  const U='ss.users', S='ss.session';
  const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
  const users=()=>{let u=read(U,null);if(!u){u=SEED_USERS;localStorage.setItem(U,JSON.stringify(u))}return u};
  return {
    current(){const e=read(S,null);return users().find(u=>u.email===e)||null},
    login(email,pw){
      const u=users().find(x=>x.email===email.trim().toLowerCase()&&x.password===pw);
      if(!u) throw new Error('Invalid email or password.');
      localStorage.setItem(S,JSON.stringify(u.email));return u;
    },
    register(name,email,pw){
      email=email.trim().toLowerCase();
      if(name.trim().length<2) throw new Error('Enter your name.');
      if(!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email.');
      if(pw.length<6) throw new Error('Password needs 6+ characters.');
      const all=users(); if(all.some(u=>u.email===email)) throw new Error('Email already registered.');
      const u={name:name.trim(),email,password:pw,role:'customer'};
      all.push(u);localStorage.setItem(U,JSON.stringify(all));localStorage.setItem(S,JSON.stringify(email));return u;
    },
    logout(){localStorage.removeItem(S)}
  };
})();
