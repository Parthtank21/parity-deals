import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();

const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const ProductTable = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index("products.clerk_user_id_index").on(
      table.clerkUserId
    ),
  })
);

export const ProductRelations = relations(ProductTable, ({ one }) => ({
  productCustomization: one(ProductCustomizationTable),
}));

export const ProductCustomizationTable = pgTable("product_customizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  classPrefix: text("class_prefix"),
  productId: uuid("product_id")
    .notNull()
    .references(() => ProductTable.id, { onDelete: "cascade" })
    .unique(),
  locationMessage: text("location_message")
    .notNull()
    .default(
      "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off."
    ),
  backgroundColor: text("background_color")
    .notNull()
    .default("hsl(193, 82%, 31%)"),
  textColor: text("text_color").notNull().default("hsl(0, 0%, 100%)"),
  fontSize: text("font_size").notNull().default("1rem"),
  bannerContainer: text("banner_container").notNull().default("body"),
  isSticky: boolean("is_sticky").notNull().default(true),
  createdAt,
  updatedAt,
});

export const productCustomizationRelations = relations(
  ProductCustomizationTable,
  ({ one }) => ({
    product: one(ProductTable, {
      fields: [ProductCustomizationTable.productId],
      references: [ProductTable.id],
    }),
  })
);
