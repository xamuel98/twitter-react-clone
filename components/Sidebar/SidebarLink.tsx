import React from "react";

interface SidebarLinksProps {
    src?: string,
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    text: string,
    active?: boolean,
}

export default function SidebarLink({src, Icon, text, active}:SidebarLinksProps) {
    return (
        <div className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${active && 'font-bold'}`}>
            {src && (
                <img className="h-7 rounded-full" src={src} alt="" width="30" height="30" />            
            )}
            {Icon && (<Icon className="h-7"/>)}
            <span className="hidden xl:inline">{text}</span>
        </div>
    )
}
