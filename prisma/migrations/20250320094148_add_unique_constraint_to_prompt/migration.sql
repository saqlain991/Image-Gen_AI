/*
  Warnings:

  - A unique constraint covering the columns `[prompt]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_prompt_key" ON "Image"("prompt");
