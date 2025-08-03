import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | "warning">("success");

  function show(msg: string, t: "success" | "error" | "warning" = "success") {
    setMessage(msg);
    setType(t);
    setTimeout(() => setMessage(null), 3000);
  }

  function Toast() {
    if (!message) return null;

    const borderColor = {
      success: "border-l-green-500",
      error: "border-l-red-500",
      warning: "border-l-yellow-500",
    }[type];

    return (
      <div
        className={`fixed top-4 right-4 z-50 animate-slide-in rounded-md border-l-4 bg-white px-4 py-3 text-sm text-black shadow-md ${borderColor}`}
      >
        {message}
      </div>
    );
  }

  return { show, Toast };
}
