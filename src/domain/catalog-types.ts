export interface CatalogItem {
  readonly externalId: string;
  readonly name: string;
  readonly category: string;
  readonly priceCents: number;
  readonly vatRate: number;
  readonly isAvailable: boolean;
  readonly sourceUpdatedAt: string;
}

export interface CatalogSnapshot {
  readonly locationId: string;
  readonly sourceVersion: string;
  readonly fetchedAt: Date;
  readonly items: readonly CatalogItem[];
}

export interface CatalogSyncJob {
  readonly jobId: string;
  readonly locationId: string;
  readonly deduplicationKey: string;
  readonly triggeredBy: 'webhook' | 'manual' | 'scheduled';
}

export interface CatalogDiff {
  readonly toCreate: readonly CatalogItem[];
  readonly toUpdate: readonly CatalogItem[];
  readonly toDelete: readonly string[];
  readonly unchangedCount: number;
}

export interface PersistDiffResult {
  readonly created: number;
  readonly updated: number;
  readonly deleted: number;
  readonly unchanged: number;
}

export interface SyncExecutionResult {
  readonly status: 'applied' | 'duplicate' | 'busy';
  readonly persisted: PersistDiffResult;
}

export interface PersistDiffInput {
  readonly locationId: string;
  readonly incomingSnapshot: CatalogSnapshot;
  readonly diff: CatalogDiff;
  readonly batchSize: number;
}
