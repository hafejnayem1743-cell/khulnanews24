import { Category, Author, NewsItem, BreakingNewsItem, AdSlot, SiteSettings, HomepageSectionConfig, AdminUser, MediaItem } from '../types';

export const DEFAULT_AUTHORS: Author[] = [
  {
    id: 'auth-1',
    name: 'Tariqul Islam',
    banglaName: 'তারিকুল ইসলাম',
    designation: 'প্রধান বার্তা সম্পাদক',
    bio: 'সাংবাদিকতায় দীর্ঘ ১৫ বছরের অভিজ্ঞতা। খুলনা ও উপকূলীয় অঞ্চলের সমস্যা ও সম্ভাবনা নিয়ে নিয়মিত কাজ করছেন।',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    email: 'tariqul@khulnanews.com',
    socialLinks: { facebook: 'https://facebook.com', twitter: 'https://x.com' }
  },
  {
    id: 'auth-2',
    name: 'Nusrat Jahan',
    banglaName: 'নুসরাত জাহান',
    designation: 'বিশেষ প্রতিনিধি, খুলনা ব্যুরো',
    bio: 'পরিবেশ, সুন্দরবন ও খুলনা বিশ্ববিদ্যালয়ের শিক্ষা বিষয়ক গবেষক ও সাংবাদিক।',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    email: 'nusrat@khulnanews.com',
    socialLinks: { facebook: 'https://facebook.com' }
  },
  {
    id: 'auth-3',
    name: 'Kawsar Ahmed',
    banglaName: 'কাওসার আহমেদ',
    designation: 'অর্থনীতি ও ব্যবসা বিশ্লেষক',
    bio: 'মংলা বন্দর, চিংড়ি রপ্তানি ও দক্ষিণ-পশ্চিমাঞ্চলের শিল্প উন্নয়ন সংক্রান্ত কলাম লেখক।',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    email: 'kawsar@khulnanews.com'
  }
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-khulna', name: 'খুলনা', englishName: 'Khulna', slug: 'khulna', order: 1, showInNav: true, showInHome: true, color: '#dc2626' },
  { id: 'cat-national', name: 'জাতীয়', englishName: 'National', slug: 'national', order: 2, showInNav: true, showInHome: true, color: '#2563eb' },
  { id: 'cat-politics', name: 'রাজনীতি', englishName: 'Politics', slug: 'politics', order: 3, showInNav: true, showInHome: true, color: '#7c3aed' },
  { id: 'cat-international', name: 'আন্তর্জাতিক', englishName: 'International', slug: 'international', order: 4, showInNav: true, showInHome: true, color: '#0891b2' },
  { id: 'cat-economy', name: 'অর্থনীতি', englishName: 'Economy', slug: 'economy', order: 5, showInNav: true, showInHome: true, color: '#059669' },
  { id: 'cat-business', name: 'ব্যবসা-বাণিজ্য', englishName: 'Business', slug: 'business', order: 6, showInNav: true, showInHome: true, color: '#d97706' },
  { id: 'cat-sports', name: 'খেলাধুলা', englishName: 'Sports', slug: 'sports', order: 7, showInNav: true, showInHome: true, color: '#ea580c' },
  { id: 'cat-entertainment', name: 'বিনোদন', englishName: 'Entertainment', slug: 'entertainment', order: 8, showInNav: true, showInHome: true, color: '#db2777' },
  { id: 'cat-tech', name: 'প্রযুক্তি', englishName: 'Technology', slug: 'technology', order: 9, showInNav: true, showInHome: true, color: '#4f46e5' },
  { id: 'cat-lifestyle', name: 'লাইফস্টাইল', englishName: 'Lifestyle', slug: 'lifestyle', order: 10, showInNav: true, showInHome: false, color: '#10b981' },
  { id: 'cat-education', name: 'শিক্ষা', englishName: 'Education', slug: 'education', order: 11, showInNav: true, showInHome: false, color: '#0284c7' },
  { id: 'cat-health', name: 'স্বাস্থ্য', englishName: 'Health', slug: 'health', order: 12, showInNav: true, showInHome: false, color: '#16a34a' },
  { id: 'cat-opinion', name: 'মতামত', englishName: 'Opinion', slug: 'opinion', order: 13, showInNav: true, showInHome: true, color: '#475569' },
  { id: 'cat-others', name: 'অন্যান্য', englishName: 'Others', slug: 'others', order: 14, showInNav: true, showInHome: false, color: '#64748b' }
];

