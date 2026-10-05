const cases=[
 {id:"EX-1048",sev:"HIGH",title:"Settled holding mismatch",client:"CL-2084",security:"INFY · INE009A01021",impact:"+50 shares",state:"OPEN",updated:"09:21"},
 {id:"EX-1047",sev:"MEDIUM",title:"Ambiguous cash evidence",client:"CL-1732",security:"Duplicate bank reference",impact:"₹25,000",state:"INVESTIGATING",updated:"09:17"},
 {id:"EX-1045",sev:"MEDIUM",title:"Pending DP movement",client:"CL-1941",security:"TCS · settlement pending",impact:"+20 pending",state:"NEEDS_SOURCE",updated:"08:58"},
 {id:"EX-1042",sev:"CRITICAL",title:"Scope access anomaly",client:"CL-2210",security:"Support role · restricted client",impact:"blocked",state:"OPEN",updated:"08:42"},
 {id:"EX-1039",sev:"HIGH",title:"Corrected source changed evidence",client:"CL-1875",security:"HDFCBANK · INE040A01034",impact:"−15 shares",state:"REOPENED",updated:"08:31"},
 {id:"EX-1037",sev:"MEDIUM",title:"Stale DP cut",client:"CL-1608",security:"RELIANCE · INE002A01018",impact:"unknown",state:"NEEDS_SOURCE",updated:"08:19"},
 {id:"EX-1035",sev:"LOW",title:"Reference mapping update",client:"CL-1431",security:"ITC · INE154A01025",impact:"info",state:"OPEN",updated:"08:02"},
 {id:"EX-1032",sev:"HIGH",title:"Posted cash mismatch",client:"CL-1198",security:"Cash ledger vs confirmation",impact:"₹12,500",state:"INVESTIGATING",updated:"07:54"}
];

function showView(name){
 document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
 document.getElementById(name+'View').classList.add('active');
 document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===name));
 const titles={overview:'Overview',cases:'Exceptions',imports:'Imports',audit:'Audit trail'};
 document.getElementById('pageTitle').textContent=titles[name];
 if(name==='cases') renderCases();
}
document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>showView(n.dataset.view)));

function severityClass(s){return s.toLowerCase().replace('medium','medium').replace('critical','critical')}
function stateClass(s){return s==='INVESTIGATING'?'investigating':s==='NEEDS_SOURCE'?'needs':s.toLowerCase()}
function renderCases(){
 const q=(document.getElementById('caseSearch')?.value||'').toLowerCase();
 const rows=cases.filter(c=>(c.id+c.title+c.client+c.security).toLowerCase().includes(q));
 document.getElementById('caseTable').innerHTML=rows.map(c=>`
 <div class="table-row" onclick="openCase('${c.id}')">
   <span><span class="severity ${severityClass(c.sev)}">${c.sev==='MEDIUM'?'MED':c.sev==='CRITICAL'?'CRIT':c.sev}</span><small>${c.id}</small></span>
   <span><strong>${c.title}</strong><small>${c.client} · ${c.security}</small></span>
   <span><strong>${c.impact}</strong></span>
   <span><span class="state ${stateClass(c.state)}">${c.state.replace('_',' ')}</span></span>
   <span>${c.updated}</span><span class="chev">›</span>
 </div>`).join('') || '<div style="padding:30px;text-align:center;color:#8f98a8;font-size:11px">No cases match the current filters.</div>';
}
function filterCases(){renderCases()}
function clearFilters(){const s=document.getElementById('caseSearch');if(s)s.value='';renderCases()}
function toggleFilters(){document.getElementById('filterBar').classList.toggle('show')}
function openCase(id){
 const c=cases.find(x=>x.id===id)||cases[0];
 document.getElementById('modalCaseId').textContent=c.id;
 document.getElementById('modalTitle').textContent=c.title;
 document.getElementById('modalSubtitle').textContent=`${c.client} · ${c.security}`;
 const sev=document.getElementById('modalSeverity');sev.textContent=c.sev==='MEDIUM'?'MED':c.sev;sev.className='severity '+severityClass(c.sev);
 document.getElementById('statusSelect').value=c.state;
 document.getElementById('caseModal').classList.add('show');
}
function openImport(){document.getElementById('importModal').classList.add('show')}
function closeModal(id){document.getElementById(id).classList.remove('show')}
function saveNote(){
 const btn=document.querySelector('.side-card .full');
 btn.textContent='✓ Note added to audit trail';
 btn.style.background='#238e61';
 setTimeout(()=>{btn.textContent='Add note';btn.style.background='';},1800);
}
function simulateImport(){
 const btn=document.querySelector('#importModal .full');
 btn.textContent='Validating…';
 setTimeout(()=>{btn.textContent='✓ Imported successfully';setTimeout(()=>closeModal('importModal'),700)},900);
}
document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));
renderCases();
