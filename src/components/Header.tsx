import React, { useContext } from 'react';
import { AppContext } from '@/store';
import Image from "next/image";
import Locale from "../locales";

export default function Header() {
    const globalState = useContext(AppContext);
    return (
        <div id="translator-header">
            <div className="flex space-x-2 items-center justify-center p-4 w-full">
                <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px]">
                    <a href={globalState.domain} target="_blank">
                        <Image width={40} height={40} className="w-full h-auto" src="/images/logo.png" alt="" />
                    </a>
                </div>
                <div className="text-[30px] sm:text-[40px] no-underline">
                    {Locale.Home.Title}
                </div>
            </div>
        </div>
    )
}
