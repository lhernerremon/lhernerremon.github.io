import{l as v,a_ as m,a$ as g,aC as h,s as x,b4 as _,I as P,m as w,x as T,G as k,ak as p,v as C,J as A,K as L,L as B,N as I,O as E,W as $,am as z,q as O,e as c,V as F,y as q,a0 as D}from"./xtwNUpjG.js";import{V as G}from"./nWZyXumK.js";const H=x({disabled:Boolean,group:Boolean,hideOnLeave:Boolean,leaveAbsolute:Boolean,mode:String,origin:String},"transition");function i(n,d,s){return v()({name:n,props:H({mode:s,origin:d}),setup(a,r){let{slots:o}=r;const t={onBeforeEnter(e){a.origin&&(e.style.transformOrigin=a.origin)},onLeave(e){if(a.leaveAbsolute){const{offsetTop:l,offsetLeft:u,offsetWidth:f,offsetHeight:y}=e;e._transitionInitialStyles={position:e.style.position,top:e.style.top,left:e.style.left,width:e.style.width,height:e.style.height},e.style.position="absolute",e.style.top=`${l}px`,e.style.left=`${u}px`,e.style.width=`${f}px`,e.style.height=`${y}px`}a.hideOnLeave&&e.style.setProperty("display","none","important")},onAfterLeave(e){if(a.leaveAbsolute&&(e!=null&&e._transitionInitialStyles)){const{position:l,top:u,left:f,width:y,height:b}=e._transitionInitialStyles;delete e._transitionInitialStyles,e.style.position=l||"",e.style.top=u||"",e.style.left=f||"",e.style.width=y||"",e.style.height=b||""}}};return()=>{const e=a.group?m:g;return h(e,{name:a.disabled?"":n,css:!a.disabled,...a.group?void 0:{mode:a.mode},...a.disabled?{}:t},o.default)}}})}function S(n,d){let s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"in-out";return v()({name:n,props:{mode:{type:String,default:s},disabled:Boolean,group:Boolean},setup(a,r){let{slots:o}=r;const t=a.group?m:g;return()=>h(t,{name:a.disabled?"":n,css:!a.disabled,...a.disabled?{}:d},o.default)}})}function V(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"";const s=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1)?"width":"height",a=_(`offset-${s}`);return{onBeforeEnter(t){t._parent=t.parentNode,t._initialStyle={transition:t.style.transition,overflow:t.style.overflow,[s]:t.style[s]}},onEnter(t){const e=t._initialStyle;t.style.setProperty("transition","none","important"),t.style.overflow="hidden";const l=`${t[a]}px`;t.style[s]="0",t.offsetHeight,t.style.transition=e.transition,n&&t._parent&&t._parent.classList.add(n),requestAnimationFrame(()=>{t.style[s]=l})},onAfterEnter:o,onEnterCancelled:o,onLeave(t){t._initialStyle={transition:"",overflow:t.style.overflow,[s]:t.style[s]},t.style.overflow="hidden",t.style[s]=`${t[a]}px`,t.offsetHeight,requestAnimationFrame(()=>t.style[s]="0")},onAfterLeave:r,onLeaveCancelled:r};function r(t){n&&t._parent&&t._parent.classList.remove(n),o(t)}function o(t){const e=t._initialStyle[s];t.style.overflow=t._initialStyle.overflow,e!=null&&(t.style[s]=e),delete t._initialStyle}}i("fab-transition","center center","out-in");i("dialog-bottom-transition");i("dialog-top-transition");const W=i("fade-transition");i("scale-transition");i("scroll-x-transition");i("scroll-x-reverse-transition");i("scroll-y-transition");i("scroll-y-reverse-transition");i("slide-x-transition");i("slide-x-reverse-transition");const K=i("slide-y-transition");i("slide-y-reverse-transition");const X=S("expand-transition",V()),Y=S("expand-x-transition",V("",!0)),N=x({start:Boolean,end:Boolean,icon:P,image:String,text:String,...w(),...T(),...k(),...p(),...C(),...A(),...L({variant:"flat"})},"VAvatar"),j=v()({name:"VAvatar",props:N(),setup(n,d){let{slots:s}=d;const{themeClasses:a}=B(n),{colorClasses:r,colorStyles:o,variantClasses:t}=I(n),{densityClasses:e}=E(n),{roundedClasses:l}=$(n),{sizeClasses:u,sizeStyles:f}=z(n);return O(()=>c(n.tag,{class:["v-avatar",{"v-avatar--start":n.start,"v-avatar--end":n.end},a.value,r.value,e.value,l.value,u.value,t.value,n.class],style:[o.value,f.value,n.style]},{default:()=>[s.default?c(q,{key:"content-defaults",defaults:{VImg:{cover:!0,src:n.image},VIcon:{icon:n.icon}}},{default:()=>[s.default()]}):n.image?c(G,{key:"image",src:n.image,alt:"",cover:!0},null):n.icon?c(F,{key:"icon",icon:n.icon},null):n.text,D(!1,"v-avatar")]})),{}}});export{j as V,W as a,Y as b,X as c,K as d};