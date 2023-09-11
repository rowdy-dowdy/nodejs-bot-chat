/*
  Warnings:

  - Added the required column `userId` to the `CategorySpending` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CategorySample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "list" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategorySpending" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "list" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CategorySpending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategorySpending" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "CategorySpending";
DROP TABLE "CategorySpending";
ALTER TABLE "new_CategorySpending" RENAME TO "CategorySpending";
CREATE UNIQUE INDEX "CategorySpending_userId_key" ON "CategorySpending"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
