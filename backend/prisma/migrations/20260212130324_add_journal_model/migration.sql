-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goal" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "weight" INTEGER,
    "weightUnit" TEXT,
    "mood" INTEGER,
    "hasSoughtProfessionalHelp" BOOLEAN,
    "physicalDistress" BOOLEAN,
    "sleepQuality" INTEGER,
    "medications" TEXT[],
    "symptoms" TEXT[],
    "stressLevel" INTEGER,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);
