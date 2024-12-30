import React from "react";
import PageWithBackButton from "../../_components/PageWithBackButton";

export default function NewProductPage() {
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Create Product"
    >
      NewProductPage
    </PageWithBackButton>
  );
}
