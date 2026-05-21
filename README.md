<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Board — Full-Stack İş İlanı Platformu</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts Inter & Fira Code -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        pre, code { font-family: 'Fira Code', monospace; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased line-clamp-none">

    <div class="max-w-4xl mx-auto px-4 py-12 md:py-20">
        
        <!-- Header -->
        <header class="mb-12 border-b border-slate-200 pb-8">
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                🚀 Job Board — Full-Stack İş İlanı Platformu
            </h1>
            <p class="mt-4 text-lg text-slate-600 leading-relaxed">
                Modern, ölçeklenebilir ve rol tabanlı bir iş ilanı platformu. Laravel (PHP) backend API, Next.js frontend, Docker altyapısı ve bulut depolama entegrasyonu ile geliştirilmiştir.
            </p>
        </header>

        <!-- Proje Hakkında -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">📌 Proje Hakkında</h2>
            <p class="text-slate-600 leading-relaxed mb-6">
                Job Board, işverenler ve iş arayanları bir araya getiren tam özellikli bir kariyer platformudur. LinkedIn ve Kariyer.net gibi platformlardan ilham alınarak modern bir teknoloji yığını üzerine inşa edilmiştir.
            </p>
            
            <h3 class="text-xl font-semibold text-slate-900 mb-3">Kullanıcı Rolleri & Yetkileri</h3>
            <div class="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg shadow-sm">
                <table class="w-full text-left border-collapse bg-white">
                    <thead>
                        <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <th class="p-4 w-1/4">Rol</th>
                            <th class="p-4">Yetki Alanı</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 text-slate-600">
                        <tr class="hover:bg-slate-50">
                            <td class="p-4 font-semibold text-slate-900">Jobseeker (İş Arayan)</td>
                            <td class="p-4">İlan görüntüleme, başvuru yapma, CV yükleme, ilan kaydetme, profil oluşturma</td>
                        </tr>
                        <tr class="hover:bg-slate-50">
                            <td class="p-4 font-semibold text-slate-900">Employer (İşveren)</td>
                            <td class="p-4">Şirket profili, ilan oluşturma/düzenleme/silme, başvuru yönetimi (ATS)</td>
                        </tr>
                        <tr class="hover:bg-slate-50">
                            <td class="p-4 font-semibold text-slate-900">Admin</td>
                            <td class="p-4">Tüm kullanıcı ve ilan yönetimi, kategori yönetimi, istatistik paneli</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Özellikler -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">✨ Özellikler</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Kimlik Doğrulama -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">🔐 Kimlik Doğrulama & Güvenlik</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>Token tabanlı authentication (<span class="font-medium text-slate-900">Laravel Sanctum</span>)</li>
                        <li>Kullanıcı kaydı ve girişi <span class="text-sm text-slate-500">(rol seçimi: iş arayan / işveren)</span></li>
                        <li><span class="font-medium text-slate-900">Google OAuth 2.0</span> ile giriş</li>
                        <li>Şifre sıfırlama <span class="text-sm text-slate-500">(e-posta ile token doğrulamalı)</span></li>
                        <li>Tüm cihazlardan çıkış <span class="text-sm text-slate-500">(token invalidation)</span></li>
                        <li>Hesap silme</li>
                    </ul>
                </div>

                <!-- Kullanıcı Profili -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">👤 Kullanıcı Profili (Jobseeker)</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>Kişisel bilgiler <span class="text-sm text-slate-500">(ünvan, biyografi, şehir, telefon)</span></li>
                        <li>LinkedIn, GitHub, portfolio URL bağlantıları</li>
                        <li>Deneyim yılı ve beklenen maaş bilgisi</li>
                        <li><span class="italic">"İş tekliflerine açığım"</span> durumu</li>
                        <li>PDF CV yükleme (<span class="font-medium text-slate-900">Cloudflare R2</span> — S3 uyumlu bulut depolama)</li>
                    </ul>
                </div>

                <!-- Şirket Profili -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">🏢 Şirket Profili (Employer)</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>Şirket adı, sektör, şehir, çalışan sayısı</li>
                        <li>Kuruluş yılı ve website bilgisi</li>
                        <li>Şirket açıklaması</li>
                    </ul>
                </div>

                <!-- İş İlanı Yönetimi -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">💼 İş İlanı Yönetimi</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>İlan oluşturma, düzenleme, silme</li>
                        <li><span class="font-medium text-slate-900">Çalışma tipi:</span> Tam zamanlı, Yarı zamanlı, Freelance, Staj</li>
                        <li><span class="font-medium text-slate-900">Lokasyon tipi:</span> Ofis, Uzaktan, Hibrit</li>
                        <li>Maaş aralığı <span class="text-sm text-slate-500">(TRY/USD/EUR, görünürlük kontrolü)</span></li>
                        <li><span class="font-medium text-slate-900">İlan durumu:</span> Taslak, Yayında, Kapalı</li>
                        <li>Otomatik slug oluşturma</li>
                        <li>Kategori sistemi</li>
                    </ul>
                </div>

                <!-- Başvuru Sistemi -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">📄 Başvuru Sistemi (ATS)</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>İlana başvuru <span class="text-sm text-slate-500">(ön yazı + PDF CV yükleme)</span></li>
                        <li><span class="font-medium text-slate-900">Başvuru durumu takibi:</span> Beklemede &rarr; İnceleniyor &rarr; Kısa Listede &rarr; İşe Alındı / Reddedildi</li>
                        <li>İşveren notu <span class="text-sm text-slate-500">(adaya gizli)</span></li>
                        <li>Aynı ilana tekrar başvuru engeli</li>
                    </ul>
                </div>

                <!-- E-posta Bildirimleri -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">📧 E-posta Bildirimleri</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>Başvuru yapılınca işverene bildirim: <span class="italic">"X adlı aday başvurdu"</span></li>
                        <li>Başvuru yapılınca adaya bildirim: <span class="italic">"Başvurunuz alındı"</span></li>
                        <li>Başvuru durumu değişince adaya bildirim: <span class="italic">"Başvurunuz güncellendi"</span></li>
                        <li>Şifre sıfırlama maili</li>
                    </ul>
                </div>

                <!-- Kayıtlı İlanlar -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">🔖 Kayıtlı İlanlar</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>İlanı favorilere ekleme / çıkarma</li>
                        <li>Kaydedilen ilanları listeleme</li>
                    </ul>
                </div>

                <!-- Admin Paneli -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">📊 Admin Paneli</h3>
                    <ul class="list-disc list-inside space-y-2 text-slate-600 pl-1">
                        <li>Kullanıcı istatistikleri <span class="text-sm text-slate-500">(toplam, işveren, iş arayan)</span></li>
                        <li>İlan ve başvuru istatistikleri</li>
                        <li>Kullanıcı yönetimi <span class="text-sm text-slate-500">(listeleme, silme)</span></li>
                        <li>İlan yönetimi <span class="text-sm text-slate-500">(listeleme, silme)</span></li>
                        <li>Kategori oluşturma ve silme</li>
                    </ul>
                </div>
            </div>

            <!-- Güvenli Dosya Erişimi -->
            <div class="mt-8 bg-amber-50 border border-amber-200 p-5 rounded-xl">
                <h3 class="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">🔒 Güvenli Dosya Erişimi</h3>
                <ul class="list-disc list-inside space-y-1 text-amber-800">
                    <li>CV'ler <span class="font-semibold">Cloudflare R2</span> (S3 uyumlu) bulut depolamada saklanır.</li>
                    <li><span class="font-semibold">Presigned URL</span> ile geçici erişim sağlanır <span class="text-sm opacity-90">(30 dakika geçerli)</span>.</li>
                    <li>Bucket private konumdadır, dışarıdan doğrudan erişim tamamen kapalıdır.</li>
                </ul>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Teknoloji Yığını -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">🛠️ Teknoloji Yığını</h2>
            
            <div class="space-y-8">
                <!-- Backend -->
                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-3">Backend</h3>
                    <div class="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg shadow-sm">
                        <table class="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                    <th class="p-3 w-1/3">Teknoloji</th>
                                    <th class="p-3 w-1/6">Sürüm</th>
                                    <th class="p-3">Kullanım Amacı</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 text-slate-600 text-sm">
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">PHP</td>
                                    <td class="p-3">8.3</td>
                                    <td class="p-3">Sunucu dili</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Laravel</td>
                                    <td class="p-3">11</td>
                                    <td class="p-3">API framework</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Laravel Sanctum</td>
                                    <td class="p-3">4.3</td>
                                    <td class="p-3">Token authentication</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Laravel Socialite</td>
                                    <td class="p-3">5.x</td>
                                    <td class="p-3">Google OAuth</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Laravel Breeze</td>
                                    <td class="p-3">2.4</td>
                                    <td class="p-3">Auth scaffolding</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">PostgreSQL</td>
                                    <td class="p-3">16</td>
                                    <td class="p-3">Ana veritabanı</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Cloudflare R2</td>
                                    <td class="p-3">—</td>
                                    <td class="p-3">S3 uyumlu dosya depolama</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Frontend -->
                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-3">Frontend</h3>
                    <div class="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg shadow-sm">
                        <table class="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                    <th class="p-3 w-1/3">Teknoloji</th>
                                    <th class="p-3 w-1/6">Sürüm</th>
                                    <th class="p-3">Kullanım Amacı</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 text-slate-600 text-sm">
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Next.js</td>
                                    <td class="p-3">15+</td>
                                    <td class="p-3">React framework (App Router)</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">TypeScript</td>
                                    <td class="p-3">latest</td>
                                    <td class="p-3">Tip güvenliği</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Tailwind CSS</td>
                                    <td class="p-3">latest</td>
                                    <td class="p-3">Utility-first CSS</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">shadcn/ui</td>
                                    <td class="p-3">latest</td>
                                    <td class="p-3">UI bileşenleri</td>
                                </tr>
                                <tr class="hover:bg-slate-50">
                                    <td class="p-3 font-medium text-slate-900">Axios</td>
                                    <td class="p-3">latest</td>
                                    <td class="p-3">HTTP client</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- DevOps & Production Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-3">DevOps & Altyapı (Local)</h3>
                        <div class="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg shadow-sm">
                            <table class="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                        <th class="p-3 w-1/2">Teknoloji</th>
                                        <th class="p-3">Kullanım Amacı</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 text-slate-600 text-sm">
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Docker</td>
                                        <td class="p-3">Container orchestration</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Docker Compose</td>
                                        <td class="p-3">Çoklu servis yönetimi</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Nginx</td>
                                        <td class="p-3">Reverse proxy, PHP-FPM yönlendirme</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Mailpit</td>
                                        <td class="p-3">Local e-posta testi</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">MinIO</td>
                                        <td class="p-3">Local S3 dosya depolama</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">pgAdmin</td>
                                        <td class="p-3">PostgreSQL arayüzü</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-3">Production Servisleri</h3>
                        <div class="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg shadow-sm">
                            <table class="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                        <th class="p-3 w-1/2">Servis</th>
                                        <th class="p-3">Platform</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 text-slate-600 text-sm">
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Backend API</td>
                                        <td class="p-3">Render.com</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Frontend</td>
                                        <td class="p-3">Netlify</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Veritabanı</td>
                                        <td class="p-3">Supabase (PostgreSQL)</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">Dosya Depolama</td>
                                        <td class="p-3">Cloudflare R2</td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-medium text-slate-900">E-posta</td>
                                        <td class="p-3">Mailtrap / Gmail SMTP</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Mimari -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">🏗️ Mimari</h2>
            <div class="bg-slate-900 p-6 rounded-xl overflow-x-auto custom-scrollbar shadow-inner">
                <pre class="text-emerald-400 text-sm leading-relaxed">
┌─────────────────────────────────────────────────────────┐
│                    Kullanıcı (Tarayıcı)                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│          Next.js Frontend (Netlify)                     │
│    Login │ Register │ İlanlar │ Dashboard                │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────┐
│          Laravel API (Render.com)                       │
│    Auth │ Jobs │ Applications │ Profiles │ Admin         │
└────┬────────────────┬────────────────────┬──────────────┘
     │                │                    │
     ▼                ▼                    ▼
┌──────────┐   ┌────────────┐   ┌──────────────────┐
│ Supabase │   │  Mailtrap  │   │  Cloudflare R2   │
│(PostgreSQL)  │  (E-posta) │   │  (CV/dosya)      │
└──────────┘   └────────────┘   └──────────────────┘</pre>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Local Geliştirme Kurulumu -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">⚙️ Local Geliştirme Kurulumu</h2>
            
            <div class="space-y-4 text-slate-600 mb-8">
                <p class="font-medium text-slate-900">Gereksinimler:</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li>Docker Desktop</li>
                    <li>Node.js 18+</li>
                    <li>Git</li>
                </ul>
            </div>

            <div class="space-y-8">
                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">1. Repoyu Klonla</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                        <pre><span class="text-slate-500">git clone</span> https://github.com/kullanici/job-board.git
<span class="text-slate-500">cd</span> job-board</pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">2. Backend Ortam Değişkenleri</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar mb-2">
                        <pre><span class="text-slate-500">cp</span> backend/.env.example backend/.env</pre>
                    </div>
                    <p class="text-sm text-slate-500 mb-3"><code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border">.env</code> dosyasını düzenleyin:</p>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar max-h-96">
                        <pre><span class="text-amber-400">APP_NAME</span>="Job Board"
<span class="text-amber-400">APP_URL</span>=http://localhost:8080
<span class="text-amber-400">FRONTEND_URL</span>=http://localhost:3000

<span class="text-amber-400">DB_CONNECTION</span>=pgsql
<span class="text-amber-400">DB_HOST</span>=postgres
<span class="text-amber-400">DB_PORT</span>=5432
<span class="text-amber-400">DB_DATABASE</span>=job_board
<span class="text-amber-400">DB_USERNAME</span>=job_user
<span class="text-amber-400">DB_PASSWORD</span>=secret123

<span class="text-amber-400">SESSION_DRIVER</span>=file
<span class="text-amber-400">CACHE_STORE</span>=file
<span class="text-amber-400">QUEUE_CONNECTION</span>=sync

<span class="text-slate-500"># Local MinIO ayarları</span>
<span class="text-amber-400">FILESYSTEM_DISK</span>=s3
<span class="text-amber-400">AWS_ACCESS_KEY_ID</span>=minioadmin
<span class="text-amber-400">AWS_SECRET_ACCESS_KEY=</span>minio_secret123
<span class="text-amber-400">AWS_DEFAULT_REGION</span>=us-east-1
<span class="text-amber-400">AWS_BUCKET</span>=job-board
<span class="text-amber-400">AWS_ENDPOINT</span>=http://minio:9000
<span class="text-amber-400">AWS_URL</span>=http://localhost:9000
<span class="text-amber-400">AWS_USE_PATH_STYLE_ENDPOINT</span>=true

<span class="text-amber-400">MAIL_MAILER</span>=smtp
<span class="text-amber-400">MAIL_HOST</span>=mailpit
<span class="text-amber-400">MAIL_PORT</span>=1025
<span class="text-amber-400">MAIL_FROM_ADDRESS</span>="noreply@jobboard.com"

<span class="text-amber-400">GOOGLE_CLIENT_ID</span>=your_google_client_id
<span class="text-amber-400">GOOGLE_CLIENT_SECRET</span>=your_google_client_secret
<span class="text-amber-400">GOOGLE_REDIRECT_URI</span>=http://localhost:8080/api/auth/google/callback
<span class="text-amber-400">GOOGLE_ENABLED</span>=true</pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">3. Docker Servisleri Başlat</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar mb-4">
                        <pre>docker compose up -d</pre>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg">
                        <table class="w-full text-left border-collapse bg-white text-sm">
                            <thead>
                                <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                    <th class="p-3 w-1/3">Servis</th>
                                    <th class="p-3">Adres</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 text-slate-600">
                                <tr><td class="p-3 font-medium text-slate-900">Backend API</td><td class="p-3"><a href="http://localhost:8080" class="text-blue-600 hover:underline">http://localhost:8080</a></td></tr>
                                <tr><td class="p-3 font-medium text-slate-900">pgAdmin</td><td class="p-3"><a href="http://localhost:5050" class="text-blue-600 hover:underline">http://localhost:5050</a></td></tr>
                                <tr><td class="p-3 font-medium text-slate-900">MinIO UI</td><td class="p-3"><a href="http://localhost:9001" class="text-blue-600 hover:underline">http://localhost:9001</a></td></tr>
                                <tr><td class="p-3 font-medium text-slate-900">Mailpit</td><td class="p-3"><a href="http://localhost:8025" class="text-blue-600 hover:underline">http://localhost:8025</a></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">4. Veritabanı Kurulumu</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                        <pre>docker compose exec app php artisan migrate</pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">5. MinIO Bucket Oluştur</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                        <pre>docker compose exec minio mc alias set local http://localhost:9000 minioadmin minio_secret123
docker compose exec minio mc mb local/job-board</pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">6. Admin Kullanıcısı Oluştur</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                        <pre><span class="text-slate-400">docker compose exec app php artisan tinker</span>

App\Models\User::create([
    <span class="text-teal-400">'name'</span> => <span class="text-emerald-400">'Admin'</span>,
    <span class="text-teal-400">'email'</span> => <span class="text-emerald-400">'admin@jobboard.com'</span>,
    <span class="text-teal-400">'password'</span> => bcrypt(<span class="text-emerald-400">'sifreniz'</span>),
    <span class="text-teal-400">'role'</span> => <span class="text-emerald-400">'admin'</span>
]);</pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">7. Frontend Kurulumu</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar mb-3">
                        <pre><span class="text-slate-500">cd</span> frontend
npm install</pre>
                    </div>
                    <p class="text-sm text-slate-500 mb-2"><code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border">.env.local</code> dosyası oluşturun:</p>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar mb-3">
                        <pre><span class="text-amber-400">NEXT_PUBLIC_API_URL</span>=http://localhost:8080/api</pre>
                    </div>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                        <pre>npm run dev</pre>
                    </div>
                    <p class="text-sm text-slate-600 mt-2">🌐 Frontend: <a href="http://localhost:3000" class="text-blue-600 hover:underline">http://localhost:3000</a></p>
                </div>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Production Deploy -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">🚀 Production Deploy</h2>
            
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Backend (Render.com) Env Variables</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar max-h-64">
                        <pre><span class="text-amber-400">APP_ENV</span>=production
<span class="text-amber-400">APP_DEBUG</span>=false
<span class="text-amber-400">APP_URL</span>=https://your-backend.onrender.com
<span class="text-amber-400">FRONTEND_URL</span>=https://your-frontend.netlify.app
<span class="text-amber-400">DB_CONNECTION</span>=pgsql
<span class="text-amber-400">DB_HOST</span>=your-supabase-host
<span class="text-amber-400">FILESYSTEM_DISK</span>=s3
<span class="text-amber-400">AWS_ENDPOINT</span>=https://your-account-id.r2.cloudflarestorage.com
<span class="text-amber-400">AWS_USE_PATH_STYLE_ENDPOINT</span>=false
<span class="text-amber-400">MAIL_MAILER</span>=smtp
<span class="text-amber-400">MAIL_HOST</span>=sandbox.smtp.mailtrap.io</pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Frontend (Netlify) Env</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                        <pre><span class="text-amber-400">NEXT_PUBLIC_API_URL</span>=https://your-backend.onrender.com/api</pre>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4 text-slate-600 text-sm">
                    <div>
                        <p class="font-semibold text-slate-900 mb-1">☁️ Cloudflare R2 Kurulumu</p>
                        <p>cloudflare.com &rarr; R2 Object Storage &rarr; Create bucket (<code class="bg-slate-100 text-slate-800 px-1 rounded">job-board</code>)<br>
                        API Tokens &rarr; Create Account API Token &rarr; Object Read & Write<br>
                        Access Key ID ve Secret Access Key'i Render env ayarlarına ekleyin.</p>
                    </div>
                    <div>
                        <p class="font-semibold text-slate-900 mb-1">🔑 Google OAuth Kurulumu</p>
                        <p>Google Cloud Console &rarr; Credentials &rarr; OAuth Client &rarr; Authorized redirect URIs değerine ekleyin:<br>
                        <code class="bg-slate-100 text-slate-800 px-1 rounded break-all">https://your-backend.onrender.com/api/auth/google/callback</code></p>
                    </div>
                </div>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Kullanım Akışları -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">🗺️ Kullanım Akışları</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-5 rounded-lg border border-slate-200">
                    <h3 class="font-bold text-slate-900 mb-3 border-b pb-2">👤 İş Arayan Akışı</h3>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li><span class="font-medium text-slate-900">/register</span> &rarr; "İş Arıyorum"</li>
                        <li><span class="font-medium text-slate-900">/jobseeker/dashboard</span></li>
                        <li><span class="font-medium text-slate-900">/jobseeker/profile</span> &rarr; CV Yükle</li>
                        <li><span class="font-medium text-slate-900">/jobs</span> &rarr; İlanları Listele / Filtrele</li>
                        <li><span class="font-medium text-slate-900">/jobs/[slug]</span> &rarr; Başvur</li>
                        <li><span class="font-medium text-slate-900">/jobseeker/saved</span> &rarr; Favoriler</li>
                    </ul>
                </div>

                <div class="bg-white p-5 rounded-lg border border-slate-200">
                    <h3 class="font-bold text-slate-900 mb-3 border-b pb-2">🏢 İşveren Akışı</h3>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li><span class="font-medium text-slate-900">/register</span> &rarr; "İşveren"</li>
                        <li><span class="font-medium text-slate-900">/employer/dashboard</span></li>
                        <li><span class="font-medium text-slate-900">/employer/company</span> &rarr; Profil</li>
                        <li><span class="font-medium text-slate-900">/employer/create-job</span> &rarr; İlan Aç</li>
                        <li><span class="font-medium text-slate-900">/employer/applications/[id]</span> &rarr; ATS</li>
                        <li class="text-xs text-slate-400 italic pt-1">* Durum güncellenince adaya otomatik mail gider.</li>
                    </ul>
                </div>

                <div class="bg-white p-5 rounded-lg border border-slate-200">
                    <h3 class="font-bold text-slate-900 mb-3 border-b pb-2">👑 Admin Akışı</h3>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li><span class="font-medium text-slate-900">/login</span> &rarr; Admin Bilgileri</li>
                        <li><span class="font-medium text-slate-900">/admin</span> &rarr; İstatistikler, Kullanıcı, İlan ve Kategori Tam Kontrolü</li>
                    </ul>
                </div>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- API Dokümantasyonu -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">📡 API Dokümantasyonu</h2>
            
            <div class="space-y-6">
                <div>
                    <h3 class="text-base font-semibold text-slate-700 mb-2">Auth Endpoint'leri</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg text-xs md:text-sm overflow-x-auto custom-scrollbar">
                        <pre><span class="text-teal-400">POST</span>   /api/register                 <span class="text-slate-500">→ Kayıt ol</span>
<span class="text-teal-400">POST</span>   /api/login                    <span class="text-slate-500">→ Giriş yap</span>
<span class="text-teal-400">POST</span>   /api/logout                   <span class="text-slate-500">→ Çıkış yap (token gerekli)</span>
<span class="text-sky-400">GET</span>    /api/me                       <span class="text-slate-500">→ Giriş yapan kullanıcı (token gerekli)</span>
<span class="text-teal-400">POST</span>   /api/forgot-password          <span class="text-slate-500">→ Şifre sıfırlama maili</span>
<span class="text-teal-400">POST</span>   /api/reset-password           <span class="text-slate-500">→ Yeni şifre belirle</span>
<span class="text-rose-400">DELETE</span> /api/account                  <span class="text-slate-500">→ Hesap sil (token gerekli)</span>
<span class="text-sky-400">GET</span>    /api/auth/google/redirect     <span class="text-slate-500">→ Google OAuth yönlendirme</span>
<span class="text-sky-400">GET</span>    /api/auth/google/callback     <span class="text-slate-500">→ Google OAuth callback</span></pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-base font-semibold text-slate-700 mb-2">İlan Endpoint'leri</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg text-xs md:text-sm overflow-x-auto custom-scrollbar">
                        <pre><span class="text-sky-400">GET</span>    /api/jobs                     <span class="text-slate-500">→ Tüm yayınlanmış ilanlar (herkese açık)</span>
<span class="text-sky-400">GET</span>    /api/jobs/{slug}              <span class="text-slate-500">→ İlan detayı (herkese açık)</span>
<span class="text-teal-400">POST</span>   /api/jobs                     <span class="text-slate-500">→ İlan oluştur (employer)</span>
<span class="text-amber-400">PUT</span>    /api/jobs/{id}                <span class="text-slate-500">→ İlan güncelle (employer)</span>
<span class="text-rose-400">DELETE</span> /api/jobs/{id}                <span class="text-slate-500">→ İlan sil (employer)</span>
<span class="text-sky-400">GET</span>    /api/my-listings              <span class="text-slate-500">→ Kendi ilanlarım (employer)</span></pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-base font-semibold text-slate-700 mb-2">Başvuru Endpoint'leri</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg text-xs md:text-sm overflow-x-auto custom-scrollbar">
                        <pre><span class="text-teal-400">POST</span>   /api/jobs/{id}/apply          <span class="text-slate-500">→ İlana başvur (jobseeker)</span>
<span class="text-sky-400">GET</span>    /api/my-applications          <span class="text-slate-500">→ Kendi başvurularım (jobseeker)</span>
<span class="text-sky-400">GET</span>    /api/jobs/{id}/applications   <span class="text-slate-500">→ İlana gelen başvurular (employer)</span>
<span class="text-amber-400">PUT</span>    /api/applications/{id}/status <span class="text-slate-500">→ Başvuru durumu güncelle (employer)</span></pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-base font-semibold text-slate-700 mb-2">Profil & Şirket Endpoint'leri</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg text-xs md:text-sm overflow-x-auto custom-scrollbar">
                        <pre><span class="text-sky-400">GET</span>    /api/profile                  <span class="text-slate-500">→ Profil görüntüle</span>
<span class="text-teal-400">POST</span>   /api/profile                  <span class="text-slate-500">→ Profil oluştur/güncelle</span>
<span class="text-teal-400">POST</span>   /api/profile/cv               <span class="text-slate-500">→ CV yükle</span>
<span class="text-rose-400">DELETE</span> /api/profile/cv               <span class="text-slate-500">→ CV sil</span>
<span class="text-sky-400">GET</span>    /api/company                  <span class="text-slate-500">→ Şirket profili görüntüle</span>
<span class="text-teal-400">POST</span>   /api/company                  <span class="text-slate-500">→ Şirket oluştur</span>
<span class="text-amber-400">PUT</span>    /api/company                  <span class="text-slate-500">→ Şirket güncelle</span></pre>
                    </div>
                </div>

                <div>
                    <h3 class="text-base font-semibold text-slate-700 mb-2">Diğer Endpoint'ler</h3>
                    <div class="bg-slate-900 text-slate-200 p-4 rounded-lg text-xs md:text-sm overflow-x-auto custom-scrollbar">
                        <pre><span class="text-sky-400">GET</span>    /api/categories               <span class="text-slate-500">→ Tüm kategoriler</span>
<span class="text-teal-400">POST</span>   /api/categories               <span class="text-slate-500">→ Kategori ekle (admin)</span>
<span class="text-rose-400">DELETE</span> /api/categories/{id}          <span class="text-slate-500">→ Kategori sil (admin)</span>
<span class="text-sky-400">GET</span>    /api/saved-jobs               <span class="text-slate-500">→ Kayıtlı ilanlar</span>
<span class="text-teal-400">POST</span>   /api/saved-jobs/{jobId}       <span class="text-slate-500">→ İlanı kaydet</span>
<span class="text-rose-400">DELETE</span> /api/saved-jobs/{jobId}       <span class="text-slate-500">→ İlanı kayıtlardan çıkar</span>
<span class="text-sky-400">GET</span>    /api/cv/{path}                <span class="text-slate-500">→ CV presigned URL al</span>
<span class="text-sky-400">GET</span>    /api/admin/stats              <span class="text-slate-500">→ İstatistikler (admin)</span>
<span class="text-sky-400">GET</span>    /api/admin/users              <span class="text-slate-500">→ Kullanıcılar (admin)</span>
<span class="text-sky-400">GET</span>    /api/admin/jobs               <span class="text-slate-500">→ Tüm ilanlar (admin)</span>
<span class="text-rose-400">DELETE</span> /api/admin/users/{id}         <span class="text-slate-500">→ Kullanıcı sil (admin)</span>
<span class="text-rose-400">DELETE</span> /api/admin/jobs/{id}          <span class="text-slate-500">→ İlan sil (admin)</span></pre>
                    </div>
                </div>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Proje Yapısı -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">📁 Proje Yapısı</h2>
            <div class="bg-slate-900 text-slate-300 p-6 rounded-xl overflow-x-auto custom-scrollbar text-sm">
                <pre><span class="text-amber-400 font-semibold">job-board/</span>
├── <span class="text-sky-400">backend/</span>                    <span class="text-slate-500"># Laravel API</span>
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
├── <span class="text-sky-400">frontend/</span>                   <span class="text-slate-500"># Next.js</span>
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── callback/        <span class="text-slate-500"># Google OAuth callback</span>
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
└── docker-compose.yml</pre>
            </div>
        </section>

        <hr class="border-slate-200 my-12" />

        <!-- Veritabanı Şeması -->
        <section class="mb-16">
            <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">🗄️ Veritabanı Şeması</h2>
            <div class="bg-slate-900 p-6 rounded-xl overflow-x-auto custom-scrollbar shadow-inner text-sm text-teal-400">
                <pre>
<span class="text-white font-semibold">users</span>
 ├── profiles         (1-1)
 ├── companies        (1-1)
 ├── job_applications (1-N)
 └── saved_jobs       (1-N)

<span class="text-white font-semibold">companies</span>
 └── job_listings     (1-N)

<span class="text-white font-semibold">categories</span>
 └── job_listings     (1-N)

<span class="text-white font-semibold">job_listings</span>
 └── job_applications (1-N)
     └── saved_jobs   (N-N via pivot)</pre>
            </div>
        </section>

        <!-- Footer -->
        <footer class="mt-20 border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>
                Geliştirici: <span class="font-semibold text-slate-700">İbrahim Parlak</span>
            </div>
            <div>
                Lisans: <span class="font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border text-xs">MIT License</span>
            </div>
        </footer>

    </div>

</body>
</html>
