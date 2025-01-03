import { db } from "@/drizzle/db";
import { ProductTable, ProductViewTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { and, count, eq, gte } from "drizzle-orm";

export function getProductViewCount(userId: string, startDate: Date) {
  const cachedFn = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return cachedFn(userId, startDate);
}

async function getProductViewCountInternal(userId: string, startDate: Date) {
  const counts = await db
    .select({ pricingViewCount: count() })
    .from(ProductViewTable)
    .innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId))
    .where(
      and(
        eq(ProductTable.clerkUserId, userId),
        gte(ProductViewTable.visitedAt, startDate)
      )
    );

  return counts[0]?.pricingViewCount ?? 0;
}
