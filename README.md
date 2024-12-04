# 🎬🤖 Welcome to 302.AI's AI E-commerce Scene Image Generator! 🚀✨

[中文](README_zh.md) | [English](README.md) | [日本語](README_ja.md)

This is the open-source version of the [AI E-commerce Scene Image Generator](https://302.ai/tools/ecom1/) by [302.AI](https://302.ai). You can log in to 302.AI to use the online version without coding skills, or modify and deploy it yourself according to your needs.

## ✨ Introduction to 302.AI ✨

[302.AI](https://302.ai) is a pay-as-you-go AI application platform that solves the last mile problem of AI for practical use.

1. 🧠 It incorporates the latest and most comprehensive AI capabilities and brands, including but not limited to language models, image models, audio models, and video models.
2. 🚀 Deep application development on foundational models, we develop actual AI products, not just simple chatbots.
3. 💰 No monthly fees, all features are pay-as-you-go, fully open, ensuring truly low barriers and high ceilings.
4. 🛠 A powerful management backend, designed for teams and small to medium-sized enterprises, allowing one person to manage and multiple people to use.
5. 🔗 All AI capabilities provide API access, and all tools are open-source and customizable (in progress).
6. 💡 Our strong development team releases 2-3 new applications weekly, with products updated daily. Developers interested in joining are welcome to contact us.

## Project Features

1. 🎥 **AI E-commerce Scene Image Generator**: Generate model or product images by combining pictures and text, supports secondary image relighting, and can extend image generation to videos.
2. 🔄 **Task Management**: Tasks support regeneration.
3. ⚙️ **Multi-model Support**: Choose various models to generate videos.
4. 📜 **History**: Save your creative history, ensuring memory retention, and download anytime, anywhere.
5. 🌐 **Internationalization**: Supports multiple languages, currently available in Chinese, English, and Japanese.

## Tech Stack

- Foundation framework Next.js 14

## Development & Deployment

1. Clone the project `git clone git@github.com:302ai/302_ecom_image_generator.git`
2. Install dependencies `pnpm install`
3. Configure 302's API KEY, refer to .env.example
4. Run the project `pnpm dev`
5. Package and deploy `docker build -t ecom_image_generator . && docker run -p 3000:3000 ecom_image_generator`

## Interface Preview

![pic-tool](docs/en/电商场景英1.png)     


![pic-tool](docs/en/电商场景英2.png)
