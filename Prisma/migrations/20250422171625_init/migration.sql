-- CreateTable
CREATE TABLE "SearchMetric" (
    "date" TIMESTAMP(3) NOT NULL,
    "page" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL,
    "ctr" DOUBLE PRECISION NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SearchMetric_pkey" PRIMARY KEY ("date","page")
);
