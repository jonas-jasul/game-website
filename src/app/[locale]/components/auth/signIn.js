'use client';

import { useEffect, useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import "../../css/auth.css"
import { useAuth, VIEWS } from '../AuthProvider';
import supabase from '../../lib/supabase-browser';
import { useTranslations } from 'next-intl';
import Cookies from 'universal-cookie';
import { id } from 'date-fns/locale';
import { useFormik } from 'formik';
import { SlLogin } from "react-icons/sl";

const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('requiredError'),
    password: Yup.string().required('requiredError'),
});

const SignIn = () => {
    const cookies = new Cookies();
    const t = useTranslations('Auth');
    const { setView } = useAuth();
    const [errorMsg, setErrorMsg] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);


    const [email, setEmail] = useState('');
    async function signIn(formData) {
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        }
        );

        if (error) {
            setErrorMsg(error.message);
        }

        else {
            if (rememberMe) {
                cookies.set('rememberedEmail', formData.email, { path: '/', maxAge: 30 * 24 * 60 * 60 })
            }
            else {
                cookies.remove('rememberedEmail', { path: '/' });
            }
        }

    }

    const handleRememberMeChange = (event) => {
        const isChecked = event.target.checked;
        setRememberMe(isChecked);
        if (isChecked) {
            cookies.set('rememberMe', 'true', { path: '/', maxAge: 30 * 24 * 60 * 60 });
        }
        else {
            cookies.remove('rememberMe', { path: '/' })
        }
    }


    return (
        <div className="flex justify-center items-center shadow-md mx-auto card w-16">
            <div className="mx-auto">
                <h2 className="text-center text-2xl">{t('loginHeading')}</h2>
                <div className='mx-auto mt-2 flex justify-center items-center'>
                    <SlLogin className='' style={{ fontSize: 40 }} />
                </div>

                <Formik
                    initialValues={{
                        email: cookies.get('rememberedEmail') || '',
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
                                    <div className="text-red-600">{t(errors.email)}</div>
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
                                    <div className="text-red-600">{t(errors.password)}</div>
                                ) : null}
                            </div>

                            <div className='flex flex-col form-control'>
                                <label className='label cursor-pointer'>
                                    <span className='label-text'>{t('rememberMe')}</span>
                                    <input className='checkbox checkbox-accent' type='checkbox' checked={rememberMe} onChange={handleRememberMeChange} />
                                </label>
                            </div>

                            <button
                                className="link w-full mt-2"
                                type="button"
                                onClick={() => setView(VIEWS.FORGOTTEN_PASSWORD)}
                            >
                                {t('forgotPassHeading')}
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
        </div >

    );
};

export default SignIn;