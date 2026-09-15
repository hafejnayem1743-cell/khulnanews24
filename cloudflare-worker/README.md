# Khulna News 24 - Cloudflare Worker Auto News Collector
> **100% Free-Tier Compatible** | **No Credit Card Required** | **Cron Trigger Auto-Pilot**

এই Cloudflare Worker-টি খুলনা বিভাগের ১০টি জেলার সংবাদ বিশ্বস্ত ওপেন আরএসএস ও নিউজ ফিড থেকে স্বয়ংক্রিয়ভাবে সংগ্রহ করার জন্য প্রস্তুত করা হয়েছে।

---

## 🚀 কিভাবে ডেপ্লয় করবেন (মাত্র ৩ মিনিটে)

### পদ্ধতি ১: Wrangler CLI (প্রস্তাবিত)

1. টার্মিনালে এই ফোল্ডারে প্রবেশ করুন:
```bash
cd cloudflare-worker
```

2. ক্লাউডফ্লেয়ার অ্যাকাউন্টে লগইন করুন (ফ্রি অ্যাকাউন্ট):
```bash
npx wrangler login
```

3. এক কমান্ডে ডেপ্লয় করুন:
```bash
npx wrangler deploy
```

ডেপ্লয় সম্পন্ন হলে টার্মিনালে আপনার Worker URL পেয়ে যাবেন, যেমন:
`https://khulna-news-collector.<your-subdomain>.workers.dev`

---

### পদ্ধতি ২: Cloudflare ড্যাশবোর্ড থেকে সরাসরি (No-Code/Web Editor)

1. [dash.cloudflare.com](https://dash.cloudflare.com/) এ গিয়ে **Workers & Pages** এ ক্লিক করুন।
2. **Create application** > **Create Worker** সিলেক্ট করুন।
3. নাম দিন: `khulna-news-collector` এবং **Deploy** চাপুন।
4. এরপর **Edit code** বাটনে ক্লিক করে `src/index.js` ফাইলের কোডটুকু পেস্ট করে **Save and Deploy** করুন।
5. **Settings** > **Triggers** > **Cron Triggers** এ গিয়ে `*/15 * * * *` (প্রতি ১৫ মিনিট) অ্যাড করুন।

---

## ⚙️ অ্যাডমিন প্যানেলে লিঙ্ক করার নিয়ম

1. আপনার Khulna News 24 ওয়েবসাইটের অ্যাডমিন প্যানেলে প্রবেশ করুন: `/admin/auto-news`
2. **Cloudflare Worker (Free-Tier)** সেকশনে আপনার Worker URL টি পেস্ট করুন:
   ```text
   https://khulna-news-collector.<your-subdomain>.workers.dev
   ```
3. **কানেকশন টেস্ট করুন** বাটনে ক্লিক করুন।
4. **সংরক্ষণ** চাপুন। ব্যাস! এখন আপনার ওয়েবসাইট সরাসরি ক্লাউডফ্লেয়ার ফ্রি ওয়ার্কারের মাধ্যমে অটো নিউজ পুল করবে।

---

## 📡 Worker Endpoints

- `GET /health` : ওয়ার্কারের হেলথ চেক ও জেলা সমূহের স্ট্যাটাস।
- `GET /api/collect` : খুলনা বিভাগের ১০ জেলার সংবাদ সংগ্রহ করে জোড আকারে রিটার্ন করে।
- `GET /api/proxy-rss?url=<FEED_URL>` : যেকোনো আরএসএস ফিড ব্রাউজারের CORS ব্লক ছাড়াই ফেচ করার প্রক্সি।
- `Cron Trigger` : প্রতি ১৫ মিনিট পর পর ক্লাউডফ্লেয়ারের ব্যাকগ্রাউন্ডে রান হয়।
