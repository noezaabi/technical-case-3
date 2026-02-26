import { CatalogSyncUseCase } from '../candidate/catalog-sync-use-case';
import { InMemoryCatalogProvider } from '../mocks/in-memory-catalog-provider';
import { InMemoryCatalogRepository } from '../mocks/in-memory-catalog-repository';
import { InMemoryIdempotencyStore } from '../mocks/in-memory-idempotency-store';
import { InMemoryLocationLockManager } from '../mocks/in-memory-location-lock-manager';
import { buildItem, buildSnapshot, buildSyncJob } from '../test-utils/catalog-fixtures';

describe('CatalogSyncUseCase.execute', () => {
  it('executes a full sync lifecycle', async () => {
    const provider = new InMemoryCatalogProvider();
    const repository = new InMemoryCatalogRepository();
    const lockManager = new InMemoryLocationLockManager();
    const idempotencyStore = new InMemoryIdempotencyStore();
    repository.seedSnapshot(
      buildSnapshot({
        locationId: 'loc_1',
        sourceVersion: 'v1',
        items: [
          buildItem({ externalId: 'A', name: 'Pizza', priceCents: 1000 }),
          buildItem({ externalId: 'B', name: 'Pasta', priceCents: 1200 }),
        ],
      }),
    );
    provider.setSnapshot(
      buildSnapshot({
        locationId: 'loc_1',
        sourceVersion: 'v2',
        items: [
          buildItem({ externalId: 'A', name: 'Pizza', priceCents: 1100 }),
          buildItem({ externalId: 'C', name: 'Salad', priceCents: 900 }),
        ],
      }),
    );
    const useCase = new CatalogSyncUseCase({
      provider,
      repository,
      lockManager,
      idempotencyStore,
    });
    const result = await useCase.execute(
      buildSyncJob({
        jobId: 'job_1',
        locationId: 'loc_1',
        deduplicationKey: 'dedupe_1',
      }),
    );
    expect(result.status).toBe('applied');
    expect(result.persisted).toEqual({
      created: 1,
      updated: 1,
      deleted: 1,
      unchanged: 0,
    });
  });
});
