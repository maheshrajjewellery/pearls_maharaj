import { useEffect, useState, useRef } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useShop, UserProfile } from "@/context/ShopContext";
import { useAdmin } from "@/admin/context/AdminContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const { setCurrentPage, setUserProfile, user } = useShop();
  const { login: loginAdmin } = useAdmin();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guard to ensure single execution in React Strict Mode
  const isExchangingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    console.log("[AUTH DEBUG] Callback loaded");
    console.log("[AUTH DEBUG] URL =", window.location.href);

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const code = searchParams.get("code");
    const oauthError =
      searchParams.get("error_description") ||
      hashParams.get("error_description") ||
      searchParams.get("error") ||
      hashParams.get("error");

    console.log("[AUTH DEBUG] code exists =", !!code);

    // Check PKCE Verifier existence in browser storage
    const pkceVerifierExists =
      typeof window !== "undefined" &&
      (Object.keys(localStorage).some(
        (key) =>
          key.includes("verifier") ||
          key.includes("pkce") ||
          key.includes("auth-token"),
      ) ||
        Object.keys(sessionStorage).some(
          (key) =>
            key.includes("verifier") ||
            key.includes("pkce") ||
            key.includes("auth-token"),
        ));

    console.log("[AUTH DEBUG] PKCE verifier exists =", pkceVerifierExists);

    // 1. Check for URL OAuth error
    if (oauthError) {
      console.error("[AUTH DEBUG] OAuth URL Error:", oauthError);
      const decoded = decodeURIComponent(oauthError.replace(/\+/g, " "));
      if (isMounted) setErrorMsg(`Unable to sign in with Google. ${decoded}`);
      setTimeout(() => {
        setCurrentPage("login");
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", "/login");
        }
      }, 3500);
      return;
    }

    // Helper to process authenticated Supabase user session
    const handleAuthSession = async (sessionUser: any) => {
      if (!isMounted || !sessionUser) return;

      console.log("[AUTH DEBUG] session exists = true");
      console.log("[AUTH DEBUG] user exists = true");

      try {
        let verifiedUser = sessionUser;
        if (isSupabaseConfigured()) {
          const { data: userData, error: userError } =
            await supabase.auth.getUser();
          if (userError) {
            console.warn("[AUTH DEBUG] getUser warning:", userError.message);
          } else if (userData?.user) {
            verifiedUser = userData.user;
          }
        }

        console.log("[AUTH DEBUG] user email =", verifiedUser.email);

        const meta = verifiedUser.user_metadata || {};
        const profileEmail = verifiedUser.email || meta.email || "";
        const profileName =
          meta.full_name ||
          meta.name ||
          verifiedUser.name ||
          (profileEmail ? profileEmail.split("@")[0] : "Customer");
        const profileAvatar =
          meta.avatar_url || meta.picture || verifiedUser.avatarUrl || "";

        let profile: UserProfile = {
          id: verifiedUser.id || `user_${Date.now()}`,
          googleId: meta.sub || verifiedUser.id || `gid_${Date.now()}`,
          name: profileName,
          email: profileEmail,
          avatarUrl: profileAvatar,
          provider: verifiedUser.app_metadata?.provider || "google",
        };

        if (!profile.email) {
          console.error("[AUTH DEBUG] User email missing in session profile");
          if (isMounted)
            setErrorMsg("Email address not found in Google account profile.");
          setTimeout(() => {
            setCurrentPage("login");
            if (typeof window !== "undefined")
              window.history.replaceState({}, "", "/login");
          }, 3000);
          return;
        }

        // Save / Update profile in customer registry
        if (typeof window !== "undefined") {
          try {
            const registeredUsersStr = localStorage.getItem(
              "MAHESHRAJ_registered_users",
            );
            let registeredUsers: UserProfile[] = registeredUsersStr
              ? JSON.parse(registeredUsersStr)
              : [];
            const existingIdx = registeredUsers.findIndex(
              (u) => u.email.toLowerCase() === profile.email.toLowerCase(),
            );

            if (existingIdx >= 0) {
              const existing = registeredUsers[existingIdx];
              profile = {
                ...existing,
                ...profile,
                name: profile.name || existing.name,
                avatarUrl: profile.avatarUrl || existing.avatarUrl,
              };
              registeredUsers[existingIdx] = profile;
            } else {
              registeredUsers.push(profile);
            }
            localStorage.setItem(
              "MAHESHRAJ_registered_users",
              JSON.stringify(registeredUsers),
            );
          } catch (err) {
            console.error("[AUTH DEBUG] Error saving customer profile:", err);
          }
        }

        const isEmailAdmin =
          profileEmail.toLowerCase().trim() === "maheshtadakalle@gmail.com";

        if (isEmailAdmin) {
          console.log(
            "[AUTH DEBUG] Admin account recognized. Redirecting to /admin/dashboard",
          );
          loginAdmin(profileEmail, "oauth-session");
          setCurrentPage("admin");
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/admin/dashboard");
          }
        } else {
          setUserProfile(profile);
          console.log("[AUTH DEBUG] redirecting to customer dashboard");
          setCurrentPage("dashboard");
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/customer/dashboard");
          }
        }
      } catch (err) {
        console.error("[AUTH DEBUG] Error in handleAuthSession:", err);
      }
    };

    // 2. Perform Code Exchange if authorization code is present in URL
    const processOAuthCallback = async () => {
      if (code && !isExchangingRef.current) {
        isExchangingRef.current = true;
        console.log("[AUTH DEBUG] Starting exchangeCodeForSession");

        try {
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(code);

          console.log("[AUTH DEBUG] exchange result:", {
            hasSession: !!data?.session,
            hasUser: !!data?.user,
            error: error?.message,
            errorCode: error?.code,
          });

          if (error) {
            console.error("[AUTH DEBUG] PKCE exchange error:", error.message);
            if (isMounted)
              setErrorMsg(`Google sign-in failed: ${error.message}`);
            setTimeout(() => {
              setCurrentPage("login");
              if (typeof window !== "undefined")
                window.history.replaceState({}, "", "/login");
            }, 4000);
            return;
          }

          if (data?.session?.user && isMounted) {
            await handleAuthSession(data.session.user);
            return;
          }
        } catch (err: any) {
          console.error("[AUTH DEBUG] Code exchange exception:", err);
          if (isMounted)
            setErrorMsg(
              err?.message || "Failed to exchange authorization code.",
            );
          setTimeout(() => {
            setCurrentPage("login");
            if (typeof window !== "undefined")
              window.history.replaceState({}, "", "/login");
          }, 4000);
          return;
        }
      }

      // If user is already authenticated in context, check role and redirect
      if (user) {
        const userEmail = user.email.toLowerCase().trim();
        const isEmailAdmin = userEmail === "maheshtadakalle@gmail.com";

        if (isEmailAdmin) {
          console.log(
            "[AUTH DEBUG] Admin user detected. Redirecting to /admin/dashboard",
          );
          setCurrentPage("admin");
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/admin/dashboard");
          }
        } else {
          console.log(
            "[AUTH DEBUG] Customer user detected. Redirecting to /customer/dashboard",
          );
          setCurrentPage("dashboard");
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/customer/dashboard");
          }
        }
        return;
      }

      // Check existing active Supabase session
      if (isSupabaseConfigured()) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user && isMounted) {
          await handleAuthSession(sessionData.session.user);
          return;
        }
      }

      // If no code and no active session detected:
      if (!code && isMounted) {
        console.log("[AUTH DEBUG] session exists = false");
        console.log("[AUTH DEBUG] user exists = false");
        console.error(
          "[AUTH DEBUG] No session detected after callback timeout.",
        );
        setErrorMsg(
          "No active login session found. Redirecting to login page...",
        );
        setTimeout(() => {
          setCurrentPage("login");
          if (typeof window !== "undefined")
            window.history.replaceState({}, "", "/login");
        }, 3000);
      }
    };

    processOAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [user, setCurrentPage, setUserProfile, loginAdmin]);

  return (
    <div className="min-h-[calc(100vh-90px)] w-full bg-[#F7F3EB] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] text-center bg-[#FFFDF8] p-8 border border-[#171310]/15 shadow-xl space-y-5">
        {errorMsg ? (
          <>
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <h2 className="font-serif text-2xl font-normal text-[#171310]">
              Authentication Issue
            </h2>
            <p className="font-sans text-xs text-rose-900 bg-rose-50 p-3 border border-rose-200">
              {errorMsg}
            </p>
            <p className="font-sans text-[11px] text-[#171310]/60">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-[#C5A15A] mx-auto" />
            <h2 className="font-serif text-2xl font-normal text-[#171310]">
              Signing You In
            </h2>
            <p className="font-sans text-xs tracking-wide text-[#171310]/70">
              Exchanging Google credentials and opening Customer Dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
