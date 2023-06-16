
"use client";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Link from "next-intl/link";
import SignOut from "../auth/signOut";
import { useAuth } from "../AuthProvider";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@supabase/auth-ui-shared";
import { da } from "date-fns/locale";
export default function Avatar({ user }) {
    const supabase = createClientComponentClient()
    const { user: authUser } = useAuth();
    const router = useRouter();
    const t = useTranslations('Navbar');
    const [avatarUrl, setAvatarUrl] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function downloadImage() {

            try {
                setLoading(true);

                const { data: firstData, error, status } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user?.id)
                    .single()
                if (error) {
                    throw error
                }
                const url = firstData.avatar_url;
                console.log(url);

                try {
                    const { data, error } = await
                        supabase.storage.from('avatars').download(url);
                    const newUrl = URL.createObjectURL(data)
                    console.log(data);
                    setAvatarUrl(newUrl);
                }
                
                catch (error) {
                    console.log("error")
                }
              
                
            }
            catch (error) {
                console.log("Error while downloading image: ", error)
            }
        }
        downloadImage()

    }, [])


    return (
        <div className="dropdown dropdown-end mx-1">
            <label tabIndex={0} className="btn btn-ghost rounded-btn p-0">
                <div className="avatar placeholder">
                    <div className="bg-base-100 text-base-content rounded-full w-12 h-12 flex items-center justify-center">
                        {authUser && (<Image src={avatarUrl} width={20} height={20} alt="Avatar"></Image>)}
                        {!authUser && (<RxAvatar size="3.2em" />)}
                    </div>
                </div>
            </label>
            <ul style={{ zIndex: 2 }} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">

                {!authUser && (<li><Link locale={router.locale} href="/authCheck">{t('avatarLoginSignup')}</Link></li>)}
                {authUser && (<li><Link locale={router.locale} href="/profile">{t('navAvatarProfile')}</Link></li>)}
                {authUser && (<li><SignOut /></li>)}
            </ul>
        </div>
    )
}
