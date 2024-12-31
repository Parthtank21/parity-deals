import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";

export async function deleteUser(clerkUserId: string) {
  const [usersubscriptions, products] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
      }),
    db
      .delete(ProductTable)
      .where(eq(ProductTable.clerkUserId, clerkUserId))
      .returning({
        id: ProductTable.id,
      }),
  ]);

  usersubscriptions.forEach((sub) => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: clerkUserId,
      id: sub.id,
    });
  });

  products.forEach((product) => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: clerkUserId,
      id: product.id,
    });
  });

  return [usersubscriptions, products];
}
