-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contatos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usuarioID" INTEGER,
    CONSTRAINT "contatos_usuarioID_fkey" FOREIGN KEY ("usuarioID") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_contatos" ("email", "id", "name", "phone", "usuarioID") SELECT "email", "id", "name", "phone", "usuarioID" FROM "contatos";
DROP TABLE "contatos";
ALTER TABLE "new_contatos" RENAME TO "contatos";
CREATE UNIQUE INDEX "contatos_email_key" ON "contatos"("email");
PRAGMA foreign_key_check("contatos");
PRAGMA foreign_keys=ON;
