import Editor from '@/components/editor'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="m-0 p-10 bg-slate-700 overflow-y-auto  h-screen w-screen">

      <Editor />

      <div className='h-screen w-screen' />
    </main>
  )
}
