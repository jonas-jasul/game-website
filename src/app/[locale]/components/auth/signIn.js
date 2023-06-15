'use client';

import { useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import "../../css/auth.css"
import { useAuth, VIEWS } from '../AuthProvider';
import supabase from '../../lib/supabase-browser';
import { useTranslations } from 'next-intl';


const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

const SignIn = () => {
    const t = useTranslations('Auth');
    const { setView } = useAuth();
    const [errorMsg, setErrorMsg] = useState(null);

    async function signIn(formData) {
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            setErrorMsg(error.message);
        }
    }

    return (
        <div className="flex justify-center items-center shadow-md mx-auto card w-16">
            <div className="mx-auto">
                <h2 className="text-center">{t('loginHeading')}</h2>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={SignInSchema}
                    onSubmit={signIn}
                >
                    {({ errors, touched }) => (
                        <Form className="w-full">
                            <div className="flex flex-col">
                                <label htmlFor="email">{t('loginEmail')}</label>
                                <Field
                                    className={cn('input input-bordered', errors.email && touched.email && 'bg-red-50')}
                                    id="email"
                                    name="email"
                                    placeholder=""
                                    type="email"
                                />
                                {errors.email && touched.email ? (
                                    <div className="text-red-600">{errors.email}</div>
                                ) : null}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="password">{t('loginPass')}</label>
                                <Field
                                    className={cn('input input-bordered', errors.password && touched.password && 'bg-red-50')}
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                                {errors.password && touched.password ? (
                                    <div className="text-red-600">{errors.password}</div>
                                ) : null}
                            </div>

                            <button
                                className="link w-full"
                                type="button"
                                onClick={() => setView(VIEWS.FORGOTTEN_PASSWORD)}
                            >
                                Forgot your password?
                            </button>

                            <button className="btn bg-primary w-full mt-5" type="submit">
                                {t('loginSubmitButton')}
                            </button>
                        </Form>
                    )}
                </Formik>
                {errorMsg && <div className="text-red-600">{errorMsg}</div>}
                <button
                    className="link my-3 w-full"
                    type="button"
                    onClick={() => setView(VIEWS.SIGN_UP)}
                >
                    {t('loginLinkToSignUp')}
                </button>
            </div>
        </div>

    );
};

export default SignIn;