
---

# Huqooq-e-Niswan

*An AI-powered legal assistant for Pakistani women’s rights*

## 📖 Overview

**Huqooq-e-Niswan** (حقوق النسوان) is a web platform designed to empower women by providing **instant, reliable, and accessible legal information** about women’s rights in Pakistan.

The app combines **Retrieval-Augmented Generation (RAG)** technology with official **legal documents** to answer user queries in **English** and **Urdu**, bridging the gap between citizens and legal knowledge.

---

## ✨ Features

* ⚖️ **AI-Powered Legal Assistant** – Get instant answers to your questions about women’s rights.
* 🌐 **Multilingual Support** – Ask in English or Urdu and get culturally relevant responses.
* 📚 **Comprehensive Legal Database** – Uses real legal acts, judgments, and policy documents.
* 🔒 **Privacy First** – User questions remain private and secure.
* 📱 **Responsive Design** – Fully optimized for desktop and mobile.
* ⚡ **Instant Access** – No appointments, no waiting.

---

## 🏗️ Tech Stack

* **Frontend**: [Next.js 13+ (App Router)](https://nextjs.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Language Support**: Urdu + English
* **AI Backend**: RAG pipeline (LLMs + document retrieval)
* **Deployment**: Vercel / Netlify (recommended)

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with global styles
│   ├── page.tsx          # Home page (Hero, Features, CTA)
│   └── globals.css       # Tailwind + global styles
├── components/
│   ├── ChatInterface.tsx # Chat UI for asking legal questions
│   ├── DisclaimerBanner.tsx
│   └── ...
├── dataset/              # Legal PDFs & documents (private, not public)
├── lib/                  # Utility functions (RAG, AI integrations)
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/syedaraheen/Huqooq_e_Niswan.git
cd Huqooq_e_Niswan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root with:

```
OPENAI_API_KEY=your_key_here
# Add other vars like DB_URL if required
```

### 4. Run the Dev Server

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000).

---

## 🎨 Color Theme

The design follows a **professional and elegant palette**:

* **Primary Gradient**: Purple → Pink → Teal
* **Secondary Colors**: White, Gray (for readability)
* **Accent**: Green (for trust/validation)

---

## 🚀 Deployment

Deploy easily on **[Vercel](https://vercel.com/)** (recommended for Next.js).

```bash
npm run build
npm start
```

---

## 📜 Disclaimer

This project is for **educational and informational purposes only**.
It does not replace professional legal consultation. Always consult a qualified lawyer for official legal advice.

---

## 🙌 Contribution

Contributions are welcome! To contribute:

1. Fork the repo
2. Create a feature branch (`feature/new-feature`)
3. Commit changes
4. Open a Pull Request

---

## 📧 Contact

For questions, suggestions, or feedback:

* **Email**: \[[raheenbukhari.01@gmail.com](mailto:raheenbukhari.01@gmail.com)]
* **GitHub Issues**: [Open an Issue](https://github.com/syedaraheen/Huqooq_e_Niswan/issues)

---

Would you like me to also **add usage instructions for the AI/RAG part** (like how to index the PDFs and run retrieval), or keep the README focused only on the **frontend setup** for now?
