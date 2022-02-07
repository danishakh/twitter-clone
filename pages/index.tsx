import Head from 'next/head'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Twitter Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto min-h-screen max-w-[1500px] bg-black">
        <Sidebar />
        {/* Feed */}
        {/* Widgets */}

        {/* Modal */}
      </main>
    </div>
  )
}
