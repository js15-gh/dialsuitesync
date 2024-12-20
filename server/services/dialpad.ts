import { db } from "@db";
import { apiCredentials, apiStatus, callLogs } from "@db/schema";
import { eq } from "drizzle-orm";

export class DialpadService {
  private static instance: DialpadService;
  private credentials: any;

  private constructor() {}

  static async getInstance() {
    if (!DialpadService.instance) {
      DialpadService.instance = new DialpadService();
      await DialpadService.instance.initialize();
    }
    return DialpadService.instance;
  }

  private async initialize() {
    const creds = await db.query.apiCredentials.findFirst({
      where: eq(apiCredentials.service, "dialpad")
    });
    
    if (!creds) {
      throw new Error("Dialpad credentials not found");
    }
    
    this.credentials = creds.credentials;
  }

  async updateStatus(status: "healthy" | "degraded" | "down", error?: string) {
    await db.insert(apiStatus).values({
      service: "dialpad",
      status,
      errorMessage: error,
      lastCheck: new Date()
    }).onConflictDoUpdate({
      target: [apiStatus.service],
      set: {
        status,
        errorMessage: error,
        lastCheck: new Date()
      }
    });
  }

  async handleIncomingCall(callData: any) {
    try {
      await db.insert(callLogs).values({
        callId: callData.id,
        callerNumber: callData.caller_number,
        status: "pending"
      });

      return true;
    } catch (error) {
      console.error("Error handling incoming call:", error);
      return false;
    }
  }

  async updateCallTranscript(callId: string, transcript: string) {
    try {
      // Make API call to Dialpad to update transcript
      // Update local call log status
      await db.update(callLogs)
        .set({ status: "processed" })
        .where(eq(callLogs.callId, callId));
    } catch (error) {
      console.error("Error updating transcript:", error);
      throw error;
    }
  }
}
