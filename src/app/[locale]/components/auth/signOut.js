'use client';

import { useAuth } from "../AuthProvider";

export default function SignOut() {
    const {signOut} = useAuth();

    async function handleSignOut() {
        const {error} = await signOut();

        if(error ) {
            //TODO error
        }
    }

    return (
        <button type="button" className="button-inverse" onClick={handleSignOut}>
        Sign out</button>
    )
}