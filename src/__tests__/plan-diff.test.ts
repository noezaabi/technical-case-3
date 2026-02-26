import { CatalogSyncUseCase } from '../candidate/catalog-sync-use-case';
import { InMemoryCatalogProvider } from '../mocks/in-memory-catalog-provider';
import { InMemoryCatalogRepository } from '../mocks/in-memory-catalog-repository';
import { InMemoryIdempotencyStore } from '../mocks/in-memory-idempotency-store';
import { InMemoryLocationLockManager } from '../mocks/in-memory-location-lock-manager';
import { buildItem, buildSnapshot } from '../test-utils/catalog-fixtures';

describe('CatalogSyncUseCase.planDiff', () => {
  it('computes create, update, delete and unchanged deterministically', () => {
    const useCase = new CatalogSyncUseCase({
      provider: new InMemoryCatalogProvider(),
      repository: new InMemoryCatalogRepository(),
      idempotencyStore: new InMemoryIdempotencyStore(),
      lockManager: new InMemoryLocationLockManager(),
    });
    const previous = buildSnapshot({
      locationId: 'loc_1',
      sourceVersion: 'v1',
      items: [
        buildItem({ externalId: 'A', name: 'Pizza', priceCents: 1000 }),
        buildItem({ externalId: 'B', name: 'Pasta', priceCents: 1200 }),
        buildItem({ externalId: 'C', name: 'Tiramisu', priceCents: 700 }),
      ],
    });
    const incoming = buildSnapshot({
      locationId: 'loc_1',
      sourceVersion: 'v2',
      items: [
        buildItem({
          externalId: 'A',
          name: 'Pizza',
          priceCents: 1000,
          sourceUpdatedAt: '2026-01-02T00:00:00.000Z',
        }),
        buildItem({ externalId: 'B', name: 'Pasta', priceCents: 1300 }),
        buildItem({ externalId: 'D', name: 'Salad', priceCents: 900 }),
      ],
    });
    const diff = useCase.planDiff(previous, incoming);
    expect(diff.toCreate.map((item) => item.externalId)).toEqual(['D']);
    expect(diff.toUpdate.map((item) => item.externalId)).toEqual(['B']);
    expect(diff.toDelete).toEqual(['C']);
    expect(diff.unchangedCount).toBe(1);
  });
});
