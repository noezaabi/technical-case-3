import type { CatalogSnapshot } from '../domain/catalog-types';
import type { CatalogProvider } from '../domain/ports';

export class InMemoryCatalogProvider implements CatalogProvider {
  private readonly snapshotsByLocation = new Map<string, CatalogSnapshot>();

  public readonly fetchCallsByLocation = new Map<string, number>();

  public setSnapshot(snapshot: CatalogSnapshot): void {
    this.snapshotsByLocation.set(snapshot.locationId, snapshot);
  }

  public async fetchSnapshot(locationId: string): Promise<CatalogSnapshot> {
    const currentCalls = this.fetchCallsByLocation.get(locationId) ?? 0;
    this.fetchCallsByLocation.set(locationId, currentCalls + 1);
    const snapshot = this.snapshotsByLocation.get(locationId);
    if (!snapshot) {
      throw new Error(`No provider snapshot configured for location ${locationId}`);
    }
    return snapshot;
  }
}
