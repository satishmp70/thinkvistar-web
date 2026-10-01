import{g as s}from"./dataLoader-DErINc11.js";async function d(){const e=await s();if(!e)return;const a=document.getElementById("privacyCompanyName"),o=document.getElementById("privacyFooterCopyright");a&&(a.textContent=e.company.shortName||e.company.name),o&&(o.textContent=`© ${new Date().getFullYear()} ${e.company.legalName||e.company.name}. All rights reserved.`);const n=e.privacyPolicy;if(!n)return;const i=document.getElementById("privacyTitle"),l=document.getElementById("privacySubtitle"),c=document.getElementById("privacyLastUpdated"),r=document.getElementById("privacySectionsContainer");i&&(i.textContent=n.title),l&&(l.textContent=n.subtitle),c&&(c.textContent=`Last Updated: ${n.lastUpdated}`),r&&n.sections&&(r.innerHTML=n.sections.map(t=>`
          <div class="legal-section">
            <h2>${t.title}</h2>
            ${t.content?`<p>${t.content}</p>`:""}
            ${Array.isArray(t.items)&&t.items.length?`<ul>${t.items.map(m=>`<li>${m}</li>`).join("")}</ul>`:""}
            ${t.note?`<p class="legal-note">${t.note}</p>`:""}
          </div>
        `).join(""))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();
