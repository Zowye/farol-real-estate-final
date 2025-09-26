/*
  Warnings:

  - You are about to drop the column `url` on the `property_photo` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `room_photo` table. All the data in the column will be lost.
  - Made the column `storage_path` on table `property_photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storage_path` on table `room_photo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."property_photo" DROP COLUMN "url",
ALTER COLUMN "storage_path" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."room_photo" DROP COLUMN "url",
ALTER COLUMN "storage_path" SET NOT NULL;
