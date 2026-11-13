# Mosaic Advisors — ვებგვერდი (React + TypeScript)

ორენოვანი (ქართული / English) ვებგვერდი საბუღალტრო, იურიდიული და აუდიტის კომპანიისთვის.

## 🚀 სწრაფი გახსნა (ინსტალაციის გარეშე)

ორჯერ დააწკაპუნეთ **`საიტის-გახსნა.html`**-ზე (ან `ready-site/index.html`-ზე). საიტი ბრაუზერში გაიხსნება.
შრიფტები Google Fonts-იდან იტვირთება, ამიტომ ინტერნეტი სასურველია.

## 🛠 დეველოპმენტი

საჭიროა [Node.js](https://nodejs.org) 20 ან უფრო ახალი ვერსია.

```bash
npm install          # ერთხელ — დამოკიდებულებების ინსტალაცია
npm run dev          # დეველოპმენტ-სერვერი → http://localhost:5173
npm run typecheck    # TypeScript-ის შემოწმება
npm run build        # production build → dist/  (ჰოსტინგზე ასატვირთად)
npm run build:static # ready-site/ განახლება (ორმაგი დაწკაპუნებით გასახსნელი ვერსია)
```

> `dist/` ჰოსტინგისთვისაა (`<script type="module">`, ამიტომ ფაილიდან პირდაპირ არ იხსნება).
> `ready-site/` კი ერთ ჩვეულებრივ სკრიპტადაა აწყობილი და პირდაპირ დისკიდანაც მუშაობს.

## 📁 სტრუქტურა

```
src/
├── main.tsx              შესვლის წერტილი
├── App.tsx               პროვაიდერები, როუტინგი, layout
├── styles/global.css     ყველა სტილი + რესპონსიული breakpoint-ები
├── i18n/                 ka.ts, en.ts (ტექსტები), index.tsx (ენის კონტექსტი)
├── data/content.ts       სლაიდები, სერვისები, პაკეტები, ბლოგი, გუნდი, FAQ, კონტაქტი
├── lib/                  storage, validation, router (hash), hash (პაროლი)
├── context/              AuthContext (ანგარიშები, შეკვეთები, შეტყობინებები), UIContext
├── components/           Header, Footer, Hero, ContactSection, OrderModal, ChatWidget…
└── pages/                Home, Pages (About/Services/Contact/Blog/Post/404), Account
```

## ✏️ კონტენტის შეცვლა

| რა | სად |
|---|---|
| ტელეფონი, ელ-ფოსტა, სოციალური ქსელები | `src/data/content.ts` → `CONTACT` |
| ნებისმიერი ტექსტი | `src/i18n/ka.ts` და `src/i18n/en.ts` |
| სლაიდები, სერვისები, პაკეტები, ფასები, ბლოგი | `src/data/content.ts` |
| ფერები | `src/styles/global.css` → `:root` |

შეცვლის შემდეგ გაუშვით `npm run build:static`, რომ `ready-site` განახლდეს.

## 🌐 გვერდები (hash-როუტინგი)

`#home` · `#about` · `#services` · `#services-accounting|legal|audit` · `#packages` · `#contact` · `#blog` · `#post-<id>` · `#account` · სხვა → 404

## ✅ ტესტირება

ავტომატური ტესტებით შემოწმდა 61 სცენარი: ენები, სლაიდერი, ყველა გვერდი, ფორმები და ვალიდაცია, შეკვეთა,
რეგისტრაცია/შესვლა/გასვლა, პროფილი, ანგარიშის წაშლა, ჩატი, newsletter, დაბლოკილი და დაზიანებული localStorage,
მობილური მენიუ და ჩატი. რესპონსიულობა შემოწმდა 14 ეკრანის ზომაზე (320–2560 px, ჰორიზონტალური ტელეფონის ჩათვლით).
შედეგი: 0 შეცდომა, 0 ჰორიზონტალური გადავსება.

## ⚠️ დემო-რეჟიმი

შეკვეთები, შეტყობინებები და ანგარიშები ინახება მხოლოდ ვიზიტორის ბრაუზერში (localStorage).
რეალური გამოყენებისთვის საჭიროა backend (API, მონაცემთა ბაზა, ელ-ფოსტა). ცვლილებები შეეხება მხოლოდ
`src/context/AuthContext.tsx`-ს — კომპონენტები უცვლელი რჩება.
