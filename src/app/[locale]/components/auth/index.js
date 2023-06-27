'use client';

import { useAuth, VIEWS } from "../AuthProvider";

import ResetPassword from "./resetPassword";
import SignIn from "./signIn";
import SignUp from "./signUp";
import UpdatePassword from "./updatePassword";


const Auth = ({ view: initialView }) => {
    let { view } = useAuth();

    if (initialView) {
        view = initialView;
    }

    switch (view) {
        case VIEWS.UPDATE_PASSWORD:
            return <UpdatePassword />;

        case VIEWS.FORGOTTEN_PASSWORD:
            return <ResetPassword />;

        case VIEWS.SIGN_UP:
            return <SignUp />
        default:
            return <SignIn  />
    }
}

export default Auth;