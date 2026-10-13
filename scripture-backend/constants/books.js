const BOOK_ALIASES = {
  GEN: 'GEN', EXO: 'EXO', LEV: 'LEV', NUM: 'NUM', DEU: 'DEU',
  JOSH: 'JOS', JUDG: 'JDG', RUTH: 'RUT',
  '1SAM': '1SA', '2SAM': '2SA', '1KGS': '1KI', '2KGS': '2KI',
  '1CHR': '1CH', '2CHR': '2CH',
  EZR: 'EZR', NEH: 'NEH', ESTH: 'EST', JOB: 'JOB',
  PSAL: 'PSA', PROV: 'PRO', ECCL: 'ECC', SNG: 'SNG',
  ISA: 'ISA', JER: 'JER', LAM: 'LAM', EZEK: 'EZK', DAN: 'DAN',
  HOS: 'HOS', JOEL: 'JOL', AMOS: 'AMO', OBAD: 'OBA', JON: 'JON',
  MIC: 'MIC', NAH: 'NAM', HAB: 'HAB', ZEPH: 'ZEP', HAG: 'HAG',
  ZECH: 'ZEC', MAL: 'MAL',
  MATT: 'MAT', MARK: 'MRK', LUKE: 'LUK', JHN: 'JHN', ACTS: 'ACT',
  ROM: 'ROM', '1COR': '1CO', '2COR': '2CO',
  GAL: 'GAL', EPH: 'EPH', PHIL: 'PHP', COL: 'COL',
  '1THESS': '1TH', '2THESS': '2TH',
  '1TIM': '1TI', '2TIM': '2TI',
  TIT: 'TIT', PHILEM: 'PHM', HEB: 'HEB', JAS: 'JAS',
  '1PET': '1PE', '2PET': '2PE',
  '1JHN': '1JN', '2JHN': '2JN', '3JHN': '3JN',
  JUDE: 'JUD', REV: 'REV',
  JOS: 'JOS', JDG: 'JDG', RUT: 'RUT', '1SA': '1SA', '2SA': '2SA',
  '1KI': '1KI', '2KI': '2KI', '1CH': '1CH', '2CH': '2CH',
  EST: 'EST', PSA: 'PSA', PRO: 'PRO', ECC: 'ECC', EZK: 'EZK',
  JOL: 'JOL', AMO: 'AMO', OBA: 'OBA', NAM: 'NAM', ZEP: 'ZEP',
  ZEC: 'ZEC', MAT: 'MAT', MRK: 'MRK', LUK: 'LUK', ACT: 'ACT',
  '1CO': '1CO', '2CO': '2CO', PHP: 'PHP', '1TH': '1TH', '2TH': '2TH',
  '1TI': '1TI', '2TI': '2TI', PHM: 'PHM', '1PE': '1PE', '2PE': '2PE',
  '1JN': '1JN', '2JN': '2JN', '3JN': '3JN', JUD: 'JUD',
};

const BOOK_NAME_LOOKUP = {
  genesis: 'GEN', exodus: 'EXO', leviticus: 'LEV', numbers: 'NUM',
  deuteronomy: 'DEU', joshua: 'JOS', judges: 'JDG', ruth: 'RUT',
  '1samuel': '1SA', '2samuel': '2SA', '1kings': '1KI', '2kings': '2KI',
  '1chronicles': '1CH', '2chronicles': '2CH', ezra: 'EZR',
  nehemiah: 'NEH', esther: 'EST', job: 'JOB', psalm: 'PSA',
  psalms: 'PSA', proverbs: 'PRO', ecclesiastes: 'ECC',
  songofsolomon: 'SNG', songofsongs: 'SNG', isaiah: 'ISA',
  jeremiah: 'JER', lamentations: 'LAM', ezekiel: 'EZK', daniel: 'DAN',
  hosea: 'HOS', joel: 'JOL', amos: 'AMO', obadiah: 'OBA', jonah: 'JON',
  micah: 'MIC', nahum: 'NAM', habakkuk: 'HAB', zephaniah: 'ZEP',
  haggai: 'HAG', zechariah: 'ZEC', malachi: 'MAL',
  matthew: 'MAT', mark: 'MRK', luke: 'LUK', john: 'JHN', acts: 'ACT',
  romans: 'ROM', '1corinthians': '1CO', '2corinthians': '2CO',
  galatians: 'GAL', ephesians: 'EPH', philippians: 'PHP',
  colossians: 'COL', '1thessalonians': '1TH', '2thessalonians': '2TH',
  '1timothy': '1TI', '2timothy': '2TI', titus: 'TIT', philemon: 'PHM',
  hebrews: 'HEB', james: 'JAS', '1peter': '1PE', '2peter': '2PE',
  '1john': '1JN', '2john': '2JN', '3john': '3JN', jude: 'JUD',
  revelation: 'REV', revelations: 'REV',
};

export function resolveBookCode(input) {
  if (!input) return null;
  const raw = input.toString().trim();

  const upper = raw.toUpperCase().replace(/\s+/g, '');
  if (BOOK_ALIASES[upper]) return BOOK_ALIASES[upper];

  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (BOOK_NAME_LOOKUP[normalized]) return BOOK_NAME_LOOKUP[normalized];

  return upper;
}