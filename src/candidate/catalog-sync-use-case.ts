import type {
  CatalogDiff,
  CatalogItem,
  CatalogSnapshot,
  CatalogSyncJob,
  PersistDiffInput,
  PersistDiffResult,
  SyncExecutionResult,
} from "../domain/catalog-types";
import type {
  CatalogProvider,
  CatalogRepository,
  IdempotencyStore,
  LocationLockManager,
} from "../domain/ports";

export interface CatalogSyncUseCaseDependencies {
  readonly provider: CatalogProvider;
  readonly repository: CatalogRepository;
  readonly lockManager: LocationLockManager;
  readonly idempotencyStore: IdempotencyStore;
}

export class CatalogSyncUseCase {
  public constructor(
    private readonly dependencies: CatalogSyncUseCaseDependencies,
  ) {}

  public planDiff(
    previous: CatalogSnapshot | null,
    incoming: CatalogSnapshot,
  ): CatalogDiff {
    throw new Error("TODO: implement planDiff");
  }

  public async persistDiff(
    input: PersistDiffInput,
  ): Promise<PersistDiffResult> {
    throw new Error("TODO: implement persistDiff");
  }

  public async execute(job: CatalogSyncJob): Promise<SyncExecutionResult> {
    throw new Error("TODO: implement execute");
  }

  private splitInBatches<T>(items: readonly T[], batchSize: number): T[][] {
    if (batchSize <= 0) {
      throw new Error("batchSize must be greater than zero");
    }
    const batches: T[][] = [];
    for (let start = 0; start < items.length; start += batchSize) {
      const batch = items.slice(start, start + batchSize);
      batches.push(batch);
    }
    return batches;
  }

  private areBusinessFieldsEqual(
    left: CatalogItem,
    right: CatalogItem,
  ): boolean {
    return (
      left.externalId === right.externalId &&
      left.name === right.name &&
      left.category === right.category &&
      left.priceCents === right.priceCents &&
      left.vatRate === right.vatRate &&
      left.isAvailable === right.isAvailable
    );
  }
}
