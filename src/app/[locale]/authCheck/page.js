"use client";
import Auth from "../components/auth";
import { useRouter } from "next-intl/client";
import { useAuth, VIEWS } from "../components/AuthProvider";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const { user, view, setView } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newView =searchParams.get('view');
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
