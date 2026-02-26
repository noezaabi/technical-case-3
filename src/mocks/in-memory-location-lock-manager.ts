import type { LocationLockManager } from '../domain/ports';

export class InMemoryLocationLockManager implements LocationLockManager {
  private readonly heldLocks = new Set<string>();

  public async acquire(locationId: string): Promise<boolean> {
    if (this.heldLocks.has(locationId)) {
      return false;
    }
    this.heldLocks.add(locationId);
    return true;
  }

  public async release(locationId: string): Promise<void> {
    this.heldLocks.delete(locationId);
  }
}
