import Link from "next/link";
import Auth from "./auth";
import { useRouter } from "next/router";
import { useAuth, VIEWS } from "./AuthProvider";

export default function AuthPage() {
  const { user, view } = useAuth();
  const router = useRouter();

  if (view === VIEWS.UPDATE_PASSWORD) {
    return <Auth view={view} />;
  }

  if (user) {
    router.push("/profile");
    return null; 
  }

  return <Auth view={view} />;
}
