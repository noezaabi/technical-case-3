import type { CatalogItem, CatalogSnapshot, CatalogSyncJob } from '../domain/catalog-types';

export function buildItem(overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    externalId: overrides.externalId ?? 'item_default',
    name: overrides.name ?? 'Default item',
    category: overrides.category ?? 'default',
    priceCents: overrides.priceCents ?? 1000,
    vatRate: overrides.vatRate ?? 7.7,
    isAvailable: overrides.isAvailable ?? true,
    sourceUpdatedAt: overrides.sourceUpdatedAt ?? '2026-01-01T00:00:00.000Z',
  };
}

export function buildSnapshot(params: {
  locationId: string;
  sourceVersion: string;
  items: readonly CatalogItem[];
}): CatalogSnapshot {
  return {
    locationId: params.locationId,
    sourceVersion: params.sourceVersion,
    fetchedAt: new Date('2026-01-01T00:00:00.000Z'),
    items: [...params.items],
  };
}

export function buildSyncJob(overrides: Partial<CatalogSyncJob> = {}): CatalogSyncJob {
  return {
    jobId: overrides.jobId ?? 'job_01',
    locationId: overrides.locationId ?? 'loc_1',
    deduplicationKey: overrides.deduplicationKey ?? 'dedupe_01',
    triggeredBy: overrides.triggeredBy ?? 'webhook',
  };
}
