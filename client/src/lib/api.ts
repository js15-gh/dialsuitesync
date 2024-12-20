import { CallLog } from "@db/schema";

export async function fetchCallLogs(): Promise<CallLog[]> {
  const response = await fetch("/api/calls", {
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch call logs");
  }
  
  return response.json();
}

export async function fetchApiStatus() {
  const response = await fetch("/api/status", {
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch API status");
  }
  
  return response.json();
}
