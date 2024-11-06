import React, { useContext } from 'react';
import { AppContext } from '../store';
import Locale from "../locales";
import Image from "next/image";

export default function Footer() {
    const globalState = useContext(AppContext);
    return (
        <div id="translator-footer">
            <div className="flex flex-col items-center justify-center p-4 w-full">
                <div className="flex">
                    <a href={globalState.domain} target="_blank" className="flex p-1 space-x-2" style={{ textDecoration: "none" }}>
                        <div className="title text-xs text-[#666]">
                            Powered By
                        </div>
                        <div className="banner flex items-center">
                            <Image width={50} height={14} src="/images/banner.png" alt="" />
                        </div>
                    </a>
                </div>
                <div className="flex justify-center text-center text-xs text-gray-400 ">
                    {Locale.About.Tip}
                </div>
            </div>
        </div>
    )
}
