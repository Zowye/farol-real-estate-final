-- AlterTable
ALTER TABLE "public"."property" ADD COLUMN     "latitude" DECIMAL(10,8),
ADD COLUMN     "longitude" DECIMAL(11,8),
ADD COLUMN     "place_id" TEXT;

-- AlterTable
ALTER TABLE "public"."property_photo" ADD COLUMN     "storage_path" TEXT;

-- AlterTable
ALTER TABLE "public"."room_photo" ADD COLUMN     "storage_path" TEXT;
