const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DxZiCPTM.js","./Bb7K-Rg6.js","./entry.D76oUfaL.css","./sbbSMGn0.js","./CBEoZ86u.js","./C-v3KzvZ.js"])))=>i.map(i=>d[i]);
import{q as m,w as c,e as v,s as l,j as d,a as g,b as y}from"./sbbSMGn0.js";import{az as h,aD as _,aE as w,ag as C,aF as P,d as $,aG as x,b as N,aA as E,aC as p}from"./Bb7K-Rg6.js";import{h as f,u as b}from"./CBEoZ86u.js";import{_ as T}from"./Byw5wOMo.js";const j=async t=>{const{content:a}=h().public;typeof(t==null?void 0:t.params)!="function"&&(t=m(t));const n=t.params(),o=a.experimental.stripQueryParameters?c(`/navigation/${`${f(n)}.${a.integrity}`}/${v(n)}.json`):c(`/navigation/${f(n)}.${a.integrity}.json`);if(l())return(await _(()=>import("./DxZiCPTM.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url).then(i=>i.generateNavigation))(n);const e=await $fetch(o,{method:"GET",responseType:"json",params:a.experimental.stripQueryParameters?void 0:{_params:d(n),previewToken:b().getPreviewToken()}});if(typeof e=="string"&&e.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return e},D="$s";function S(...t){const a=typeof t[t.length-1]=="string"?t.pop():void 0;typeof t[0]!="string"&&t.unshift(a);const[n,o]=t;if(!n||typeof n!="string")throw new TypeError("[nuxt] [useState] key must be a string: "+n);if(o!==void 0&&typeof o!="function")throw new Error("[nuxt] [useState] init must be a function: "+o);const e=D+n,r=w(),i=C(r.payload.state,e);if(i.value===void 0&&o){const s=o();if(P(s))return r.payload.state[e]=s,s;i.value=s}return i}const A=$({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(t){const{query:a}=x(t),n=N(()=>{var e;return typeof((e=a.value)==null?void 0:e.params)=="function"?a.value.params():a.value});if(!n.value&&S("dd-navigation").value){const{navigation:e}=g();return{navigation:e}}const{data:o}=await y(`content-navigation-${f(n.value)}`,()=>j(n.value));return{navigation:o}},render(t){const a=E(),{navigation:n}=t,o=i=>p(T,{to:i._path},()=>i.title),e=(i,s)=>p("ul",s?{"data-level":s}:null,i.map(u=>u.children?p("li",null,[o(u),e(u.children,s+1)]):p("li",null,o(u)))),r=i=>e(i,0);return a!=null&&a.default?a.default({navigation:n,...this.$attrs}):r(n)}}),Q=A;export{Q as default};
