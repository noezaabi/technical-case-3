# Brainstorming Case

You are designing a backend service that syncs restaurant catalogs from an external POS.

## Context

- Around 1,000 catalog sync triggers per day
- Catalog size ranges from 300 to 10'000 items per location
- The provider sends events that indicate "catalog changed", then your system fetches the latest snapshot
- Sync triggers can arrive in burst and very close from one to another
- Sync triggers contain a locationId that identify the restaurant to which the catalog belongs

## Goal

Propose a robust sync approach that keeps the local catalog correct, efficient, and safe.

## Simplified item model

```ts
type CatalogItem = {
  externalId: string;
  name: string;
  category: string;
  priceCents: number;
  vatRate: number;
  isAvailable: boolean;
  sourceUpdatedAt: string;
};
```

## Production readiness

What would you add to make this production ready ? How would you maintain this system once it is deployed ?
