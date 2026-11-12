'use client';
import {useEffect,useState} from 'react';import {api} from '@/lib/api';import Login from '@/components/Login';import Chat from '@/components/Chat';
export default function P(){const [me,setMe]=useState<any>(undefined);
 useEffect(()=>{api('/me').then(setMe).catch(()=>setMe(null))},[]);
 if(me===undefined)return <div className="grid place-items-center min-h-dvh text-white/70">Memuat…</div>;
 return me?<Chat me={me} onOut={()=>setMe(null)}/>:<Login onDone={()=>api('/me').then(setMe)}/>}
