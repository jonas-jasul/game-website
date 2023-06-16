'use client';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "../lib/supabase-browser";
export const useAuth = () => useContext(AuthContext);
export const EVENTS = {
    PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
    SIGNED_OUT: 'SIGNED_OUT',
    USER_UPDATED: 'USER_UPDATED',
    SIGNED_IN: 'SIGNED_IN',

};

export const VIEWS = {
    SIGN_IN: 'sign_in',
    SIGN_UP: 'sign_up',
    FORGOTTEN_PASSWORD: 'forgotten_password',
    MAGIC_LINK: 'magic_link',
    UPDATE_PASSWORD: 'update_password',
};

export const AuthContext = createContext();

export const AuthProvider = ({ children, ...props }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);
    const [view, setView] = useState(VIEWS.SIGN_IN);
    const [initial, setInitial] = useState(true);

    useEffect(() => {
        async function getActiveSession() {
            const {
                data: { session: activeSession },
            } = await supabase.auth.getSession();
            setSession(activeSession);
            setUser(activeSession?.user ?? null);
            setInitial(false);
        }
        getActiveSession();


        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange((event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            switch (event) {
                case EVENTS.PASSWORD_RECOVERY:
                    setView(VIEWS.UPDATE_PASSWORD);
                    break;
                case EVENTS.SIGNED_IN:
                    setAuth(true);
                case EVENTS.SIGNED_OUT:
                    setAuth(false);
                case EVENTS.USER_UPDATED:
                    setView(VIEWS.SIGN_IN);
                    break;

                default:
            }
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    const value = useMemo(() => {
        return {
            initial,
            session,
            user,
            view,
            setView,
            signOut: () => supabase.auth.signOut(),
        };
    }, [initial, session, user, view]);

    return <AuthContext.Provider value={value} {...props}>
        {children}
    </AuthContext.Provider>;
}
export default AuthProvider;

