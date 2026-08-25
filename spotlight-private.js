/* Private ZLOON Spotlight journal: rendered only for a verified customer session. */
if(!document.querySelector('#spotlightPrivateCss')){const css=document.createElement('link');css.id='spotlightPrivateCss';css.rel='stylesheet';css.href='spotlight-private.css?v=20260840';document.head.appendChild(css);const rulesCss=document.createElement('link');rulesCss.rel='stylesheet';rulesCss.href='spotlight-rules.css?v=20260840';document.head.appendChild(rulesCss)}
async function showZloonSpotlight(){
  if(!document.querySelector('.edit')||document.querySelector('#zloonSpotlightJournal'))return;
  try{
    const response=await fetch('/api/auth/me',{credentials:'same-origin'});
    if(!response.ok)return;
    const {customer}=await response.json();
    if(!customer?.verified)return;
    document.querySelector('.edit').insertAdjacentHTML('afterend',`<section class="spotlight-journal" id="zloonSpotlightJournal"><div class="spotlight-intro"><p class="eyebrow">Members-only · ZLOON Spotlight</p><h2>Take the Sunday stage.</h2><p>Register for an evening of talent, fashion and community. ZLOON provides the stage and microphone—you bring your talent.</p><button class="primary-btn spotlight-register" id="spotlightRegister" type="button">Register for Sunday Spotlight</button></div><div class="spotlight-posts"><article><span>SPOTLIGHT NOTES · 01</span><h3>The Sunday Stage</h3><p>Every Sunday, 7 PM–9 PM. Pick one 3-minute showcase slot after registration. Mic and stage are provided by ZLOON.</p></article><article><span>WHAT YOU CAN SHOW · 02</span><h3>Your talent, your moment</h3><p>Music, spoken word, dance, fashion styling, comedy, poetry and creative performances are welcome—subject to ZLOON approval.</p></article><article><span>COMMUNITY RULES · 03</span><h3>Keep it respectful</h3><p>No vulgar, abusive, unsafe or nuisance activity is permitted. ZLOON may cancel a slot if these rules are not followed.</p></article></div></section>`);
    document.querySelector('#spotlightRegister').onclick=openSpotlightRegistration;
  }catch{}
}
function openSpotlightRegistration(){
  if(!document.querySelector('#spotlightRulesModal'))document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="spotlightRulesModal"><div class="modal-box spotlight-rules"><button class="close" type="button">×</button><p class="eyebrow">ZLOON SPOTLIGHT REGISTRATION</p><h2>Sunday · 7 PM–9 PM</h2><p>Each participant receives a 3-minute stage slot. ZLOON provides a microphone and stage setup.</p><ul><li>Showcase your own talent respectfully.</li><li>No vulgar, abusive, unsafe, illegal or nuisance activity.</li><li>Please arrive on time; ZLOON may change or cancel any slot for safety.</li></ul><label><input id="spotlightRulesAccept" type="checkbox"> I agree to follow the ZLOON Spotlight rules.</label><button id="spotlightContinue" type="button" disabled>Accept &amp; choose my slot</button></div></div>`);
  const modal=document.querySelector('#spotlightRulesModal');modal.classList.add('open');modal.querySelector('.close').onclick=()=>modal.classList.remove('open');modal.onclick=event=>{if(event.target===modal)modal.classList.remove('open')};const check=modal.querySelector('#spotlightRulesAccept'),continueButton=modal.querySelector('#spotlightContinue');check.onchange=()=>continueButton.disabled=!check.checked;continueButton.onclick=()=>{modal.classList.remove('open');if(typeof window.action==='function')window.action('spotlight')};
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(showZloonSpotlight,350));
