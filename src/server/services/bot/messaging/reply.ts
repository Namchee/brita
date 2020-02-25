/* eslint-disable max-len */

/**
 * An `enum` which contains all default REPLY messages
 */
export enum REPLY {
  INPUT_CATEGORY = 'Oke, Brita akan carikan pengumuman buat kamu. Kamu mau pengumuman dengan kategori apa?\n\nKategori-kategori yang tersedia adalah:',
  NO_CATEGORY = 'Hmm... Sekarang gak ada kategori yang dapat diminta...',
  UNKNOWN_CATEGORY = 'Hmm... Brita gak tau kategori apa yang kamu masukkan. Mungkin ajah karena kamu salah ketik.\nBisa tolong masukkan lagi?',
  UNIDENTIFIABLE = 'Hmm... Brita gak ngerti apa yang kamu minta. Entah karena kamu salah ketik atau sesi permintaan kamu habis.\n\nSilahkan ulang permintaan kamu lagi ya~',
  SHOW_ANNOUNCEMENT = 'Berikut ini adalah beberapa pengumuman yang sesuai dengan kriteria yang kamu minta',
  PROMPT_ANNOUNCEMENT = 'Sekarang, apakah kamu masih mau melanjutkan baca pengumuman?\n\nKamu dapat memilih\nlanjutkan" untuk melihat pengumuman selanjutnya\n"ganti" untuk mengubah kategori\n"akhiri" untuk menyelesaikan permintaan',
  RECHOOSE_CATEGORY_LABEL = 'Ganti Kategori',
  RECHOOSE_CATEGORY_TEXT = 'ganti',
  NEXT_ANNOUNCEMENT_LABEL = 'Pengumuman Selanjutnya',
  NEXT_ANNOUNCEMENT_TEXT = 'lanjutkan',
  END_REQUEST_LABEL = 'Akhiri Permintaan',
  END_REQUEST_TEXT = 'akhiri',
  END_REQUEST_REPLY = 'Baiklah. Terima kasih udah pakai Brita! Semoga harimu menyenangkan!',
  NO_ANNOUNCEMENT = 'Hmm... Saat ini, udah gak ada pengumuman lagi yang tersedia buat kategori tersebut.',
  SERVER_ERROR = 'Terjadi masalah pada server, mohon coba lagi lain kali.',
}

/**
 * An `enum` which contains all logical flow error messages
 */
export enum LOGIC_ERROR {
  INCORRECT_MAPPING = 'Incorrect service mapping',
  INCORRECT_LOGIC = 'Logic error',
  BREACH_OF_FLOW = 'Breach of flow, should be killed earlier',
}