export const DEFAULT_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'brk-1',
    headline: 'খুলনা-মোংলা রেললাইনে আধুনিক মালবাহী ট্রেন চলাচল জোরদার, দক্ষিণ-পশ্চিমাঞ্চলের বাণিজ্যে নতুন দিগন্ত',
    linkUrl: '/news/khulna-mongla-rail-commercial-operation',
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'brk-2',
    headline: 'সুন্দরবনে পর্যটক প্রবেশে নতুন ডিজিটাল পাস ব্যবস্থা চালু, রাজস্ব বাড়ার সম্ভাবনা',
    linkUrl: '/news/sundarban-tourism-digital-pass-system',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'brk-3',
    headline: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়ে (কুয়েট) আন্তর্জাতিক রোবটিক্স সম্মেলন শুরু',
    linkUrl: '/news/kuet-international-robotics-summit',
    isActive: true,
    priority: 3,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'খুলনা-মোংলা রেল রুটে পণ্য পরিবহনে নতুন রেকর্ড, বদলে যাচ্ছে উপকূলীয় অর্থনীতি',
    subTitle: 'মোংলা বন্দর থেকে সরাসরি খুলনা ও সারাদেশে স্বল্প খরচে পণ্য সরবরাহে ব্যবসায়ীদের স্বস্তি',
    slug: 'khulna-mongla-rail-commercial-operation',
    summary: 'খুলনা-মোংলা রেল সংযোগ চালুর পর পণ্য পরিবহন ব্যবস্থায় এসেছে যুগান্তকারী পরিবর্তন। মোংলা বন্দর থেকে উত্তর ও পূর্বাঞ্চলে কনটেইনার ও বাল্ক কার্গো পরিবহন কয়েকগুণ বৃদ্ধি পেয়েছে।',
    content: `
      <p class="lead">খুলনা-মোংলা রেল রুটে নিয়মিত পণ্যবাহী ট্রেন চলাচলের ফলে দেশের দ্বিতীয় বৃহত্তম সমুদ্রবন্দর মোংলার কর্মচাঞ্চল্য বহুগুণ বৃদ্ধি পেয়েছে। বন্দর কর্তৃপক্ষ ও আমদানিকারকরা জানিয়েছেন, সড়কপথের তুলনায় রেলপথে পণ্য পরিবহনে সময় ও ব্যয় দুটোই উল্লেখযোগ্য হারে সাশ্রয় হচ্ছে।</p>
      
      <h2>অর্থনীতি ও বাণিজ্যে নতুন গতির সঞ্চার</h2>
      <p>খুলনার ফুলতলা জংশন থেকে মোংলা বন্দর পর্যন্ত স্থাপিত প্রায় ৯০ কিলোমিটার দীর্ঘ এই রেল রুট দক্ষিণাঞ্চলের রূপপুর পারমাণবিক বিদ্যুৎকেন্দ্র, খুলনা বিদ্যুৎকেন্দ্র এবং যশোর ও বেনাপোল অঞ্চলের সাথে সরাসরি সংযুক্ত করেছে। শিল্পোদ্যোক্তারা বলছেন, মোংলা বন্দর দিয়ে আমদানি করা ভারী যন্ত্রপাতি ও কাঁচামাল এখন দ্রুত দেশের শিল্পাঞ্চলগুলোতে পৌঁছানো যাচ্ছে।</p>
      
      <blockquote>
        "খুলনা-মোংলা রেল যোগাযোগ দক্ষিণাঞ্চলের শিল্পের দীর্ঘদিনের দাবি পূরণ করেছে। এটি শুধু মোংলা বন্দরের ক্ষমতাই বাড়ায়নি, বরং রূপসা ও ভৈরব নদের অববাহিকায় নতুন অর্থনৈতিক অঞ্চল গড়ে ওঠার পথ সুগম করেছে।" — সভাপতি, খুলনা চেম্বার অব কমার্স।
      </blockquote>

      <h2>ভবিষ্যতের পরিকল্পনা</h2>
      <p>রেলওয়ের ঊর্ধ্বতন কর্মকর্তারা জানান, আগামী মাসে আরও দুটি আন্তর্জাতিক মানের মালবাহী ট্রেন যুক্ত করার পরিকল্পনা রয়েছে। এছাড়া শিগগিরই যাত্রীসেবা আরও সুবিন্যস্ত করা হবে যাতে সাধারণ মানুষও খুলনা ও মোংলার মধ্যে সুলভ ও দ্রুত যাতায়াত করতে পারেন।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'খুলনা-মোংলা রেললাইনে মালবাহী ট্রেনের ট্রায়াল রান ও নিয়মিত ট্রিপ',
    imageCredit: 'খুলনা নিউজ ব্যুরো',
    categoryId: 'cat-khulna',
    categoryName: 'খুলনা',
    authorId: 'auth-1',
    authorName: 'তারিকুল ইসলাম',
    status: 'published',
    isFeatured: true,
    isTopNews: true,
    isBreaking: true,
    isTrending: true,
    priority: 1,
    viewCount: 78450,
    likeCount: 6240,
    shareCount: 3120,
    tags: ['খুলনা', 'মোংলা বন্দর', 'রেলওয়ে', 'বাণিজ্য', 'অর্থনীতি'],
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    seo: {
      seoTitle: 'খুলনা-মোংলা রেল রুটে পণ্য পরিবহনে নতুন রেকর্ড | খুলনা নিউজ',
      metaDescription: 'খুলনা-মোংলা রেল সংযোগ চালুর পর মোংলা বন্দর থেকে পণ্য পরিবহন ব্যবস্থায় এসেছে যুগান্তকারী পরিবর্তন।',
      focusKeywords: ['খুলনা মোংলা রেল', 'মোংলা বন্দর', 'খুলনা খবর']
    },
    allowComments: true
  },
  {
    id: 'news-2',
    title: 'সুন্দরবনের জীববৈচিত্র্য রক্ষায় কৃত্রিম বুদ্ধিমত্তা ও স্মার্ট প্যাট্রোলিং প্রযুক্তির সফল ব্যবহার',
    subTitle: 'বন বিভাগ ও গবেষকদের যৌথ উদ্যোগে বন্যপ্রাণী ও বাঘের গতিবিধি পর্যবেক্ষণ জোরদার',
    slug: 'sundarban-smart-patrolling-ai-wildlife',
    summary: 'বিশ্ব ঐতিহ্য সুন্দরবনের রয়েল বেঙ্গল টাইগার ও হরিণ রক্ষায় বন বিভাগ স্মার্ট ক্যামেরা ট্র্যাপিং ও এআই ভিত্তিক রিয়েল-টাইম অডিও সার্ভিলেন্স প্রযুক্তি চালু করেছে।',
    content: `
      <p>সুন্দরবন পূর্ব ও পশ্চিম বন বিভাগে চোরাশিকারি প্রতিরোধ ও বন্যপ্রাণী সংরক্ষণে অত্যাধুনিক 'স্মার্ট প্যাট্রোলিং' পদ্ধতি ব্যাপক সাফল্য দেখাচ্ছে। বন কর্মকর্তা ও বনরক্ষীদের হাতে তুলে দেওয়া হয়েছে বিশেষ জিপিএস ডিভাইস এবং স্বয়ংক্রিয় সংকেত প্রদানকারী নজরদারি সেন্সর।</p>
      
      <h2>বাঘের ঘনত্ব ও সুরক্ষায় ডিজিটাল ট্র্যাকিং</h2>
      <p>গবেষকরা জানান, সুন্দরবনের গভীর অরণ্যে স্থাপিত হাই-রেজ্যুলেশন সেন্সর ক্যামেরাগুলোর ডেটা স্বয়ংক্রিয়ভাবে খুলনা সার্কেল কন্ট্রোল রুমে পৌঁছে যায়। কোনো অবৈধ গতিবিধি বা কাঠের ক্ষতিসাধন হলে স্বয়ংক্রিয় এলার্ট বেজে ওঠে।</p>
      
      <p>এর ফলে গত ছয় মাসে সুন্দরবনে চোরাশিকারিদের তৎপরতা প্রায় শূন্যের কোঠায় নেমে এসেছে এবং বন্যপ্রাণীদের স্বাভাবিক বিচরণ সুরক্ষিত হয়েছে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'সুন্দরবনে স্থাপিত আধুনিক নজরদারি ক্যামেরা ও বন বিভাগের টহল দল',
    imageCredit: 'বন বিভাগ / খুলনা নিউজ',
    categoryId: 'cat-khulna',
    categoryName: 'খুলনা',
    authorId: 'auth-2',
    authorName: 'নুসরাত জাহান',
    status: 'published',
    isFeatured: true,
    isTopNews: false,
    isBreaking: false,
    isTrending: true,
    priority: 2,
    viewCount: 64200,
    likeCount: 5890,
    shareCount: 2840,
    tags: ['সুন্দরবন', 'রয়েল বেঙ্গল টাইগার', 'পরিবেশ', 'খুলনা'],
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    seo: {
      seoTitle: 'সুন্দরবনের জীববৈচিত্র্য রক্ষায় স্মার্ট প্যাট্রোলিং প্রযুক্তি | খুলনা নিউজ',
      metaDescription: 'সুন্দরবনের বন্যপ্রাণী সুরক্ষায় এআই ও ক্যামেরা ট্র্যাপিংয়ের মাধ্যমে স্মার্ট প্যাট্রোলিংয়ের নতুন যুগ।',
      focusKeywords: ['সুন্দরবন', 'বাঘ', 'খুলনা বন বিভাগ']
    },
    allowComments: true
  },
  {
    id: 'news-3',
    title: 'রূপসা ও ভৈরব নদীর নাব্যতা ফেরাতে মেগা ড্রেজিং প্রকল্প অনুমোদনের পথে',
    subTitle: 'খুলনা মহানগরী ও নদী তীরবর্তী শিল্পাঞ্চলকে রক্ষা করতে ৫০০ কোটি টাকার মহাপরিকল্পনা',
    slug: 'rupsha-bhairab-river-dredging-project',
    summary: 'খুলনার প্রাণ হিসেবে পরিচিত রূপসা এবং ভৈরব নদীর তলদেশে পলি জমা প্রতিরোধে এবং নৌযান চলাচল নির্বিঘ্ন করতে দীর্ঘমেয়াদী ড্রেজিং প্রকল্প হাতে নেওয়া হয়েছে।',
    content: `
      <p>খুলনা নগরীর প্রধান দুটি নদী রূপসা ও ভৈরবের ড্রেজিং এবং তীর সংরক্ষণ প্রকল্পের চূড়ান্ত সমীক্ষা সম্পন্ন হয়েছে। পানি উন্নয়ন বোর্ড ও বিআইডব্লিউটিএ যৌথভাবে এই প্রকল্প বাস্তবায়ন করতে যাচ্ছে।</p>
      <p>প্রকল্পের আওতায় নদীর গভীরতা বৃদ্ধি ছাড়াও দুই পাড়ে টেকসই বাঁধ নির্মাণ ও সবুজ বেষ্টনী গড়ে তোলা হবে, যা নদীভাঙন রোধে কার্যকরী ভূমিকা রাখবে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'রূপসা নদীর বর্তমান অবস্থা ও লঞ্চ পারাপার',
    categoryId: 'cat-khulna',
    categoryName: 'খুলনা',
    authorId: 'auth-1',
    authorName: 'তারিকুল ইসলাম',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,
    priority: 3,
    viewCount: 41800,
    likeCount: 3450,
    shareCount: 1620,
    tags: ['রূপসা', 'ভৈরব নদী', 'ড্রেজিং', 'খুলনা উন্নয়ন'],
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    seo: {
      seoTitle: 'রূপসা ও ভৈরব নদীর ড্রেজিং প্রকল্প | খুলনা নিউজ',
      metaDescription: 'রূপসা ও ভৈরব নদীর নাব্যতা বৃদ্ধি ও নদীভাঙন রোধে মেগা প্রকল্প।',
      focusKeywords: ['রূপসা নদী', 'ভৈরব নদী', 'খুলনা সংবাদ']
    },
    allowComments: true
  },
  {
    id: 'news-4',
    title: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়ে (কুয়েট) আন্তর্জাতিক রোবটিক্স ও এআই সম্মেলন অনুষ্ঠিত',
    subTitle: 'দেশ-বিদেশের গবেষক ও বিজ্ঞানীদের অংশগ্রহণে ৩ দিনব্যাপী যুগান্তকারী গবেষণা প্রদর্শনী',
    slug: 'kuet-international-robotics-summit',
    summary: 'কুয়েট ক্যাম্পাসে বিশ্বের ১০টি দেশের প্রযুক্তি গবেষক ও শিক্ষার্থীদের উদ্ভাবনী রোবটিক্স প্রজেক্ট এবং এআই সলিউশন প্রদর্শিত হয়েছে।',
    content: `
      <p>খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়ে (কুয়েট) শুরু হয়েছে তিন দিনব্যাপী আন্তর্জাতিক রোবটিক্স ও অটোমেশন সম্মেলন। দেশ-বিদেশের প্রযুক্তি গবেষক, প্রকৌশলী ও উদ্ভাবকরা এতে তাদের সর্বাধুনিক গবেষণা উপস্থাপন করছেন।</p>
      <p>উদ্বোধনী অনুষ্ঠানে বক্তারা বলেন, দেশের চতুর্থ শিল্পবিপ্লবের নেতৃত্ব দিতে প্রযুক্তি বিশ্ববিদ্যালয়গুলোর এমন যুগোপযোগী উদ্যোগ অত্যন্ত প্রশংসনীয়।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'কুয়েট ক্যাম্পাসে অনুষ্ঠিত রোবটিক্স সম্মেলন',
    categoryId: 'cat-tech',
    categoryName: 'প্রযুক্তি',
    authorId: 'auth-2',
    authorName: 'নুসরাত জাহান',
    status: 'published',
    isFeatured: true,
    isTopNews: false,
    isBreaking: false,
    isTrending: true,
    priority: 4,
    viewCount: 56900,
    likeCount: 4920,
    shareCount: 2310,
    tags: ['কুয়েট', 'রোবটিক্স', 'কৃত্রিম বুদ্ধিমত্তা', 'প্রযুক্তি', 'খুলনা'],
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    seo: {
      seoTitle: 'কুয়েটে আন্তর্জাতিক রোবটিক্স ও এআই সম্মেলন | খুলনা নিউজ',
      metaDescription: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়ে আন্তর্জাতিক রোবটিক্স ও প্রযুক্তি প্রদর্শনী।',
      focusKeywords: ['কুয়েট', 'রোবটিক্স সম্মেলন', 'খুলনা সংবাদ']
    },
    allowComments: true
  },
  {
    id: 'news-5',
    title: 'জাতীয় অর্থনীতিতে মোংলা বন্দরের অবদান দ্বিগুণ: চলতি অর্থবছরে রাজস্বে বড় উল্লম্ফন',
    subTitle: 'আধুনিক গ্যান্ট্রি ক্রেন স্থাপন ও স্বয়ংক্রিয় শুল্কায়নের ফলে খালাস প্রক্রিয়ায় দ্রুততা',
    slug: 'mongla-port-record-revenue-fy',
    summary: 'মোংলা সমুদ্রবন্দরে কন্টেইনার ও জাহাজ হ্যান্ডলিংয়ে আধুনিক প্রযুক্তি ব্যবহারের সুফল মিলছে। চলতি অর্থবছরের প্রথম ৬ মাসে রেকর্ড পরিমাণ রাজস্ব সংগৃহীত হয়েছে।',
    content: `
      <p>মোংলা বন্দর কর্তৃপক্ষের সাম্প্রতিক পরিসংখ্যানে দেখা গেছে, বিগত বছরের তুলনায় এবছর কার্গো খালাসের গতি বেড়েছে ৪০ শতাংশ। চট্টগ্রাম বন্দরের ওপর চাপ কমাতে এবং সহজে রাজধানীসহ দেশের যেকোনো স্থানে পণ্য পাঠাতে ব্যবসায়ীরা মোংলা বন্দরকে বেছে নিচ্ছেন।</p>
      <p>বন্দর চেয়ারম্যান জানান, ডিজিটাল অটোমেশন ও ড্রেজিং কার্যক্রম নিয়মিত থাকায় বড় ড্রাফটের বিদেশি বাণিজ্যিক জাহাজ এখন সহজেই জেটিতে ভিড়তে পারছে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'মোংলা সমুদ্রবন্দরে কন্টেইনার খালাসের ব্যস্ত দৃশ্য',
    categoryId: 'cat-economy',
    categoryName: 'অর্থনীতি',
    authorId: 'auth-3',
    authorName: 'কাওসার আহমেদ',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,
    priority: 5,
    viewCount: 68300,
    likeCount: 5120,
    shareCount: 2450,
    tags: ['মোংলা বন্দর', 'অর্থনীতি', 'রাজস্ব', 'বাণিজ্য'],
    publishedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    seo: {
      seoTitle: 'মোংলা বন্দরের রেকর্ড রাজস্ব ও কর্মচাঞ্চল্য | খুলনা নিউজ',
      metaDescription: 'মোংলা বন্দরের আধুনিকায়নে রাজস্ব আদায়ে নতুন রেকর্ড সৃষ্টি।',
      focusKeywords: ['মোংলা বন্দর', 'জাতীয় অর্থনীতি', 'খুলনা']
    },
    allowComments: true
  },
  {
    id: 'news-6',
    title: 'খুলনা শেখ আবু নাসের স্টেডিয়ামে প্রথম বিভাগ ক্রিকেট লিগের জমজমাট উদ্বোধন',
    subTitle: '১০টি শীর্ষ ক্লাবের অংশগ্রহণে শুরু হলো দক্ষিণাঞ্চলের মর্যাদাপূর্ণ ক্রিকেট উৎসব',
    slug: 'sheikh-abu-naser-stadium-cricket-league-open',
    summary: 'খুলনার আন্তর্জাতিক মানসম্পন্ন শেখ আবু নাসের স্টেডিয়ামে বর্ণাঢ্য আয়োজনে শুরু হলো জেলা ক্রীড়া সংস্থা পরিচালিত প্রথম বিভাগ ক্রিকেট লিগ ২০২৬।',
    content: `
      <p>খুলনার ক্রিকেটপ্রেমীদের জন্য উৎসবের আমেজ নিয়ে মাঠে গড়িয়েছে প্রথম বিভাগ ক্রিকেট লিগ। প্রথম দিনের ম্যাচে মুখোমুখি হয় খুলনা মোহামেডান স্পোর্টিং ক্লাব এবং ব্রাদার্স ইউনিয়ন।</p>
      <p>খেলা উদ্বোধনকালে জেলা ক্রীড়া সংস্থার সভাপতি জানান, স্থানীয় ক্রিকেটারদের জাতীয় পর্যায়ে তুলে আনতে নিয়মিত প্রিমিয়ার ও প্রথম বিভাগ টুর্নামেন্ট আয়োজন করা হবে। মাঠে বিপুলসংখ্যক দর্শকের উপস্থিতি ম্যাচকে আরও প্রাণবন্ত করে তুলেছে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'শেখ আবু নাসের স্টেডিয়ামে প্রথম দিনের উদ্বোধনী ম্যাচ',
    categoryId: 'cat-sports',
    categoryName: 'খেলাধুলা',
    authorId: 'auth-1',
    authorName: 'তারিকুল ইসলাম',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: true,
    priority: 6,
    viewCount: 89400,
    likeCount: 8750,
    shareCount: 4320,
    tags: ['ক্রিকেট', 'শেখ আবু নাসের স্টেডিয়াম', 'খুলনা খেলাধুলা', 'বিসিবি'],
    publishedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    seo: {
      seoTitle: 'শেখ আবু নাসের স্টেডিয়ামে ক্রিকেট লিগ শুরু | খুলনা নিউজ',
      metaDescription: 'খুলনা শেখ আবু নাসের স্টেডিয়ামে প্রথম বিভাগ ক্রিকেট লিগের জমকালো উদ্বোধন।',
      focusKeywords: ['খুলনা ক্রিকেট', 'আবু নাসের স্টেডিয়াম', 'খেলাধুলা']
    },
    allowComments: true
  },
  {
    id: 'news-7',
    title: 'খুলনা বিভাগে চিংড়ি রপ্তানিতে নতুন মান নিয়ন্ত্রণ ল্যাবরেটরি উদ্বোধন',
    subTitle: 'ইউরোপীয় ইউনিয়নের কঠোর মানদণ্ডে উত্তীর্ণ হয়ে বাড়ছে সাদা সোনাখ্যাত গলদা ও বাগদা চিংড়ির কদর',
    slug: 'khulna-shrimp-export-quality-control-lab',
    summary: 'খুলনা বিভাগের মৎস্যচাষী ও রপ্তানিকারকদের জন্য আন্তর্জাতিক মানের সেন্ট্রাল কোয়ালিটি কন্ট্রোল ল্যাবরেটরি চালু করা হয়েছে।',
    content: `
      <p>দক্ষিণাঞ্চলের অন্যতম প্রধান রপ্তানি খাত হিমায়িত চিংড়ি শিল্পের প্রসারে খুলনা নগরীতে স্থাপিত হলো অত্যাধুনিক অ্যাক্রেডিটেড টেস্টিং ল্যাব। এর ফলে স্থানীয়ভাবে পরীক্ষার রিপোর্ট পাওয়া যাবে মাত্র ২৪ ঘণ্টায়।</p>
      <p>মৎস্য অধিদপ্তর ও বাংলাদেশ ফ্রোজেন ফুডস এক্সপোর্টার্স অ্যাসোসিয়েশনের যৌথ উদ্যোগে এই প্রকল্প বাস্তবায়িত হয়েছে, যা বৈশ্বিক বাজারে বাংলাদেশি চিংড়ির গ্রহণযোগ্যতা আরও সুদৃঢ় করবে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1559742811-822863ccbaee?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'খুলনার হিমায়িত চিংড়ি প্রক্রিয়াজাতকরণ ও মান নিয়ন্ত্রণ ইউনিট',
    categoryId: 'cat-business',
    categoryName: 'ব্যবসা-বাণিজ্য',
    authorId: 'auth-3',
    authorName: 'কাওসার আহমেদ',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,
    priority: 7,
    viewCount: 38200,
    likeCount: 2980,
    shareCount: 1410,
    tags: ['চিংড়ি শিল্প', 'রপ্তানি', 'খুলনা বাণিজ্য', 'মৎস্য'],
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    seo: {
      seoTitle: 'খুলনায় চিংড়ি রপ্তানির আধুনিক মান নিয়ন্ত্রণ ল্যাব | খুলনা নিউজ',
      metaDescription: 'খুলনায় চালু হলো চিংড়ি ও মৎস্য রপ্তানির আন্তর্জাতিক মানদণ্ড ল্যাবরেটরি।',
      focusKeywords: ['খুলনা চিংড়ি', 'হিমায়িত মৎস্য', 'ব্যবসা']
    },
    allowComments: true
  },
  {
    id: 'news-8',
    title: 'ডিজিটাল রূপান্তরে এগিয়ে খুলনা সিটি করপোরেশন: এবার মিলবে ১০০% অনলাইন নাগরিক সেবা',
    subTitle: 'ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স ও জন্ম-মৃত্যু নিবন্ধন এখন সম্পূর্ণ ডিজিটাল প্ল্যাটফর্মে',
    slug: 'kcc-digital-citizen-services-online-portal',
    summary: 'খুলনা সিটি করপোরেশনের নাগরিক সেবাকে সম্পূর্ণ কাগজবিহীন ও দ্রুততর করতে স্মার্ট কেসিসি অ্যাপ ও ওয়েব পোর্টাল উদ্বোধন করা হয়েছে।',
    content: `
      <p>খুলনা মহানগরীর বাসিন্দারা এখন ঘরে বসেই হোল্ডিং ট্যাক্স পরিশোধ, নতুন ট্রেড লাইসেন্স আবেদন এবং সকল ধরনের নাগরিক সনদ ডাউনলোড করতে পারবেন। কোনো দাপ্তরিক ভিড় বা দালালদের হয়রানি ছাড়াই স্বয়ংক্রিয়ভাবে সেবা পাওয়া যাবে।</p>
      <p>সিটি কর্পোরেশন কর্তৃপক্ষ জানিয়েছে, অনলাইন অভিযোগ প্রতিকার ব্যবস্থা চালুর মাধ্যমে নাগরিকরা সরাসরি ড্রেনেজ, সড়ক বা বাতি সংক্রান্ত সমস্যা তুলে ধরতে পারবেন।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'খুলনা সিটি করপোরেশন ভবন ও ডিজিটাল সেবা কেন্দ্র',
    categoryId: 'cat-national',
    categoryName: 'জাতীয়',
    authorId: 'auth-1',
    authorName: 'তারিকুল ইসলাম',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,
    priority: 8,
    viewCount: 52100,
    likeCount: 4230,
    shareCount: 1980,
    tags: ['খুলনা সিটি করপোরেশন', 'ডিজিটাল বাংলাদেশ', 'নাগরিক সেবা'],
    publishedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    seo: {
      seoTitle: 'খুলনা সিটি করপোরেশনের ১০০% ডিজিটাল সেবা | খুলনা নিউজ',
      metaDescription: 'ঘরে বসেই মিলবে কেসিসির সকল অনলাইন নাগরিক সেবা।',
      focusKeywords: ['কেসিসি', 'খুলনা সিটি করপোরেশন', 'অনলাইন সেবা']
    },
    allowComments: true
  },
  {
    id: 'news-9',
    title: 'খুলনা মেডিকেল কলেজ হাসপাতালে বিশেষায়িত ক্যানসার সেন্টারে চিকিৎসা সেবা শুরু',
    subTitle: 'দক্ষিণ-পশ্চিমাঞ্চলের লাখো রোগীর জন্য সুলভ ও আধুনিক রেডিওথেরাপির দ্বার উন্মোচন',
    slug: 'khulna-medical-college-hospital-cancer-center',
    summary: 'খুলনা মেডিকেল কলেজ হাসপাতালে ১০০ শয্যার পূর্ণাঙ্গ ক্যানসার কেয়ার ইউনিট আনুষ্ঠানিকভাবে কার্যক্রম শুরু করেছে।',
    content: `
      <p>খুলনা ও পার্শ্ববর্তী জেলার ক্যানসার রোগীদের চিকিৎসা নিতে আর দূরদূরান্তে ছুটতে হবে না। খুলনা মেডিকেল কলেজ হাসপাতালের নবনির্মিত বিশেষায়িত ক্যানসার ভবনে আধুনিক লিনিয়ার এক্সিলারেটর রেডিওথেরাপি মেশিন স্থাপন করা হয়েছে।</p>
      <p>হাসপাতালের পরিচালক জানান, বিশেষজ্ঞ অনকোলজিস্ট ও নার্সদের সমন্বয়ে প্রতিদিন বহির্বিভাগ ও অন্তর্বিভাগে রোগীদের বিশ্বমানের সেবা প্রদান করা হচ্ছে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'খুলনা মেডিকেল কলেজ হাসপাতাল প্রাঙ্গণ',
    categoryId: 'cat-health',
    categoryName: 'স্বাস্থ্য',
    authorId: 'auth-2',
    authorName: 'নুসরাত জাহান',
    status: 'published',
    isFeatured: true,
    isTopNews: false,
    isBreaking: false,
    isTrending: true,
    priority: 9,
    viewCount: 71500,
    likeCount: 6840,
    shareCount: 3450,
    tags: ['খুলনা মেডিকেল', 'স্বাস্থ্যসেবা', 'ক্যান্সার ইউনিট', 'খুলনা'],
    publishedAt: new Date(Date.now() - 3600000 * 32).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    seo: {
      seoTitle: 'খুলনা মেডিকেল কলেজ হাসপাতালে ক্যান্সার সেন্টার চালু | খুলনা নিউজ',
      metaDescription: 'খুলনা মেডিকেল কলেজ হাসপাতালে ১০০ শয্যার আধুনিক ক্যান্সার সেন্টারে সেবা শুরু।',
      focusKeywords: ['খুলনা মেডিকেল', 'ক্যান্সার চিকিৎসা', 'খুলনা স্বাস্থ্য']
    },
    allowComments: true
  },
  {
    id: 'news-10',
    title: 'সুন্দরবনের খাঁটি মধু আহরণে এ বছর রেকর্ড সাফল্য, মৌয়ালদের মুখে আনন্দের হাসি',
    subTitle: 'বন বিভাগের বিশেষ নিরাপত্তা ও ন্যায্য মূল্য নিশ্চিতকরণে প্রাণ ফিরে পেল উপকূলের মৌয়াল সমাজ',
    slug: 'sundarban-honey-harvest-record-mouals',
    summary: 'সুন্দরবন পশ্চিম ও পূর্ব বন বিভাগ থেকে সংগৃহীত খাঁটি পদ্ম ও খলিসা ফুলের মধুর ফলন এ বছর বিগত পাঁচ বছরের রেকর্ড ছাড়িয়ে গেছে।',
    content: `
      <p>চলতি মধু মৌসুমে সুন্দরবনে মৌয়ালরা প্রায় আড়াই হাজার কুইন্টাল খাঁটি মধু সংগ্রহ করেছেন। বন বিভাগের উদ্যোগে সরাসরি মৌয়ালদের কাছ থেকে মধু কিনে সরকার নির্ধারিত মূল্যে সরবরাহের উদ্যোগ নেওয়ায় মধ্যস্বত্বভোগীদের দৌরাত্ম্য বন্ধ হয়েছে।</p>
      <p>বন কর্মকর্তারা জানান, সুন্দরবনের মিষ্টি পানির অঞ্চলগুলোতে খলিসা ও গরাণ ফুলের প্রাচুর্যের কারণে মধুর গুণমান অত্যন্ত উৎকৃষ্ট হয়েছে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'সুন্দরবনে মধু সংগ্রহরত মৌয়াল দল',
    categoryId: 'cat-khulna',
    categoryName: 'খুলনা',
    authorId: 'auth-1',
    authorName: 'তারিকুল ইসলাম',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,
    priority: 10,
    viewCount: 63400,
    likeCount: 5410,
    shareCount: 2690,
    tags: ['সুন্দরবন', 'মধু সংগ্রহ', 'মৌয়াল', 'পরিবেশ', 'খুলনা'],
    publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 25).toISOString(),
    seo: {
      seoTitle: 'সুন্দরবনের খাঁটি মধু আহরণে রেকর্ড | খুলনা নিউজ',
      metaDescription: 'সুন্দরবনের মধু আহরণে এ বছর রেকর্ড সাফল্য পেয়েছেন উপকূলের মৌয়ালরা।',
      focusKeywords: ['সুন্দরবনের মধু', 'মৌয়াল', 'খুলনা সংবাদ']
    },
    allowComments: true
  },
  {
    id: 'news-11',
    title: 'দক্ষিণ-পশ্চিমাঞ্চলের লবণাক্ত জমিতে ব্রি উদ্ভাবিত নতুন জাতের ধানের বাম্পার ফলন',
    subTitle: 'খুলনা ও সাতক্ষীরার উপকূলীয় কৃষিতে বিপ্লব ঘটিয়েছে লবণাক্ততা সহনশীল ব্রি ধান-৯৭ ও ৯৯',
    slug: 'saline-tolerant-bri-rice-harvest-khulna',
    summary: 'বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (ব্রি) উদ্ভাবিত লবণাক্ত সহনশীল বোরো ধানের আবাদে উপকূলের অনাবাদি জমিতে সোনালী হাসির জোয়ার।',
    content: `
      <p>উপকূলীয় খুলনা ও সাতক্ষীরা জেলার নদীর লবণাক্ত পানি বৃদ্ধি পাওয়া অঞ্চলে যেখানে আগে কোনো ফসল হতো না, সেখানে এখন ব্রি-৯৭ ও ব্রি-৯৯ ধানের বাম্পার ফলন হয়েছে। হেক্টর প্রতি গড় ফলন দাঁড়িয়েছে ৭ মেট্রিক টনেরও বেশি।</p>
      <p>কৃষি সম্প্রসারণ অধিদপ্তরের কর্মকর্তারা জানান, জলবায়ু পরিবর্তনের অভিঘাত মোকাবিলায় এই জাতের ধান দক্ষিণ-পশ্চিমাঞ্চলের খাদ্য নিরাপত্তা নিশ্চিত করতে অগ্রণী ভূমিকা রাখছে।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'খুলনার দাকোপে সোনালী ধানের ক্ষেত',
    categoryId: 'cat-economy',
    categoryName: 'অর্থনীতি',
    authorId: 'auth-3',
    authorName: 'কাওসার আহমেদ',
    status: 'published',
    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,
    priority: 11,
    viewCount: 45700,
    likeCount: 3760,
    shareCount: 1820,
    tags: ['কৃষি', 'ধান গবেষণা', 'লবণাক্ততা সহনশীল ধান', 'খুলনা'],
    publishedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    seo: {
      seoTitle: 'লবণাক্ত জমিতে ব্রি উদ্ভাবিত ধানের বাম্পার ফলন | খুলনা নিউজ',
      metaDescription: 'খুলনার উপকূলীয় লবণাক্ত জমিতে ব্রি উদ্ভাবিত ধানের বাম্পার ফলনে কৃষকের মুখে হাসি।',
      focusKeywords: ['ব্রি ধান', 'উপকূলীয় কৃষি', 'খুলনা অর্থনীতি']
    },
    allowComments: true
  },
  {
    id: 'news-12',
    title: 'খুলনা বিশ্ববিদ্যালয়ের শিক্ষার্থীদের উদ্ভাবনী সৌর কৃষি ড্রোন আন্তর্জাতিক জার্নালে প্রশংসিত',
    subTitle: 'স্বল্প খরচে মাটির স্বাস্থ্য পরীক্ষা ও স্মার্ট সেচ পরিচালনায় নতুন মাইলফলক',
    slug: 'khulna-university-ku-solar-agri-drone',
    summary: 'খুলনা বিশ্ববিদ্যালয়ের ইলেকট্রনিক্স অ্যান্ড কমিউনিকেশন ইঞ্জিনিয়ারিং বিভাগের একদল গবেষক শিক্ষার্থীদের উদ্ভাবিত সৌর ড্রোন বৈশ্বিক স্বীকৃতি অর্জন করেছে।',
    content: `
      <p>কৃষিক্ষেত্রে উৎপাদনশীলতা বাড়াতে এবং প্রান্তিক কৃষকের খরচ অর্ধেকে নামিয়ে আনতে বিশেষায়িত 'স্মার্ট সৌর ড্রোন' তৈরি করেছেন খুলনা বিশ্ববিদ্যালয়ের (খুবি) তরুণ শিক্ষার্থীরা। স্বনামধন্য আন্তর্জাতিক বিজ্ঞান সাময়িকীতে তাদের এই উদ্ভাবন স্থান পেয়েছে।</p>
      <p>ড্রোনটি মাটির আর্দ্রতা, ক্ষতিকর পোকার আক্রমণ এবং পুষ্টি ঘাটতি তাৎক্ষণিক কৃত্রিম বুদ্ধিমত্তার মাধ্যমে শনাক্ত করতে সক্ষম।</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'খুবি ক্যাম্পাসে পরীক্ষামূলক ড্রোন উড্ডয়ন',
    categoryId: 'cat-education',
    categoryName: 'শিক্ষা',
    authorId: 'auth-2',
    authorName: 'নুসরাত জাহান',
    status: 'published',
    isFeatured: true,
    isTopNews: false,
    isBreaking: false,
    isTrending: true,
    priority: 12,
    viewCount: 59800,
    likeCount: 5120,
    shareCount: 2740,
    tags: ['খুলনা বিশ্ববিদ্যালয়', 'কৃষি ড্রোন', 'বিজ্ঞান ও গবেষণা', 'শিক্ষা'],
    publishedAt: new Date(Date.now() - 3600000 * 44).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    seo: {
      seoTitle: 'খুলনা বিশ্ববিদ্যালয়ের উদ্ভাবনী সৌর ড্রোন | খুলনা নিউজ',
      metaDescription: 'খুবি শিক্ষার্থীদের তৈরি সৌর ড্রোন কৃষি ক্ষেত্রে আন্তর্জাতিক স্বীকৃতি অর্জন করেছে।',
      focusKeywords: ['খুলনা বিশ্ববিদ্যালয়', 'ড্রোন প্রযুক্তি', 'খুলনা শিক্ষা']
    },
    allowComments: true
  }
];

