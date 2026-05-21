<img width="1440" height="8654" alt="image" src="https://github.com/user-attachments/assets/fa76bcd2-5bcf-4d96-a8da-de69d9448127" /># 🚀 Job Board — Full-Stack İş İlanı Platformu

Modern, ölçeklenebilir ve rol tabanlı bir iş ilanı platformu. Laravel (PHP) backend API, Next.js frontend, Docker altyapısı ve bulut depolama entegrasyonu ile geliştirilmiştir.

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## 📌 Proje Hakkında

Job Board, işverenler ve iş arayanları bir araya getiren tam özellikli bir kariyer platformudur. LinkedIn ve Kariyer.net gibi platformlardan ilham alınarak modern bir teknoloji yığını üzerine inşa edilmiştir.

### Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| **Jobseeker** (İş Arayan) | İlan görüntüleme, başvuru yapma, CV yükleme, ilan kaydetme, profil oluşturma |
| **Employer** (İşveren) | Şirket profili, ilan oluşturma/düzenleme/silme, başvuru yönetimi (ATS) |
| **Admin** | Tüm kullanıcı ve ilan yönetimi, kategori yönetimi, istatistik paneli |

---

## ✨ Özellikler

<details>
<summary><strong>🔐 Kimlik Doğrulama & Güvenlik</strong></summary>

- Token tabanlı authentication (Laravel Sanctum)
- Kullanıcı kaydı ve girişi (rol seçimi: iş arayan / işveren)
- Google OAuth 2.0 ile giriş
- Şifre sıfırlama (e-posta ile token doğrulamalı)
- Tüm cihazlardan çıkış (token invalidation)
- Hesap silme

</details>

<details>
<summary><strong>👤 Kullanıcı Profili (Jobseeker)</strong></summary>

- Kişisel bilgiler (ünvan, biyografi, şehir, telefon)
- LinkedIn, GitHub, portfolio URL bağlantıları
- Deneyim yılı ve beklenen maaş bilgisi
- "İş tekliflerine açığım" durumu
- PDF CV yükleme (Cloudflare R2 — S3 uyumlu bulut depolama)

</details>

<details>
<summary><strong>🏢 Şirket Profili (Employer)</strong></summary>

- Şirket adı, sektör, şehir, çalışan sayısı
- Kuruluş yılı ve website bilgisi
- Şirket açıklaması

</details>

<details>
<summary><strong>💼 İş İlanı Yönetimi</strong></summary>

- İlan oluşturma, düzenleme, silme
- Çalışma tipi: Tam zamanlı, Yarı zamanlı, Freelance, Staj
- Lokasyon tipi: Ofis, Uzaktan, Hibrit
- Maaş aralığı (TRY/USD/EUR, görünürlük kontrolü)
- İlan durumu: Taslak, Yayında, Kapalı
- Otomatik slug oluşturma & kategori sistemi

</details>

<details>
<summary><strong>📄 Başvuru Sistemi (ATS)</strong></summary>

- İlana başvuru (ön yazı + PDF CV yükleme)
- Başvuru durumu takibi: `Beklemede` → `İnceleniyor` → `Kısa Listede` → `İşe Alındı` / `Reddedildi`
- İşveren notu (adaya gizli)
- Aynı ilana tekrar başvuru engeli

</details>

<details>
<summary><strong>📧 E-posta Bildirimleri</strong></summary>

- Başvuru yapılınca işverene bildirim
- Başvuru yapılınca adaya onay bildirimi
- Başvuru durumu değişince adaya bildirim
- Şifre sıfırlama maili

</details>

<details>
<summary><strong>🔖 Kayıtlı İlanlar & 📊 Admin Paneli</strong></summary>

- İlanı favorilere ekleme / çıkarma, kaydedilen ilanları listeleme
- Kullanıcı istatistikleri (toplam, işveren, iş arayan)
- İlan ve başvuru istatistikleri
- Kullanıcı yönetimi (listeleme, silme)
- Kategori oluşturma ve silme

</details>

