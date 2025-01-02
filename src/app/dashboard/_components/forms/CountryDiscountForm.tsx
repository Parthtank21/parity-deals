"use client";

import { z } from "zod";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCountryDiscountsSchema } from "@/schemas/product";
import { updateCountryDiscounts } from "@/server/actions/product";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function CountryDiscountForm({
  productId,
  countryGroups,
}: {
  productId: string;
  countryGroups: {
    id: string;
    name: string;
    recommendedDiscountPercentage: number | null;
    countries: {
      name: string;
      code: string;
    }[];
    discount?: {
      coupon: string;
      discountPercentage: number;
    };
  }[];
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productCountryDiscountsSchema>>({
    resolver: zodResolver(productCountryDiscountsSchema),
    defaultValues: {
      groups: countryGroups.map((group) => {
        const discount =
          group.discount?.discountPercentage ??
          group.recommendedDiscountPercentage;
        return {
          countryGroupId: group.id,
          coupon: group.discount?.coupon ?? "",
          discountPercentage: discount != null ? discount * 100 : undefined,
        };
      }),
    },
  });

  async function onSubmit(
    values: z.infer<typeof productCountryDiscountsSchema>
  ) {
    const data = await updateCountryDiscounts(productId, values);

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex gap-6 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {countryGroups.map((group, index) => {
          return (
            <Card key={group.id}>
              <CardContent className="pt-6 flex gap-16 items-center">
                <div>
                  <h2 className="text-muted-foreground text-sm font-semibold mb-2">
                    {group.name}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {group.countries.map((country) => {
                      return (
                        <Image
                          key={country.code}
                          width={24}
                          height={16}
                          title={country.name}
                          className="border"
                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`}
                          alt={country.name}
                        />
                      );
                    })}
                  </div>
                </div>
                <Input
                  type="hidden"
                  {...form.register(`groups.${index}.countryGroupId`)}
                />
                <div className="ml-auto flex-shrink-0 flex gap-2 flex-col w-min">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`groups.${index}.discountPercentage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount %</FormLabel>
                          <FormControl>
                            <Input
                              className="w-24"
                              {...field}
                              type="number"
                              value={
                                field.value != null && !isNaN(field.value)
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              min="0"
                              max="100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`groups.${index}.coupon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon</FormLabel>
                          <FormControl>
                            <Input className="w-48" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage>
                    {form.formState.errors.groups?.[index]?.root?.message}
                  </FormMessage>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
