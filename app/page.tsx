"use client"; // Ensure this is a Client Component

import { useState } from "react";

export default function InviteBot() {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");

  const handleGetInviteLink = async () => {
    const res = await fetch("/api/inviteBot");
    const data = await res.json();

    if (data.success) {
      setInviteLink(data.inviteLink);
      setError("");
    } else {
      setError("Failed to get the invite link.");
      setInviteLink("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={handleGetInviteLink}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Get Bot Invite Link
      </button>
      {inviteLink && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Invite the bot to your server using the following link:
          </p>
          <a
            href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Invite Bot
          </a>
        </div>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
