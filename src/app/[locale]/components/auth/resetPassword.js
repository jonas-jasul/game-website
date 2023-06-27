'use client';

import { useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Link from "next-intl/link"
import { useAuth, VIEWS } from '../AuthProvider';
import supabase from '../../lib/supabase-browser';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

const ResetPassword = () => {
    const { setView } = useAuth();
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const t = useTranslations('Auth');
    const router = useRouter();

    async function resetPassword(formData) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData?.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_BASE_URL}`,
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg('Password reset instructions sent.');
        }
    }

    return (
        <div className="card flex justify-center items-center mx-auto w-32 ">
            <h2 className="w-full text-center text-2xl">{t('forgotPassRecovery')}</h2>
            <Formik
                initialValues={{
                    email: '',
                }}
                validationSchema={ResetPasswordSchema}
                onSubmit={resetPassword}
            >
                {({ errors, touched }) => (
                    <Form className="w-full">
                        <div className='col col-flex'>
                            <label htmlFor="email" className="m-1">{t('forgotPassEmail')}</label>
                            <Field
                                className={cn('input border-primary', errors.email && 'bg-base-100')}
                                id="email"
                                name="email"
                                placeholder=""
                                type="email"
                            />
                        </div>
                        {errors.email && touched.email ? (
                            <div className="text-error">{errors.email}</div>
                        ) : null}
                        <button className="btn btn-primary w-full mt-5" type="submit">
                            {t('forgotPassSendInstruct')}
                        </button>
                    </Form>
                )}
            </Formik>
            {errorMsg && <div className="text-center text-error">{errorMsg}</div>}
            {successMsg && <div className="text-center text-primary">{successMsg}</div>}
            <Link className="link text-accent" locale={router.locale} href={`/authCheck?view=sign_in`}>
                {t('forgotPassLinkBack')}
            </Link>
        </div>
    );
};

export default ResetPassword;