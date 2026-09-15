import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { ToastContainer } from './components/common/ToastContainer';

// Public Layout & Pages
import { Layout } from './components/common/Layout';
import { HomePage } from './pages/public/HomePage';
import { SingleNewsPage } from './pages/public/SingleNewsPage';
import { CategoryPage } from './pages/public/CategoryPage';
import { LatestNewsPage } from './pages/public/LatestNewsPage';
import { SearchPage } from './pages/public/SearchPage';
import { ArchivePage } from './pages/public/ArchivePage';
import { AuthorPage } from './pages/public/AuthorPage';
import { LegalPage } from './pages/public/LegalPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { SyndicationPages } from './pages/public/SyndicationPages';
import { DistrictPage } from './pages/public/DistrictPage';

// Admin CMS Pages
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { NewsListPage } from './pages/admin/NewsListPage';
import { NewsEditorPage } from './pages/admin/NewsEditorPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { BreakingNewsManager } from './pages/admin/BreakingNewsManager';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { AdsterraManager } from './pages/admin/AdsterraManager';
import { CommentsManager } from './pages/admin/CommentsManager';
import { HomepageLayoutManager } from './pages/admin/HomepageLayoutManager';
import { SettingsPage } from './pages/admin/SettingsPage';
import { AuthorsPage } from './pages/admin/AuthorsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { BackupPage } from './pages/admin/BackupPage';
import { DeploymentPage } from './pages/admin/DeploymentPage';
import { TrashPage } from './pages/admin/TrashPage';
import { ThemeSettingsPage } from './pages/admin/ThemeSettingsPage';
import { SeoSettingsPage } from './pages/admin/SeoSettingsPage';
import { SocialSettingsPage } from './pages/admin/SocialSettingsPage';
import { AutoNewsManager } from './pages/admin/AutoNewsManager';

export default function App() {
  return (
    <NewsProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news/:slug" element={<SingleNewsPage />} />
            <Route path="/news/:district/:slug" element={<SingleNewsPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/latest" element={<LatestNewsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/author/:authorId" element={<AuthorPage />} />
            <Route path="/tag/:tag" element={<LegalPage />} />

            {/* 10 Khulna Division District Dedicated SEO Routes */}
            <Route path="/khulna" element={<DistrictPage districtSlug="khulna" />} />
            <Route path="/bagerhat" element={<DistrictPage districtSlug="bagerhat" />} />
            <Route path="/satkhira" element={<DistrictPage districtSlug="satkhira" />} />
            <Route path="/jashore" element={<DistrictPage districtSlug="jashore" />} />
            <Route path="/jessore" element={<Navigate to="/jashore" replace />} />
            <Route path="/jhenaidah" element={<DistrictPage districtSlug="jhenaidah" />} />
            <Route path="/magura" element={<DistrictPage districtSlug="magura" />} />
            <Route path="/narail" element={<DistrictPage districtSlug="narail" />} />
            <Route path="/kushtia" element={<DistrictPage districtSlug="kushtia" />} />
            <Route path="/chuadanga" element={<DistrictPage districtSlug="chuadanga" />} />
            <Route path="/meherpur" element={<DistrictPage districtSlug="meherpur" />} />
            <Route path="/district/:districtSlug" element={<DistrictPage />} />
            
            {/* Legal & Static Pages */}
            <Route path="/about" element={<LegalPage />} />
            <Route path="/contact" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/editorial-policy" element={<LegalPage />} />

            {/* Syndication & SEO Feeds */}
            <Route path="/rss.xml" element={<SyndicationPages />} />
            <Route path="/sitemap.xml" element={<SyndicationPages />} />
            <Route path="/robots.txt" element={<SyndicationPages />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin CMS Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="news" element={<NewsListPage />} />
            <Route path="auto-news" element={<AutoNewsManager />} />
            <Route path="news/new" element={<NewsEditorPage />} />
            <Route path="news/edit/:id" element={<NewsEditorPage />} />
            <Route path="trash" element={<TrashPage />} />
            <Route path="breaking" element={<BreakingNewsManager />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="authors" element={<AuthorsPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="homepage-layout" element={<HomepageLayoutManager />} />
            <Route path="comments" element={<CommentsManager />} />
            <Route path="ads" element={<AdsterraManager />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="theme-settings" element={<ThemeSettingsPage />} />
            <Route path="seo-settings" element={<SeoSettingsPage />} />
            <Route path="social-settings" element={<SocialSettingsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="backup" element={<BackupPage />} />
            <Route path="deployment" element={<DeploymentPage />} />
          </Route>
        </Routes>

        {/* Global Toast System */}
        <ToastContainer />
      </BrowserRouter>
    </NewsProvider>
  );
}
