import{g as c}from"./dataLoader-DErINc11.js";async function d(){const e=await c();if(!e)return;const o=document.getElementById("termsCompanyName"),a=document.getElementById("termsFooterCopyright");o&&(o.textContent=e.company.shortName||e.company.name),a&&(a.textContent=`© ${new Date().getFullYear()} ${e.company.legalName||e.company.name}. All rights reserved.`);const n=e.termsAndConditions;if(!n)return;const i=document.getElementById("termsTitle"),m=document.getElementById("termsSubtitle"),s=document.getElementById("termsLastUpdated"),l=document.getElementById("termsSectionsContainer");i&&(i.textContent=n.title),m&&(m.textContent=n.subtitle),s&&(s.textContent=`Last Updated: ${n.lastUpdated}`),l&&n.sections&&(l.innerHTML=n.sections.map(t=>`
          <div class="legal-section">
            <h2>${t.title}</h2>
            ${t.content?`<p>${t.content}</p>`:""}
            ${Array.isArray(t.items)&&t.items.length?`<ul>${t.items.map(r=>`<li>${r}</li>`).join("")}</ul>`:""}
            ${t.note?`<p class="legal-note">${t.note}</p>`:""}
          </div>
        `).join(""))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();
