/*
  Warnings:

  - You are about to drop the column `guestUser` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "psid" TEXT NOT NULL,
    "isGuest" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "locale" TEXT,
    "timezone" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "firstName", "gender", "id", "lastName", "locale", "psid", "timezone", "updatedAt") SELECT "createdAt", "firstName", "gender", "id", "lastName", "locale", "psid", "timezone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_psid_key" ON "User"("psid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
