import type { CatalogItem, CatalogSnapshot } from '../domain/catalog-types';
import type { CatalogRepository, CatalogTransaction } from '../domain/ports';

interface FailurePlan {
  readonly failOnOperationNumber: number;
}

interface LocationState {
  readonly itemsByExternalId: Map<string, CatalogItem>;
  snapshot: CatalogSnapshot | null;
}

export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly stateByLocation = new Map<string, LocationState>();

  private failurePlan: FailurePlan | null = null;

  private operationCounter = 0;

  public readonly operationLog: string[] = [];

  public seedSnapshot(snapshot: CatalogSnapshot): void {
    const itemsMap = new Map<string, CatalogItem>();
    for (const item of snapshot.items) {
      itemsMap.set(item.externalId, item);
    }
    this.stateByLocation.set(snapshot.locationId, {
      itemsByExternalId: itemsMap,
      snapshot,
    });
  }

  public setFailurePlan(failurePlan: FailurePlan | null): void {
    this.failurePlan = failurePlan;
  }

  public getItems(locationId: string): CatalogItem[] {
    const state = this.getOrCreateLocationState(locationId);
    return [...state.itemsByExternalId.values()].sort((a, b) =>
      a.externalId.localeCompare(b.externalId),
    );
  }

  public async getLatestSnapshot(locationId: string): Promise<CatalogSnapshot | null> {
    const state = this.stateByLocation.get(locationId);
    return state?.snapshot ?? null;
  }

  public async withTransaction<T>(
    locationId: string,
    callback: (tx: CatalogTransaction) => Promise<T>,
  ): Promise<T> {
    this.operationCounter = 0;
    const sourceState = this.getOrCreateLocationState(locationId);
    const workingItemsByExternalId = new Map<string, CatalogItem>(sourceState.itemsByExternalId);
    let workingSnapshot: CatalogSnapshot | null = sourceState.snapshot;
    const tx: CatalogTransaction = {
      insertItems: async (items: readonly CatalogItem[]) => {
        this.markOperation('insertItems');
        for (const item of items) {
          workingItemsByExternalId.set(item.externalId, item);
        }
      },
      updateItems: async (items: readonly CatalogItem[]) => {
        this.markOperation('updateItems');
        for (const item of items) {
          workingItemsByExternalId.set(item.externalId, item);
        }
      },
      deleteItems: async (externalIds: readonly string[]) => {
        this.markOperation('deleteItems');
        for (const externalId of externalIds) {
          workingItemsByExternalId.delete(externalId);
        }
      },
      saveSnapshot: async (snapshot: CatalogSnapshot) => {
        this.markOperation('saveSnapshot');
        workingSnapshot = snapshot;
      },
    };
    const result = await callback(tx);
    this.stateByLocation.set(locationId, {
      itemsByExternalId: workingItemsByExternalId,
      snapshot: workingSnapshot,
    });
    return result;
  }

  private getOrCreateLocationState(locationId: string): LocationState {
    const existing = this.stateByLocation.get(locationId);
    if (existing) {
      return existing;
    }
    const initialState: LocationState = {
      itemsByExternalId: new Map<string, CatalogItem>(),
      snapshot: null,
    };
    this.stateByLocation.set(locationId, initialState);
    return initialState;
  }

  private markOperation(operationName: string): void {
    this.operationCounter += 1;
    this.operationLog.push(operationName);
    if (this.failurePlan && this.operationCounter === this.failurePlan.failOnOperationNumber) {
      throw new Error(`Injected failure on operation ${operationName}`);
    }
  }
}
