import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { ApiStatus as ApiStatusType } from "@db/schema";

interface StatusIndicatorProps {
  status: "healthy" | "degraded" | "down";
  label: string;
}

function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const Icon = status === "healthy" 
    ? CheckCircle 
    : status === "degraded" 
    ? AlertCircle 
    : XCircle;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${getStatusColor()}`} />
      <span className="font-medium">{label}</span>
      <span className="text-sm text-muted-foreground capitalize">
        ({status})
      </span>
    </div>
  );
}

interface ApiStatusProps {
  status?: {
    dialpad: ApiStatusType;
    netsuite: ApiStatusType;
  };
}

export default function ApiStatus({ status }: ApiStatusProps) {
  if (!status?.dialpad || !status?.netsuite) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">API Status</h2>
        <div className="text-muted-foreground">Loading API status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">API Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusIndicator
          status={(status.dialpad?.status || "down") as "healthy" | "degraded" | "down"}
          label="Dialpad API"
        />
        <StatusIndicator
          status={(status.netsuite?.status || "down") as "healthy" | "degraded" | "down"}
          label="NetSuite API"
        />
      </div>
    </div>
  );
}
