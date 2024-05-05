/*
  Warnings:

  - You are about to drop the column `chatId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_chatId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "chatId",
ADD COLUMN     "refresh_token" TEXT;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Token";
