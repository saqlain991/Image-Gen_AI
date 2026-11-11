DROP INDEX IF EXISTS "Image_prompt_key";
CREATE UNIQUE INDEX "Image_userId_prompt_key" ON "Image"("userId", "prompt");
