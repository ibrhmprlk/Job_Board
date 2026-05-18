# 🚀 Job Board — Full-Stack İş İlanı Platformu

Modern, ölçeklenebilir ve rol tabanlı bir iş ilanı platformu. Laravel (PHP) backend API, Next.js frontend, Docker altyapısı ve bulut depolama entegrasyonu ile geliştirilmiştir.

## 📌 Proje Hakkında

Job Board, işverenler ve iş arayanları bir araya getiren tam özellikli bir kariyer platformudur. LinkedIn ve Kariyer.net gibi platformlardan ilham alınarak, modern bir teknoloji yığını üzerine inşa edilmiştir.

### Kullanıcı Rolleri

| Rol | Yetki |
|-----|-------|
| **Jobseeker** (İş Arayan) | İlan görüntüleme, başvuru yapma, CV yükleme, ilan kaydetme, profil oluşturma |
| **Employer** (İşveren) | Şirket profili, ilan oluşturma/düzenleme/silme, başvuru yönetimi (ATS) |
| **Admin** | Tüm kullanıcı ve ilan yönetimi, kategori yönetimi, istatistik paneli |

---

## ✨ Özellikler

### 🔐 Kimlik Doğrulama & Güvenlik
- JWT tabanlı token authentication (Laravel Sanctum)
- Kullanıcı kaydı ve girişi (rol seçimi: iş arayan / işveren)
- Şifre sıfırlama (e-posta ile token doğrulamalı)
- Tüm cihazlardan çıkış (token invalidation)
- Hesap silme

### 👤 Kullanıcı Profili (Jobseeker)
- Kişisel bilgiler (ünvan, biyografi, şehir, telefon)
- LinkedIn, GitHub, portfolio URL bağlantıları
- Deneyim yılı ve beklenen maaş bilgisi
- "İş tekliflerine açığım" durumu
- PDF CV yükleme (MinIO S3 entegrasyonu)

### 🏢 Şirket Profili (Employer)
- Şirket adı, sektör, şehir, çalışan sayısı
- Kuruluş yılı ve website bilgisi
- Şirket açıklaması

### 💼 İş İlanı Yönetimi
- İlan oluşturma, düzenleme, silme
- Çalışma tipi: Tam zamanlı, Yarı zamanlı, Freelance, Staj
- Lokasyon tipi: Ofis, Uzaktan, Hibrit
- Maaş aralığı (TRY/USD/EUR, görünürlük kontrolü)
- İlan durumu: Taslak, Yayında, Kapalı
- Otomatik slug oluşturma
- Kategori sistemi

### 📄 Başvuru Sistemi (ATS)
- İlana başvuru (ön yazı + PDF CV yükleme)
- Başvuru durumu takibi: Beklemede → İnceleniyor → Kısa Listede → İşe Alındı / Reddedildi
- İşveren notu (adaya gizli)
- Aynı ilana tekrar başvuru engeli

### 📧 E-posta Bildirimleri
- Başvuru yapılınca **işverene** bildirim: "X adlı aday başvurdu"
- Başvuru yapılınca **adaya** bildirim: "Başvurunuz alındı"
- Başvuru durumu değişince **adaya** bildirim: "Başvurunuz güncellendi"
- Şifre sıfırlama maili

### 🔖 Kayıtlı İlanlar
- İlanı favorilere ekleme / çıkarma
- Kaydedilen ilanları listeleme

### 📊 Admin Paneli
- Kullanıcı istatistikleri (toplam, işveren, iş arayan)
- İlan ve başvuru istatistikleri
- Kullanıcı yönetimi (listeleme, silme)
- İlan yönetimi (listeleme, silme)
- Kategori oluşturma ve silme

### 🔒 Güvenli Dosya Erişimi
- CV'ler MinIO (S3 uyumlu) bulut depolamada saklanır
- Presigned URL ile geçici erişim (30 dakika geçerli)
- Bucket erişim kontrolü

---

## 🛠️ Teknoloji Yığını

### Backend
| Teknoloji | Sürüm | Kullanım |
|-----------|-------|----------|
| PHP | 8.3 | Sunucu dili |
| Laravel | 11 | API framework |
| Laravel Sanctum | 4.3 | Token authentication |
| Laravel Breeze | 2.4 | Auth scaffolding |
| PostgreSQL | 16 | Ana veritabanı |
| Redis | latest | Cache, session, queue |
| MinIO | latest | S3 uyumlu dosya depolama |

### Frontend
| Teknoloji | Sürüm | Kullanım |
|-----------|-------|----------|
| Next.js | 16.2 | React framework (App Router) |
| TypeScript | latest | Tip güvenliği |
| Tailwind CSS | latest | Utility-first CSS |
| shadcn/ui | latest | UI bileşenleri |
| Axios | latest | HTTP client |

### DevOps & Altyapı
| Teknoloji | Kullanım |
|-----------|----------|
| Docker | Container orchestration |
| Docker Compose | Çoklu servis yönetimi |
| Nginx | Reverse proxy, PHP-FPM yönlendirme |
| Mailpit | Local e-posta testi |
| pgAdmin | PostgreSQL yönetim arayüzü |

