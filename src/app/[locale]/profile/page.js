import { redirect, useRouter } from "next/navigation";
import createClient from '../lib/supabase-server';
import AccountForm from "./accountEditForm";
import Avatar from "../components/ui/avatar";
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export default async function Profile() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/`);
    }

    return (
        <>
            <AccountForm user={user} />

        </>
    )
}