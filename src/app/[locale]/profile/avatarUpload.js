"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { RxAvatar } from "react-icons/rx";
export default function AvatarUpload({ uid, url, size, onUploadUrl, onUploadFile }) {
    const supabase = createClientComponentClient();
    const t = useTranslations('Profile');
    const avatarRef=useRef();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

    useEffect(() => {
        async function downloadImage(path) {
            try {
                const { data, error } = await supabase.storage.from("avatars").download(path);

                if (error) {
                    throw error
                }

                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
            }
            catch (error) {
                console.log("Error while downloading image: ", error)
            }
        }

        if (url) {
            downloadImage(url)
        }
    }, [url, supabase]);

    const uploadAvatar = async (event) => {
            try {
                setUploading(true);

                if (!event.target.files || event.target.files.length === 0) {
                    throw new Error("Select an image!");
                }
                const file =event.target.files[0];
                setSelectedAvatarFile(file);
                const imageUrl= URL.createObjectURL(file);
                setAvatarUrl(imageUrl);
                const fileExten = file.name.split('.').pop();
                const filePath = `${uid}-${Math.random()}.${fileExten}`;
                // let { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, newFile);

                // if (uploadError) {
                //     throw uploadError;
                // }

                onUploadUrl(filePath)
                onUploadFile(file)
            }
            // catch (error) {
            //     alert("error uploading avatar");
            // }
            finally {
                setUploading(false)
            }
        
    }

    function handleImgUpload(event) {
        const file = event.target.files[0];
        setSelectedAvatarFile(file);

    }

    // function twoFunctions (e) {
    //     handleImgUpload(e)
    //     uploadAvatar(e)

    // }

    return (
        <div className="flex flex-col w-60">
            <div className="flex mx-auto">
                <h2>{t('profileAvatarHeading')}</h2>
            </div>
            <div className="flex mx-auto mb-2 avatar">
                <div className="rounded-full">
                    {avatarUrl ? (
                        <Image
                        
                            width={size}
                            height={size}
                            src={selectedAvatarFile ? URL.createObjectURL(selectedAvatarFile) : avatarUrl}
                            alt="Avatar"
                            className="avatar image"
                            style={{ height: size, width: size }} />
                    ) : (
                        <div className="avatar no-image" style={{ height: size, width: size }} />
                    )}
                </div>
            </div>

            <div style={{ width: size }} className="mr-auto">
                <input className="file-input file-input-bordered file-input-secondary file-input-sm w-52 lg:w-72" type="file" htmlFor="single" onChange={uploadAvatar} />
                {/* <button id="single" className="btn mt-2" onClick={uploadAvatar} >{uploading ? 'Uploading...' : t('uploadImageProfile')}</button> */}

                {/* <input style={{ visibility: "hidden", position: 'absolute' }} type="file" id="single" accept="image/*"
                    onChange={uploadAvatar} disabled={uploading} /> */}

            </div>
        </div>
    )
}