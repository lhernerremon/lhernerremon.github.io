import{q as m,w as c,h as p,e as v,s as l,j as d,a as g,u as y}from"./query.37b941df.js";import{D as h,Z as _,$ as w,O as C,a0 as P,f as $,a1 as x,g as N,P as E,R as f}from"./entry.ef86cfce.js";import{_ as T}from"./nuxt-link.c3902804.js";import{u as j}from"./preview.c84af44a.js";const D="$s";function R(...t){const e=typeof t[t.length-1]=="string"?t.pop():void 0;typeof t[0]!="string"&&t.unshift(e);const[n,o]=t;if(!n||typeof n!="string")throw new TypeError("[nuxt] [useState] key must be a string: "+n);if(o!==void 0&&typeof o!="function")throw new Error("[nuxt] [useState] init must be a function: "+o);const a=D+n,r=w(),i=h(r.payload.state,a);if(i.value===void 0&&o){const s=o();if(_(s))return r.payload.state[a]=s,s;i.value=s}return i}const S=async t=>{const{content:e}=C().public;typeof(t==null?void 0:t.params)!="function"&&(t=m(t));const n=t.params(),o=e.experimental.stripQueryParameters?c(`/navigation/${`${p(n)}.${e.integrity}`}/${v(n)}.json`):c(`/navigation/${p(n)}.${e.integrity}.json`);if(l())return(await P(()=>import("./client-db.78a7bbc0.js"),["./client-db.78a7bbc0.js","./entry.ef86cfce.js","./entry.96658eb4.css","./query.37b941df.js","./preview.c84af44a.js","./index.b0fe9fac.js"],import.meta.url).then(i=>i.generateNavigation))(n);const a=await $fetch(o,{method:"GET",responseType:"json",params:e.experimental.stripQueryParameters?void 0:{_params:d(n),previewToken:j().getPreviewToken()}});if(typeof a=="string"&&a.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return a},b=$({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(t){const{query:e}=x(t),n=N(()=>{var a;return typeof((a=e.value)==null?void 0:a.params)=="function"?e.value.params():e.value});if(!n.value&&R("dd-navigation").value){const{navigation:a}=g();return{navigation:a}}const{data:o}=await y(`content-navigation-${p(n.value)}`,()=>S(n.value));return{navigation:o}},render(t){const e=E(),{navigation:n}=t,o=i=>f(T,{to:i._path},()=>i.title),a=(i,s)=>f("ul",s?{"data-level":s}:null,i.map(u=>u.children?f("li",null,[o(u),a(u.children,s+1)]):f("li",null,o(u)))),r=i=>a(i,0);return e!=null&&e.default?e.default({navigation:n,...this.$attrs}):r(n)}}),Q=b;export{Q as default};