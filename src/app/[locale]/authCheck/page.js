"use client";
import Auth from "../components/auth";
import { useAuth, VIEWS } from "../components/AuthProvider";
import { useSearchParams } from "next/navigation";
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export default function AuthPage() {
  const { user, view, setView } = useAuth();
  const {useRouter} = createSharedPathnamesNavigation();
  const searchParams = useSearchParams();
  const newView =searchParams.get('view');
  const router = useRouter();
  if (view === VIEWS.UPDATE_PASSWORD) {
    return <Auth view={view} />;
  }

  if (user) {
    router.push('/profile');

  }


  return (
    <div className="mt-20 lg:mt-3">
      <Auth view={newView}  />

    </div>

  )
}
