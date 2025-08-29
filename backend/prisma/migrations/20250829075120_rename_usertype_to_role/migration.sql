-- AlterEnum
ALTER TYPE "public"."UseruserType" RENAME TO "UserRole";

-- AlterTable
ALTER TABLE "public"."users" RENAME COLUMN "userType" TO "role";
ALTER TABLE "public"."users" RENAME COLUMN "currentuserType" TO "currentRole";

-- Update column type reference
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."UserRole";
