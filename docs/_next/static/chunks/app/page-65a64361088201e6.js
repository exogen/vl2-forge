(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9343:function(e,t,i){Promise.resolve().then(i.bind(i,9330))},9330:function(e,t,i){"use strict";i.d(t,{Forge:function(){return T}});var a=i(7437),n=i(2265),s=i(7380),r=i(7635),l=i.n(r),o=i(12),m=i(1124),c=i.n(m),p=i(9089),u=i(2744),d=i(8637),g=i(1273),f=i(7780),y=i(6537),h=i.n(y);function _(e){let t=e.split("/"),i="",a="";return(t.length>1?(i=t.slice(0,-1).join("/"),a=t[t.length-1]):(i="",a=t[0]),i)?"".concat(i,"/").concat(a):(/\.(l|m|h)(male|female|bioderm)\.png$/i.test(a)||/^(vehicle|weapon)_.+png$/i.test(a)||/^dcase\d\d\.png$/i.test(a)?i="textures/skins":/\.(ter|spn)$/i.test(a)?i="terrains":/\.mis$/i.test(a)?i="missions":/\.dif$/i.test(a)&&(i="interiors"),i)?"".concat(i,"/").concat(a):a}function v(e){if(e.type){if(/^image\//i.test(e.type))return{mimeType:e.type,genericType:"image"};if(/^audio\//i.test(e.type))return{mimeType:e.type,genericType:"audio"}}if(/\.png$/i.test(e.name))return{mimeType:"image/png",genericType:"image"};if(/\.jpg$/i.test(e.name))return{mimeType:"image/jpeg",genericType:"image"};if(/\.bmp$/i.test(e.name))return{mimeType:"image/bmp",genericType:"image"};if(/\.webp$/i.test(e.name))return{mimeType:"image/webp",genericType:"image"};if(/\.gif$/i.test(e.name))return{mimeType:"image/gif",genericType:"image"};if(/\.tiff$/i.test(e.name))return{mimeType:"image/tiff",genericType:"image"};if(/\.svg$/i.test(e.name))return{mimeType:"image/svg+xml",genericType:"image"};else if(/\.wav$/i.test(e.name))return{mimeType:"audio/wav",genericType:"audio"};else if(/\.mp3$/i.test(e.name))return{mimeType:"audio/mpeg",genericType:"audio"};return e.type?{mimeType:e.type,genericType:null}:null}function x(e){var t,i;let{file:n,onDelete:s,onRename:r}=e,l=null;return n.dataUri&&(null===(t=n.type)||void 0===t?void 0:t.genericType)==="image"?l=(0,a.jsx)("img",{className:h().PreviewIcon,src:n.dataUri,width:24,alt:""}):(null===(i=n.type)||void 0===i?void 0:i.genericType)==="audio"?l=(0,a.jsx)(f.Eow,{}):/\.cs$/i.test(n.path)?l=(0,a.jsx)(d.HXH,{}):/\.mis$/i.test(n.path)?l=(0,a.jsx)(g.W95,{}):/\.dif$/i.test(n.path)?l=(0,a.jsx)(u.JEK,{}):/\.ter$/i.test(n.path)?l=(0,a.jsx)(u.seb,{}):/\.spn$/i.test(n.path)&&(l=(0,a.jsx)(g.ekl,{})),(0,a.jsxs)("div",{className:h().File,children:[(0,a.jsx)("span",{className:h().IconContainer,children:l})," ",(0,a.jsx)("span",{className:h().Path,onDoubleClick:()=>{let e=window.prompt("Rename file (".concat(n.path,"):"),n.path);e&&(e=e.trim().replace(/\/+/g,"/").replace(/^\//,"").replace(/\/$/,"").trim())&&e!==n.path&&r(n.path,e)},children:n.path}),(0,a.jsx)("button",{className:h().DeleteButton,type:"button","aria-label":"Delete",title:"Delete",onClick:e=>{s(n.path)},children:(0,a.jsx)(p.AMf,{})})]})}async function w(e){let t=await l().loadAsync(e),i=new Map;for(let e in t.files){let s=t.files[e];if(!s.dir){var a,n;let t={path:e=_(e),buffer:await s.async("arraybuffer"),dataUri:null,date:s.date,unixPermissions:s.unixPermissions,dosPermissions:s.dosPermissions,type:v(s)};if((null===(a=t.type)||void 0===a?void 0:a.genericType)==="image"||(null===(n=t.type)||void 0===n?void 0:n.genericType)==="audio"){let e=await s.async("base64");t.dataUri="data:".concat(t.type.mimeType,";base64,").concat(e)}i.set(e,t)}}return i}async function b(e){var t,i;let a;let n=new Map;if(e.path)(a=e.path).startsWith("/")&&(a=a.slice(1));else{if(!e.name)return n;a=e.name}a=_(a);let s=await new Promise((t,i)=>{let a=new FileReader;a.addEventListener("load",e=>{t(e.target.result)}),a.readAsArrayBuffer(e)}),r={path:a,buffer:s,dataUri:null,date:null,unixPermissions:null,dosPermissions:null,type:v(e)};if((null===(t=r.type)||void 0===t?void 0:t.genericType)==="image"||(null===(i=r.type)||void 0===i?void 0:i.genericType)==="audio"){let e=function(e){for(var t,i,a,n,s="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",l=new Uint8Array(e),o=l.byteLength,m=o%3,c=o-m,p=0;p<c;p+=3)s+=r[t=(16515072&(n=l[p]<<16|l[p+1]<<8|l[p+2]))>>18]+r[(258048&n)>>12]+r[(4032&n)>>6]+r[63&n];return 1==m?s+=r[t=(252&(n=l[c]))>>2]+r[(3&n)<<4]+"==":2==m&&(s+=r[t=(64512&(n=l[c]<<8|l[c+1]))>>10]+r[(1008&n)>>4]+r[(15&n)<<2]+"="),s}(s);r.dataUri="data:".concat(r.type.mimeType,";base64,").concat(e)}return n.set(a,r),n}async function F(e){return/\.(zip|vl2)$/i.test(e.name)?w(e):b(e)}async function j(e,t){let i=await e.generateAsync({type:"blob",mimeType:"application/octet-stream"});(0,o.saveAs)(i,t)}function T(){let[e,t]=(0,n.useState)(()=>[]),[i,r]=(0,n.useState)(()=>new Map),o=(0,n.useCallback)(async e=>{let i=[],a=new Map;(await Promise.all(e.map(e=>F(e)))).forEach(e=>{e.forEach((e,t)=>{a.has(t)&&i.push({type:"overwrite",path:t}),a.set(t,e)})}),r(e=>new Map([...Array.from(e.entries()),...Array.from(a.entries())])),t(e=>[...e,...i])},[]),{getRootProps:m,getInputProps:u,open:d,isDragActive:g}=(0,s.uI)({noClick:!0,onDrop:o}),f=(0,n.useMemo)(()=>c()(Array.from(i.keys()),[e=>e.toLowerCase()],["asc"]).map(e=>i.get(e)),[i]),y=(0,a.jsx)("button",{type:"button",className:h().AddButton,"aria-label":"Add files",title:"Add files",onClick:d,children:"+"}),_=(0,n.useCallback)(e=>{r(t=>{let i=new Map(t);return i.delete(e),i})},[]),v=(0,n.useCallback)((e,t)=>{r(i=>{let a={...i.get(e),path:t},n=new Map(i);return n.delete(e),n.set(t,a),n})},[]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("section",{className:h().Forge,...m(),children:[(0,a.jsxs)("header",{className:h().Header,children:[(0,a.jsx)("a",{className:h().HeaderLink,href:"https://github.com/exogen/vl2-forge",children:(0,a.jsx)(p.hJX,{"aria-label":"GitHub"})}),(0,a.jsx)("img",{width:210,height:188,src:"/vl2-forge/logo-md.png",alt:"VL2 Forge"}),y]}),(0,a.jsx)("input",{...u()}),(0,a.jsx)("div",{className:h().ListArea,children:f.length?(0,a.jsx)("ul",{className:h().FileList,children:f.map(e=>(0,a.jsx)("li",{children:(0,a.jsx)(x,{file:e,onDelete:_,onRename:v})},e.path))}):(0,a.jsx)("div",{className:h().EmptyMessage,children:"Drop files onto the page or press the add button. No need to extract existing .vl2 files first –\xa0just drop ‘em in and it’ll do that for you!"})})]}),(0,a.jsxs)("footer",{className:h().Footer,children:[(0,a.jsx)("a",{className:h().FooterLink,href:"https://github.com/exogen/vl2-forge",children:(0,a.jsx)(p.hJX,{"aria-label":"GitHub"})}),(0,a.jsxs)("form",{onSubmit:async e=>{e.preventDefault();let t=e.target.elements.fileName,i=t.value.trim();if(i){if(f.length){let e=function(e){let t=new(l());for(let i of e)t.file(i.path,i.buffer,{date:i.date,dosPermissions:i.dosPermissions,unixPermissions:i.unixPermissions});return t}(f);await j(e,"".concat(i,".vl2"))}else window.alert("Add some files!")}else window.alert("Name thy file."),t.focus()},children:[(0,a.jsx)("div",{className:h().NameInput,children:(0,a.jsx)("input",{name:"fileName",type:"text",placeholder:"name thy file",onChange:e=>{/\.vl2$/i.test(e.target.value)&&(e.target.value=e.target.value.slice(0,-4))}})}),(0,a.jsx)("button",{type:"submit",className:h().DownloadButton,children:"Download"})]})]})]})}},6537:function(e){e.exports={Forge:"Forge_Forge__dDZFe",Footer:"Forge_Footer__ghw3O",NameInput:"Forge_NameInput__lpcsg",DownloadButton:"Forge_DownloadButton__CnFTn",ListArea:"Forge_ListArea__OpY_R",FileList:"Forge_FileList__9JOyh",EmptyMessage:"Forge_EmptyMessage__Lrlud",AddButton:"Forge_AddButton__09pXD",Header:"Forge_Header__7t3Qc",File:"Forge_File__Mn05Y",DeleteButton:"Forge_DeleteButton__Csfdg",IconContainer:"Forge_IconContainer__AgM_T",PreviewIcon:"Forge_PreviewIcon__HFERe",Path:"Forge_Path__GZs81",HeaderLink:"Forge_HeaderLink__fEDGG",FooterLink:"Forge_FooterLink__gznaM"}}},function(e){e.O(0,[359,51,212,516,240,699,634,971,117,744],function(){return e(e.s=9343)}),_N_E=e.O()}]);