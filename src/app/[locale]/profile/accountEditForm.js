'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'
import DatePicker, { getDefaultLocale, registerLocale } from "react-datepicker";
import lt from "date-fns/locale/lt";
import moment from 'moment/moment';
import "react-datepicker/dist/react-datepicker.css";
import AvatarUpload from './avatarUpload';
import { useTranslations } from 'next-intl';
import "../css/datepicker.css";

export default function AccountForm({ user }) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [birthdate, setBirthdate] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const successModalRef = useRef();
  const pathname = usePathname();
  const [startBirthdate, setStartBirthdate] = useState(new Date());
  const t = useTranslations('Profile');
  registerLocale("lt", lt);

  //getting locale from url
  const regex = /\/[A-Za-z]+\/profile/i;
  const localeFromPathname = regex.test(pathname) === true ? "lt" : "en";

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, birthdate, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setBirthdate(data.birthdate)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {

    getProfile();
  }, [user, getProfile])

  async function updateProfile({
    username,
    birthdate,
    avatar_url,
    email,
  }) {
    try {
      setLoading(true)

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        birthdate: moment(startBirthdate).format(),
        email: user?.email,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if(avatarFile) {
        let { error: uploadError } = await supabase.storage.from("avatars").upload(avatar_url, avatarFile);

        if (uploadError) {
          throw uploadError;
        }
      }

     
      if (error) throw error
      openSuccessModal();
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarFileSelect = (file) => {
    setAvatarFile(file)
  }

  const openSuccessModal = () => {
    if (successModalRef.current) {
      successModalRef.current.showModal();
    }
  }

  return (
    <>
      <dialog id="my_modal_2" className="modal" ref={successModalRef}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{t('profileSuccessModHead')}</h3>
          <p className="py-4">{t('profileSuccessModBody')}</p>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className='flex justify-center items-center'>
        <h1 style={{ fontSize: 26 }}>{t('profileHeading')}</h1>
      </div>

      <div className="flex mx-auto justify-center items-center flex-col lg:flex-row w-full mt-8">
        <div className=''>
          <div className='flex flex-col justify-center items-center'>
            <label htmlFor="email">{t('emailProfile')}</label>
            <input className="input input-bordered input-accent w-60 " id="email" type="text" value={user.email} disabled />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <label htmlFor="fullName">{t('fullNameProfile')}</label>
            <input className="input input-bordered input-accent w-60"
              id="fullName"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <label htmlFor="username">{t('usernameProfile')}</label>
            <input className="input input-bordered input-accent w-60"
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <label htmlFor="birthdate">{t('birthdateProfile')}</label>
            <DatePicker
              locale={localeFromPathname}
              dateFormat="yyyy-MM-dd"
              className='input input-bordered input-accent w-60'
              id="birthdate"
              showYearDropdown
              calendarClassName='custom-datepicker'
              scrollableYearDropdown
              showMonthDropdown
              maxDate={new Date(moment().toDate())}
              yearDropdownItemNumber={90}

              selected={startBirthdate}
              onChange={(date) => setStartBirthdate(date)}
            />
          </div>

        </div>
        <div className='flex justify-center items-start ml-5'>
          <AvatarUpload uid={user.id} url={avatar_url} size={170} onUploadFile={handleAvatarFileSelect} onUploadUrl={(url) => {
            setAvatarUrl(url);

          }} />
        </div>

      </div>
      <div className='flex justify-center items-center mt-3'>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, birthdate, avatar_url })}
          disabled={loading}
        >
          {loading ? <span className='loading loading-dots loading-md'></span> : <button className='btn btn-primary'>{t('updateProfile')}</button>}
        </button>
      </div>
    </>
  )
}