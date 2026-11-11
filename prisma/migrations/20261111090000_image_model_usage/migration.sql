ALTER TABLE "Image" ADD COLUMN "modelId" TEXT NOT NULL DEFAULT '@cf/black-forest-labs/flux-1-schnell';
ALTER TABLE "Image" ADD COLUMN "estimatedNeurons" DOUBLE PRECISION;
DROP INDEX IF EXISTS "Image_userId_prompt_key";
CREATE UNIQUE INDEX "Image_userId_prompt_modelId_key" ON "Image"("userId", "prompt", "modelId");
