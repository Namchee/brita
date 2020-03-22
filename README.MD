# Brita API

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts) ![dependencies: up to date](https://img.shields.io/david/namchee/brita) ![devDependencies: up to date](https://img.shields.io/david/dev/namchee/brita)

Brita adalah sebuah aplikasi sederhana untuk mengelola pengumuman. Sederhananya, anggap saja ini merupakan sebuah CMS custom.

Repository ini merupakan bagian dari API untuk ekosistem brita. Nantinya, API ini dapat di _consume_ oleh _chatbot_ seperti [ini](https://github.com/Namchee/brita-line-channel)

## Fitur

1. Sistem pengelolaan pengumuman yang berkategori (ingat _Wordpress_?)
2. REST API sesuai standar
3. Sistem autentikasi menggunakan akun Google

## Environment

1. NodeJS version >= 10.x.x
2. NPM version >= 6.13

## Instalasi

1. Clone repository ini
2. Lakukan `npm install`
3. Lakukan migrasi database dengan mengganti informasi yang ada pada [`database.json`](database.json) pada bagian `dev` dengan informasi yang ada pada _environment_ yang tersedia
4. Lakukan `npm run build`. Atau lakukan `npm run dev` untuk menggunakan fitur _hot reload_ (lebih lambat, namun tidak perlu ke langkah 5)
5. Lakukan `npm start`, aplikasi sudah bisa digunakan pada `localhost:8080`.

## Command List

Coming Soon

## Endpoints

Coming Soon

## Developer

Cristopher Namchee - [GitHub](https://github.com/Namchee)

## Lisensi

Project ini dilisensikan menggunakan [lisensi GNU GPLv3](LICENSE).
