/* Expanded study notes. All examples and control designs are educational. */
function productDeepDive(product) {
  const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const cards = rows => `<div class="grid grid-2">${rows.map(([title,text])=>`<article class="card card-pad"><h3>${title}</h3><p class="mb-0">${text}</p></article>`).join('')}</div>`;
  const section = (id,title,body) => `<section id="${id}" class="deep-section">${subhead(title)}${body}</section>`;
  const faq = rows => `<div class="deep-faq">${rows.map(([q,a])=>`<details class="card"><summary>${q}</summary><div>${a}</div></details>`).join('')}</div>`;
  const ref = (url,title) => `<a class="textlink" href="${url}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`;
  const sources = {
    tables:ref('https://support.workiva.com/hc/en-us/articles/360045393471-Get-started-with-tables','Workiva: Tables'),
    queries:ref('https://support.workiva.com/hc/en-us/articles/360045366912-Get-started-with-queries','Workiva: Queries'),
    chains:ref('https://support.workiva.com/hc/en-us/articles/360056193131-Get-started-with-chains','Workiva: Chains'),
    connectors:ref('https://support.workiva.com/hc/en-us/articles/360035643852-Manage-connectors-for-chains','Workiva: Connectors'),
    mapping:ref('https://developers.workiva.com/chains-v1/chains-dataprep.html','Workiva Developer Hub: Data Prep mapping rules'),
    course:ref('https://support.workiva.com/hc/nl/article_attachments/17987282448660','Workiva: Data Management Suite learning objectives'),
    params:ref('https://support.workiva.com/hc/en-us/articles/23249203401108-Chain-template-Maintain-Wdata-Parameters','Workiva: Maintain Wdata Parameters'),
    links:ref('https://support.workiva.com/hc/en-us/articles/360050675771-Connect-a-document-s-tables-and-charts-to-Workiva-sources','Workiva: Document connections'),
    api:ref('https://developers.workiva.com/wdata-v1/wdata-createquery.html','Workiva API: Create a new query')
  };
  const labels = {wdata:['Model & schema','Dataset & batch','Query design','Join diagnostics','Report handoff','Latihan & troubleshooting'],chains:['Object & input','Rencana command','Run lifecycle','Recovery & rerun','Operasional','Latihan & troubleshooting'],dataprep:['Input contract','Pipeline recipe','Mapping rules','Quality gates','Change management','Latihan & troubleshooting']};
  const start = `<div class="deep-intro"><div class="eyebrow">PRODUCT DEEP DIVE · PRACTICAL PLAYBOOK</div><h2>Dari konsep ke implementasi</h2><p>Materi lanjutan untuk data finance dan audit. Kemampuan produk dirujuk ke dokumentasi; skema, quality gate, batch register, dan contoh runbook di bawah adalah <b>rancangan latihan</b> yang perlu dikonfigurasi oleh tim, bukan kontrol otomatis bawaan.</p><nav class="deep-nav" aria-label="Topik lanjutan ${product}">${labels[product].map((label,i)=>`<a class="btn btn-outline btn-sm" href="#${product}-detail-${i}">${i+1}. ${label}</a>`).join('')}</nav></div>`;
  let content;
  if (product === 'wdata') content = [
    section('wdata-detail-0','01 · Rancang model sebelum membuat tabel',
      `<p>Mulai dengan pertanyaan bisnis: saldo apa, untuk entitas mana, pada tanggal berapa, dalam mata uang dan unit apa? TB adalah snapshot saldo; jurnal adalah pergerakan transaksi. Keduanya memerlukan grain dan aturan agregasi yang berbeda.</p>`+
      table(['Kolom contoh F_TB','Tipe yang disarankan','Tujuan & pengujian'],[
        ['entity_id, account_id','Text','Pertahankan leading zero. Kode 001100 tidak boleh berubah menjadi 1100 tanpa aturan bisnis.'],
        ['period','Text atau tanggal yang konsisten','Contoh 2026-10 atau tanggal akhir bulan. Hindari mencampur keduanya.'],
        ['currency, scenario','Text','IDR/USD dan actual/budget harus dapat dipisahkan dalam query.'],
        ['debit, credit atau signed_amount','Decimal sesuai presisi yang disetujui','Dokumentasikan signed_amount = debit − credit. Konversi unit dilakukan secara eksplisit.'],
        ['source_system, batch_id','Text','Metadata contoh untuk menghubungkan baris ke extract dan strategi rerun.'],
        ['version / mapping_version','Text jika dibutuhkan','Bedakan data revisi dan aturan mapping yang digunakan; bukan histori otomatis yang diasumsikan tersedia.']
      ])+callout('Grain yang bisa diuji','Contoh grain: entity × account × period × currency × scenario × source × version. Tambahkan cost center bila sumber memang memisahkannya. Baris berulang pada grain ini perlu dijelaskan; jangan langsung menghapusnya.')+`<p class="source-line">Referensi struktur fact/dimension dan schema: ${sources.tables}. Desain kolom di atas adalah contoh implementasi.</p>`),
    section('wdata-detail-1','02 · Dataset, tag, dan keputusan loading',
      cards([
        ['Table ≠ dataset','Table menentukan struktur data. Dataset adalah kelompok data yang dimasukkan ke dalam table. Membuat schema dari file belum berarti seluruh proses load dan pemeriksaan sudah selesai.'],
        ['Tag ≠ approval','Tag membantu memilih dataset dalam query, misalnya actual vs budget. Tag tidak membuktikan bahwa data sudah direkonsiliasi atau disetujui. Tetapkan siapa yang boleh mengubahnya.'],
        ['Append untuk data yang benar-benar baru','Sesuai ketika batch berisi periode atau populasi baru. Menambahkan ulang extract TB yang sama dapat menggandakan saldo. Bandingkan scope dan identitas batch sebelum import.'],
        ['Revisi periode memerlukan prosedur','Tentukan dataset mana yang tetap masuk pelaporan dan bagaimana versi lama dikeluarkan dari scope. Uji dependensi dan rekonsiliasi sebelum perubahan; jangan mengasumsikan append sama dengan upsert.']
      ])+numbered(['Catat manifest extract: source, entity, period, currency, waktu extract, jumlah baris, serta total debit/kredit.','Cocokkan delimiter, encoding dan tipe kolom. Pilih dataset/tag yang tepat untuk scope laporan.','Muat ke tabel latihan, lalu cocokkan kembali count dan total. Jika berbeda, berhenti sebelum refresh laporan.','Untuk revisi, dokumentasikan versi pengganti, alasan, approval dan dampak ke query. Pastikan hanya versi yang dimaksud yang terpilih.'])+`<p class="source-line">Kemampuan dataset dan filter tag: ${sources.tables}. Batch register dan persetujuan adalah prosedur desain tim.</p>`),
    section('wdata-detail-2','03 · Mendesain query yang bisa direview',
      table(['Lapisan','Pertanyaan desain','Contoh hasil'],[
        ['Sources','Apakah tabel dan periode yang benar dipilih?','Raw TB dan mapping yang disetujui.'],
        ['Relationships','Apakah key unik dan tipe kedua sisi sesuai?','LEFT JOIN dengan key source_system + account_id bila kode akun berbeda antar ERP.'],
        ['Fields','Apakah detail audit masih dapat ditelusuri?','Entity, period, account, currency, reporting line, batch.'],
        ['Filters & parameters','Apakah pengguna bisa menjalankan ulang bulan yang tepat?','Parameter reporting_period, scenario dan entity; periksa default saat roll-forward.'],
        ['Aggregation','Apakah ukuran ini boleh dijumlahkan?','SUM saldo lintas entitas dengan mata uang/unit yang sama; saldo snapshot lintas bulan memerlukan aturan.'],
        ['Output','Siapa yang menggunakan angka dan kapan refresh?','Query detail untuk investigasi dan ringkasan terpisah untuk laporan.']
      ])+callout('Snapshot vs movement','TB Januari dan Februari masing-masing adalah saldo pada waktu tertentu. Menjumlahkan keduanya dapat menggandakan makna saldo. Untuk laporan posisi keuangan pilih snapshot; perhitungan movement atau YTD harus mengikuti sifat data sumber.')+`<p>Builder memudahkan review relationships dan filter; SQL Editor membantu logika yang lebih kompleks. Contoh SQL pada bab ini bersifat konseptual. Gunakan referensi objek dan sintaks dari workspace saat menerapkannya. Simpan deskripsi tujuan, asumsi join, parameter, dan pemilik query.</p><p class="source-line">Kemampuan query: ${sources.queries}; pemisahan pembuatan query dan eksekusi: ${sources.api}.</p>`),
    section('wdata-detail-3','04 · Empat pengujian join yang wajib dipahami',
      table(['Pengujian sintetis','Ekspektasi','Jika gagal'],[
        ['14 baris TB; satu akun tidak ter-mapping','LEFT JOIN tetap 14 baris dengan satu exception','INNER JOIN menjadi 13 baris: informasi hilang walau query sukses.'],
        ['Satu akun TB cocok ke dua baris mapping','Satu mapping aktif per key yang disepakati','Baris TB terduplikasi; total setelah join membesar. Perbaiki uniqueness/aturan effective period.'],
        ['Kode akun sama dari ERP-A dan ERP-B','Key menyertakan konteks sumber bila klasifikasi berbeda','Join hanya pada account_id dapat memberi reporting line salah.'],
        ['LEFT JOIN lalu filter kolom mapping','Unmapped tetap masuk exception report','WHERE reporting_line = ... dapat membuang baris NULL. Pisahkan analisis exception dari filter laporan.']
      ])+`<p>Bandingkan <b>count, sum debit, sum credit, net, dan count unmapped</b> sebelum dan sesudah join. Total net nol saja tidak cukup: duplikasi pasangan debit/kredit bisa tetap menghasilkan net nol. Simpan hasil uji per entity, period dan currency agar selisih tidak tertutup agregasi grup.</p>`),
    section('wdata-detail-4','05 · Dari query ke view, sheet, dan dokumen',
      numbered(['Gunakan view untuk eksplorasi pola dan drill-down. Tinjau parameter sebelum menyimpulkan angka.', 'Tentukan tujuan output: incoming connection yang direfresh atau export melalui Chain sesuai desain. Catat siapa pemilik koneksinya.', 'Jalankan query dengan parameter yang disetujui, lalu refresh connection pada output terkait. Query baru tidak otomatis membuktikan semua laporan sudah menggunakan hasil terbaru.', 'Untuk tabel/chart dokumen yang terhubung ke query, cek parameter koneksi dan gunakan Apply & Refresh saat mengubah periode.', 'Tie-out beberapa angka material hingga ke query dan source batch. Catat waktu refresh, hasil kontrol dan reviewer.'])+`<p class="source-line">Koneksi tabel/chart dokumen dan parameter: ${sources.links}. Pick list parameter yang berubah dapat dikelola melalui template: ${sources.params}.</p>`),
    section('wdata-detail-5','06 · Latihan mandiri & troubleshooting',
      callout('Latihan 20 menit','Buka Hands-on lab. Catat hasil LEFT JOIN Oktober: 14 baris, debit 13.700 dan kredit 13.700 juta rupiah. Ganti ke INNER JOIN. Ekspektasi: 13 baris, debit 12.950, kredit 13.700; akun 5999 sebesar 750 tidak terlihat. Jelaskan mengapa perbaikan mapping perlu dilakukan sebelum laporan digunakan.')+
      faq([
        ['Query kosong, padahal load sukses?','Periksa parameter, periode, scenario/tag, source table, dan status dataset. Jalankan pemeriksaan sumber dengan scope kecil sebelum menambahkan join.'],
        ['Total membesar setelah mapping?','Cari key ganda di dimension serta hubungan many-to-many. Bandingkan jumlah baris per key sebelum/sesudah join; jangan menutupi duplikasi dengan DISTINCT tanpa memahami grain.'],
        ['Data sudah benar, tetapi laporan masih lama?','Periksa output run yang dipakai, parameter koneksi, waktu refresh serta izin pada source dan destination. Bedakan suksesnya query dari suksesnya refresh.'],
        ['Bagaimana menjaga performa?','Ambil kolom dan periode yang dibutuhkan, gunakan grain output yang sesuai, dan hindari ekspor seluruh detail untuk ringkasan kecil. Periksa batas produk pada dokumentasi yang berlaku di workspace; jangan mengandalkan angka limit dari materi lama.']
      ])+`<div class="mt-24">${doneBox('wd-deep','Saya bisa merancang grain TB, memeriksa duplikasi join dan menjelaskan strategi dataset revisi.')}<a class="btn btn-primary mt-12" href="#lab">Coba query lab →</a></div>`)
  ].join('');
  if (product === 'chains') content = [
    section('chains-detail-0','01 · Object, scope, dan aliran input/output',
      table(['Komponen','Peran','Contoh praktis'],[
        ['Connector vs connection','Connector menyediakan command; connection menyimpan konfigurasi akses ke endpoint','Workiva connector dengan connection untuk environment latihan.'],
        ['Runner','Tempat command dijalankan dengan akses jaringan yang sesuai','GroundRunner untuk sumber private; CloudRunner untuk endpoint online yang dapat dijangkau.'],
        ['Runtime input','Nilai yang disediakan saat run dimulai','Period 2026-10, entity E01, query ID dan destination.'],
        ['Chain/workspace variable','Konfigurasi yang digunakan ulang sesuai scope','ID tabel per environment; rahasia hanya dalam penyimpanan aman yang disediakan.'],
        ['Command output','Hasil suatu langkah yang dipakai langkah berikutnya','Query result ID hasil Run Query diteruskan ke Export Query Result.'],
        ['Environment','Konteks konfigurasi dan eksekusi','Pisahkan ID, connections, dan tujuan test dari production.']
      ])+`<p class="source-line">Kemampuan input/output: ${sources.chains}. Pengaktifan connector dan connection: ${sources.connectors}.</p>`),
    section('chains-detail-1','02 · Blueprint TB load yang dapat diaudit',
      `<p>Berikut contoh rancangan, bukan template wajib atau jaminan bahwa setiap pemeriksaan otomatis tersedia. Setiap gate perlu diwujudkan melalui command, query, logika dan prosedur yang sesuai.</p>`+
      table(['Tahap','Input → output','Gate / evidence contoh'],[
        ['1. Terima scope','Entity + period + batch → manifest','Scope valid; destination sesuai environment.'],
        ['2. Extract','ERP/API/file → raw extract','Extract lengkap; kontrol total tersedia; raw dipertahankan sesuai kebijakan.'],
        ['3. Validate','Raw → hasil pemeriksaan','Kolom wajib, format angka, currency, periode, dan count diperiksa.'],
        ['4. Transform','Raw + mapping → curated + exceptions','Versi mapping tercatat; akun tidak dikenal tidak disembunyikan.'],
        ['5. Reconcile','Raw vs curated → perbandingan','Count dan nominal sesuai perubahan yang memang direncanakan.'],
        ['6. Import','Curated → dataset Wdata','Strategi append/revisi aman; dataset dan batch teridentifikasi.'],
        ['7. Query & output','Parameter → result → connection/export','Baca output command aktual, bukan ID hasil run sebelumnya.'],
        ['8. Review','Run evidence → persetujuan','Finance/audit owner memeriksa hasil sebelum penggunaan final.']
      ])+callout('Kontrak antarlangkah','Sebelum menghubungkan node, tulis jenis outputnya: file, string, angka, daftar, atau ID. Query ID mengidentifikasi definisi query; Query result ID mengidentifikasi hasil eksekusi. Tertukarnya kedua ID adalah kesalahan konfigurasi, bukan masalah angka finance.')),
    section('chains-detail-2','03 · Save, publish, execute, verify',
      cards([
        ['Sebelum publish','Review input default, environment, connections, tujuan output, serta perubahan logika. Jalankan dengan sampel sintetis dan dokumentasikan hasilnya.'],
        ['Saat execute','Masukkan scope yang benar dan identitas batch. Perhatikan konfigurasi concurrent runs agar dua proses tidak menulis ke target yang sama secara tidak terkendali.'],
        ['Saat memonitor','Buka run history dan log command yang gagal. Periksa input teresolusi, waktu, pesan error dan output. Status langkah membantu menemukan titik kegagalan.'],
        ['Sesudah sukses','Periksa dataset serta output tujuan. Status sukses teknis tidak membuktikan completeness, klasifikasi akun, atau sign-off sudah terpenuhi.']
      ])+`<p class="source-line">Alur publish/execute dan pemeriksaan command log: ${sources.chains}.</p>`),
    section('chains-detail-3','04 · Error handling, retry, dan rerun aman',
      table(['Jenis masalah','Respons desain yang disarankan','Risiko jika langsung rerun'],[
        ['Gangguan koneksi sementara','Periksa status request dan output; retry terbatas jika operasi aman diulang','Request pertama mungkin sudah selesai meski respons terputus.'],
        ['401/403','Periksa connection, grant/role dan izin objek dengan admin','Retry berulang tidak memperbaiki hak akses.'],
        ['Schema atau mapping gagal','Hentikan downstream; catat exception; perbaiki data/aturan melalui review','Data salah dapat tetap masuk bila error diabaikan.'],
        ['Import sukses, refresh gagal','Buktikan dataset sudah masuk, lalu pilih titik pemulihan yang aman','Menjalankan extract/import lagi bisa menggandakan dataset.'],
        ['Run ganda untuk batch sama','Terapkan aturan status batch dan konflik target dalam desain','Race condition dapat meloloskan dua append.']
      ])+callout('Idempotency bukan tombol ajaib','Contoh batch key: ERP-A | E01 | 2026-10 | actual | revision-02. Tim dapat merancang register status received → validated → loaded → reported. Sebelum rerun, cocokkan register dengan kondisi Wdata yang sebenarnya. Register, locking dan pencegahan duplikasi harus dibangun serta diuji.','warn')+
      `<p>Cabang kegagalan sebaiknya menyimpan konteks error dan menahan pekerjaan yang tidak aman. Mengizinkan command melanjutkan setelah error hanya masuk akal untuk kondisi yang sudah diidentifikasi dan diuji; jangan menjadikan semua error sebagai sukses.</p>`),
    section('chains-detail-4','05 · Runbook bulanan untuk operator',
      numbered(['Pastikan source sudah tersedia, periode benar, mapping disetujui dan tidak ada run yang berkonflik.','Periksa runner/connection serta tujuan. Jalankan sesuai scope yang diotorisasi.','Catat run ID, batch, periode, environment, parameter non-rahasia, dan waktu mulai/selesai. Jangan menyalin secret ke evidence.','Bandingkan control totals pada raw, curated, dataset dan query. Simpan daftar exception dan tindakan korektif.','Jika gagal, tentukan langkah terakhir yang benar-benar selesai sebelum memilih recovery. Minta review bila ada dampak pada data yang sudah dilaporkan.','Setelah output terverifikasi, dokumentasikan reviewer dan komunikasikan kesiapan sesuai proses tim.'])+
      `<p>Untuk koneksi yang dipakai banyak Chain, tinjau penggunaan connection sebelum mengubahnya. Nama dan deskripsi sebaiknya menjelaskan tujuan, owner, serta scope; ID tetap menjadi rujukan teknis saat nama berubah.</p>`),
    section('chains-detail-5','06 · Latihan insiden & pertanyaan review',
      callout('Kasus: import selesai, output belum refresh','Skenario sintetis: 14 baris sudah masuk Wdata. Command refresh gagal karena izin destination. Respons yang baik: buktikan import berhasil, perbaiki izin sesuai proses admin, lalu ulang bagian output melalui jalur recovery yang disetujui. Jangan langsung append 14 baris yang sama.')+
      faq([
        ['Run Query sukses tetapi Export Query Result gagal?','Periksa result ID dari output run yang sama, spreadsheet URL, connection serta izin destination. Pastikan command terhubung sehingga output upstream tersedia.'],
        ['Mengapa sukses di test tetapi gagal di production?','Bandingkan environment, ID objek, endpoint, izin integration user, serta connection dan runner. Jangan menyalin secret atau target test tanpa penyesuaian.'],
        ['Apa yang perlu dijelaskan saat handover?','Tujuan dan jadwal, owner, dependency, input/output, kontrol, expected totals, cara membaca error dan titik recovery. Operator perlu tahu kapan harus berhenti dan meminta review.']
      ])+`${doneBox('ch-deep','Saya bisa membedakan query ID/result ID, membaca run failure dan menjelaskan pemulihan tanpa duplicate load.')}<a class="btn btn-primary mt-12" href="#lab">Coba Chain simulator →</a>`)
  ].join('');
  if (product === 'dataprep') content = [
    section('dataprep-detail-0','01 · Definisikan kontrak input dan output',
      `<p>Sample data membantu merancang transformasi, tetapi bukan bukti bahwa seluruh populasi sudah valid. Gunakan sampel yang mencakup kondisi normal dan kondisi bermasalah. Dokumentasi pelatihan Workiva membedakan Pipelines, Sample Data, dan Mapping Groups sebagai komponen utama Data Prep.</p>`+
      table(['Kontrak contoh','Keputusan yang harus tertulis','Kasus uji'],[
        ['Kolom & identifier','entity, account, period, currency, debit, credit; kode disimpan sebagai teks','Akun 001100, kolom hilang, urutan kolom berubah.'],
        ['Angka & locale','Tentukan separator ribuan/desimal dan cara membaca angka negatif','1.234,56 vs 1,234.56; (500); blank vs zero.'],
        ['Grain & unit','Satu baris berarti apa; rupiah penuh atau juta rupiah','Dua ERP memakai unit berbeda.'],
        ['Output','Kolom standar + original account + reporting line + batch/mapping metadata','Baris masih dapat ditelusuri ke raw source.'],
        ['Exception','Aturan reject/hold/review dan lokasi evidence','Account tidak ditemukan, entity kosong, currency tidak dikenal.']
      ])+`<p class="source-line">Komponen produk: ${sources.course}. Kontrak serta pengujian adalah desain implementasi.</p>`),
    section('dataprep-detail-1','02 · Recipe: raw TB menjadi data standar',
      `<p>Urutan berikut adalah resep logika. Pilih transformasi yang tersedia pada konfigurasi Data Prep, atau command/query pendukung; nama tombol dan implementasi dapat berbeda menurut workspace.</p>`+
      numbered(['<b>Profiling:</b> hitung baris, jumlah nilai kosong, distinct entity/currency, total debit/kredit. Simpan baseline sebelum mengubah data.','<b>Normalisasi identifier:</b> rapikan whitespace, format huruf dan kode sesuai master. Pertahankan nilai asli di kolom terpisah bila diperlukan untuk trace-back.','<b>Parsing tipe:</b> konversi angka/tanggal dengan locale yang diketahui. Keluarkan parse failure sebagai exception, jangan mengubahnya diam-diam menjadi nol.','<b>Standarisasi measure:</b> contoh signed_amount = debit − credit. Terapkan faktor unit hanya setelah memastikan unit sumber; dokumentasikan pembulatan.','<b>Mapping:</b> cocokkan source system + account dengan reporting COA. Tambahkan konteks entity/periode bila aturan bisnis membutuhkannya.','<b>Validasi output:</b> bandingkan count dan nominal, cek unmapped dan duplikasi. Jangan menghapus baris untuk sekadar membuat saldo tampak cocok.','<b>Handoff:</b> Chain menerima output transformasi lalu menjalankan import/reporting sesuai quality gate. Simpan identitas input, mapping dan run yang digunakan.'])+
      cards([['Contoh normalisasi yang benar','Raw account " 001100 " → account "001100"; currency "idr" → "IDR". Nilai saldo tetap sama.'],['Contoh yang perlu investigasi','Raw amount "1.234" belum pasti berarti seribu dua ratus tiga puluh empat atau 1,234 desimal. Kontrak sumber harus menjawabnya sebelum konversi.']])),
    section('dataprep-detail-2','03 · Mapping groups: aturan yang mengubah klasifikasi',
      `<p>Model API Data Prep mendokumentasikan jenis aturan EXACT, LIKE, dan REGEX, beserta kondisi, target dan position. Uji perilaku pencocokan di workspace sebelum menerapkan pola ke populasi finance.</p>`+
      table(['Jenis aturan','Contoh rancangan','Pengujian yang diperlukan'],[
        ['EXACT','Akun 1100 dari ERP-A → Cash & equivalents','Cocokkan kode lengkap, tipe data dan konteks sumber.'],
        ['LIKE','Sekelompok kode dengan pola → kategori reporting','Konfirmasi sintaks pola yang diterima; uji kode yang hampir mirip dan seharusnya tidak masuk.'],
        ['REGEX','Pola kode terstruktur untuk klasifikasi','Uji anchor, panjang kode dan karakter yang diperbolehkan. Review bersama pemilik mapping.'],
        ['Conditions & order','Aturan khusus entity/periode sebelum aturan yang lebih luas, sesuai hasil pengujian','Uji overlap dan precedence aktual. Jangan mengasumsikan aturan paling spesifik selalu menang.']
      ])+callout('Jangan menyembunyikan akun baru','Mapping semua nilai yang tidak dikenal menjadi Other membuat output terlihat lengkap, tetapi dapat menutupi kesalahan klasifikasi. Pertahankan exception dan lakukan review business owner. Default category hanya digunakan jika memang disetujui dan dampaknya dipantau.','warn')+
      `<p class="source-line">Jenis rule dan model condition/position: ${sources.mapping}. Contoh pemetaan dan kebijakan exception di atas merupakan rancangan latihan.</p>`),
    section('dataprep-detail-3','04 · Quality gates dengan hasil yang diharapkan',
      table(['Gate contoh','Lulus bila','Evidence'],[
        ['Structure','Semua kolom wajib tersedia dan data bisa diparse','Schema + daftar parse failures.'],
        ['Completeness','Raw count = output count + rejected count, bila desain memang memisahkan rejects','Count sebelum/sesudah dan alasan reject.'],
        ['Value preservation','Total per entity/currency tidak berubah kecuali transformasi terotorisasi','Debit/kredit/net sebelum/sesudah + penjelasan adjustment.'],
        ['Mapping coverage','Akun in-scope memiliki mapping yang disetujui atau exception sudah ditangani','Unmapped listing; review akun baru.'],
        ['Uniqueness','Tidak ada duplikasi tak terjelaskan pada grain yang disepakati','Duplicate listing, bukan hanya indikator pass/fail.'],
        ['Output readiness','Schema output cocok ke target dan scope sesuai batch','File output, metadata, status import dan tie-out.']
      ])+`<p>Nilai threshold seperti zero unmapped adalah kebijakan desain tim. Jika exception ditoleransi, catat dampak nominal dan approval; jangan hanya memakai persentase baris karena satu baris bisa material. Bila pipeline mengagregasi, count memang dapat turun: bandingkan grain dan totals yang tepat.</p>`),
    section('dataprep-detail-4','05 · Uji perubahan mapping sebelum publikasi',
      numbered(['Dokumentasikan alasan perubahan, rule lama/baru, owner dan periode efektif yang dimaksud. Penanganan effective period harus dirancang; jangan diasumsikan otomatis.','Siapkan regression sample: akun normal, akun baru, leading zero, nilai kosong, pola overlap, serta kode dari dua ERP.','Bandingkan output sebelum/sesudah. Total saldo bisa tetap sama sementara klasifikasi FS berubah; periksa per reporting line.','Minta review pemilik COA/finance. Simpan versi atau salinan konfigurasi sesuai kemampuan produk dan prosedur tim.','Terapkan melalui mekanisme save/publish yang tersedia dan jalankan kembali pada scope terkontrol. Cocokkan versi yang benar-benar dipakai run.','Jika hasil salah, hentikan downstream. Pulihkan konfigurasi yang disetujui dan tentukan bagaimana data/laporan terdampak diperbaiki.'])+
      `<p class="source-line">API menyediakan operasi update/publish mapping groups: ${sources.mapping}. Prosedur review, regression dan recovery adalah kontrol implementasi.</p>`),
    section('dataprep-detail-5','06 · Latihan before/after & troubleshooting',
      callout('Latihan: akun baru 5999','Gunakan data sintetis Oktober pada lab. Akun 5999 bernilai debit 750 juta rupiah dan belum ter-mapping. Susun exception berisi entity, account, amount, batch dan alasan. Setelah business owner menyetujui klasifikasi, hasil yang diharapkan adalah coverage membaik tanpa mengubah total debit/kredit. Latihan ini berupa analisis desain, bukan editor mapping Workiva asli.')+
      faq([
        ['Preview benar tetapi run penuh gagal?','Sampel mungkin belum mencakup format angka, karakter, nilai kosong atau akun baru. Cari contoh baris gagal, perbarui regression sample dan uji ulang tanpa mengubah data sumber diam-diam.'],
        ['Mapping cocok di satu ERP tetapi salah di ERP lain?','Key kurang lengkap. Tambahkan konteks sumber/entity dalam desain mapping dan uji benturan kode; kode identik tidak selalu berarti akun bisnis yang sama.'],
        ['Saldo berkurang setelah transformasi?','Periksa filter, parse failure, duplicate removal, inner join serta conversion/unit. Hitung reject dan total per tahap untuk menemukan transformasi pertama yang mengubah hasil.'],
        ['Rule sudah diedit tetapi output belum berubah?','Periksa konfigurasi yang disimpan/dipublikasikan, mapping group yang dirujuk pipeline, input run serta hasil terbaru yang dikonsumsi downstream. Jangan langsung menyimpulkan cache sebagai penyebab.']
      ])+`${doneBox('dp-deep','Saya bisa merancang kontrak input, menguji mapping overlap dan membuktikan count serta total sebelum/sesudah transformasi.')}`)
  ].join('');
  return start + content + `<p class="disclaimer mt-24">Materi lanjutan ditinjau 4 November 2026. Contoh menggunakan data sintetis. Menu, hak akses, dan kemampuan tersedia mengikuti konfigurasi serta lisensi workspace; verifikasi pada sumber resmi sebelum penerapan.</p>`;
}
