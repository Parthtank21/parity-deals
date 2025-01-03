import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getProducts } from "@/server/db/products";

import { Button } from "@/components/ui/button";
import NoProducts from "../_components/NoProducts";
import ProductGrid from "../_components/ProductGrid";

export default async function Products() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const products = await getProducts(userId);
  if (products.length === 0) return <NoProducts />;

  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold flex justify-between">
        Products
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-1" />
            New Product
          </Link>
        </Button>
      </h1>
      <ProductGrid products={products} />
    </>
  );
}
