"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_KEY = "tp_role";
const COMP_KEY = "tp_competencies";

export default function SummaryPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setRole(localStorage.getItem(ROLE_KEY) || "");

    const raw = localStorage.getItem(COMP_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.items)) setItems(parsed.items);
      } catch {}
    }
  }, []);

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Summary (Temporary)</h1>

        <div className="rounded-md border p-4 space-y-2">
          <div><span className="font-medium">Role:</span> {role || "-"}</div>
          <div className="font-medium">Selected competencies:</div>
          {items.length === 0 ? (
            <div className="text-gray-600">-</div>
          ) : (
            <ul className="list-disc pl-6">
              {items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button className="rounded-md border px-4 py-2" onClick={() => router.push("/planner")}>
            Back to role selection
          </button>
          <button
            className="rounded-md bg-black px-4 py-2 text-white"
            onClick={() => alert("Next step will be implemented after you provide the next logic.")}
          >
            Continue →
          </button>
        </div>
      </div>
    </main>
  );
}
