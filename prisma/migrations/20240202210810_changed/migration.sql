-- CreateTable
CREATE TABLE "ApiToken" (
    "tokenId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "refreshToken" TEXT NOT NULL,
    "addedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("tokenId")
);
