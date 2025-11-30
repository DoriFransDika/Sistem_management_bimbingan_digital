<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Materi;

class MateriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materiData = [
            // Administrasi Perkantoran
            [
                'modul' => 'Administrasi Perkantoran',
                'pertemuan' => 1,
                'topik' => 'Microsoft Word',
                'sub_topik' => 'Pengenalan, Format Teks, Insert, Paragraf & Penomoran, Mail Merge'
            ],
            [
                'modul' => 'Administrasi Perkantoran',
                'pertemuan' => 2,
                'topik' => 'Microsoft Excel Dasar',
                'sub_topik' => 'Pengantar, Rumus Dasar, Fungsi Dasar, Fungsi Lanjutan'
            ],
            [
                'modul' => 'Administrasi Perkantoran',
                'pertemuan' => 3,
                'topik' => 'Microsoft Excel Lanjutan',
                'sub_topik' => 'Fungsi HLOOKUP & VLOOKUP, Grafik Dasar, Chart, Pivot Tabel'
            ],
            [
                'modul' => 'Administrasi Perkantoran',
                'pertemuan' => 4,
                'topik' => 'Microsoft PowerPoint',
                'sub_topik' => 'Pengantar, Teks & Gambar, Transisi & Animasi'
            ],
            [
                'modul' => 'Administrasi Perkantoran',
                'pertemuan' => 5,
                'topik' => '-',
                'sub_topik' => 'Pembuatan Akun LinkedIn dan CV ATS'
            ],
            [
                'modul' => 'Administrasi Perkantoran',
                'pertemuan' => 6,
                'topik' => '-',
                'sub_topik' => 'Tes Kemampuan'
            ],

            // Desain Grafis
            [
                'modul' => 'Desain Grafis',
                'pertemuan' => 1,
                'topik' => 'Pengenalan Desain Grafis & Figma',
                'sub_topik' => 'Definisi, antarmuka, instalasi Figma'
            ],
            [
                'modul' => 'Desain Grafis',
                'pertemuan' => 2,
                'topik' => 'Dasar-dasar Figma',
                'sub_topik' => 'Frame & layers, tools dasar, grid & layout'
            ],
            [
                'modul' => 'Desain Grafis',
                'pertemuan' => 3,
                'topik' => 'Desain Identitas Visual (Branding)',
                'sub_topik' => 'Logo, brand consistency, warna & tipografi'
            ],
            [
                'modul' => 'Desain Grafis',
                'pertemuan' => 4,
                'topik' => 'Desain Materi Promosi',
                'sub_topik' => 'Poster & banner, hierarki informasi, gambar & ilustrasi'
            ],
            [
                'modul' => 'Desain Grafis',
                'pertemuan' => 5,
                'topik' => 'Desain Media Sosial & CV',
                'sub_topik' => 'Desain post & story, penggunaan template, strategi desain, pembuatan CV'
            ],
            [
                'modul' => 'Desain Grafis',
                'pertemuan' => 6,
                'topik' => '-',
                'sub_topik' => 'Tes Kemampuan'
            ],

            // Pemrograman Web Dasar
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 1,
                'topik' => 'Pengenalan HTML',
                'sub_topik' => 'Struktur Dasar HTML'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 2,
                'topik' => 'Penggunaan Tag Dasar HTML',
                'sub_topik' => 'Teks & Paragraf, List & Tabel'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 3,
                'topik' => 'Penggunaan Media & Hyperlink',
                'sub_topik' => 'Gambar & Multimedia, Hyperlink'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 4,
                'topik' => 'Pengantar CSS',
                'sub_topik' => 'Sejarah & peran, Penulisan CSS, Selektor, Properti & Nilai'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 5,
                'topik' => 'Pengantar CSS',
                'sub_topik' => 'Sejarah & peran, Penulisan CSS, Selektor, Properti & Nilai'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 6,
                'topik' => 'Pengaturan Teks & Box Model',
                'sub_topik' => 'Styling Teks, Box Model'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 7,
                'topik' => 'Positioning & Layout',
                'sub_topik' => 'Penggunaan position, konsep layout'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 8,
                'topik' => 'Proyek Akhir',
                'sub_topik' => 'Menggabungkan HTML & CSS, styling, layout & visual effects'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 9,
                'topik' => 'Proyek Akhir',
                'sub_topik' => 'Menggabungkan HTML & CSS, styling, layout & visual effects'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 10,
                'topik' => 'Proyek Akhir',
                'sub_topik' => 'Menggabungkan HTML & CSS, styling, layout & visual effects'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 11,
                'topik' => '-',
                'sub_topik' => 'Pembuatan Akun LinkedIn dan CV ATS'
            ],
            [
                'modul' => 'Pemrograman Web Dasar',
                'pertemuan' => 12,
                'topik' => '-',
                'sub_topik' => 'Tes Kemampuan'
            ],

            // UI/UX Design
            [
                'modul' => 'UI/UX Design',
                'pertemuan' => 1,
                'topik' => 'Pengenalan UI/UX Design & Figma',
                'sub_topik' => 'Konsep UI & UX, Peran Figma, Instalasi & antarmuka'
            ],
            [
                'modul' => 'UI/UX Design',
                'pertemuan' => 2,
                'topik' => 'Dasar-dasar Figma',
                'sub_topik' => 'Frame & layers, tools dasar, grid & layout'
            ],
            [
                'modul' => 'UI/UX Design',
                'pertemuan' => 3,
                'topik' => 'Desain Komponen Dasar',
                'sub_topik' => 'Button, form, card, styling, prinsip desain'
            ],
            [
                'modul' => 'UI/UX Design',
                'pertemuan' => 4,
                'topik' => 'Prototyping di Figma',
                'sub_topik' => 'Tautan antar frame, interaksi & animasi, uji prototipe'
            ],
            [
                'modul' => 'UI/UX Design',
                'pertemuan' => 5,
                'topik' => 'Penggunaan Komponen & Variants',
                'sub_topik' => 'Membuat & menggunakan komponen, mengelola varian, membangun sistem desain, Pembuatan CV'
            ],
            [
                'modul' => 'UI/UX Design',
                'pertemuan' => 6,
                'topik' => '-',
                'sub_topik' => 'Tes Kemampuan'
            ]
        ];

        foreach ($materiData as $data) {
            Materi::create($data);
        }

        $this->command->info('Materi data seeded successfully!');
    }
}