import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageWithBackButton({
  backButtonHref,
  pageTitle,
  children,
}: {
  backButtonHref: string;
  pageTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
      <Button size="icon" className="rounded-full" variant="outline" asChild>
        <Link href={backButtonHref}>
          <div className="sr-only">Back</div>
          <ArrowLeftIcon className="size-8" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold self-center">{pageTitle}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
}
