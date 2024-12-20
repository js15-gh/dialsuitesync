import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NetSuiteService } from '../../services/netsuite';
import { db } from '../../../db';

// Mock the database
vi.mock('@db', () => {
  const mockQuery = {
    apiCredentials: {
      findFirst: vi.fn()
    }
  };

  // Mock values and onConflictDoUpdate for insert
  const mockValues = vi.fn().mockReturnValue({
    onConflictDoUpdate: vi.fn().mockResolvedValue({ rowCount: 1 })
  });
  
  // Mock set and where for update
  const mockWhere = vi.fn().mockResolvedValue({ rowCount: 1 });
  const mockSet = vi.fn().mockReturnValue({ where: mockWhere });

  const mockDb = {
    query: mockQuery,
    insert: vi.fn().mockImplementation(() => ({
      values: mockValues
    })),
    update: vi.fn().mockReturnValue({
      set: mockSet
    })
  };

  return { db: mockDb };
});

// Clear all instances before each test
beforeEach(() => {
  // @ts-ignore - Reset the singleton instance
  NetSuiteService.instance = undefined;
});

describe('NetSuiteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful credentials retrieval
    (db.query.apiCredentials.findFirst as any).mockResolvedValue({
      id: 1,
      service: 'netsuite',
      credentials: { apiKey: 'test-key' },
      isActive: true
    });
  });

  describe('getInstance', () => {
    it('creates a singleton instance', async () => {
      const instance1 = await NetSuiteService.getInstance();
      const instance2 = await NetSuiteService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('throws error when credentials are not found', async () => {
      (db.query.apiCredentials.findFirst as any).mockResolvedValue(null);
      await expect(NetSuiteService.getInstance()).rejects.toThrow('NetSuite credentials not found');
    });
  });

  describe('updateStatus', () => {
    it('updates API status correctly', async () => {
      const service = await NetSuiteService.getInstance();
      (db.insert as any).mockResolvedValueOnce({ rowCount: 1 });
      await service.updateStatus('healthy');
      expect(db.insert).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('findCustomerByPhone', () => {
    it('returns customer data when found', async () => {
      const service = await NetSuiteService.getInstance();
      const result = await service.findCustomerByPhone('+1234567890');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
    });
  });
});
