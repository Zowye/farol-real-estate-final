/*
  Warnings:

  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ContractType" AS ENUM ('RENT', 'SALE');

-- DropTable
DROP TABLE "public"."Property";

-- CreateTable
CREATE TABLE "public"."property_type" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "property_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."amenity_type" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "amenity_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."room_type" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "room_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "property_type_id" BIGINT NOT NULL,
    "contract" "public"."ContractType" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "rooms_count" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "garages" INTEGER NOT NULL DEFAULT 0,
    "street" TEXT,
    "street_number" TEXT,
    "neighborhood" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_amenity" (
    "property_id" BIGINT NOT NULL,
    "amenity_type_id" BIGINT NOT NULL,
    "note" TEXT,

    CONSTRAINT "property_amenity_pkey" PRIMARY KEY ("property_id","amenity_type_id")
);

-- CreateTable
CREATE TABLE "public"."room" (
    "id" BIGSERIAL NOT NULL,
    "property_id" BIGINT NOT NULL,
    "room_type_id" BIGINT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "area_m2" DECIMAL(8,2),
    "floor_number" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_photo" (
    "id" BIGSERIAL NOT NULL,
    "property_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."room_photo" (
    "id" BIGSERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_type_code_key" ON "public"."property_type"("code");

-- CreateIndex
CREATE UNIQUE INDEX "amenity_type_code_key" ON "public"."amenity_type"("code");

-- CreateIndex
CREATE UNIQUE INDEX "room_type_code_key" ON "public"."room_type"("code");

-- AddForeignKey
ALTER TABLE "public"."property" ADD CONSTRAINT "property_property_type_id_fkey" FOREIGN KEY ("property_type_id") REFERENCES "public"."property_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_amenity" ADD CONSTRAINT "property_amenity_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_amenity" ADD CONSTRAINT "property_amenity_amenity_type_id_fkey" FOREIGN KEY ("amenity_type_id") REFERENCES "public"."amenity_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room" ADD CONSTRAINT "room_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room" ADD CONSTRAINT "room_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_photo" ADD CONSTRAINT "property_photo_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_photo" ADD CONSTRAINT "room_photo_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
