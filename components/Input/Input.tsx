import React from 'react';
import { useState, useRef, ChangeEvent } from "react";

import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon, } from "@heroicons/react/outline";

import { db, storage } from "../../firebase";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";

import 'emoji-mart/css/emoji-mart.css'
import { Picker, EmojiData } from 'emoji-mart';
import { useSession } from 'next-auth/react';


export default function Input() {

    const {data: session} = useSession();

    const profileUrl: string | undefined = session?.user.image!;

    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [loading, setLoading] = useState(false);

    const filePickerRef = useRef<HTMLInputElement>(null);

    // Add Image to post
    const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
        const fileReader =  new FileReader();
        const files: any = e.target.files;
        if (files[0]) {
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
                return alert("Please add a valid file!")
            }
            fileReader.readAsDataURL(files[0])
        }

        fileReader.addEventListener('load', () => {
            setSelectedFile(fileReader.result);
        });
    };

    // Hide and Show emoji picker
    const togglePicker = () => {
        setShowEmojis(!showEmojis);
    };

    // Click emoji from emoji-picker and add to textarea content
    const addEmoji = (emoji: EmojiData) => {
        if ("native" in emoji) {
            const text = `${input}${emoji.native}`;
            setInput(text);
        }
    };

    // Send tweet using firebase
    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp()
        }) 

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(
                async () => {
                    const downloadURL = await getDownloadURL(imageRef);
                    await updateDoc(doc(db, "posts", docRef.id), {
                        image: downloadURL,
                    });
                }
            );
        }

        setLoading(false);
        setInput("");
        setSelectedFile(null);
        setShowEmojis(false);
    };


    return (
        <div className={`border-b border-gray-700 p-3 flex space-x-3
            overflow-y-scroll ${loading && "opacity-60"}`}>
            <img 
                src={profileUrl} 
                alt="" 
                className="h-11 w-11 rounded-full cursor-pointer" 
            />
            <div className="w-full divide-y divide-gray-700">
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        rows={2}
                        placeholder="What's happening?" 
                        className="bg-transparent outline-none text-[#d9d9d9] text-lg 
                        placeholder-gray-500 tracking-wide w-full min-h-[50px]"
                    ></textarea>

                    {selectedFile && (
                        <div className="relative">
                            <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full
                                flex items-center justify-center top-1 cursor-pointer" onClick={() => setSelectedFile(null)}>
                                <XIcon className="text-white h-5" />
                            </div>
                            <img src={selectedFile} className="rounded-2xl max-h-80 object-contain" alt="" />
                        </div>
                    )}
                </div>
                
                {!loading && (
                    <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                            <div className="icon" onClick={() => filePickerRef.current.click()}>
                                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                                <input 
                                    accept='image/*'
                                    type="file" 
                                    hidden 
                                    onChange={addImageToPost} 
                                    ref={filePickerRef} 
                                />
                            </div>

                            <div className="icon rotate-90">
                                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            <div className="icon" onClick={togglePicker}>
                                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            <div className="icon">
                                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            {showEmojis && (
                                <Picker 
                                    onSelect={addEmoji}
                                    emoji="" 
                                    title="" 
                                    native={true}
                                    style={{
                                        position: "absolute",
                                        marginTop: "465px",
                                        marginLeft: -40,
                                        maxWidth: "320px",
                                        borderRadius: "20px",
                                    }}
                                    theme="dark"
                                />
                            )}
                        </div>
                        <button
                            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default" 
                            disabled={!input.trim() && !selectedFile}
                            onClick={sendPost}
                        >
                            Tweet
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
