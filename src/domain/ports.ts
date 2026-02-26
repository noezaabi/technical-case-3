import type { CatalogItem, CatalogSnapshot, PersistDiffResult } from './catalog-types';

export interface CatalogProvider {
  fetchSnapshot(locationId: string): Promise<CatalogSnapshot>;
}

export interface CatalogTransaction {
  insertItems(items: readonly CatalogItem[]): Promise<void>;
  updateItems(items: readonly CatalogItem[]): Promise<void>;
  deleteItems(externalIds: readonly string[]): Promise<void>;
  saveSnapshot(snapshot: CatalogSnapshot): Promise<void>;
}

export interface CatalogRepository {
  getLatestSnapshot(locationId: string): Promise<CatalogSnapshot | null>;
  withTransaction<T>(
    locationId: string,
    callback: (tx: CatalogTransaction) => Promise<T>,
  ): Promise<T>;
}

export interface LocationLockManager {
  acquire(locationId: string): Promise<boolean>;
  release(locationId: string): Promise<void>;
}

export interface IdempotencyStore {
  get(key: string): Promise<PersistDiffResult | null>;
  set(key: string, value: PersistDiffResult): Promise<void>;
}
