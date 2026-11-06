
FROM php:8.4.27-fpm

WORKDIR /var/www

# Sistem bağımlılıkları
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# PHP eklentileri
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Redis eklentisi
RUN pecl install redis \
    && docker-php-ext-enable redis

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Uygulama dosyaları
COPY . .

# Composer bağımlılıkları
RUN composer install \
    --no-interaction \
    --optimize-autoloader \
    --no-dev \
    --prefer-dist

# Laravel izinleri
RUN chown -R www-data:www-data \
    /var/www/storage \
    /var/www/bootstrap/cache \
    && chmod -R 775 \
    /var/www/storage \
    /var/www/bootstrap/cache

# PHP-FPM portu
EXPOSE 9000

# PHP-FPM başlat
CMD ["php-fpm"]
