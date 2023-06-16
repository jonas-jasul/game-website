"use client";
import Auth from "../components/auth";
import { useRouter } from "next-intl/client";
import { useAuth, VIEWS } from "../components/AuthProvider";

export default function AuthPage() {
  const { user, view } = useAuth();
  const router = useRouter();

  if (view === VIEWS.UPDATE_PASSWORD) {
    return <Auth view={view} />;
  }

  if (user) {
    router.push('/profile');
    
  }

  return <Auth view={view} />;
}
