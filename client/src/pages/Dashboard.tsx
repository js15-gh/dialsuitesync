import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/DashboardHeader";
import CallLogTable from "@/components/CallLogTable";
import ApiStatus from "@/components/ApiStatus";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { CallLog } from "@db/schema";

function Dashboard() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();
  
  const { data: callLogs = [], refetch: refetchLogs } = useQuery<CallLog[]>({
    queryKey: ["/api/calls"],
  });

  const { data: apiStatus } = useQuery({
    queryKey: ["/api/status"],
    refetchInterval: 30000, // Check API status every 30 seconds
  });

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'call') {
        toast({
          title: "New Call Received",
          description: `From: ${data.callerNumber}`,
        });
        refetchLogs();
      }
    };

    socket.onclose = () => {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "WebSocket Connection Lost",
          description: "Attempting to reconnect...",
        });
      }, 5000);
    };

    setWs(socket);
    return () => socket.close();
  }, [toast, refetchLogs]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <ApiStatus status={apiStatus} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Recent Call Logs</h2>
              <CallLogTable logs={callLogs} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
