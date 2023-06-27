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
import Link from "next-intl/link";
import { useRouter } from 'next/navigation';
const SignInSchema = Yup.object().shape({
    email: Yup.string().email('invalidEmailError').required('requiredError'),
    password: Yup.string().required('requiredError'),
});

const SignIn = () => {
    const cookies = new Cookies();
    const t = useTranslations('Auth');
    const { setView } = useAuth();
    const [errorMsg, setErrorMsg] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

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
                                    className={cn('input border-primary', errors.email && touched.email && 'bg-base-200')}
                                    id="email"
                                    name="email"
                                    placeholder=""
                                    type="email"
                                />
                                {errors.email && touched.email ? (
                                    <div className="text-error">{t(errors.email)}</div>
                                ) : null}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="password">{t('loginPass')}</label>
                                <Field
                                    className={cn('input border-primary', errors.password && touched.password && 'bg-base-200')}
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                                {errors.password && touched.password ? (
                                    <div className="text-error">{t(errors.password)}</div>
                                ) : null}
                            </div>

                            <div className='flex flex-col form-control'>
                                <label className='label cursor-pointer'>
                                    <span className='label-text'>{t('rememberMe')}</span>
                                    <input className='checkbox checkbox-accent' type='checkbox' checked={rememberMe} onChange={handleRememberMeChange} />
                                </label>
                            </div>

                            <Link
                                className="link w-full mt-2 text-accent"
                                href={`/authCheck?view=forgotten_password`}
                            >
                                {t('forgotPassHeading')}
                            </Link>

                            <button className="btn btn-primary w-full mt-5" type="submit">
                                {t('loginSubmitButton')}
                            </button>
                        </Form>
                    )}
                </Formik>
                {errorMsg && <div className="text-error">{errorMsg}</div>}
                <div className='flex mx-auto justify-center items-center'>
                    <Link
                        locale={router.locale}
                        className="link my-3 w-full text-xl text-accent text-center"
                        href={`/authCheck?view=sign_up`}
                    >
                        {t('loginLinkToSignUp')}
                    </Link>
                </div>

            </div>
        </div>

    );
};

export default SignIn;