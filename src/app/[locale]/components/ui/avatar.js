
"use client";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Link from "next-intl/link";
import SignOut from "../auth/signOut";

export default function Avatar() {
    const router = useRouter();
    return (
        <div className="dropdown dropdown-end mx-1">
            <label tabIndex={0} className="btn btn-ghost rounded-btn p-0">
                <div className="avatar placeholder">
                    <div className="bg-base-100 text-base-content rounded-full w-12 h-12 flex items-center justify-center">
                        <RxAvatar size="3.2em" />
                    </div>
                </div>
            </label>
            <ul style={{ zIndex: 2 }} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li><Link locale={router.locale} href="/authCheck">Log In / Sign Up</Link></li>
                {/* <li><Link locale={router.locale} href="/auth" >Sign Up</Link></li> */}
                <li><SignOut /></li>
            </ul>
        </div>
    )
}
