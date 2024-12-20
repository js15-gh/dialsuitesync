import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DialpadService } from '../../services/dialpad';
import { db } from '../../../db';

// Mock the database
vi.mock('@db', () => ({
  db: {
    query: {
      apiCredentials: {
        findFirst: vi.fn()
      }
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue({ rowCount: 1 })
      })
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 1 })
      })
    })
  }
}));

describe('DialpadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful credentials retrieval
    (db.query.apiCredentials.findFirst as any).mockResolvedValue({
      id: 1,
      service: 'dialpad',
      credentials: { apiKey: 'test-key' },
      isActive: true
    });
  });

  describe('getInstance', () => {
    it('creates a singleton instance', async () => {
      const instance1 = await DialpadService.getInstance();
      const instance2 = await DialpadService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('updateStatus', () => {
    it('updates API status correctly', async () => {
      const service = await DialpadService.getInstance();
      
      (db.insert as any).mockResolvedValueOnce({ rowCount: 1 });
      
      await service.updateStatus('healthy');
      
      expect(db.insert).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('handleIncomingCall', () => {
    it('processes incoming call data correctly', async () => {
      const service = await DialpadService.getInstance();
      const mockCallData = {
        id: 'call-123',
        caller_number: '+1234567890'
      };

      (db.insert as any).mockResolvedValueOnce({ rowCount: 1 });

      const result = await service.handleIncomingCall(mockCallData);
      expect(result).toBe(true);
      expect(db.insert).toHaveBeenCalledWith(expect.anything());
    });
  });
});
