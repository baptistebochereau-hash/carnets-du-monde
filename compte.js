// Espace "Mon compte" : mes pays et mes commentaires
(function(){
  const st=document.createElement("style");
  st.textContent=".chip{display:inline-flex;align-items:center;gap:6px;background:var(--card);border:1px solid var(--bd);border-radius:999px;padding:6px 12px;margin:0 8px 8px 0;cursor:pointer;color:var(--fg);font:inherit}.chip:hover{border-color:var(--acc)}#accbtn{position:fixed;top:calc(env(safe-area-inset-top,0px) + 58px);right:14px;z-index:20;box-shadow:0 2px 10px rgba(0,0,0,.2)}#account h2{font-size:1.9rem}#account h3{font-family:Georgia,serif;margin:28px 0 10px}.post .meta a{color:var(--acc);cursor:pointer;text-decoration:underline}";
  document.head.append(st);
  const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
  const sec=el("main");sec.id="account";sec.hidden=true;document.body.append(sec);
  const btn=el("button","edit","👤 Mon compte");btn.id="accbtn";btn.hidden=true;
  btn.onclick=()=>{location.hash="compte"};document.body.append(btn);

  function render(){
    btn.hidden=!me;
    if(location.hash!=="#compte")return;
    sec.textContent="";
    const back=el("button","back","← Accueil");back.onclick=()=>{location.hash="pays"};
    sec.append(back,el("h2",null,"Mon compte"));
    if(!me){sec.append(el("p","sub","Connecte-toi pour voir tes souvenirs et tes pays."));return}
    sec.append(el("p","sub",me.email));
    const mine=posts.filter(p=>p.user_id===me.id);
    const names=[...new Set(mine.map(p=>p.country))].map(c=>({c,n:nm(c)})).sort((a,b)=>a.n.localeCompare(b.n,"fr"));
    sec.append(el("h3",null,"Mes pays ("+names.length+" sur "+CODES.length+")"));
    if(!names.length)sec.append(el("p","msg","Tu n'as pas encore partagé de souvenir. Choisis un pays pour commencer !"));
    names.forEach(x=>{const b=el("button","chip",flag(x.c)+" "+x.n);b.onclick=()=>{location.hash=x.c};sec.append(b)});
    const vil=new Map();
    mine.forEach(p=>[p.city,...photosOf(p).map(x=>x.city)].filter(Boolean).forEach(c=>vil.set(c+"|"+p.country,{c,k:p.country})));
    if(vil.size){
      sec.append(el("h3",null,"Mes villes ("+vil.size+")"));
      [...vil.values()].sort((a,b)=>a.c.localeCompare(b.c,"fr")).forEach(v=>{const b=el("button","chip","📍 "+v.c+" · "+flag(v.k)+" "+nm(v.k));b.onclick=()=>{location.hash=v.k};sec.append(b)});
    }
    sec.append(el("h3",null,"Mes commentaires ("+mine.length+")"));
    mine.forEach(p=>{
      const d=el("article","post");
      const ph=photosOf(p);
      if(ph.length&&sb){
        const g=el("div","pgrid"+(ph.length===1?" one":""));
        ph.forEach(x=>{const f=el("figure");const i=el("img");i.src=pub(x.path);i.alt="";i.loading="lazy";f.append(i);if(x.city)f.append(el("figcaption",null,"📍 "+x.city));g.append(f)});
        d.append(g);
      }
      const w=el("div");
      if(p.city)w.append(el("p","city","📍 "+p.city));
      if(p.text)w.append(el("p",null,p.text));
      const m=el("div","meta");m.style.padding="0";
      const a=el("a",null,flag(p.country)+" "+nm(p.country));a.onclick=()=>{location.hash=p.country};
      m.append(a,el("span",null,new Date(p.created_at).toLocaleDateString("fr-FR")));
      const x=el("button",null,"Supprimer");x.onclick=()=>delPost(p);m.append(x);
      w.append(m);d.append(w);sec.append(d);
    });
  }
  function show(){
    const on=location.hash==="#compte";
    sec.hidden=!on;
    if(on){$("home").hidden=true;$("country").hidden=true;render();window.scrollTo(0,0)}
  }
  window.addEventListener("hashchange",show);
  const orig=renderPosts;
  renderPosts=function(){orig();render()};
  show();
})();
})();
