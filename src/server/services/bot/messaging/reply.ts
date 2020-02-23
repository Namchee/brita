/* eslint-disable max-len */

/**
 * An `enum` which contains all default REPLY messages
 */
export enum REPLY {
  INPUT_CATEGORY = 'Oke, Brita akan carikan pengumuman buat kamu. Kamu mau pengumuman dengan kategori apa?\n\n Kategori-kategori yang tersedia adalah:',
  NO_CATEGORY = 'Saat ini, tidak ada kategori pengumuman yang tersedia',
  UNKNOWN_CATEGORY = 'Hmm... Brita gak tau kategori apa yang kamu masukkan. Mungkin ajah karena kamu salah ketik. Bisa tolong masukkan lagi?',
  UNIDENTIFIABLE = 'Hmm... Brita gak ngerti apa yang kamu minta. Entah karena kamu salah ketik atau sesi permintaan kamu habis. Silahkan ulang permintaan kamu lagi ya~',
  PROMPT = 'Yay! Brita udah nanganin permintaan kamu! Sekarang, apa yang mau kamu lakukan?\nKamu dapat memilih "Ubah Kategori" untuk mengubah kategori, "Selanjutnya" untuk melihat pengumuman selanjutnya, dan "Akhiri" untuk menyelesaikan permintaan',
  RECHOOSE_CATEGORY_LABEL = 'Ubah Kategori',
  NEXT_ANNOUNCEMENT_LABEL = 'Selanjutnya',
  END_REQUEST_LABEL = 'Akhiri',
  NO_ANNOUNCEMENT = 'Hmm... Sekarang gak ada kategori yang dapat diminta...',
  AMOUNT_NOT_NUMBER = 'Jumlah yang anda masukkan bukanlah angka.',
  AMOUNT_TOO_LITTLE = 'Jumlah yang anda minta terlalu sedikit (min. 1).',
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
