import Head from 'next/head';
import Feed from '../components/Feed/Feed';
import Sidebar from '../components/Sidebar/Sidebar';
import { getProviders, getSession, useSession } from 'next-auth/react';
import Login from '../components/Login';
import Modal from '../components/Modal/Modal';
import { modalState } from '../atoms/modalAtom';
import { useRecoilState } from 'recoil';
import Widgets from '../components/Widgets/Widgets';


export default function Home({ trendingResults, followingResults, providers }: any) {

    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useRecoilState<boolean>(modalState);

    if (!(session as any)) {
        return (
            <>
                <Login providers={providers} />;
                {/* TutoriL TIMESTAMP 3:25: 06 */}
            </> 
        )
    } 

    return (
        <div className="">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
                <Sidebar />
                <Feed />
                {(session as any)?.user?.name}
                
                <Widgets
                    trendingResults={trendingResults}
                    followResults={followingResults}
                />

                {isOpen && <Modal />}
            </main>
        </div>
    )
};

export async function getServerSideProps(context: any) {
    const trendingResults = await fetch(`https://jsonkeeper.com/b/NKEV`).then(
        res => res.json()
    );
    
    const followingResults = await fetch(`https://jsonkeeper.com/b/WWMJ`).then(
        res => res.json()
    );
  
    const providers = await getProviders();
    const session: any = await getSession(context);
  
    return {
        props: {
            trendingResults,
            followingResults,
            providers,
            session,
        },
    }
}
