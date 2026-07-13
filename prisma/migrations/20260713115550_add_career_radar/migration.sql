-- CreateEnum
CREATE TYPE "OppStream" AS ENUM ('smart_ports', 'general');

-- CreateEnum
CREATE TYPE "OppCategory" AS ENUM ('scholarship', 'fellowship', 'job', 'internship', 'conference', 'training', 'volunteering', 'grant', 'call');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('rss', 'api', 'scrape', 'manual');

-- CreateEnum
CREATE TYPE "OppStatus" AS ENUM ('new', 'reviewed', 'saved', 'dismissed');

-- CreateEnum
CREATE TYPE "AppStage" AS ENUM ('spotted', 'considering', 'preparing', 'submitted', 'interview', 'accepted', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "opp_sources" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "type" "SourceType" NOT NULL,
    "url" VARCHAR(600) NOT NULL,
    "category" "OppCategory",
    "stream" "OppStream" NOT NULL DEFAULT 'general',
    "config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_fetched_at" TIMESTAMP(3),
    "last_status" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opp_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" SERIAL NOT NULL,
    "source_id" INTEGER NOT NULL,
    "external_id" VARCHAR(500) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "org" VARCHAR(300),
    "category" "OppCategory" NOT NULL,
    "stream" "OppStream" NOT NULL,
    "raw_text" TEXT,
    "summary" TEXT,
    "location" VARCHAR(300),
    "country" VARCHAR(120),
    "is_remote" BOOLEAN NOT NULL DEFAULT false,
    "language_req" VARCHAR(200),
    "funding_info" VARCHAR(500),
    "eligibility" TEXT,
    "deadline" TIMESTAMP(3),
    "posted_at" TIMESTAMP(3),
    "tags" JSONB,
    "fit_score" INTEGER,
    "fit_reasons" JSONB,
    "why_now" TEXT,
    "recommended_action" TEXT,
    "status" "OppStatus" NOT NULL DEFAULT 'new',
    "notified_at" TIMESTAMP(3),
    "scored_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opp_application_tracks" (
    "id" SERIAL NOT NULL,
    "opportunity_id" INTEGER NOT NULL,
    "stage" "AppStage" NOT NULL DEFAULT 'spotted',
    "notes" TEXT,
    "next_action_date" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "outcome" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opp_application_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radar_profile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "profile_text" TEXT NOT NULL,
    "english_level" VARCHAR(10) NOT NULL DEFAULT 'A1',
    "weights" JSONB NOT NULL,
    "fit_threshold" INTEGER NOT NULL DEFAULT 70,
    "digest_day" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "radar_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radar_digest_runs" (
    "id" SERIAL NOT NULL,
    "run_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" VARCHAR(20) NOT NULL,
    "item_count" INTEGER NOT NULL,
    "status" VARCHAR(200) NOT NULL,

    CONSTRAINT "radar_digest_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "opportunities_stream_fit_score_idx" ON "opportunities"("stream", "fit_score");

-- CreateIndex
CREATE INDEX "opportunities_deadline_idx" ON "opportunities"("deadline");

-- CreateIndex
CREATE INDEX "opportunities_status_idx" ON "opportunities"("status");

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_source_id_external_id_key" ON "opportunities"("source_id", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "opp_application_tracks_opportunity_id_key" ON "opp_application_tracks"("opportunity_id");

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "opp_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opp_application_tracks" ADD CONSTRAINT "opp_application_tracks_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
