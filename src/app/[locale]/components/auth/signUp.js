'use client';

import { useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth, VIEWS } from '../AuthProvider';
import supabase from '../../lib/supabase-browser';
import { useTranslations } from 'next-intl';


const SignUpSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});


const SignUp = () => {
    const t = useTranslations('Auth');

    const { setView } = useAuth();
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    async function signUp(formData) {
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg('Success! Please check your email for further instructions.');
        }
        if (formData?.user?.identities?.length === 0) {
            return { formData, error: "Please sign in with your existing account" };
          }
    }

    return (
        <div className="flex justify-center items-center shadow-md mx-auto card w-64">
            <h2 className="text-center">{t('registerHeading')}</h2>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={SignUpSchema}
                onSubmit={signUp}
            >
                {({ errors, touched }) => (
                    <div className="flex justify-center items-center">
                        <Form className="w-full">
                            <div className="flex flex-col">

                                <label htmlFor="email">{t('registerEmail')}</label>
                                <Field
                                    className={cn('input input-bordered', errors.email && 'bg-red-50')}
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

                                <label htmlFor="email">{t('registerPass')}</label>
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
                            <button className="btn btn-primary w-full mt-5" type="submit">
                                {t('registerSubmitButton')}
                            </button>
                        </Form>
                    </div>
                )}
            </Formik>
            {errorMsg && <div className="text-red-600">{errorMsg}</div>}
            {successMsg && <div className="text-black">{successMsg}</div>}
            <button
                className="link w-full"
                type="button"
                onClick={() => setView(VIEWS.SIGN_IN)}
            >
                {t('registerLinkTo')}
            </button>
        </div>
    );
};

export default SignUp;