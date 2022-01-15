import Image from 'next/image';
import SidebarLink from '../Sidebar/SidebarLink';

import {
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    ClipboardListIcon,
    UserIcon,
    DotsCircleHorizontalIcon,
    DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from '@heroicons/react/solid';
import { signOut, useSession } from 'next-auth/react';

const sidebarLinkItems = [
    {
        id: 1,
        icon: HomeIcon,
        text: "Home"
    },
    {
        id: 2,
        icon: HashtagIcon,
        text: "Explore"
    },
    {
        id: 3,
        icon: BellIcon,
        text: "Notification"
    },
    {
        id: 4,
        icon: InboxIcon,
        text: "Messages"
    },
    {
        id: 5,
        icon: BookmarkIcon,
        text: "Bookmark"
    },
    {
        id: 6,
        icon: ClipboardListIcon,
        text: "Lists"
    },
    {
        id: 7,
        icon: UserIcon,
        text: "Profile"
    },
    {
        id: 8,
        icon: DotsCircleHorizontalIcon,
        text: "More"
    }
]

export default function Sidebar() {
    const { data: session } = useSession();

    const profileUrl: string | undefined = session?.user.image!;
    const profileName: string | undefined = session?.user.name!;
    const profileTag: string | undefined = session?.user.tag!;


    return (
        <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
            <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
                <Image src="https://rb.gy/ogau5a" width={30} height={30} />
            </div>
            <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
                {/* Loop Sidebar Items */}
                {sidebarLinkItems.map(({text, icon, id}) => 
                    {
                        return <SidebarLink text={text} Icon={icon} key={id} active={id === 1 ? true : false} />
                    }
                )}
            </div>
            <button className="hidden xl:inline ml-auto bg-[#1d9bf0] rounded-full text-white 
                w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]"
            >
                Tweet
            </button>
            <div className="text-[#d9d9d9] flex items-center justify-center hoverAnimation xl:ml-auto xl:-mr-5 mt-auto"
                onClick={signOut}    
            >
                <img 
                    src={profileUrl}
                    alt="" 
                    className="h-10 w-10 rounded-full xl:mr-2.5" 
                />
                <div className="hidden xl:inline leading-5">
                    <h4 className="font-bold">{profileName}</h4>
                    <p className="text-[#6e767d]">@{profileTag}</p>
                </div>
                <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
            </div>
        </div>
    );
};