<details>
<summary><strong>🔒 Güvenli Dosya Erişimi</strong></summary>

- CV'ler Cloudflare R2 (S3 uyumlu) bulut depolamada saklanır
- Presigned URL ile geçici erişim (30 dakika geçerli)
- Bucket private, doğrudan erişim kapalı

</details>

---

## 🛠️ Teknoloji Yığını

### Backend

| Teknoloji | Sürüm | Kullanım |
|-----------|-------|----------|
| PHP | 8.3 | Sunucu dili |
| Laravel | 11 | API framework |
| Laravel Sanctum | 4.3 | Token authentication |
| Laravel Socialite | 5.x | Google OAuth |
| Laravel Breeze | 2.4 | Auth scaffolding |
| PostgreSQL | 16 | Ana veritabanı |
| Cloudflare R2 | — | S3 uyumlu dosya depolama |

### Frontend

| Teknoloji | Sürüm | Kullanım |
|-----------|-------|----------|
| Next.js | 15+ | React framework (App Router) |
| TypeScript | latest | Tip güvenliği |
| Tailwind CSS | latest | Utility-first CSS |
| shadcn/ui | latest | UI bileşenleri |
| Axios | latest | HTTP client |

### DevOps & Altyapı (Local)

| Teknoloji | Kullanım |
|-----------|----------|
| Docker | Container orchestration |
| Docker Compose | Çoklu servis yönetimi |
| Nginx | Reverse proxy, PHP-FPM yönlendirme |
| Mailpit | Local e-posta testi |
| MinIO | Local S3 uyumlu dosya depolama |
| pgAdmin | PostgreSQL yönetim arayüzü |

### Production Servisleri

| Servis | Platform |
|--------|----------|
| Backend API | Render.com |
| Frontend | Netlify |
| Veritabanı | Supabase (PostgreSQL) |
| Dosya Depolama | Cloudflare R2 |
| E-posta | Mailtrap / Gmail SMTP |

---

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    Kullanıcı (Tarayıcı)                  │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│         Next.js Frontend (Netlify)                       │
│    Login │ Register │ İlanlar │ Dashboard                │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────┐
│         Laravel API (Render.com)                         │
│    Auth │ Jobs │ Applications │ Profiles │ Admin         │
└────┬────────────────┬────────────────────┬──────────────┘
     │                │                    │
     ▼                ▼                    ▼
┌──────────┐   ┌────────────┐   ┌──────────────────┐
│ Supabase │   │  Mailtrap  │   │  Cloudflare R2   │
│(PostgreSQL)  │  (E-posta) │   │  (CV/dosya)      │
└──────────┘   └────────────┘   └──────────────────┘
```

---

## ⚙️ Local Geliştirme Kurulumu

### Gereksinimler

- Docker Desktop
- Node.js 18+
- Git

### 1. Repoyu Klonla

```bash
git clone https://github.com/kullanici/job-board.git
cd job-board
```

### 2. Backend Ortam Değişkenleri

```bash
cp backend/.env.example backend/.env
```

`.env` dosyasını düzenle:

```env
APP_NAME="Job Board"
APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=job_board
DB_USERNAME=job_user
DB_PASSWORD=secret123

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minio_secret123
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=job-board
AWS_ENDPOINT=http://minio:9000
AWS_URL=http://localhost:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS="noreply@jobboard.com"

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
GOOGLE_ENABLED=true
```

> **Not:** Production'da MinIO yerine Cloudflare R2, Mailpit yerine Mailtrap veya Gmail SMTP kullanılır.

### 3. Docker Servisleri Başlat

```bash
docker compose up -d
```

| Servis | Adres |
|--------|-------|
| Backend API | http://localhost:8080 |
| pgAdmin | http://localhost:5050 |
| MinIO UI | http://localhost:9001 |
| Mailpit | http://localhost:8025 |

### 4. Veritabanı Kurulumu

```bash
docker compose exec app php artisan migrate
```

### 5. MinIO Bucket Oluştur

```bash
docker compose exec minio mc alias set local http://localhost:9000 minioadmin minio_secret123
docker compose exec minio mc mb local/job-board
```

### 6. Admin Kullanıcısı Oluştur

```bash
docker compose exec app php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@jobboard.com',
    'password' => bcrypt('sifreniz'),
    'role' => 'admin'
]);
```

### 7. Frontend Kurulumu

```bash
cd frontend
npm install
```

`.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

