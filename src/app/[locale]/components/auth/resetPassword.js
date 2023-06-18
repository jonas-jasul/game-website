'use client';

import { useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useAuth, VIEWS } from '../AuthProvider';
import supabase from '../../lib/supabase-browser';
import { useTranslations } from 'next-intl';

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

const ResetPassword = () => {
    const { setView } = useAuth();
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const t = useTranslations('Auth');

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
                            className={cn('input input-bordered', errors.email && 'bg-red-50')}
                            id="email"
                            name="email"
                            placeholder=""
                            type="email"
                        />
                        </div>
                        {errors.email && touched.email ? (
                            <div className="text-red-600">{errors.email}</div>
                        ) : null}
                        <button className="btn btn-primary w-full mt-5" type="submit">
                            {t('forgotPassSendInstruct')}
                        </button>
                    </Form>
                )}
            </Formik>
            {errorMsg && <div className="text-center text-red-600">{errorMsg}</div>}
            {successMsg && <div className="text-center text-black">{successMsg}</div>}
            <button className="link" type="button" onClick={() => setView(VIEWS.SIGN_IN)}>
                {t('forgotPassLinkBack')}
            </button>
        </div>
    );
};

export default ResetPassword;