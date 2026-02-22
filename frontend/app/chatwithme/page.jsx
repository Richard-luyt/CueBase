"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getStoredUser, getMe } from "../lib/api";
import ChatWithMeView from "../components/ChatWithMeView";

export default function ChatWithMePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/");
      return;
    }
    setUser(stored);
    getMe()
      .then((me) => {
        if (me) {
          setUser(me);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(me));
          }
        } else {
          router.replace("/");
        }
      })
      .catch(() => router.replace("/"))
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading…
      </div>
    );
  }
  if (!user) return null;

  const initialPrompt = searchParams.get("prompt") ?? "";
  return (
    <ChatWithMeView
      user={user}
      initialPrompt={initialPrompt}
      onBack={() => router.back()}
    />
  );
}
