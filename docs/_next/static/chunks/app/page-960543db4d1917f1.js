(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9343:function(e,t,i){Promise.resolve().then(i.bind(i,9330))},9330:function(e,t,i){"use strict";i.d(t,{Forge:function(){return w}});var n=i(7437),a=i(2265),r=i(7380),s=i(7635),l=i.n(s),o=i(12),m=i(1124),c=i.n(m),u=i(9089),p=i(6537),d=i.n(p);function g(e){if(e.type){if(/^image\//i.test(e.type))return{mimeType:e.type,genericType:"image"};if(/^audio\//i.test(e.type))return{mimeType:e.type,genericType:"audio"}}if(/\.png$/i.test(e.name))return{mimeType:"image/png",genericType:"image"};if(/\.jpg$/i.test(e.name))return{mimeType:"image/jpeg",genericType:"image"};if(/\.bmp$/i.test(e.name))return{mimeType:"image/bmp",genericType:"image"};if(/\.webp$/i.test(e.name))return{mimeType:"image/webp",genericType:"image"};if(/\.gif$/i.test(e.name))return{mimeType:"image/gif",genericType:"image"};if(/\.tiff$/i.test(e.name))return{mimeType:"image/tiff",genericType:"image"};if(/\.svg$/i.test(e.name))return{mimeType:"image/svg+xml",genericType:"image"};else if(/\.wav$/i.test(e.name))return{mimeType:"audio/wav",genericType:"audio"};else if(/\.mp3$/i.test(e.name))return{mimeType:"audio/mpeg",genericType:"audio"};return e.type?{mimeType:e.type,genericType:null}:null}function f(e){var t;let{file:i,onDelete:a}=e,r=null;return i.dataUri&&(null===(t=i.type)||void 0===t?void 0:t.genericType)==="image"&&(r=(0,n.jsx)("img",{className:d().PreviewIcon,src:i.dataUri,width:24,alt:""})),(0,n.jsxs)("div",{className:d().File,children:[(0,n.jsx)("span",{className:d().IconContainer,children:r})," ",(0,n.jsx)("span",{className:d().Path,children:i.path}),(0,n.jsx)("button",{className:d().DeleteButton,type:"button","aria-label":"Delete",title:"Delete",onClick:e=>{a(i.path)},children:(0,n.jsx)(u.AMf,{})})]})}async function y(e){let t=await l().loadAsync(e),i=new Map;for(let e in t.files){let r=t.files[e];if(!r.dir){var n,a;let t={path:e,buffer:await r.async("arraybuffer"),dataUri:null,date:r.date,unixPermissions:r.unixPermissions,dosPermissions:r.dosPermissions,type:g(r)};if((null===(n=t.type)||void 0===n?void 0:n.genericType)==="image"||(null===(a=t.type)||void 0===a?void 0:a.genericType)==="audio"){let e=await r.async("base64");t.dataUri="data:".concat(t.type.mimeType,";base64,").concat(e)}i.set(e,t)}}return i}async function h(e){var t,i;let n;let a=new Map;if(e.path)(n=e.path).startsWith("/")&&(n=n.slice(1));else{if(!e.name)return a;n=e.name}let r=await new Promise((t,i)=>{let n=new FileReader;n.addEventListener("load",e=>{t(e.target.result)}),n.readAsArrayBuffer(e)}),s={path:n,buffer:r,dataUri:null,date:null,unixPermissions:null,dosPermissions:null,type:g(e)};if((null===(t=s.type)||void 0===t?void 0:t.genericType)==="image"||(null===(i=s.type)||void 0===i?void 0:i.genericType)==="audio"){let e=function(e){for(var t,i,n,a,r="",s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",l=new Uint8Array(e),o=l.byteLength,m=o%3,c=o-m,u=0;u<c;u+=3)r+=s[t=(16515072&(a=l[u]<<16|l[u+1]<<8|l[u+2]))>>18]+s[(258048&a)>>12]+s[(4032&a)>>6]+s[63&a];return 1==m?r+=s[t=(252&(a=l[c]))>>2]+s[(3&a)<<4]+"==":2==m&&(r+=s[t=(64512&(a=l[c]<<8|l[c+1]))>>10]+s[(1008&a)>>4]+s[(15&a)<<2]+"="),r}(r);s.dataUri="data:".concat(s.type.mimeType,";base64,").concat(e)}return a.set(n,s),a}async function _(e){return/\.(zip|vl2)$/i.test(e.name)?y(e):h(e)}async function v(e,t){let i=await e.generateAsync({type:"blob",mimeType:"application/octet-stream"});(0,o.saveAs)(i,t)}function w(){let[e,t]=(0,a.useState)(()=>[]),[i,s]=(0,a.useState)(()=>new Map),o=(0,a.useCallback)(async e=>{let i=[],n=new Map;(await Promise.all(e.map(e=>_(e)))).forEach(e=>{e.forEach((e,t)=>{n.has(t)&&i.push({type:"overwrite",path:t}),n.set(t,e)})}),s(e=>new Map([...Array.from(e.entries()),...Array.from(n.entries())])),t(e=>[...e,...i])},[]),{getRootProps:m,getInputProps:u,open:p,isDragActive:g}=(0,r.uI)({noClick:!0,onDrop:o}),y=(0,a.useMemo)(()=>c()(Array.from(i.keys()),[e=>e.toLowerCase()],["asc"]).map(e=>i.get(e)),[i]),h=(0,n.jsx)("button",{type:"button",className:d().AddButton,"aria-label":"Add files",title:"Add files",onClick:p,children:"+"}),w=(0,a.useCallback)(e=>{s(t=>{let i=new Map(t);return i.delete(e),i})},[]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("section",{className:d().Forge,...m(),children:[(0,n.jsxs)("header",{className:d().Header,children:[(0,n.jsx)("img",{width:210,height:188,src:"/vl2-forge/logo-md.png",alt:"VL2 Forge"}),h]}),(0,n.jsx)("input",{...u()}),(0,n.jsx)("div",{className:d().ListArea,children:y.length?(0,n.jsx)("ul",{className:d().FileList,children:y.map(e=>(0,n.jsx)("li",{children:(0,n.jsx)(f,{file:e,onDelete:w})},e.path))}):(0,n.jsx)("div",{className:d().EmptyMessage,children:"Drop files onto the page or press the add button!"})})]}),(0,n.jsx)("footer",{className:d().Footer,children:(0,n.jsxs)("form",{onSubmit:async e=>{e.preventDefault();let t=e.target.elements.fileName,i=t.value.trim();if(i){if(y.length){let e=function(e){let t=new(l());for(let i of e)t.file(i.path,i.buffer,{date:i.date,dosPermissions:i.dosPermissions,unixPermissions:i.unixPermissions});return t}(y);await v(e,"".concat(i,".vl2"))}else window.alert("Add some files!")}else window.alert("Name thy file."),t.focus()},children:[(0,n.jsx)("div",{className:d().NameInput,children:(0,n.jsx)("input",{name:"fileName",type:"text",placeholder:"name thy file",onChange:e=>{/\.vl2$/i.test(e.target.value)&&(e.target.value=e.target.value.slice(0,-4))}})}),(0,n.jsx)("button",{type:"submit",className:d().DownloadButton,children:"Download"})]})})]})}},6537:function(e){e.exports={Forge:"Forge_Forge__dDZFe",Footer:"Forge_Footer__ghw3O",NameInput:"Forge_NameInput__lpcsg",DownloadButton:"Forge_DownloadButton__CnFTn",ListArea:"Forge_ListArea__OpY_R",FileList:"Forge_FileList__9JOyh",EmptyMessage:"Forge_EmptyMessage__Lrlud",AddButton:"Forge_AddButton__09pXD",Header:"Forge_Header__7t3Qc",File:"Forge_File__Mn05Y",DeleteButton:"Forge_DeleteButton__Csfdg",IconContainer:"Forge_IconContainer__AgM_T",PreviewIcon:"Forge_PreviewIcon__HFERe",Path:"Forge_Path__GZs81"}}},function(e){e.O(0,[359,699,634,971,117,744],function(){return e(e.s=9343)}),_N_E=e.O()}]);