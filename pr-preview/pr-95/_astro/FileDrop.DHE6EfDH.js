import{j as a}from"./jsx-runtime.D_zvdyIk.js";import{r as i}from"./index.GdwJiW92.js";const f=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path d="M21 15v4h-2v-4zm-2 4v2H5v-2zM5 15v4H3v-4zm8-12v14h-2V3z"/>
  <path d="M7 11v2h10v-2zm2 2v2h2v-2zm4 0v2h2v-2z"/>
  <path d="M15 11v2h2v-2z"/>
</svg>
`,d=({accept:s,multiple:v,onFiles:r,children:n,className:o=""})=>{const[l,t]=i.useState(!1);return a.jsxs("label",{className:`pixel-file ${o}`,"data-dragover":l||void 0,onDragOver:e=>{e.preventDefault(),t(!0)},onDragLeave:e=>{e.currentTarget.contains(e.relatedTarget)||t(!1)},onDrop:e=>{e.preventDefault(),t(!1),r([...e.dataTransfer?.files??[]])},children:[a.jsx("input",{type:"file",accept:s,multiple:v,onChange:e=>r([...e.target.files??[]])}),n]})};export{d as F,f as d};
