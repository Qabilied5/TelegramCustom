'use client';
import {useState} from 'react';import {api} from '@/lib/api';
export default function Login({onDone}:{onDone:()=>void}){
 const [step,setStep]=useState<'phone'|'code'|'pw'>('phone'),[v,setV]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const go=async()=>{setErr('');setBusy(true);try{
  if(step==='phone'){await api('/auth/send-code',{method:'POST',body:JSON.stringify({phone:v})});setStep('code')}
  else if(step==='code'){const r=await api('/auth/verify',{method:'POST',body:JSON.stringify({code:v})});r.needPassword?setStep('pw'):onDone()}
  else{await api('/auth/password',{method:'POST',body:JSON.stringify({password:v})});onDone()}
  setV('')}catch(e:any){setErr(e.message)}setBusy(false)};
 const t={phone:['Masuk dengan Telegram','Nomor telepon dengan kode negara, contoh +62812…'],code:['Masukkan kode','Kode dikirim ke aplikasi Telegram Anda.'],pw:['Verifikasi dua langkah','Masukkan kata sandi akun Telegram Anda.']}[step];
 return <main className="grid place-items-center min-h-dvh p-4"><form onSubmit={e=>{e.preventDefault();go()}} className="glass rounded-3xl p-8 w-full max-w-sm space-y-4 pop">
  <h1 className="text-2xl font-semibold">{t[0]}</h1><p className="text-sm text-white/70">{t[1]}</p>
  <input className="inp" autoFocus value={v} onChange={e=>setV(e.target.value)} type={step==='pw'?'password':'text'} inputMode={step==='pw'?'text':'tel'} placeholder={step==='phone'?'+62…':step==='code'?'Kode':'Kata sandi'}/>
  {err&&<p className="text-sm text-rose-200">{err}</p>}
  <button className="btn w-full" disabled={busy||!v}>{busy?'Memproses…':step==='phone'?'Kirim kode':'Lanjutkan'}</button></form></main>}