---

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    Kullanıcı (Tarayıcı)                  │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3000)                │
│         Login │ Register │ İlanlar │ Dashboard           │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Nginx Reverse Proxy (Port 8080)             │
└─────────────────────────┬───────────────────────────────┘
                          │ FastCGI
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Laravel API (PHP-FPM)                       │
│    Auth │ Jobs │ Applications │ Profiles │ Admin         │
└────┬────────────────┬────────────────────┬──────────────┘
     │                │                    │
     ▼                ▼                    ▼
┌─────────┐    ┌─────────────┐    ┌───────────────┐
│PostgreSQL│    │    Redis    │    │     MinIO     │
│  (veri) │    │(cache/queue)│    │  (CV/dosya)   │
└─────────┘    └─────────────┘    └───────────────┘
```

---

## ⚙️ Kurulum

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

SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PASSWORD=
REDIS_PORT=6379

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
```

### 3. Docker Servisleri Başlat

```bash
docker compose up -d
```

Çalışan servisler:

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
    'password' => 'sifreniz',
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

Frontend: **http://localhost:3000**

---

## 🗺️ Kullanım

### İş Arayan Akışı
1. `/register` → "İş Arıyorum" seç → Kayıt ol
2. `/jobseeker` → Dashboard
3. `/jobseeker/profile` → Profil ve CV yükle
4. `/jobs` → İlanları gez, filtrele
5. `/jobs/[slug]` → İlan detayı → Başvur
6. `/jobseeker/saved` → Kayıtlı ilanlar
7. Dashboard → Başvuru durumlarını takip et

### İşveren Akışı
1. `/register` → "İşveren" seç → Kayıt ol
2. `/employer` → Dashboard
3. `/employer/company` → Şirket profili oluştur
4. `/employer/create-job` → İlan oluştur
5. `/employer/applications/[id]` → Başvuruları yönet
6. Başvuru durumunu güncelle → Adaya otomatik bildirim gider

### Admin Akışı
1. `/login` → Admin bilgileriyle giriş
2. `/admin` → İstatistikler, kullanıcılar, ilanlar, kategoriler

---

## 📡 API Dokümantasyonu

### Auth Endpoint'leri

```
POST   /api/register          → Kayıt ol
POST   /api/login             → Giriş yap
POST   /api/logout            → Çıkış yap (token gerekli)
GET    /api/me                → Giriş yapan kullanıcı (token gerekli)
POST   /api/forgot-password   → Şifre sıfırlama maili
POST   /api/reset-password    → Yeni şifre belirle
DELETE /api/account           → Hesap sil (token gerekli)
```

### İlan Endpoint'leri

```
GET    /api/jobs              → Tüm yayınlanmış ilanlar (herkese açık)
GET    /api/jobs/{slug}       → İlan detayı (herkese açık)
POST   /api/jobs              → İlan oluştur (employer)
PUT    /api/jobs/{id}         → İlan güncelle (employer)
DELETE /api/jobs/{id}         → İlan sil (employer)
GET    /api/my-listings       → Kendi ilanlarım (employer)
```

### Başvuru Endpoint'leri

```
POST   /api/jobs/{id}/apply           → İlana başvur (jobseeker)
GET    /api/my-applications           → Kendi başvurularım (jobseeker)
GET    /api/jobs/{id}/applications    → İlana gelen başvurular (employer)
PUT    /api/applications/{id}/status  → Başvuru durumu güncelle (employer)
```

### Profil & Şirket Endpoint'leri

```
GET    /api/profile      → Profil görüntüle
POST   /api/profile      → Profil oluştur/güncelle
POST   /api/profile/cv   → CV yükle
GET    /api/company      → Şirket profili görüntüle
POST   /api/company      → Şirket oluştur
PUT    /api/company      → Şirket güncelle
```

### Diğer Endpoint'ler

```
GET    /api/categories           → Tüm kategoriler
POST   /api/categories           → Kategori ekle (admin)
DELETE /api/categories/{id}      → Kategori sil (admin)
GET    /api/saved-jobs           → Kayıtlı ilanlar
POST   /api/saved-jobs/{jobId}   → İlanı kaydet
DELETE /api/saved-jobs/{jobId}   → İlanı kayıtlardan çıkar
GET    /api/cv/{path}            → CV presigned URL al
GET    /api/admin/stats          → İstatistikler (admin)
GET    /api/admin/users          → Kullanıcılar (admin)
GET    /api/admin/jobs           → Tüm ilanlar (admin)
DELETE /api/admin/users/{id}     → Kullanıcı sil (admin)
```

---

## 📁 Proje Yapısı

```
job-board/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── ApiAuthController.php
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
│   ├── database/migrations/    # Veritabanı şeması
│   └── routes/
│       └── api.php             # API route'ları
│
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
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
│   │   └── axios.ts            # API client
│   └── types/
│       └── index.ts            # TypeScript tipleri
│
├── nginx/
│   └── default.conf            # Nginx konfigürasyonu
└── docker-compose.yml          # Servis tanımları
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

## 👨‍💻 Geliştirici

**İbrahim Parlak**

---

## 📄 Lisans

MIT License
