import{j as e,T as g}from"./ThemeToggle.DYUP8Wtv.js";import{c as p,r as n}from"./client.BDdPAVk5.js";import{Q as f}from"./browser.BNyc9-SY.js";import"./_commonjsHelpers.D6-XlEtG.js";const v=`<!-- @license lucide-static v1.14.0 - ISC -->
<svg
  class="lucide lucide-lock"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
</svg>
`,k=`<!-- @license lucide-static v1.14.0 - ISC -->
<svg
  class="lucide lucide-lock-open"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
</svg>
`,w=`<!-- @license lucide-static v1.14.0 - ISC -->
<svg
  class="lucide lucide-scan-line"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  <path d="M7 12h10" />
</svg>
`,x="TAPBLOK_TOGGLE";function l({svg:r,className:t}){return e.jsx("span",{"aria-hidden":"true",className:`inline-block [&>svg]:w-full [&>svg]:h-full ${t}`,dangerouslySetInnerHTML:{__html:r}})}function b({historyUrl:r}){const[t,i]=n.useState(!1),[a,m]=n.useState(0),[c,d]=n.useState(!1),h=n.useRef(null);n.useEffect(()=>{const s=h.current;s&&f.toCanvas(s,x,{width:512,margin:2,color:{dark:"#0f172a",light:"#ffffff"}}).then(()=>{s.style.width="100%",s.style.height="100%",d(!0)},()=>d(!1))},[]);const u=()=>{i(!0),m(s=>s+1)};return e.jsxs("div",{className:"flex flex-col min-h-screen p-4 gap-4 text-gray-900 dark:text-gray-100",children:[e.jsxs("nav",{className:"flex items-center gap-3 text-sm text-gray-400",children:[e.jsx("a",{href:"../",className:"inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",children:"← Home"}),r&&e.jsx("a",{href:r,target:"_blank",rel:"noopener",className:"hover:text-gray-600 dark:hover:text-gray-300 transition-colors",children:"history"}),e.jsx(g,{className:"ml-auto"})]}),e.jsxs("main",{className:"flex-1 flex flex-col items-center justify-center gap-8 py-4",children:[e.jsxs("header",{className:"flex flex-col items-center gap-1 text-center",children:[e.jsx("h1",{className:"text-xl font-semibold tracking-tight",children:"TapBlok Unlock"}),e.jsx("p",{className:"max-w-xs text-sm text-gray-500 dark:text-gray-400",children:"Scan this code to start or stop a monitoring session."})]}),e.jsxs("div",{className:`relative rounded-[2rem] bg-gradient-to-b from-slate-800 to-slate-950 p-4 shadow-2xl ring-1 transition-colors duration-700 ${t?"ring-emerald-400/40":"ring-white/10"}`,children:[t&&e.jsx("span",{className:"tapblok-halo pointer-events-none absolute inset-0 rounded-[2rem]"},`halo-${a}`),e.jsxs("div",{className:"relative h-64 w-64 overflow-hidden rounded-3xl bg-white sm:h-80 sm:w-80",children:[e.jsxs("div",{className:`flex h-full w-full items-center justify-center p-3 transition-[filter,transform] duration-700 ${t?"scale-100 blur-0":"scale-[0.97] blur-md"}`,children:[e.jsx("canvas",{ref:h,className:c?"h-full w-full":"hidden"}),!c&&e.jsx("span",{className:"break-all text-center font-mono text-sm text-slate-900",children:x})]}),t&&e.jsx("span",{className:"tapblok-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"},a),!t&&e.jsxs("button",{type:"button",onClick:u,"aria-label":"Unlock the QR code",className:"group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-slate-950/75 text-white backdrop-blur-sm focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-emerald-400",children:[e.jsx(l,{svg:v,className:"tapblok-breathe h-10 w-10 text-amber-300 transition-transform duration-300 group-hover:scale-110"}),e.jsx("span",{className:"text-sm font-medium tracking-wide",children:"Tap to unlock"})]})]}),t&&e.jsx(l,{svg:k,className:"tapblok-spring absolute -top-4 -right-3 h-9 w-9 rounded-full bg-emerald-500 p-1.5 text-slate-950 shadow-lg shadow-emerald-500/40"},`open-${a}`)]}),e.jsx("div",{className:"flex h-16 flex-col items-center gap-3",children:t?e.jsxs("div",{className:"tapblok-pop flex flex-col items-center gap-3",children:[e.jsxs("p",{className:"inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400",children:[e.jsx(l,{svg:w,className:"h-4 w-4"}),"Unlocked — ready to scan"]}),e.jsx("button",{type:"button",onClick:()=>i(!1),className:"cursor-pointer rounded-full border border-gray-300 px-4 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200",children:"Lock again"})]},a):e.jsx("p",{className:"text-sm text-gray-400 dark:text-gray-500",children:"Locked"})})]})]})}const o=document.getElementById("app");o&&p.createRoot(o).render(e.jsx(b,{historyUrl:o.dataset.historyUrl}));
