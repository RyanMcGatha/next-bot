"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function OAuth2Callback() {
  const router = useRouter();

  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (code) {
        axios
          .post("/api/oauth2callback", { code })
          .then((response) => {
            console.log("Token exchange successful:", response.data);
            router.push("/"); // Redirect the user after successful authentication
          })
          .catch((error) => {
            console.error("Error exchanging code for tokens:", error);
          });
      } else {
        console.error("Authorization code not found in query parameters.");
      }
    }
  }, [router]);

  return <div>Processing OAuth2 callback...</div>;
}

export default OAuth2Callback;
