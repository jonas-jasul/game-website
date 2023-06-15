import { Link } from "next-intl/link";
import { redirect, useRouter } from "next/navigation";
import createClient from '../lib/supabase-server';
import AccountForm from "./accountEditForm";
export default async function Profile() {
    const supabase =createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if(!user) {
        redirect(`/`);
    }

    return (
        <AccountForm />
    )
}