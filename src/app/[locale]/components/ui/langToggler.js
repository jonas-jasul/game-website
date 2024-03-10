"use client";
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
const {Link, usePathname, useRouter} = createSharedPathnamesNavigation();

const LangToggler = () => {
    const pathname = usePathname();

    return (

        <div className="join p-0 m-0 me-1">
            <Link href={pathname} locale="en"><button className="btn join-item">EN</button></Link>
            <Link href={pathname} locale="lt"><button className="btn join-item">LT</button></Link>

        </div>
    )

}

export default LangToggler;
