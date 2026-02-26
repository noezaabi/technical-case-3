import { CatalogSyncUseCase } from '../candidate/catalog-sync-use-case';
import { InMemoryCatalogProvider } from '../mocks/in-memory-catalog-provider';
import { InMemoryCatalogRepository } from '../mocks/in-memory-catalog-repository';
import { InMemoryIdempotencyStore } from '../mocks/in-memory-idempotency-store';
import { InMemoryLocationLockManager } from '../mocks/in-memory-location-lock-manager';
import { buildItem, buildSnapshot } from '../test-utils/catalog-fixtures';

describe('CatalogSyncUseCase.persistDiff', () => {
  it('persists all operations in batches and saves snapshot', async () => {
    const repository = new InMemoryCatalogRepository();
    const useCase = new CatalogSyncUseCase({
      provider: new InMemoryCatalogProvider(),
      repository,
      idempotencyStore: new InMemoryIdempotencyStore(),
      lockManager: new InMemoryLocationLockManager(),
    });
    const incomingSnapshot = buildSnapshot({
      locationId: 'loc_1',
      sourceVersion: 'v2',
      items: [
        buildItem({ externalId: 'A' }),
        buildItem({ externalId: 'B' }),
        buildItem({ externalId: 'C' }),
        buildItem({ externalId: 'D' }),
      ],
    });
    const result = await useCase.persistDiff({
      locationId: 'loc_1',
      incomingSnapshot,
      diff: {
        toCreate: [buildItem({ externalId: 'A' }), buildItem({ externalId: 'B' })],
        toUpdate: [buildItem({ externalId: 'C' }), buildItem({ externalId: 'D' })],
        toDelete: ['Z1', 'Z2', 'Z3'],
        unchangedCount: 5,
      },
      batchSize: 2,
    });
    expect(result).toEqual({
      created: 2,
      updated: 2,
      deleted: 3,
      unchanged: 5,
    });
  });
});
