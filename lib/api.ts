export const B=process.env.NEXT_PUBLIC_API_URL!;
export const api=async(p:string,o:RequestInit={})=>{const r=await fetch(B+p,{credentials:'include',...o,headers:o.body instanceof FormData?{}:{'Content-Type':'application/json'}});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Permintaan gagal');return j};
export const mediaUrl=(c:string,m:number,t=false)=>`${B}/media/${c}/${m}${t?'?thumb=1':''}`;
export const events=()=>new EventSource(B+'/events',{withCredentials:true});
