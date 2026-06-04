/* GlobeOne — shared interactions */
(function(){
  'use strict';

  /* ---- header scroll state ---- */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if(burger && links){
    burger.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open'); burger.classList.remove('open');
      });
    });
  }

  /* ---- theme toggle (injected; init handled by inline head script) ---- */
  var navCta = document.querySelector('.nav__cta');
  if(navCta){
    var tt = document.createElement('button');
    tt.className = 'theme-toggle';
    tt.type = 'button';
    tt.setAttribute('aria-label','Switch between light and dark theme');
    tt.innerHTML =
      '<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>' +
      '<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z"/></svg>';
    navCta.insertBefore(tt, navCta.firstChild);
    tt.addEventListener('click', function(){
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if(isLight){ document.documentElement.removeAttribute('data-theme'); }
      else { document.documentElement.setAttribute('data-theme','light'); }
      try{ localStorage.setItem('go-theme', isLight ? 'dark' : 'light'); }catch(e){}
    });
  }

  /* ---- scroll reveal ---- */
  var reveal = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && reveal.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
    reveal.forEach(function(el){ io.observe(el); });
  } else {
    reveal.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- current year ---- */
  var y = document.querySelector('[data-year]');
  if(y) y.textContent = new Date().getFullYear();

  /* ============================================================
     ECOSYSTEM — interactive concentric orbital map
     Renders 8 orbits; clicking/hovering a layer node updates the
     readout panel. Pure SVG + JS, no deps.
     ============================================================ */
  var eco = document.getElementById('eco');
  if(eco){
    var LAYERS = [
      {n:'01', t:'Strategic Services', d:'Advisory, delivery & open-banking integration that set the trajectory.', items:'GlobeBridge · GlobeTranscend · GlobeImplify · GlobeLeadEdge · GlobeConnectX · GlobeComply · GlobeFinLink · GlobeTrustXchange', href:'services.html'},
      {n:'02', t:'AI Offering', d:'Intelligence across experience, risk, efficiency, native products & wealth.', items:'ChatNova · PersonaX · VoiceIQ · FraudShield · CreditIQ · ComplyAI · AutoFlow · DocuSense · ForeSight · Treasura · PayRouteX · ReconNext · CreditPulse · RoboWealth · TradeVision · InsightX', href:'ai.html'},
      {n:'03', t:'Capability Domains', d:'Four enterprise-grade core banking suites.', items:'NexusCredit · AxisTrade · PulsePay · HorizonRisk', href:'platforms.html'},
      {n:'04', t:'Turnkey Platforms', d:'Bank-in-a-box: digital, core, universal & community.', items:'NeoCore · NeoLend · NeoVest · GlobeCore · UniGlobe · CommuGlobe · GlobeFX', href:'platforms.html'},
      {n:'05', t:'Product Portfolio', d:'Ready-to-launch retail, corporate/SME & wealth products.', items:'CASA · ISA · Cards · Loans · Mortgages · Trade Finance · Microfinance · Investment · Bancassurance · Treasury', href:'products.html'},
      {n:'06', t:'Integration & Governance', d:'The connective tissue: middleware, security, compliance, CRM.', items:'GlobeMesh · PayMesh · SecuraX · CompliSphere · CustoraX', href:'solutions.html'},
      {n:'07', t:'Omnichannel Framework', d:'One orchestration layer across every physical & digital channel.', items:'BranchIQ · BranchOps · WebBankX · MobBankX · AgentX · VendX · ExecuView · ChatBankX', href:'solutions.html'},
      {n:'08', t:'Enterprise Administration', d:'Run the bank behind the bank: people, assets & financial control.', items:'PeopleSphere · Procura · AssetIQ · FinCore · Consolida · AuditX · ReconX', href:'solutions.html'}
    ];

    var NS='http://www.w3.org/2000/svg';
    var size=720, c=size/2;
    var svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','0 0 '+size+' '+size);
    svg.setAttribute('class','eco-svg');
    eco.querySelector('.eco__stage').appendChild(svg);

    var rMin=70, rMax=c-26, step=(rMax-rMin)/(LAYERS.length-1);
    var nodes=[];

    // core
    var coreGlow=document.createElementNS(NS,'circle');
    coreGlow.setAttribute('cx',c);coreGlow.setAttribute('cy',c);coreGlow.setAttribute('r',46);
    coreGlow.setAttribute('class','eco-coreglow');
    svg.appendChild(coreGlow);
    var coreTxt=document.createElementNS(NS,'text');
    coreTxt.setAttribute('x',c);coreTxt.setAttribute('y',c+6);coreTxt.setAttribute('text-anchor','middle');
    coreTxt.setAttribute('class','eco-coretxt');coreTxt.textContent='G1';
    svg.appendChild(coreTxt);

    LAYERS.forEach(function(L,i){
      var r=rMin+step*i;
      var ring=document.createElementNS(NS,'circle');
      ring.setAttribute('cx',c);ring.setAttribute('cy',c);ring.setAttribute('r',r);
      ring.setAttribute('class','eco-ring');ring.dataset.i=i;
      svg.appendChild(ring);

      // node placed around the circle, spread out
      var ang=(-90 + i*(360/LAYERS.length)) * Math.PI/180;
      var nx=c+r*Math.cos(ang), ny=c+r*Math.sin(ang);
      var g=document.createElementNS(NS,'g');
      g.setAttribute('class','eco-node');g.dataset.i=i;
      g.setAttribute('tabindex','0');
      g.setAttribute('role','button');
      g.setAttribute('aria-label','Layer '+L.n+' — '+L.t);

      var hit=document.createElementNS(NS,'circle');
      hit.setAttribute('cx',nx);hit.setAttribute('cy',ny);hit.setAttribute('r',18);
      hit.setAttribute('class','eco-hit');
      var dot=document.createElementNS(NS,'circle');
      dot.setAttribute('cx',nx);dot.setAttribute('cy',ny);dot.setAttribute('r',6);
      dot.setAttribute('class','eco-dot');
      var lbl=document.createElementNS(NS,'text');
      lbl.setAttribute('x',nx);lbl.setAttribute('y',ny-14);lbl.setAttribute('text-anchor','middle');
      lbl.setAttribute('class','eco-lbl');lbl.textContent=L.n;
      g.appendChild(hit);g.appendChild(dot);g.appendChild(lbl);
      svg.appendChild(g);
      nodes.push({g:g,ring:ring,dot:dot});

      function activate(){ setActive(i); }
      g.addEventListener('mouseenter',activate);
      g.addEventListener('focus',activate);
      g.addEventListener('click',activate);
      g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
    });

    // readout panel refs
    var rOut={
      n:eco.querySelector('[data-eco="n"]'),
      t:eco.querySelector('[data-eco="t"]'),
      d:eco.querySelector('[data-eco="d"]'),
      items:eco.querySelector('[data-eco="items"]'),
      link:eco.querySelector('[data-eco="link"]')
    };
    function setActive(i){
      nodes.forEach(function(o,j){
        o.g.classList.toggle('active',j===i);
        o.ring.classList.toggle('active',j===i);
      });
      var L=LAYERS[i];
      if(rOut.n) rOut.n.textContent='Layer '+L.n+' / 08';
      if(rOut.t) rOut.t.textContent=L.t;
      if(rOut.d) rOut.d.textContent=L.d;
      if(rOut.items) rOut.items.textContent=L.items;
      if(rOut.link) rOut.link.setAttribute('href',L.href);
    }
    setActive(0);
  }
})();
