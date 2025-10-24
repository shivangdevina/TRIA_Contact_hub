# 🪄 Contact-Hub

A **production-ready frontend-only contact manager** that demonstrates how far you can push client-side architecture.  
Built with **React 18**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **IndexedDB** — no backend required today, yet **100% ready to plug into your future API**.

🔗 **Live Demo / One-Click Deploy:**  
Deploy on Vercel →

---

## 🚀 What You Can Do

| Feature | Description |
|----------|--------------|
| **Add** | Create contacts with name, e-mail, phone & avatar photo |
| **Edit** | Inline form pre-filled for quick updates |
| **Delete** | One-click removal with confirmation |
| **Copy** | One-tap copy of vCard text to clipboard |
| **Export** | Dump entire address book to a timestamped `.json` file |
| **Share** | Auto-generated QR code (vCard) for instant mobile save |
| **Search** | Real-time filter by name / e-mail / phone |
| **Theming** | Light ↔ Dark mode (persisted) |
| **Responsive** | Works great on mobile, tablet & desktop |
| **Offline** | PWA-ready (service-worker stub included) |

---

## ⚡ Quick Start (Local)

```bash
git clone https://github.com/your-username/contact-hub.git
cd contact-hub
pnpm i               # or npm / yarn
pnpm dev             # http://localhost:5173
```
Push to GitHub, then import into Vercel — **zero config**.

---

## 🏗 Architecture Highlights

| Layer | Tech | Why |
|--------|------|-----|
| **UI** | React 18 + TypeScript + Vite | Type-safe, HMR, tree-shaken bundles |
| **Styling** | Tailwind 3 + shadcn/ui | Consistent design-system, dark mode out-of-the-box |
| **State & Cache** | TanStack Query 5 + IndexedDB persister | Offline-first, optimistic updates, SWR |
| **Routing** | React Router 6 | SPA navigation, catch-all 404 |
| **Storage** | IndexedDB (via `idb` wrapper) | >50 MB capacity, survives reloads |
| **Asset Opt.** | vite-plugin-imagemin + lazy loading | ≤100 kB first paint |

---

## Folder Map

src
├── components
│ ├── AddContactModal.tsx # Zod-level validation, typo detection
│ ├── ContactCard.tsx # QR-code generation, vCard export
│ ├── ContactList.tsx # Search, sort, bulk-select, speed-dial
│ └── ui/ # shadcn/ui primitives
├── lib
│ └── api
│ └── contacts.ts # IndexedDB CRUD + future Axios switch
├── pages
│ ├── Index.tsx # Shell wrapper
│ └── NotFound.tsx
└── index.css # HSL design tokens


---

## ✅ Validation Rules

- **Name** — required, ≤ 100 chars  
- **E-mail** — optional, RFC-like format + typo detection (`gamil.com → gmail.com?`)  
- **Phone** — optional, ≥ 10 digits, allows + - ( ) space  
- **Avatar** — optional, ≤ 5 MB, client-side resized before storage  

---

## 🎨 Theming

All colors use **HSL CSS variables**.  
Edit `index.css` `:root` / `.dark` to re-skin in seconds.

---

## ☁️ Deploy on Vercel (One Click)

Deploy instantly →

| Build Setting | Value |
|----------------|--------|
| **Framework Preset** | Vite |
| **Build Command** | `pnpm build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm i` |

---

## 🔒 Privacy & Compliance

- 100% client-side — zero data leaves the browser  
- No cookies, no third-party trackers  
- GDPR/CCPA ready: users can export & delete all data instantly  

---

## 🔁 Migration Path to Real Backend

1. Deploy your API (`/api/v1/contacts`, `/api/v1/upload`)  
2. Update `lib/api/contacts.ts` to use **Axios** instead of IndexedDB  
3. Add JWT header in `lib/api/axios.ts`  
4. TanStack Query will refetch and hydrate IndexedDB for offline fallback  

---

## 🧭 Roadmap / Future Improvements

| Feature | Status | Description |
|----------|---------|-------------|
| **Profile-based Cloud** | Planned | OAuth login (Google, Apple, GitHub) + encrypted sync |
| **Import Contacts** | Planned | vCard/CSV parser with duplicate resolver |
| **Enhanced Export** | Planned | vCard 3.0/4.0, Google/Outlook CSV, Drive backup |
| **External Integrations** | Planned | Google, iCloud, Microsoft Graph, CardDAV |
| **Collaboration** | Planned | Share folders via expirable public links |
| **Security Hardening** | Planned | 2FA, encryption, GDPR audit logs |
| **Developer SDK** | Planned | REST/GraphQL APIs, webhooks, plugin system |

---

## 🤝 Contributing

We welcome PRs that keep the **frontend-only promise** while improving API boundaries.

```bash
git checkout -b feat/your-feature
pnpm lint && pnpm type-check && pnpm test:unit
git push origin feat/your-feature

