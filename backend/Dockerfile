
FROM php:8.1-apache


RUN apt-get update && apt-get install -y \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


COPY . /var/www/html


WORKDIR /var/www/html
RUN composer install GraphQL 
RUN composer install  require illuminate/database 


RUN chown -R www-data:www-data /var/www/html


CMD ["apache2-foreground"]
