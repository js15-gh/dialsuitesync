import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CallLog } from "@db/schema";

interface CallLogTableProps {
  logs: CallLog[];
}

export default function CallLogTable({ logs }: CallLogTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Caller Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.createdAt), "MMM d, h:mm a")}
              </TableCell>
              <TableCell>{log.callerNumber}</TableCell>
              <TableCell>
                {log.customerInfo ? (
                  <div>
                    <div>{(log.customerInfo as any).name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(log.customerInfo as any).email}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    log.status === "processed"
                      ? "default"
                      : log.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No call logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
