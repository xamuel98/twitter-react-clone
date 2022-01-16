import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    Query,
    DocumentReference,
    CollectionReference,
    DocumentData
  } from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Modal from "../components/Modal/Modal";
import Sidebar from "../components/Sidebar/Sidebar";
// import Widgets from "../components/Widgets";
import Post from "../components/Post/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Comment from "../components/Comment/Comment";
import Head from "next/head";
import Login from "../components/Login";
import Widgets from '../components/Widgets/Widgets';
// import { Firestore } from "firebase/firestore";

function PostPage({ trendingResults, followingResults, providers }: any) {

    const {data: session} = useSession();
    const [isOpen, setIsOpen] = useRecoilState<boolean>(modalState);
    const [post, setPost] = useState<any>();
    const [comments, setComments] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const router = useRouter();
    const { id }: any = router.query;
    const dataBase: any = db;
    useEffect(
        () => 
            onSnapshot(doc(dataBase, "/posts", id) as DocumentReference<DocumentData>, (snapshot: any) =>  {
                setPost(snapshot.data());
            }),
        [db]
    );

    useEffect(
        () =>
          onSnapshot(
            query(collection(db, "posts", id, "comments") as CollectionReference<DocumentData> , orderBy("timestamp", "desc")),
            (snapshot: any) => {
                setComments(snapshot.docs)
            }
        ),
        [db, id]
    );


    if (!session) return <Login providers={providers} />;
    

    return (
        <div className="">
            <Head>
                <title>{(post as any)?.username} on Twitter: "{(post as any)?.text!}"</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
                <Sidebar />
                <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:xl-[73px] xl:ml-[370px]">
                    <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
                        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                        onClick={() => router.push('/')}
                        >
                            <ArrowLeftIcon className="h-5 text-white" />
                        </div>
                        Tweet
                    </div>

                    <Post id={id} post={post} postPage />
                    {comments.length > 0 && (
                        <div className="pb-72">
                            {comments.map(comment => (
                                <Comment 
                                    key={comment.id} 
                                    id={comment.id} 
                                    comment={comment.data()} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                <Widgets
                    trendingResults={trendingResults}
                    followResults={followingResults}
                />

                {isOpen && <Modal />}
            </main>
        </div>
    )
}

export default PostPage;
 

export async function getServerSideProps(context: any) {
    const trendingResults = await fetch(`https://jsonkeeper.com/b/NKEV`).then(
        res => res.json()
    );
    
    const followingResults = await fetch(`https://jsonkeeper.com/b/WWMJ`).then(
        res => res.json()
    );
  
    const providers = await getProviders();
    const session = await getSession(context);
  
    return {
        props: {
            trendingResults,
            followingResults,
            providers,
            session,
        },
    }
}