'use client';
import {useEffect,useRef,useState} from 'react';import {api,events,mediaUrl,B} from '@/lib/api';
const TABS=[['all','Semua'],['user','Pribadi'],['group','Grup'],['channel','Channel'],['contacts','Kontak']];
const Av=({c}:{c:any})=><div className="relative size-11 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-sky-400 grid place-items-center font-semibold">
 <span>{c.name?.[0]}</span><img src={`${B}/avatar/${c.id}`} alt="" className="absolute inset-0 size-full rounded-full object-cover" onError={e=>e.currentTarget.remove()}/>
 {c.online&&<i className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-indigo-700"/>}</div>;
const hm=(d:number)=>d?new Date(d*1000).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}):'';
export default function Chat({me,onOut}:any){
 const [dl,setDl]=useState<any[]>([]),[cs,setCs]=useState<any[]>([]),[tab,setTab]=useState('all'),[q,setQ]=useState(''),[hits,setHits]=useState<any[]>([]);
 const [act,setAct]=useState<any>(null),[ms,setMs]=useState<any[]>([]),[rm,setRm]=useState(0),[txt,setTxt]=useState('');
 const ar=useRef<any>(null),end=useRef<HTMLDivElement>(null),fi=useRef<HTMLInputElement>(null);ar.current=act;
 const load=()=>api('/dialogs').then(setDl);
 useEffect(()=>{load();api('/contacts').then(setCs);const es=events();
  es.addEventListener('msg',(e:any)=>{const {chat,msg}=JSON.parse(e.data);const open=ar.current?.id===chat;
   if(open){setMs(m=>m.some(x=>x.id===msg.id)?m:[...m,msg]);if(!msg.out)api('/read/'+chat,{method:'POST'})}
   setDl(d=>{const i=d.findIndex(x=>x.id===chat);if(i<0){load();return d}
    return [{...d[i],last:msg.text||'['+msg.kind+']',date:msg.date,unread:open||msg.out?0:d[i].unread+1},...d.filter((_,j)=>j!==i)]})});
  es.addEventListener('read',(e:any)=>{const r=JSON.parse(e.data);if(r.chat===ar.current?.id)setRm(r.maxId)});
  es.addEventListener('status',(e:any)=>{const s=JSON.parse(e.data);setDl(d=>d.map(x=>x.id===s.id?{...x,online:s.online}:x))});
  return()=>es.close()},[]);
 useEffect(()=>{if(q.length<3){setHits([]);return}const t=setTimeout(()=>api('/search?q='+encodeURIComponent(q)).then(setHits).catch(()=>{}),400);return()=>clearTimeout(t)},[q]);
 useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth'})},[ms]);
 const open=async(c:any)=>{setAct(c);setMs([]);setDl(d=>d.map(x=>x.id===c.id?{...x,unread:0}:x));const r=await api('/messages/'+c.id);setMs(r.messages);setRm(r.readMax)};
 const send=async()=>{const t=txt.trim();if(!t)return;setTxt('');const m=await api('/send/'+act.id,{method:'POST',body:JSON.stringify({text:t})});setMs(x=>x.some(y=>y.id===m.id)?x:[...x,m])};
 const upload=async(f?:File)=>{if(!f)return;const fd=new FormData();fd.append('file',f);fd.append('caption',txt);setTxt('');
  const m=await api(`/send/${act.id}/file`,{method:'POST',body:fd});setMs(x=>x.some(y=>y.id===m.id)?x:[...x,m])};
 const list=(tab==='contacts'?cs:dl.filter(x=>tab==='all'||x.type===tab)).filter(x=>x.name.toLowerCase().includes(q.toLowerCase()));
 return <div className="h-dvh p-0 md:p-4 flex gap-4">
  <aside className={`${act?'hidden md:flex':'flex'} glass md:rounded-3xl w-full md:w-[360px] flex-col shrink-0`}>
   <div className="p-4 flex items-center gap-2"><input className="inp" placeholder="Cari chat atau pesan" value={q} onChange={e=>setQ(e.target.value)}/>
    <button title={`Keluar (${me.name})`} className="px-3 text-white/70 hover:text-white" onClick={async()=>{await api('/auth/logout',{method:'POST'});onOut()}}>Keluar</button></div>
   <div className="px-4 pb-2 flex gap-1 overflow-x-auto">{TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${tab===k?'bg-white/25':'hover:bg-white/10 text-white/70'}`}>{l}</button>)}</div>
   <div className="flex-1 overflow-y-auto px-2 pb-2">
    {hits.length>0&&<div className="px-2 py-1 text-xs text-white/60">Hasil pesan</div>}
    {hits.map(h=><button key={h.chat+h.id} onClick={()=>{open(dl.find(d=>d.id===h.chat)||{id:h.chat,name:'Chat',type:'user'});setQ('')}} className="w-full text-left p-3 rounded-2xl hover:bg-white/10 transition"><p className="text-sm truncate">{h.text}</p></button>)}
    {list.map(c=><button key={c.id} onClick={()=>open(c)} className={`w-full flex gap-3 items-center p-3 rounded-2xl text-left transition hover:bg-white/10 ${act?.id===c.id?'bg-white/20':''}`}>
     <Av c={c}/><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="font-medium truncate">{c.name}</span><span className="text-xs text-white/50">{hm(c.date)}</span></div>
     <div className="flex justify-between gap-2"><span className="text-sm text-white/60 truncate">{c.last}</span>{c.unread>0&&<b className="text-xs bg-sky-400 text-indigo-950 rounded-full px-2 py-0.5">{c.unread}</b>}</div></div></button>)}
    {!list.length&&<p className="p-6 text-center text-sm text-white/60">Tidak ada hasil.</p>}</div></aside>
  <main className={`${act?'flex':'hidden md:flex'} glass md:rounded-3xl flex-1 flex-col min-w-0`}>
   {!act?<div className="m-auto text-white/60">Pilih chat untuk mulai mengobrol</div>:<>
    <header className="p-4 flex items-center gap-3 border-b border-white/10"><button className="md:hidden text-xl" onClick={()=>setAct(null)}>←</button><Av c={act}/>
     <div><p className="font-semibold">{act.name}</p><p className="text-xs text-white/60">{act.online?'online':act.type==='user'?'offline':act.type}</p></div></header>
    <div className="flex-1 overflow-y-auto p-4 space-y-2">{ms.map(m=><div key={m.id} className={`flex pop ${m.out?'justify-end':''}`}>
     <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.out?'bg-gradient-to-br from-violet-500/80 to-sky-500/80 rounded-br-md':'bg-white/15 rounded-bl-md'}`}>
      {m.kind==='photo'&&<img className="rounded-xl mb-1 max-h-72" src={mediaUrl(act.id,m.id,true)} alt=""/>}
      {m.kind==='video'&&<video className="rounded-xl mb-1 max-h-72" controls preload="none" src={mediaUrl(act.id,m.id)}/>}
      {m.kind==='document'&&<a className="underline block mb-1" href={mediaUrl(act.id,m.id)} download>{m.name||'Dokumen'}</a>}
      {m.text&&<p className="whitespace-pre-wrap break-words">{m.text}</p>}
      <p className="text-[11px] text-white/60 text-right">{hm(m.date)} {m.out&&(m.id<=rm?'✓✓':'✓')}</p></div></div>)}<div ref={end}/></div>
    <footer className="p-3 flex gap-2 items-center border-t border-white/10"><input ref={fi} type="file" hidden onChange={e=>upload(e.target.files?.[0])}/>
     <button className="size-11 rounded-full hover:bg-white/10 text-xl" title="Lampirkan file" onClick={()=>fi.current?.click()}>+</button>
     <input className="inp" placeholder="Tulis pesan" value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
     <button className="btn" onClick={send}>Kirim</button></footer></>}</main></div>}
