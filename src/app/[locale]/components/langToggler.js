"use client";
import { usePathname, useRouter } from "next-intl/client";
// import React,{ useState } from "react";
// import { useIntl } from "react-intl";
import Link from "next-intl/link";
const LangToggler = () => {
    // const router = useRouter();
    // const [language, setLanguage] = useState("en");
    const pathname = usePathname();

    // const handleLangToggle =()=>{
    //     const newLanguage = language === "en" ? "lt" : "en";
    //     setLanguage(newLanguage);
    //     router.push('/');
    // }


    return (
        // <div className="form-control">
        //     <label className="label cursor-pointer" onClick={handleLangToggle}>
        //         <span className="label-text">{language}</span>
        //         <input type="checkbox" className="toggle toggle-secondary" />
        //     </label>
        // </div>
        <div className="join p-0 m-0 me-1">
            <Link href={pathname} locale="en"><button className="btn join-item">EN</button></Link>
            <Link href={pathname} locale="lt"><button className="btn join-item">LT</button></Link>

        </div>
    )

}

export default LangToggler;
