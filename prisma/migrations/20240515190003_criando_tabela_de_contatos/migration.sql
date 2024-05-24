-- CreateTable
CREATE TABLE "contatos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "contatos_phone_key" ON "contatos"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "contatos_email_key" ON "contatos"("email");