export const DEFAULT_AD_SLOTS: AdSlot[] = [
  {
    id: 'ad-header-banner',
    name: 'Header Banner (728x90 / Responsive)',
    position: 'HEADER_BANNER',
    isActive: true,
    adCode: `<div class="w-full h-full bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center p-3 text-center border border-dashed border-red-200 dark:border-slate-700 rounded-xl"><span class="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 tracking-wider">বিজ্ঞাপন স্লট / Adsterra Banner (728x90)</span></div>`,
    mobileCode: `<div class="w-full bg-slate-100 dark:bg-slate-800 p-2 text-center text-[10px] text-slate-500 rounded border border-dashed border-slate-300 dark:border-slate-700">Adsterra Mobile 320x50 Banner Slot</div>`,
    priority: 1,
    adsterraType: 'banner'
  },
  {
    id: 'ad-homepage-top',
    name: 'Homepage Top Banner',
    position: 'HOMEPAGE_TOP',
    isActive: true,
    adCode: `<div class="w-full py-4 bg-slate-50 dark:bg-slate-800/60 rounded border border-dashed border-slate-300 dark:border-slate-700 text-center"><span class="text-[10px] font-semibold text-slate-400">বিজ্ঞাপন (Adsterra 970x90 / Leaderboard)</span><p class="text-sm font-bold text-red-600 mt-1">খুলনার যেকোনো ব্যবসার ডিজিটাল প্রচারণায় খুলনা নিউজ নির্ভরযোগ্য পার্টনার</p></div>`,
    priority: 2,
    adsterraType: 'banner'
  },
  {
    id: 'ad-homepage-middle',
    name: 'Homepage Middle Banner',
    position: 'HOMEPAGE_MIDDLE',
    isActive: true,
    adCode: `<div class="w-full py-6 bg-slate-50 dark:bg-slate-800/80 rounded border border-dashed border-slate-300 dark:border-slate-700 text-center"><span class="text-[10px] font-semibold text-slate-400">Adsterra Native / Banner (Middle Section)</span><p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Admin Panel থেকে Adsterra Code প্রতিস্থাপন করুন</p></div>`,
    priority: 3,
    adsterraType: 'native'
  },
  {
    id: 'ad-sidebar-top',
    name: 'Sidebar Top Square (300x250)',
    position: 'SIDEBAR_TOP',
    isActive: true,
    adCode: `<div class="w-full h-[250px] bg-slate-100 dark:bg-slate-800/90 rounded border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center"><span class="text-[10px] uppercase font-bold text-red-500">Adsterra 300x250</span><p class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">স্পন্সরড বিজ্ঞাপন</p><p class="text-xs text-slate-500 mt-1">আপনার ব্র্যান্ডকে পৌঁছে দিন লাখো পাঠকের কাছে</p></div>`,
    priority: 4,
    adsterraType: 'banner'
  },
  {
    id: 'ad-sidebar-middle',
    name: 'Sidebar Middle Banner',
    position: 'SIDEBAR_MIDDLE',
    isActive: true,
    adCode: `<div class="w-full h-[250px] bg-slate-100 dark:bg-slate-800/90 rounded border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center"><span class="text-[10px] uppercase font-bold text-slate-400">Adsterra Sidebar 300x250</span></div>`,
    priority: 5,
    adsterraType: 'banner'
  },
  {
    id: 'ad-article-top',
    name: 'Article Top Banner',
    position: 'ARTICLE_TOP',
    isActive: true,
    adCode: `<div class="w-full py-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-dashed border-slate-200 dark:border-slate-700 text-center"><span class="text-[9px] font-bold text-slate-400">বিজ্ঞাপন (Article Top)</span></div>`,
    priority: 6,
    adsterraType: 'banner'
  },
  {
    id: 'ad-article-middle',
    name: 'Article Middle Banner',
    position: 'ARTICLE_MIDDLE',
    isActive: true,
    adCode: `<div class="w-full py-4 my-6 bg-slate-50 dark:bg-slate-800/50 rounded border border-dashed border-slate-200 dark:border-slate-700 text-center"><span class="text-[9px] font-bold text-slate-400">বিজ্ঞাপন (Article Inline / Native Ad)</span></div>`,
    priority: 7,
    adsterraType: 'native'
  },
  {
    id: 'ad-article-bottom',
    name: 'Article Bottom Banner',
    position: 'ARTICLE_BOTTOM',
    isActive: true,
    adCode: `<div class="w-full py-3 mt-4 bg-slate-50 dark:bg-slate-800/50 rounded border border-dashed border-slate-200 dark:border-slate-700 text-center"><span class="text-[9px] font-bold text-slate-400">বিজ্ঞাপন (Article Bottom)</span></div>`,
    priority: 8,
    adsterraType: 'banner'
  },
  {
    id: 'ad-social-bar',
    name: 'Adsterra Social Bar',
    position: 'SOCIAL_BAR',
    isActive: false,
    adCode: `<!-- Adsterra Social Bar Code Here -->`,
    priority: 9,
    adsterraType: 'social_bar'
  },
  {
    id: 'ad-popunder',
    name: 'Adsterra Popunder',
    position: 'POPUNDER',
    isActive: false,
    adCode: `<!-- Adsterra Popunder Script Here -->`,
    priority: 10,
    adsterraType: 'popunder'
  }
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: 'sec-hero', type: 'hero', newsCount: 5, layout: 'featured_with_list', order: 1, isVisible: true },
  { id: 'sec-ad-top', type: 'ad_banner', newsCount: 0, layout: 'grid', order: 2, isVisible: true },
  { id: 'sec-khulna', type: 'category', title: 'খুলনা বিভাগ', categoryId: 'cat-khulna', newsCount: 4, layout: 'bento', order: 3, isVisible: true },
  { id: 'sec-latest', type: 'latest', title: 'সর্বশেষ খবর', newsCount: 6, layout: 'grid', order: 4, isVisible: true },
  { id: 'sec-national', type: 'category', title: 'জাতীয় সংবাদ', categoryId: 'cat-national', newsCount: 4, layout: 'grid', order: 5, isVisible: true },
  { id: 'sec-ad-mid', type: 'ad_banner', newsCount: 0, layout: 'grid', order: 6, isVisible: true },
  { id: 'sec-economy', type: 'category', title: 'অর্থনীতি ও বাণিজ্য', categoryId: 'cat-economy', newsCount: 3, layout: 'list', order: 7, isVisible: true },
  { id: 'sec-tech-sports', type: 'category', title: 'প্রযুক্তি ও উদ্ভাবন', categoryId: 'cat-tech', newsCount: 3, layout: 'grid', order: 8, isVisible: true },
  { id: 'sec-sports', type: 'category', title: 'খেলাধুলা', categoryId: 'cat-sports', newsCount: 3, layout: 'grid', order: 9, isVisible: true }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  websiteName: 'খুলনা নিউজ ২৪',
  englishBrandName: 'Khulna News 24',
  tagline: 'খুলনা ও ১০ জেলার সর্বশেষ খবর',
  logoText: 'খুলনা নিউজ ২৪',
  logoUrl: '',
  faviconUrl: '',
  phone: '01306721743',
  whatsapp: '01907655994',
  email: 'worldbusiness677@gmail.com',
  address: '',
  editorName: 'তারিকুল ইসলাম',
  publisherName: 'খুলনা নিউজ মিডিয়া লিমিটেড',
  facebookUrl: '',
  youtubeUrl: '',
  telegramUrl: '',
  twitterUrl: '',
  footerAbout: '‘খুলনা নিউজ ২৪’ খুলনা বিভাগ ও দক্ষিণ-পশ্চিমাঞ্চল সহ সমগ্র বাংলাদেশের বস্তুনিষ্ঠ, দ্রুত ও নির্ভরযোগ্য সংবাদ পৌঁছে দেওয়ার অঙ্গীকারে নিবেদিত একটি আধুনিক ডিজিটাল সংবাদ মাধ্যম। খুলনার ১০ জেলার রাজনীতি, অর্থনীতি, পর্যটন, স্থানীয় উন্নয়ন ও জনজীবনের বিশ্বস্ত প্রতিচ্ছবি।',
  copyrightText: '© ২০২৬ খুলনা নিউজ ২৪ (Khulna News 24)। সর্বস্বত্ব সংরক্ষিত। অনুমতি ছাড়া এই ওয়েবসাইটের কোনো লেখা বা ছবি অন্য কোথাও প্রকাশ আইনত দণ্ডনীয়।',
  googleAnalyticsId: 'G-KHULNA2026',
  searchConsoleVerification: 'google-site-verification=khulna_news_portal_verification_code',
  defaultSeoTitle: 'খুলনা নিউজ ২৪ | খুলনা ও ১০ জেলার সর্বশেষ খবর',
  defaultMetaDescription: 'খুলনা নিউজ ২৪ | খুলনা ও খুলনা বিভাগের ১০ জেলার সর্বশেষ তাজা খবর, ব্রেকিং নিউজ, স্থানীয় সংবাদ, রাজনীতি ও জনজীবনের বস্তুনিষ্ঠ বিশ্লেষণ।',
  defaultSocialImage: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80',
  breakingNewsEnabled: true,
  commentsAutoApprove: false,
  adsterraGlobalCode: ''
};

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-superadmin',
    username: 'admin',
    email: 'admin@khulnanews.com',
    name: 'Super Administrator',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user-editor',
    username: 'editor',
    email: 'editor@khulnanews.com',
    name: 'Senior News Editor',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user-reporter',
    username: 'reporter',
    email: 'reporter@khulnanews.com',
    name: 'Staff Reporter',
    role: 'reporter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  }
];

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Khulna Mongla Rail Track',
    url: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80',
    altText: 'খুলনা-মোংলা রেলপথ',
    caption: 'খুলনা মোংলা রেলপথ ও মালবাহী ট্রেন',
    fileSize: '420 KB',
    dimensions: '1200x800',
    uploadedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'media-2',
    title: 'Sundarban Forest Wildlife',
    url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80',
    altText: 'সুন্দরবনের জীববৈচিত্র্য ও বন্যপ্রাণী',
    caption: 'সুন্দরবনের গভীর অরণ্য',
    fileSize: '380 KB',
    dimensions: '1000x667',
    uploadedAt: '2026-09-01T11:30:00.000Z'
  },
  {
    id: 'media-3',
    title: 'Mongla Sea Port Cargo',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    altText: 'মোংলা সমুদ্র বন্দর',
    caption: 'মোংলা বন্দর টার্মিনাল',
    fileSize: '290 KB',
    dimensions: '800x533',
    uploadedAt: '2026-09-01T14:15:00.000Z'
  }
];

export const VERSION_HISTORY = [
  {
    version: '1.0.0-PROD',
    date: '2026-09-02',
    summary: 'Initial Full-Stack Production Release for Khulna News (খুলনা নিউজ)',
    changedFiles: [
      'src/types/index.ts',
      'src/config/constants.ts',
      'src/services/storage.ts',
      'src/services/seo.ts',
      'src/context/NewsContext.tsx',
      'src/admin/*',
      'src/components/*',
      'src/pages/*'
    ]
  }
];
