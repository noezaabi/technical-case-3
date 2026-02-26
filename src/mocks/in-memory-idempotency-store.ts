import type { PersistDiffResult } from '../domain/catalog-types';
import type { IdempotencyStore } from '../domain/ports';

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly store = new Map<string, PersistDiffResult>();

  public async get(key: string): Promise<PersistDiffResult | null> {
    return this.store.get(key) ?? null;
  }

  public async set(key: string, value: PersistDiffResult): Promise<void> {
    this.store.set(key, value);
  }
}
