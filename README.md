# 🎓 ScholarAI

Instant document summarizer for your work and school related needs

## This project includes:

* Next.js, utilizing Next's API routing capabilities
* Routes for ChatGPT and Twilio APIs
* Frontend design with TailwindCSS

## ⚙️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

* Note that you will need to provide your own OpenAI and Twilio API keys in a .env file.

Edit the page by modifying `pages/_app.tsx`. The page auto-updates as you edit the file.

Modify the API routes by changing the TypeScript files in the `pages/api` directory. Files in this directory are treated as [routes] instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [OpenAI Documentation](https://platform.openai.com/docs/introduction) - learn about OpenAI's APIs and models.
- [API Keys] (https://platform.openai.com/account/api-keys) - link to finding your OpenAI API keys.

## Next Steps

- Create a more user-friendly UI 
- Add various buttons for functions such as quizzes for ease of use
- Allow users to input their own API keys (provide a link to get one as well).
