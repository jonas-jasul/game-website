// 'use client';

import { useAuth } from "../AuthProvider";
import { useTranslations } from "next-intl";

export default function SignOut() {
    const t = useTranslations('Navbar')
    const {signOut} = useAuth();

    async function handleSignOut() {
        const {error} = await signOut();

        if(error ) {
            //TODO error
        }
    }

    return (
        <button type="button" className="button-inverse bg-error" onClick={handleSignOut}>
        {t('navAvatarSignOut')}</button>
    )
}