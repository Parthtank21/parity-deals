import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { canCustomizeBanner, canRemoveBranding } from "@/server/permissions";
import {
  getProduct,
  getProductCountryGroups,
  getProductCustomization,
} from "@/server/db/products";

import PageWithBackButton from "@/app/dashboard/_components/PageWithBackButton";
import ProductDetailsForm from "@/app/dashboard/_components/forms/ProductDetailsForm";
import CountryDiscountForm from "@/app/dashboard/_components/forms/CountryDiscountForm";
import ProductCustomizationForm from "@/app/dashboard/_components/forms/ProductCustomizationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: {
    productId: string;
  };
  searchParams: { tab?: string };
}) {
  const { productId } = await params;
  const { tab = "details" } = await searchParams;

  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const product = await getProduct({ id: productId, userId });
  if (product == null) return notFound();

  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Edit Product"
    >
      <Tabs defaultValue={tab}>
        <TabsList className="bg-background/60">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="country">
          <CountryTab productId={productId} userId={userId} />
        </TabsContent>
        <TabsContent value="customization">
          <CustomizationsTab productId={productId} userId={userId} />
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
}

function DetailsTab({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductDetailsForm product={product} />
      </CardContent>
    </Card>
  );
}

async function CountryTab({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const countryGroups = await getProductCountryGroups({
    productId,
    userId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscountForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>
    </Card>
  );
}

async function CustomizationsTab({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const customization = await getProductCustomization({ productId, userId });
  if (customization == null) return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          canRemoveBranding={await canRemoveBranding(userId)}
          canCustomizeBanner={await canCustomizeBanner(userId)}
          customization={customization}
        />
      </CardContent>
    </Card>
  );
}
