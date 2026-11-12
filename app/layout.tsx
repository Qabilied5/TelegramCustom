import './globals.css';import {Sora} from 'next/font/google';
const f=Sora({subsets:['latin'],variable:'--f'});
export const metadata={title:'Telegram Glass'};
export default function L({children}:{children:React.ReactNode}){return <html lang="id"><body className={f.variable+' font-sans'}>{children}</body></html>}
