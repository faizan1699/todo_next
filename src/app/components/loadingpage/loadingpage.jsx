"use client";

import loader from "@/app/assets/loader/loader.gif";
import Image from "next/image";

const LoadingPage = ({loading}) => {

    if(!loading) {
        return null
    }

    return (
        <div className='loading_page'>
            <Image
                src={loader}
                width={70}
                height={70}
                alt="loader"
            />
        </div>
    )
}

export default LoadingPage