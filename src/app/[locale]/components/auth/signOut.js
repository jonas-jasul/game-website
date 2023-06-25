import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { useTranslations } from "next-intl";

export default function SignOut() {
    const {signOut} = useAuth();
    const router = useRouter();

    async function handleSignOut() {
        const {error} = await signOut();

        if(!error) {
            router.push('/');

        }
       //TODO error
    }
    const t = useTranslations('Navbar')


    return (
        <button type="button" className="button-inverse bg-error pl-4 p-1 text-primary-content" onClick={handleSignOut}>
        {t('navAvatarSignOut')}</button>
    )
}