```bash
npm run dev
```

Frontend: http://localhost:3000

---

## 🚀 Production Deploy

<details>
<summary><strong>Backend (Render.com)</strong></summary>

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.netlify.app

DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=your-username
DB_PASSWORD=your-password

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-r2-access-key
AWS_SECRET_ACCESS_KEY=your-r2-secret-key
AWS_DEFAULT_REGION=auto
AWS_BUCKET=job-board
AWS_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
AWS_USE_PATH_STYLE_ENDPOINT=false

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@jobboard.com"

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/api/auth/google/callback
GOOGLE_ENABLED=true
```

</details>

<details>
<summary><strong>Frontend (Netlify)</strong></summary>

`.env.local` veya Netlify dashboard'dan:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

</details>

<details>
<summary><strong>Cloudflare R2 Kurulumu</strong></summary>

1. cloudflare.com → R2 Object Storage → Create bucket (`job-board`)
2. API Tokens → Create Account API Token → Object Read & Write
3. Access Key ID ve Secret Access Key'i Render env'e ekle

</details>

<details>
<summary><strong>Google OAuth Kurulumu</strong></summary>

Google Cloud Console → Credentials → OAuth Client → Authorized redirect URIs:

```
https://your-backend.onrender.com/api/auth/google/callback
```

</details>

---

## 🗺️ Kullanım

<details>
<summary><strong>İş Arayan Akışı</strong></summary>

1. `/register` → "İş Arıyorum" seç → Kayıt ol
2. `/jobseeker/dashboard` → Dashboard
3. `/jobseeker/profile` → Profil ve CV yükle
4. `/jobs` → İlanları gez, filtrele
5. `/jobs/[slug]` → İlan detayı → Başvur
6. `/jobseeker/saved` → Kayıtlı ilanlar
7. Dashboard → Başvuru durumlarını takip et

</details>

<details>
<summary><strong>İşveren Akışı</strong></summary>

1. `/register` → "İşveren" seç → Kayıt ol
2. `/employer/dashboard` → Dashboard
3. `/employer/company` → Şirket profili oluştur
4. `/employer/create-job` → İlan oluştur
5. `/employer/applications/[id]` → Başvuruları yönet
6. Başvuru durumunu güncelle → Adaya otomatik bildirim gider

</details>

<details>
<summary><strong>Admin Akışı</strong></summary>

1. `/login` → Admin bilgileriyle giriş
2. `/admin` → İstatistikler, kullanıcılar, ilanlar, kategoriler

</details>

---

## 📡 API Dokümantasyonu

<details>
<summary><strong>Auth Endpoint'leri</strong></summary>

```
POST   /api/register                    → Kayıt ol
POST   /api/login                       → Giriş yap
POST   /api/logout                      → Çıkış yap (token gerekli)
GET    /api/me                          → Giriş yapan kullanıcı (token gerekli)
POST   /api/forgot-password             → Şifre sıfırlama maili
POST   /api/reset-password              → Yeni şifre belirle
DELETE /api/account                     → Hesap sil (token gerekli)
GET    /api/auth/google/redirect        → Google OAuth yönlendirme
GET    /api/auth/google/callback        → Google OAuth callback
```

</details>

<details>
<summary><strong>İlan Endpoint'leri</strong></summary>

```
GET    /api/jobs                        → Tüm yayınlanmış ilanlar (herkese açık)
GET    /api/jobs/{slug}                 → İlan detayı (herkese açık)
POST   /api/jobs                        → İlan oluştur (employer)
PUT    /api/jobs/{id}                   → İlan güncelle (employer)
DELETE /api/jobs/{id}                   → İlan sil (employer)
GET    /api/my-listings                 → Kendi ilanlarım (employer)
```

</details>

<details>
<summary><strong>Başvuru Endpoint'leri</strong></summary>

```
POST   /api/jobs/{id}/apply             → İlana başvur (jobseeker)
GET    /api/my-applications             → Kendi başvurularım (jobseeker)
GET    /api/jobs/{id}/applications      → İlana gelen başvurular (employer)
PUT    /api/applications/{id}/status    → Başvuru durumu güncelle (employer)
```

</details>

<details>
<summary><strong>Profil & Şirket Endpoint'leri</strong></summary>

```
GET    /api/profile                     → Profil görüntüle
POST   /api/profile                     → Profil oluştur/güncelle
POST   /api/profile/cv                  → CV yükle
DELETE /api/profile/cv                  → CV sil
GET    /api/company                     → Şirket profili görüntüle
POST   /api/company                     → Şirket oluştur
PUT    /api/company                     → Şirket güncelle
```

</details>

<details>
<summary><strong>Diğer Endpoint'ler</strong></summary>

```
GET    /api/categories                  → Tüm kategoriler
POST   /api/categories                  → Kategori ekle (admin)
DELETE /api/categories/{id}             → Kategori sil (admin)
GET    /api/saved-jobs                  → Kayıtlı ilanlar
POST   /api/saved-jobs/{jobId}          → İlanı kaydet
DELETE /api/saved-jobs/{jobId}          → İlanı kayıtlardan çıkar
GET    /api/cv/{path}                   → CV presigned URL al
GET    /api/admin/stats                 → İstatistikler (admin)
GET    /api/admin/users                 → Kullanıcılar (admin)
GET    /api/admin/jobs                  → Tüm ilanlar (admin)
DELETE /api/admin/users/{id}            → Kullanıcı sil (admin)
DELETE /api/admin/jobs/{id}             → İlan sil (admin)
```

</details>

---

## 📁 Proje Yapısı

```
job-board/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── ApiAuthController.php
│   │   │   │   └── GoogleAuthController.php
│   │   │   ├── AdminController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── CompanyController.php
│   │   │   ├── JobApplicationController.php
│   │   │   ├── JobListingController.php
│   │   │   ├── ProfileController.php
│   │   │   └── SavedJobController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Profile.php
│   │   │   ├── Company.php
│   │   │   ├── Category.php
│   │   │   ├── JobListing.php
│   │   │   ├── JobApplication.php
│   │   │   └── SavedJob.php
│   │   └── Notifications/
│   │       ├── ApplicationSubmitted.php
│   │       ├── ApplicationReceived.php
│   │       └── ApplicationStatusChanged.php
│   ├── database/migrations/
│   └── routes/
│       └── api.php
│
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── callback/
│   │   │   ├── forgot-password/
│   │   │   └── password-reset/[token]/
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   ├── employer/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── company/
│   │   │   │   ├── create-job/
│   │   │   │   ├── edit-job/[id]/
│   │   │   │   └── applications/[jobId]/
│   │   │   └── jobseeker/
│   │   │       ├── page.tsx
│   │   │       ├── profile/
│   │   │       └── saved/
│   │   └── jobs/
│   │       ├── page.tsx
│   │       └── [slug]/
│   ├── lib/
│   │   └── axios.ts
│   └── types/
│       └── index.ts
│
├── nginx/
│   └── default.conf
└── docker-compose.yml
```

---

## 🗄️ Veritabanı Şeması

```
users
 ├── profiles         (1-1)
 ├── companies        (1-1)
 ├── job_applications (1-N)
 └── saved_jobs       (1-N)

companies
 └── job_listings     (1-N)

categories
 └── job_listings     (1-N)

job_listings
 └── job_applications (1-N)
     └── saved_jobs   (N-N via pivot)
```

---

## 👨‍💻 Geliştirici

**İbrahim Parlak**

## 📄 Lisans

MIT License
