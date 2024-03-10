"use client";

import { useState } from "react";
import cn from "classnames";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAuth, VIEWS } from "../AuthProvider";
import supabase from "../../lib/supabase-browser";
import { useTranslations } from "next-intl";
import { SlNote } from "react-icons/sl";
import { authEmailsTranslations } from "./authEmailsTranslations";
import { useRouter } from "next/navigation";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignUp = () => {
  const t = useTranslations("Auth");

  const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const router = useRouter();
  const { Link } = createSharedPathnamesNavigation();
  async function signUp(formData) {
    const { data: createdUser, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: authEmailsTranslations[router.locale],
      },
    });

    const { data, errorStorage } = await supabase.storage.createBucket(
      "avatars",
      {
        public: false,
        allowedMimeTypes: ["image/png", "image/jpeg"],
        fileSizeLimit: 1024,
      }
    );

    if (error) {
      setErrorMsg(error.message);
    }
    if (createdUser.user.identities?.length === 0) {
      setErrorMsg("Email already exists");
    } else {
      setSuccessMsg(t("confirmation_text"));
    }
  }

  return (
    <div className="flex justify-center items-center shadow-md mx-auto card w-64">
      <h2 className="text-center text-2xl">{t("registerHeading")}</h2>
      <div className="mx-auto flex justify-center items-center">
        <SlNote className="" style={{ fontSize: 40 }} />
      </div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={SignUpSchema}
        onSubmit={signUp}
      >
        {({ errors, touched }) => (
          <div className="flex justify-center items-center">
            <Form className="w-full">
              <div className="flex flex-col w-64">
                <label htmlFor="email">{t("registerEmail")}</label>
                <Field
                  className={cn(
                    "input border-primary",
                    errors.email && "bg-base-200"
                  )}
                  id="email"
                  name="email"
                  placeholder=""
                  type="email"
                />
                {errors.email && touched.email ? (
                  <div className="text-error">{errors.email}</div>
                ) : null}
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">{t("registerPass")}</label>
                <Field
                  className={cn(
                    "input border-primary",
                    errors.password && touched.password && "bg-base-200"
                  )}
                  id="password"
                  name="password"
                  type="password"
                />
                {errors.password && touched.password ? (
                  <div className="text-error">{errors.password}</div>
                ) : null}
              </div>
              <button className="btn btn-primary w-full mt-8" type="submit">
                {t("registerSubmitButton")}
              </button>
            </Form>
          </div>
        )}
      </Formik>
      {errorMsg && <div className="text-error">{errorMsg}</div>}
      {successMsg && <div className="text-info">{successMsg}</div>}
      <div className="flex mx-auto justify-center items-center">
        <Link
          locale={router.locale}
          className="link w-full text-xl text-accent text-center"
          href={`/authCheck?view=sign_in`}
        >
          {t("registerLinkTo")}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
