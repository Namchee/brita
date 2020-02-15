/* eslint-disable max-len */

/**
 * An `enum` which contains all default REPLY messages
 */
export enum REPLY {
  INPUT_CATEGORY = 'Mohon masukkan kategori pengumuman yang anda inginkan.',
  UNKNOWN_CATEGORY = 'Kategori yang anda masukkan tidak ada.',
  UNIDENTIFIABLE = 'Permintaan yang anda minta tidak dapat dipahami. Mungkin saja karena permintaan anda sudah expired. Silahkan mengulangi permintaan anda.',
  INPUT_AMOUNT = 'Mohon masukkan jumlah pengumuman yang diinginkan (maks: 10).',
  AMOUNT_TOO_MUCH = 'Jumlah pengumuman yang anda minta terlalu banyak.',
  ANNOUNCEMENT_SERVED = 'Berikut adalah daftar pengumuman dengan kategori',
  AMOUNT_NOT_NUMBER = 'Jumlah yang anda masukkan bukanlah angka.',
  AMOUNT_TOO_LITTLE = 'Jumlah yang anda minta terlalu sedikit (min. 1).',
  SERVER_ERROR = 'Terjadi masalah pada server, mohon coba lagi lain kali.',
  REQUEST_EXPIRED = 'Mohon maaf, namun sesi permintaan anda habis. Silahkan mengulangi permintaan anda',
}

/**
 * An `enum` which contains all logical flow error messages
 */
export enum LOGIC_ERROR {
  INCORRECT_MAPPING = 'Incorrect service mapping',
  INCORRECT_LOGIC = 'Logic error',
  BREACH_OF_FLOW = 'Breach of flow, should be killed earlier',
}
