import { useState, useEffect } from 'react';

// Multilingual labels interface
export interface LanguageLabels {
  views: string;
  likes: string;
  shares: string;
  breaking: string;
  latestNews: string;
  trending: string;
  top5: string;
  viewAll: string;
  relatedNews: string;
  newsDesk: string;
  khulna: string;
  bangladesh: string;
  searchPlaceholder: string;
  searchTitle: string;
  searchButton: string;
  noResults: string;
  readMore: string;
  authorArticles: string;
  shareArticle: string;
  copyLink: string;
  linkCopied: string;
  cms: string;
  login: string;
  lightMode: string;
  darkMode: string;
  home: string;
  archive: string;
  about: string;
  contact: string;
  privacy: string;
  topStories: string;
  allNews: string;
  categories: string;
  moreNews: string;
  like: string; liked: string; share: string; facebook: string; whatsapp: string; telegram: string; copy: string; copied: string; print: string; back: string; tags: string;
}

export const LANGUAGE_DICTIONARY: Record<string, LanguageLabels> = {
  bn: {
    views: 'ভিউ',
    likes: 'লাইক',
    shares: 'শেয়ার',
    breaking: 'ব্রেকিং',
    latestNews: 'সর্বশেষ খবর',
    trending: 'সর্বাধিক পঠিত / ট্রেন্ডিং',
    top5: 'শীর্ষ ৫',
    viewAll: 'সব দেখুন',
    relatedNews: 'সম্পর্কিত আরও খবর',
    newsDesk: 'বার্তা বিভাগ',
    khulna: 'খুলনা',
    bangladesh: 'বাংলাদেশ',
    searchPlaceholder: 'সংবাদ খুঁজুন...',
    searchTitle: 'সংবাদ অনুসন্ধান',
    searchButton: 'খুঁজুন',
    noResults: 'কোনো সংবাদ পাওয়া যায়নি',
    readMore: 'সম্পূর্ণ পড়ুন',
    authorArticles: 'লেখকের সব প্রতিবেদন দেখুন →',
    shareArticle: 'শেয়ার করুন',
    copyLink: 'লিংক কপি',
    linkCopied: 'লিংক কপি হয়েছে!',
    cms: 'সিএমএস',
    login: 'লগইন',
    lightMode: 'লাইট',
    darkMode: 'ডার্ক',
    home: 'প্রচ্ছদ',
    archive: 'আর্কাইভ',
    about: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    privacy: 'গোপনীয়তা নীতি',
    topStories: 'শীর্ষ সংবাদ',
    allNews: 'সকল সংবাদ',
    categories: 'সংবাদ বিভাগসমূহ',
    moreNews: 'আরও খবর',    like:'লাইক', liked:'পছন্দ হয়েছে', share:'শেয়ার', facebook:'ফেসবুক', whatsapp:'হোয়াটসঅ্যাপ', telegram:'টেলিগ্রাম', copy:'লিংক', copied:'কপি হয়েছে', print:'প্রিন্ট', back:'ফিরে যান', tags:'ট্যাগস'
  },
  en: {
    views: 'Views',
    likes: 'Likes',
    shares: 'Shares',
    breaking: 'BREAKING',
    latestNews: 'Latest News',
    trending: 'Most Read / Trending',
    top5: 'Top 5',
    viewAll: 'View All',
    relatedNews: 'Related News',
    newsDesk: 'News Desk',
    khulna: 'Khulna',
    bangladesh: 'Bangladesh',
    searchPlaceholder: 'Search news...',
    searchTitle: 'Search News',
    searchButton: 'Search',
    noResults: 'No news found',
    readMore: 'Read More',
    authorArticles: 'View all reports by author →',
    shareArticle: 'Share',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
    cms: 'CMS',
    login: 'Login',
    lightMode: 'Light',
    darkMode: 'Dark',
    home: 'Home',
    archive: 'Archive',
    about: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    topStories: 'Top Stories',
    allNews: 'All News',
    categories: 'Categories',
    moreNews: 'More News',    like:'Like', liked:'Liked', share:'Share', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Link', copied:'Copied', print:'Print', back:'Back', tags:'Tags'
  },
  hi: {
    views: 'व्यू',
    likes: 'लाइक',
    shares: 'शेयर',
    breaking: 'ब्रेकिंग',
    latestNews: 'ताज़ा समाचार',
    trending: 'सर्वाधिक पढ़े गए / ट्रेंडिंग',
    top5: 'शीर्ष ५',
    viewAll: 'सभी देखें',
    relatedNews: 'संबंधित ख़बरें',
    newsDesk: 'समाचार कक्ष',
    khulna: 'खुलना',
    bangladesh: 'बांग्लादेश',
    searchPlaceholder: 'समाचार खोजें...',
    searchTitle: 'समाचार खोजें',
    searchButton: 'खोजें',
    noResults: 'कोई समाचार नहीं मिला',
    readMore: 'पूरा पढ़ें',
    authorArticles: 'लेखक की सभी रिपोर्ट देखें →',
    shareArticle: 'साझा करें',
    copyLink: 'लिंक कॉपी करें',
    linkCopied: 'लिंक कॉपी हो गया!',
    cms: 'सीएमएस',
    login: 'लॉग इन',
    lightMode: 'लाइट',
    darkMode: 'डार्क',
    home: 'होम',
    archive: 'अभिलेखागार',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    topStories: 'प्रमुख समाचार',
    allNews: 'सभी समाचार',
    categories: 'समाचार श्रेणियाँ',
    moreNews: 'और समाचार',    like:'लाइक', liked:'पसंद आया', share:'शेयर', facebook:'फेसबुक', whatsapp:'व्हाट्सऐप', telegram:'टेलीग्राम', copy:'लिंक', copied:'कॉपी हुआ', print:'प्रिंट', back:'वापस', tags:'टैग'
  },
  ar: {
    views: 'مشاهدات',
    likes: 'إعجابات',
    shares: 'مشاركات',
    breaking: 'عاجل',
    latestNews: 'آخر الأخبار',
    trending: 'الأكثر قراءة / شائعة',
    top5: 'أفضل ٥',
    viewAll: 'عرض الكل',
    relatedNews: 'أخبار ذات صلة',
    newsDesk: 'قسم الأخبار',
    khulna: 'خولنا',
    bangladesh: 'بنغلاديش',
    searchPlaceholder: 'ابحث عن الأخبار...',
    searchTitle: 'بحث الأخبار',
    searchButton: 'بحث',
    noResults: 'لم يتم العثور على أخبار',
    readMore: 'اقرأ المزيد',
    authorArticles: 'عرض جميع تقارير الكاتب ←',
    shareArticle: 'مشاركة',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط!',
    cms: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    lightMode: 'نهاري',
    darkMode: 'ليلي',
    home: 'الرئيسية',
    archive: 'الأرشيف',
    about: 'من نحن',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    topStories: 'أبرز الأخبار',
    allNews: 'كل الأخبار',
    categories: 'الأقسام',
    moreNews: 'مزيد من الأخبار',    like:'إعجاب', liked:'تم الإعجاب', share:'مشاركة', facebook:'فيسبوك', whatsapp:'واتساب', telegram:'تيليجرام', copy:'رابط', copied:'تم النسخ', print:'طباعة', back:'رجوع', tags:'الوسوم'
  },
  ur: {
    views: 'مناظر',
    likes: 'پسند',
    shares: 'شیئر',
    breaking: 'بریکنگ',
    latestNews: 'تازہ ترین خبریں',
    trending: 'سب سے زیادہ پڑھی جانے والی',
    top5: 'ٹاپ ۵',
    viewAll: 'سب دیکھیں',
    relatedNews: 'متعلقہ خبریں',
    newsDesk: 'نیوز ڈیسک',
    khulna: 'کھلنا',
    bangladesh: 'بنگلہ دیش',
    searchPlaceholder: 'خبریں تلاش کریں...',
    searchTitle: 'خبریں تلاش کریں',
    searchButton: 'تلاش',
    noResults: 'کوئی خبر نہیں ملی',
    readMore: 'مزید پڑھیں',
    authorArticles: 'مصنف کی تمام رپورٹس دیکھیں ←',
    shareArticle: 'شیئر کریں',
    copyLink: 'لنک کاپی کریں',
    linkCopied: 'لنک کاپی ہو گیا!',
    cms: 'سی ایم ایس',
    login: 'لاگ ان',
    lightMode: 'لائٹ',
    darkMode: 'ڈارک',
    home: 'صفحہ اول',
    archive: 'آرکائیو',
    about: 'ہمارے بارے میں',
    contact: 'رابطہ',
    privacy: 'پرائیویسی پالیسی',
    topStories: 'اہم خبریں',
    allNews: 'تمام خبریں',
    categories: 'اقسام',
    moreNews: 'مزید خبریں',    like:'پسند', liked:'پسند کیا', share:'شیئر', facebook:'فیس بک', whatsapp:'واٹس ایپ', telegram:'ٹیلیگرام', copy:'لنک', copied:'کاپی ہوگیا', print:'پرنٹ', back:'واپس', tags:'ٹیگز'
  },
  es: {
    views: 'Vistas',
    likes: 'Me gusta',
    shares: 'Compartidos',
    breaking: 'ÚLTIMA HORA',
    latestNews: 'Últimas Noticias',
    trending: 'Más Leídas / Tendencias',
    top5: 'Top 5',
    viewAll: 'Ver Todo',
    relatedNews: 'Noticias Relacionadas',
    newsDesk: 'Mesa de Redacción',
    khulna: 'Khulna',
    bangladesh: 'Bangladés',
    searchPlaceholder: 'Buscar noticias...',
    searchTitle: 'Buscar Noticias',
    searchButton: 'Buscar',
    noResults: 'No se encontraron noticias',
    readMore: 'Leer más',
    authorArticles: 'Ver todos los artículos del autor →',
    shareArticle: 'Compartir',
    copyLink: 'Copiar enlace',
    linkCopied: '¡Enlace copiado!',
    cms: 'CMS',
    login: 'Acceso',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    home: 'Inicio',
    archive: 'Archivo',
    about: 'Nosotros',
    contact: 'Contacto',
    privacy: 'Privacidad',
    topStories: 'Noticias Principales',
    allNews: 'Todas las noticias',
    categories: 'Categorías',
    moreNews: 'Más Noticias',    like:'Me gusta', liked:'Me gusta', share:'Compartir', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Enlace', copied:'Copiado', print:'Imprimir', back:'Volver', tags:'Etiquetas'
  },
  fr: {
    views: 'Vues',
    likes: "J'aime",
    shares: 'Partages',
    breaking: 'URGENT',
    latestNews: 'Dernières Nouvelles',
    trending: 'Les plus lus / Tendances',
    top5: 'Top 5',
    viewAll: 'Voir tout',
    relatedNews: 'Articles Connexes',
    newsDesk: 'Rédaction',
    khulna: 'Khulna',
    bangladesh: 'Bangladesh',
    searchPlaceholder: 'Rechercher des actualités...',
    searchTitle: 'Rechercher',
    searchButton: 'Rechercher',
    noResults: 'Aucune nouvelle trouvée',
    readMore: 'Lire la suite',
    authorArticles: "Voir tous les articles de l'auteur →",
    shareArticle: 'Partager',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié !',
    cms: 'CMS',
    login: 'Connexion',
    lightMode: 'Clair',
    darkMode: 'Sombre',
    home: 'Accueil',
    archive: 'Archives',
    about: 'À propos',
    contact: 'Contact',
    privacy: 'Confidentialité',
    topStories: 'À la une',
    allNews: 'Toutes les actualités',
    categories: 'Catégories',
    moreNews: "Plus d'actualités",    like:'J’aime', liked:'Aimé', share:'Partager', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Lien', copied:'Copié', print:'Imprimer', back:'Retour', tags:'Tags'
  },
  de: {
    views: 'Aufrufe',
    likes: 'Gefällt mir',
    shares: 'Geteilt',
    breaking: 'EILMELDUNG',
    latestNews: 'Neueste Nachrichten',
    trending: 'Meistgelesen / Trends',
    top5: 'Top 5',
    viewAll: 'Alle anzeigen',
    relatedNews: 'Ähnliche Nachrichten',
    newsDesk: 'Redaktion',
    khulna: 'Khulna',
    bangladesh: 'Bangladesch',
    searchPlaceholder: 'Nachrichten suchen...',
    searchTitle: 'Nachrichten suchen',
    searchButton: 'Suchen',
    noResults: 'Keine Nachrichten gefunden',
    readMore: 'Weiterlesen',
    authorArticles: 'Alle Artikel des Autors anzeigen →',
    shareArticle: 'Teilen',
    copyLink: 'Link kopieren',
    linkCopied: 'Link kopiert!',
    cms: 'CMS',
    login: 'Anmelden',
    lightMode: 'Hell',
    darkMode: 'Dunkel',
    home: 'Startseite',
    archive: 'Archiv',
    about: 'Über uns',
    contact: 'Kontakt',
    privacy: 'Datenschutz',
    topStories: 'Top-Themen',
    allNews: 'Alle Nachrichten',
    categories: 'Kategorien',
    moreNews: 'Weitere Nachrichten',    like:'Gefällt mir', liked:'Gefällt mir', share:'Teilen', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Link', copied:'Kopiert', print:'Drucken', back:'Zurück', tags:'Tags'
  },

  'zh-CN': { views:'浏览', likes:'点赞', shares:'分享', breaking:'突发', latestNews:'最新消息', trending:'热门新闻', top5:'热门5条', viewAll:'查看全部', relatedNews:'相关新闻', newsDesk:'新闻编辑部', khulna:'库尔纳', bangladesh:'孟加拉国', searchPlaceholder:'搜索新闻...', searchTitle:'搜索新闻', searchButton:'搜索', noResults:'未找到新闻', readMore:'阅读更多', authorArticles:'查看作者全部报道 →', shareArticle:'分享', copyLink:'复制链接', linkCopied:'链接已复制！', cms:'管理后台', login:'登录', lightMode:'浅色', darkMode:'深色', home:'首页', archive:'归档', about:'关于我们', contact:'联系我们', privacy:'隐私政策', topStories:'头条新闻', allNews:'全部新闻', categories:'新闻分类', moreNews:'更多新闻', like:'点赞', liked:'已点赞', share:'分享', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'链接', copied:'已复制', print:'打印', back:'返回', tags:'标签' },
  ja: { views:'閲覧', likes:'いいね', shares:'シェア', breaking:'速報', latestNews:'最新ニュース', trending:'人気ニュース', top5:'トップ5', viewAll:'すべて見る', relatedNews:'関連記事', newsDesk:'ニュースデスク', khulna:'クルナ', bangladesh:'バングラデシュ', searchPlaceholder:'ニュースを検索...', searchTitle:'ニュース検索', searchButton:'検索', noResults:'ニュースが見つかりません', readMore:'続きを読む', authorArticles:'著者のすべての記事 →', shareArticle:'共有', copyLink:'リンクをコピー', linkCopied:'リンクをコピーしました！', cms:'CMS', login:'ログイン', lightMode:'ライト', darkMode:'ダーク', home:'ホーム', archive:'アーカイブ', about:'概要', contact:'お問い合わせ', privacy:'プライバシー', topStories:'主要ニュース', allNews:'すべてのニュース', categories:'カテゴリ', moreNews:'その他のニュース', like:'いいね', liked:'いいね済み', share:'共有', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'リンク', copied:'コピー済み', print:'印刷', back:'戻る', tags:'タグ' },
  ru: { views:'Просмотры', likes:'Лайки', shares:'Поделились', breaking:'СРОЧНО', latestNews:'Последние новости', trending:'Популярное', top5:'Топ 5', viewAll:'Смотреть все', relatedNews:'Похожие новости', newsDesk:'Редакция', khulna:'Кхулна', bangladesh:'Бангладеш', searchPlaceholder:'Поиск новостей...', searchTitle:'Поиск новостей', searchButton:'Поиск', noResults:'Новости не найдены', readMore:'Читать далее', authorArticles:'Все материалы автора →', shareArticle:'Поделиться', copyLink:'Копировать ссылку', linkCopied:'Ссылка скопирована!', cms:'CMS', login:'Войти', lightMode:'Светлая', darkMode:'Тёмная', home:'Главная', archive:'Архив', about:'О нас', contact:'Контакты', privacy:'Конфиденциальность', topStories:'Главные новости', allNews:'Все новости', categories:'Категории', moreNews:'Больше новостей', like:'Лайк', liked:'Понравилось', share:'Поделиться', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Ссылка', copied:'Скопировано', print:'Печать', back:'Назад', tags:'Теги' },
  pt: { views:'Visualizações', likes:'Curtidas', shares:'Compartilhamentos', breaking:'URGENTE', latestNews:'Últimas Notícias', trending:'Em Alta', top5:'Top 5', viewAll:'Ver tudo', relatedNews:'Notícias relacionadas', newsDesk:'Redação', khulna:'Khulna', bangladesh:'Bangladesh', searchPlaceholder:'Pesquisar notícias...', searchTitle:'Pesquisar notícias', searchButton:'Pesquisar', noResults:'Nenhuma notícia encontrada', readMore:'Ler mais', authorArticles:'Ver todos os artigos do autor →', shareArticle:'Compartilhar', copyLink:'Copiar link', linkCopied:'Link copiado!', cms:'CMS', login:'Entrar', lightMode:'Claro', darkMode:'Escuro', home:'Início', archive:'Arquivo', about:'Sobre nós', contact:'Contato', privacy:'Privacidade', topStories:'Principais notícias', allNews:'Todas as notícias', categories:'Categorias', moreNews:'Mais notícias', like:'Curtir', liked:'Curtido', share:'Compartilhar', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Link', copied:'Copiado', print:'Imprimir', back:'Voltar', tags:'Tags' },
  tr: { views:'Görüntülenme', likes:'Beğeni', shares:'Paylaşım', breaking:'SON DAKİKA', latestNews:'Son Haberler', trending:'Trendler', top5:'İlk 5', viewAll:'Tümünü Gör', relatedNews:'İlgili Haberler', newsDesk:'Haber Merkezi', khulna:'Khulna', bangladesh:'Bangladeş', searchPlaceholder:'Haber ara...', searchTitle:'Haber Ara', searchButton:'Ara', noResults:'Haber bulunamadı', readMore:'Devamını Oku', authorArticles:'Yazarın tüm haberleri →', shareArticle:'Paylaş', copyLink:'Bağlantıyı Kopyala', linkCopied:'Bağlantı kopyalandı!', cms:'CMS', login:'Giriş', lightMode:'Açık', darkMode:'Koyu', home:'Ana Sayfa', archive:'Arşiv', about:'Hakkımızda', contact:'İletişim', privacy:'Gizlilik', topStories:'Öne Çıkan Haberler', allNews:'Tüm Haberler', categories:'Kategoriler', moreNews:'Daha Fazla Haber', like:'Beğen', liked:'Beğenildi', share:'Paylaş', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Bağlantı', copied:'Kopyalandı', print:'Yazdır', back:'Geri', tags:'Etiketler' },
  id: { views:'Dilihat', likes:'Suka', shares:'Dibagikan', breaking:'TERKINI', latestNews:'Berita Terbaru', trending:'Tren', top5:'5 Teratas', viewAll:'Lihat Semua', relatedNews:'Berita Terkait', newsDesk:'Redaksi', khulna:'Khulna', bangladesh:'Bangladesh', searchPlaceholder:'Cari berita...', searchTitle:'Cari Berita', searchButton:'Cari', noResults:'Berita tidak ditemukan', readMore:'Baca selengkapnya', authorArticles:'Lihat semua laporan penulis →', shareArticle:'Bagikan', copyLink:'Salin tautan', linkCopied:'Tautan disalin!', cms:'CMS', login:'Masuk', lightMode:'Terang', darkMode:'Gelap', home:'Beranda', archive:'Arsip', about:'Tentang Kami', contact:'Kontak', privacy:'Privasi', topStories:'Berita Utama', allNews:'Semua Berita', categories:'Kategori', moreNews:'Berita Lainnya', like:'Suka', liked:'Disukai', share:'Bagikan', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Tautan', copied:'Disalin', print:'Cetak', back:'Kembali', tags:'Tag' },
  fa: { views:'بازدید', likes:'پسندها', shares:'اشتراک‌گذاری', breaking:'فوری', latestNews:'آخرین اخبار', trending:'اخبار داغ', top5:'۵ برتر', viewAll:'مشاهده همه', relatedNews:'اخبار مرتبط', newsDesk:'تحریریه', khulna:'خولنا', bangladesh:'بنگلادش', searchPlaceholder:'جستجوی اخبار...', searchTitle:'جستجوی اخبار', searchButton:'جستجو', noResults:'خبری پیدا نشد', readMore:'ادامه مطلب', authorArticles:'همه گزارش‌های نویسنده →', shareArticle:'اشتراک‌گذاری', copyLink:'کپی لینک', linkCopied:'لینک کپی شد!', cms:'سیستم مدیریت', login:'ورود', lightMode:'روشن', darkMode:'تیره', home:'خانه', archive:'آرشیو', about:'درباره ما', contact:'تماس', privacy:'حریم خصوصی', topStories:'اخبار برتر', allNews:'همه اخبار', categories:'دسته‌بندی‌ها', moreNews:'اخبار بیشتر', like:'پسند', liked:'پسند شد', share:'اشتراک‌گذاری', facebook:'فیس‌بوک', whatsapp:'واتساپ', telegram:'تلگرام', copy:'لینک', copied:'کپی شد', print:'چاپ', back:'بازگشت', tags:'برچسب‌ها' },
  ko: { views:'조회수', likes:'좋아요', shares:'공유', breaking:'속보', latestNews:'최신 뉴스', trending:'인기 뉴스', top5:'TOP 5', viewAll:'전체 보기', relatedNews:'관련 뉴스', newsDesk:'뉴스 데스크', khulna:'쿨나', bangladesh:'방글라데시', searchPlaceholder:'뉴스 검색...', searchTitle:'뉴스 검색', searchButton:'검색', noResults:'뉴스를 찾을 수 없습니다', readMore:'더 읽기', authorArticles:'작성자의 모든 기사 →', shareArticle:'공유', copyLink:'링크 복사', linkCopied:'링크가 복사되었습니다!', cms:'CMS', login:'로그인', lightMode:'라이트', darkMode:'다크', home:'홈', archive:'아카이브', about:'회사 소개', contact:'연락처', privacy:'개인정보 보호', topStories:'주요 뉴스', allNews:'전체 뉴스', categories:'카테고리', moreNews:'더 많은 뉴스', like:'좋아요', liked:'좋아요 완료', share:'공유', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'링크', copied:'복사됨', print:'인쇄', back:'뒤로', tags:'태그' },
  it: { views:'Visualizzazioni', likes:'Mi piace', shares:'Condivisioni', breaking:'ULTIM’ORA', latestNews:'Ultime notizie', trending:'Tendenze', top5:'Top 5', viewAll:'Vedi tutto', relatedNews:'Notizie correlate', newsDesk:'Redazione', khulna:'Khulna', bangladesh:'Bangladesh', searchPlaceholder:'Cerca notizie...', searchTitle:'Cerca notizie', searchButton:'Cerca', noResults:'Nessuna notizia trovata', readMore:'Leggi di più', authorArticles:'Vedi tutti gli articoli dell’autore →', shareArticle:'Condividi', copyLink:'Copia link', linkCopied:'Link copiato!', cms:'CMS', login:'Accedi', lightMode:'Chiaro', darkMode:'Scuro', home:'Home', archive:'Archivio', about:'Chi siamo', contact:'Contatti', privacy:'Privacy', topStories:'Notizie principali', allNews:'Tutte le notizie', categories:'Categorie', moreNews:'Altre notizie', like:'Mi piace', liked:'Piaciuto', share:'Condividi', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Link', copied:'Copiato', print:'Stampa', back:'Indietro', tags:'Tag' },
  th: { views:'การดู', likes:'ถูกใจ', shares:'แชร์', breaking:'ข่าวด่วน', latestNews:'ข่าวล่าสุด', trending:'ข่าวยอดนิยม', top5:'5 อันดับ', viewAll:'ดูทั้งหมด', relatedNews:'ข่าวที่เกี่ยวข้อง', newsDesk:'กองบรรณาธิการ', khulna:'คูลนา', bangladesh:'บังกลาเทศ', searchPlaceholder:'ค้นหาข่าว...', searchTitle:'ค้นหาข่าว', searchButton:'ค้นหา', noResults:'ไม่พบข่าว', readMore:'อ่านต่อ', authorArticles:'ดูบทความทั้งหมดของผู้เขียน →', shareArticle:'แชร์', copyLink:'คัดลอกลิงก์', linkCopied:'คัดลอกลิงก์แล้ว!', cms:'CMS', login:'เข้าสู่ระบบ', lightMode:'สว่าง', darkMode:'มืด', home:'หน้าแรก', archive:'คลังข่าว', about:'เกี่ยวกับเรา', contact:'ติดต่อ', privacy:'ความเป็นส่วนตัว', topStories:'ข่าวเด่น', allNews:'ข่าวทั้งหมด', categories:'หมวดหมู่', moreNews:'ข่าวเพิ่มเติม', like:'ถูกใจ', liked:'ถูกใจแล้ว', share:'แชร์', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'ลิงก์', copied:'คัดลอกแล้ว', print:'พิมพ์', back:'ย้อนกลับ', tags:'แท็ก' },
  vi: { views:'Lượt xem', likes:'Thích', shares:'Chia sẻ', breaking:'TIN NÓNG', latestNews:'Tin mới nhất', trending:'Xu hướng', top5:'Top 5', viewAll:'Xem tất cả', relatedNews:'Tin liên quan', newsDesk:'Tòa soạn', khulna:'Khulna', bangladesh:'Bangladesh', searchPlaceholder:'Tìm tin tức...', searchTitle:'Tìm kiếm tin tức', searchButton:'Tìm kiếm', noResults:'Không tìm thấy tin tức', readMore:'Đọc thêm', authorArticles:'Xem tất cả bài viết của tác giả →', shareArticle:'Chia sẻ', copyLink:'Sao chép liên kết', linkCopied:'Đã sao chép liên kết!', cms:'CMS', login:'Đăng nhập', lightMode:'Sáng', darkMode:'Tối', home:'Trang chủ', archive:'Lưu trữ', about:'Về chúng tôi', contact:'Liên hệ', privacy:'Chính sách riêng tư', topStories:'Tin nổi bật', allNews:'Tất cả tin', categories:'Danh mục', moreNews:'Tin khác', like:'Thích', liked:'Đã thích', share:'Chia sẻ', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Liên kết', copied:'Đã sao chép', print:'In', back:'Quay lại', tags:'Thẻ' },
  ms: { views:'Paparan', likes:'Suka', shares:'Perkongsian', breaking:'TERKINI', latestNews:'Berita Terkini', trending:'Trend', top5:'5 Teratas', viewAll:'Lihat Semua', relatedNews:'Berita Berkaitan', newsDesk:'Meja Berita', khulna:'Khulna', bangladesh:'Bangladesh', searchPlaceholder:'Cari berita...', searchTitle:'Cari Berita', searchButton:'Cari', noResults:'Tiada berita ditemui', readMore:'Baca selanjutnya', authorArticles:'Lihat semua laporan penulis →', shareArticle:'Kongsi', copyLink:'Salin pautan', linkCopied:'Pautan disalin!', cms:'CMS', login:'Log masuk', lightMode:'Cerah', darkMode:'Gelap', home:'Laman Utama', archive:'Arkib', about:'Tentang Kami', contact:'Hubungi', privacy:'Privasi', topStories:'Berita Utama', allNews:'Semua Berita', categories:'Kategori', moreNews:'Berita Lain', like:'Suka', liked:'Disukai', share:'Kongsi', facebook:'Facebook', whatsapp:'WhatsApp', telegram:'Telegram', copy:'Pautan', copied:'Disalin', print:'Cetak', back:'Kembali', tags:'Tag' },
  ne: { views:'दृश्य', likes:'लाइक', shares:'सेयर', breaking:'ब्रेकिङ', latestNews:'पछिल्ला समाचार', trending:'लोकप्रिय', top5:'शीर्ष ५', viewAll:'सबै हेर्नुहोस्', relatedNews:'सम्बन्धित समाचार', newsDesk:'समाचार डेस्क', khulna:'खुल्ना', bangladesh:'बंगलादेश', searchPlaceholder:'समाचार खोज्नुहोस्...', searchTitle:'समाचार खोज्नुहोस्', searchButton:'खोज्नुहोस्', noResults:'समाचार भेटिएन', readMore:'पूरा पढ्नुहोस्', authorArticles:'लेखकका सबै रिपोर्ट हेर्नुहोस् →', shareArticle:'सेयर गर्नुहोस्', copyLink:'लिङ्क प्रतिलिपि गर्नुहोस्', linkCopied:'लिङ्क प्रतिलिपि भयो!', cms:'CMS', login:'लगइन', lightMode:'लाइट', darkMode:'डार्क', home:'गृहपृष्ठ', archive:'अभिलेख', about:'हाम्रो बारेमा', contact:'सम्पर्क', privacy:'गोपनीयता', topStories:'मुख्य समाचार', allNews:'सबै समाचार', categories:'श्रेणीहरू', moreNews:'थप समाचार', like:'लाइक', liked:'मन पर्यो', share:'सेयर', facebook:'फेसबुक', whatsapp:'ह्वाट्सएप', telegram:'टेलिग्राम', copy:'लिङ्क', copied:'प्रतिलिपि भयो', print:'प्रिन्ट', back:'फिर्ता', tags:'ट्याग' }

};

// Languages supported by the selector but not requiring a separate custom-label pack.
// Google Translate handles the article/body translation while these labels keep the UI reactive.
for (const code of ['ta', 'te', 'ml']) {
  if (!LANGUAGE_DICTIONARY[code]) LANGUAGE_DICTIONARY[code] = LANGUAGE_DICTIONARY.en;
}

// Digits mapping
const DIGITS_MAP: Record<string, string[]> = {
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  ne: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  ar: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
  ur: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  fa: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
};

// Hindi category map
const HINDI_CATEGORIES: Record<string, string> = {
  khulna: 'खुलना',
  national: 'राष्ट्रीय',
  politics: 'राजनीति',
  international: 'अंतर्राष्ट्रीय',
  economy: 'अर्थव्यवस्था',
  business: 'व्यापार',
  sports: 'खेल',
  entertainment: 'मनोरंजन',
  technology: 'प्रौद्योगिकी',
  lifestyle: 'लाइफस्टाइल',
  education: 'शिक्षा',
  health: 'स्वास्थ्य',
  opinion: 'विचार',
  others: 'अन्य'
};

// Detect active language
export function getActiveLanguage(): string {
  try {
    const saved = localStorage.getItem('khulna_selected_language');
    if (saved && LANGUAGE_DICTIONARY[saved]) {
      return saved;
    }
    const match = document.cookie.match(/googtrans=\/bn\/([a-zA-Z-]+)/);
    if (match && match[1] && LANGUAGE_DICTIONARY[match[1]]) {
      return match[1];
    }
    const htmlLang = document.documentElement.lang;
    if (htmlLang && LANGUAGE_DICTIONARY[htmlLang]) {
      return htmlLang;
    }
  } catch {
    // Ignore storage/cookie restrictions
  }
  return 'bn';
}

// Convert digits according to language
export function formatNumberByLanguage(num: number | string | undefined | null, lang: string = 'bn'): string {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  const digits = DIGITS_MAP[lang];
  if (digits) {
    return str.replace(/[0-9]/g, d => digits[parseInt(d, 10)]);
  }
  return str;
}

/**
 * Format metric numbers according to requirement:
 * 1,200 → 1.2K
 * 12,500 → 12.5K
 * 71,600 → 71.6K
 * 1,200,000 → 1.2M
 * 
 * In Bangla:
 * ১,২০০ → ১.২K
 * ১২,৫০০ → ১২.৫K
 * ৭১,৬০০ → ৭১.৬K
 * ১,২০০,০০০ → ১.২M
 * 
 * In Hindi:
 * १२,५०० → १२.५K
 * ७१,६०० → ७१.६K
 */
export function formatEngagementNumber(num: number | undefined | null, lang: string = 'bn'): string {
  if (num === undefined || num === null || isNaN(num) || num <= 0) {
    return formatNumberByLanguage(0, lang);
  }

  let baseStr = '';
  let suffix = '';

  if (num >= 1_000_000) {
    const m = num / 1_000_000;
    baseStr = (Math.floor(m * 10) / 10).toFixed(1).replace(/\.0$/, '');
    suffix = 'M';
  } else if (num >= 1_000) {
    const k = num / 1_000;
    baseStr = (Math.floor(k * 10) / 10).toFixed(1).replace(/\.0$/, '');
    suffix = 'K';
  } else {
    baseStr = Math.floor(num).toString();
    suffix = '';
  }

  return `${formatNumberByLanguage(baseStr, lang)}${suffix}`;
}

/**
 * Format ISO date string by language
 */
export function formatDateByLanguage(isoDate: string, lang: string = 'bn', includeTime: boolean = false): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;

    if (lang === 'bn') {
      const months = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const dayName = days[d.getDay()];
      const dateNum = formatNumberByLanguage(d.getDate(), 'bn');
      const monthName = months[d.getMonth()];
      const yearNum = formatNumberByLanguage(d.getFullYear(), 'bn');

      let formatted = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
      if (includeTime) {
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
        hours = hours % 12 || 12;
        const hoursBn = formatNumberByLanguage(hours, 'bn');
        const minutesBn = formatNumberByLanguage(minutes < 10 ? '0' + minutes : minutes, 'bn');
        formatted += `, ${ampm} ${hoursBn}:${minutesBn}`;
      }
      return formatted;
    }

    const localeMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ar: 'ar-SA',
      ur: 'ur-PK',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      'zh-CN': 'zh-CN', ja: 'ja-JP', ru: 'ru-RU', pt: 'pt-PT', tr: 'tr-TR', id: 'id-ID', fa: 'fa-IR', ko: 'ko-KR', it: 'it-IT', th: 'th-TH', vi: 'vi-VN', ms: 'ms-MY', ne: 'ne-NP'
    };

    const locale = localeMap[lang] || 'en-US';
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    if (includeTime) {
      dateOptions.hour = 'numeric';
      dateOptions.minute = '2-digit';
      dateOptions.hour12 = true;
    }

    return new Intl.DateTimeFormat(locale, dateOptions).format(d);
  } catch {
    return isoDate;
  }
}

/**
 * Get category name by language
 */
export function getCategoryNameByLanguage(
  category: { name: string; englishName?: string; slug?: string },
  lang: string = 'bn'
): string {
  if (lang === 'en' && category.englishName) {
    return category.englishName;
  }
  if (lang === 'hi' && category.slug && HINDI_CATEGORIES[category.slug]) {
    return HINDI_CATEGORIES[category.slug];
  }
  return category.name;
}

// React hook for reactive language awareness
export function useActiveLanguage(): {
  lang: string;
  labels: LanguageLabels;
  isBangla: boolean;
  isEnglish: boolean;
  isHindi: boolean;
  formatNumber: (n: number | string | undefined | null) => string;
  formatMetric: (n: number | undefined | null) => string;
  formatDate: (isoDate: string, includeTime?: boolean) => string;
} {
  const [lang, setLang] = useState<string>(() => getActiveLanguage());

  useEffect(() => {
    const updateLang = () => {
      const detected = getActiveLanguage();
      setLang(detected);
    };

    updateLang();

    window.addEventListener('khulna-language-change', updateLang);
    window.addEventListener('storage', updateLang);

    const interval = setInterval(() => {
      const current = getActiveLanguage();
      if (current !== lang) {
        setLang(current);
      }
    }, 1200);

    return () => {
      window.removeEventListener('khulna-language-change', updateLang);
      window.removeEventListener('storage', updateLang);
      clearInterval(interval);
    };
  }, [lang]);

  const labels = LANGUAGE_DICTIONARY[lang] || LANGUAGE_DICTIONARY.en;

  return {
    lang,
    labels,
    isBangla: lang === 'bn',
    isEnglish: lang === 'en',
    isHindi: lang === 'hi',
    formatNumber: (n) => formatNumberByLanguage(n, lang),
    formatMetric: (n) => formatEngagementNumber(n, lang),
    formatDate: (isoDate, includeTime) => formatDateByLanguage(isoDate, lang, includeTime)
  };
}
