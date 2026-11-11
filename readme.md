# 🖼️ AI Image Generator  

An AI-powered image generator that allows users to create visuals using **Cloudflare Workers AI**. This project is built with modern web technologies to ensure scalability, performance, and seamless user experience.  

## 🚀 Live Demo  
🔗 [Live Project](https://genai.saqlain.work)  

## 💻 Tech Stack  
- **Frontend:** Next.js, React.js, TypeScript, TailwindCSS, Shadcn UI  
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL  
- **AI Models:** Cloudflare Workers AI hosted text-to-image models from Black Forest Labs, Leonardo, lykon, Stability AI, and ByteDance  
- **Authentication:** NextAuth  
- **Storage:** Cloudinary  
- **Validation:** Zod  

## ✨ Features  
✅ Generate AI-powered images using Cloudflare Workers AI  
✅ Choose a model and see estimated neuron use against the daily free allocation  
✅ Secure user authentication with NextAuth  
✅ Store and manage images using Cloudinary  
✅ Responsive and modern UI with TailwindCSS & Shadcn UI  
✅ Data validation with Zod  
✅ Backend powered by Prisma ORM & PostgreSQL  

## 📸 Screenshots  

![Project Screenshot](public/project-img.png)


## 🛠️ Installation & Setup  

### 1️⃣ Clone the Repository  
```sh  
git clone https://github.com/saqlain991/Image-Gen_AI/  
cd Image-Gen_Ai  
```

### 2️⃣ Install Dependencies  
```sh  
npm install  
```

### 3️⃣ Set Up Environment Variables  
Copy `.env.example` to `.env` in the project root and replace the placeholders with your own values. `.env` is ignored by Git. For local development, use `NEXTAUTH_URL=http://localhost:3000`; use your site's public origin in production.

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Connection string for your PostgreSQL database. |
| `NEXTAUTH_SECRET` | Generate a random secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. |
| `NEXTAUTH_URL` | Your app's origin, such as `http://localhost:3000`. |
| `CLOUDFLARE_ACCOUNT_ID` | Copy the account ID from Cloudflare Dashboard → Workers AI → Use REST API. |
| `CLOUDFLARE_API_TOKEN` | Create a Workers AI API token in the same dashboard flow. Keep it on the server. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name in your Cloudinary Console. |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | API Keys page in Cloudinary Console settings. |
| `ACCESS_CODE` | Choose a private code that people must enter to register. |
The Cloudinary variable name is `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in the current code, even though only server routes read it.

The image route builds the Cloudflare REST endpoint from `CLOUDFLARE_ACCOUNT_ID`; there is no separate endpoint URL to configure. The user selects a model, the server validates it against the supported model list, sends the prompt, uploads the result to Cloudinary, and stores the model and an estimated neuron cost in PostgreSQL. Reusing a prompt with the same model returns the saved image without another inference call. See Cloudflare's [REST setup](https://developers.cloudflare.com/workers-ai/get-started/rest-api/), [model catalog](https://developers.cloudflare.com/workers-ai/models/?tasks=Text-to-Image), and [pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).

Cloudflare currently provides 10,000 free neurons per account per day, resetting at 00:00 UTC. The app shows an estimate from successfully saved images; usage from other Cloudflare apps, failed uploads after inference, and older images without an estimate are not included. Check the Cloudflare Workers AI dashboard for the actual account total. The three legacy image models are scheduled for retirement on November 20, 2026 and are disabled after that date.

### 4️⃣ Run Database Migrations  
```sh  
npx prisma migrate deploy  
```

### 5️⃣ Start the Development Server  
```sh  
npm run dev  
```
The app will be available at `http://localhost:3000`.  

## 🚀 Deployment  
You can deploy this app on **Vercel** or any Next.js-supported platform.  


## 📜 License  
This project is open-source and available under the **MIT License**.  

## ⭐ Support & Contributions  
Feel free to fork the repo, raise issues, and contribute! If you like this project, **give it a star ⭐ on GitHub!**  

💻 **GitHub Repository:** [GitHub Repo Link](https://github.com/saqlain991/Image-Gen_AI/)  

---

