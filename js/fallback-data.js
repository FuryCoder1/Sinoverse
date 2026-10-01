/* Fallback dataset — used only when data/words.json cannot be fetched
   (e.g. opening index.html directly from file://). A representative subset
   of the full lexicon; same schema as the JSON so future API swaps are safe. */
window.SINOVERSE_FALLBACK_ENTRIES = [
  {
    id: "w-xue",
    main: "學", alt: "学",
    meaning: "study; learn; learning",
    note: "A core Sino-Xenic verb of learning. Japanese splits the sense between 勉強する for diligent study and 学ぶ for academic learning.",
    confidence: "High", tags: ["education", "verb"],
    forms: {
      zh:  { native: "学习", roman: "xuéxí", pronunciationKey: "zh-CN" },
      yue: { native: "學習", roman: "hok6 zaap6", pronunciationKey: "zh-HK" },
      nan: { native: "學習", roman: "ha̍k-si̍p / o̍h-si̍p", pronunciationKey: null },
      ja:  { native: "学習", roman: "gakushū (がくしゅう)", pronunciationKey: "ja-JP" },
      ko:  { native: "학습", roman: "hak-seup (학습)", pronunciationKey: "ko-KR" },
      vi:  { native: "học tập", roman: "học tập", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-guo",
    main: "國", alt: "国",
    meaning: "country; nation; state",
    note: "Mandarin prefers the disyllabic 國家/国家; the others keep the monosyllable as the everyday word.",
    confidence: "High", tags: ["politics", "society"],
    forms: {
      zh:  { native: "国家", roman: "guójiā", pronunciationKey: "zh-CN" },
      yue: { native: "國家", roman: "gwok3 gaa1", pronunciationKey: "zh-HK" },
      nan: { native: "國家", roman: "kok-ka", pronunciationKey: null },
      ja:  { native: "国", roman: "kuni / kokugo (くに)", pronunciationKey: "ja-JP" },
      ko:  { native: "국", roman: "guk (국)", pronunciationKey: "ko-KR" },
      vi:  { native: "quốc", roman: "quốc", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-ren",
    main: "人", alt: "人",
    meaning: "person; people; human",
    note: "One of the most stable Sinitic words across all six languages.",
    confidence: "High", tags: ["people", "everyday"],
    forms: {
      zh:  { native: "人", roman: "rén", pronunciationKey: "zh-CN" },
      yue: { native: "人", roman: "jan4", pronunciationKey: "zh-HK" },
      nan: { native: "人", roman: "lâng / jîn", pronunciationKey: null },
      ja:  { native: "人", roman: "hito / jin (ひと)", pronunciationKey: "ja-JP" },
      ko:  { native: "인", roman: "in (인)", pronunciationKey: "ko-KR" },
      vi:  { native: "nhân", roman: "nhân", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-shan",
    main: "山", alt: "山",
    meaning: "mountain",
    note: "Vietnamese 'núi' is native; 'sơn' survives in Sino-Vietnamese compounds like Giang Sơn.",
    confidence: "High", tags: ["nature"],
    forms: {
      zh:  { native: "山", roman: "shān", pronunciationKey: "zh-CN" },
      yue: { native: "山", roman: "saan1", pronunciationKey: "zh-HK" },
      nan: { native: "山", roman: "suann / san", pronunciationKey: null },
      ja:  { native: "山", roman: "yama / san (やま)", pronunciationKey: "ja-JP" },
      ko:  { native: "산", roman: "san (산)", pronunciationKey: "ko-KR" },
      vi:  { native: "sơn", roman: "sơn", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-shui",
    main: "水", alt: "水",
    meaning: "water",
    note: "Everyday speech uses native words in Japanese (mizu) and Vietnamese (nước); the Sino form lives in compounds.",
    confidence: "Medium", tags: ["nature", "everyday"],
    forms: {
      zh:  { native: "水", roman: "shuǐ", pronunciationKey: "zh-CN" },
      yue: { native: "水", roman: "seoi2", pronunciationKey: "zh-HK" },
      nan: { native: "水", roman: "tsuí", pronunciationKey: null },
      ja:  { native: "水", roman: "mizu / sui (みず)", pronunciationKey: "ja-JP" },
      ko:  { native: "수", roman: "su (수)", pronunciationKey: "ko-KR" },
      vi:  { native: "thủy", roman: "thủy", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-huo",
    main: "火", alt: "火",
    meaning: "fire",
    note: "Japanese on'yomi 'ka' shifted from the older 'fa'; Korean lost the initial entirely (f → ∅).",
    confidence: "High", tags: ["nature", "elements"],
    forms: {
      zh:  { native: "火", roman: "huǒ", pronunciationKey: "zh-CN" },
      yue: { native: "火", roman: "fo2", pronunciationKey: "zh-HK" },
      nan: { native: "火", roman: "hé / hóe", pronunciationKey: null },
      ja:  { native: "火", roman: "hi / ka (ひ)", pronunciationKey: "ja-JP" },
      ko:  { native: "화", roman: "hwa (화)", pronunciationKey: "ko-KR" },
      vi:  { native: "hoả", roman: "hoả (huỷ)", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-dian",
    main: "電", alt: "电",
    meaning: "electricity; lightning",
    note: "A modern semantic extension: the classical character for lightning was repurposed for electricity in Meiji-era Japanese coinages, then borrowed back into Chinese and Korean.",
    confidence: "High", tags: ["technology", "nature"],
    forms: {
      zh:  { native: "电", roman: "diàn", pronunciationKey: "zh-CN" },
      yue: { native: "電", roman: "din6", pronunciationKey: "zh-HK" },
      nan: { native: "電", roman: "tiān", pronunciationKey: null },
      ja:  { native: "電気", roman: "denki (でんき)", pronunciationKey: "ja-JP" },
      ko:  { native: "전기", roman: "jeon-gi (전기)", pronunciationKey: "ko-KR" },
      vi:  { native: "điện", roman: "điện", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-wen",
    main: "文", alt: "文",
    meaning: "writing; language; literature; pattern",
    note: "Semantic shift par excellence: from 'tattooed pattern' in oracle bones to literature, culture, and grammar.",
    confidence: "High", tags: ["language", "culture"],
    forms: {
      zh:  { native: "文字", roman: "wénzì", pronunciationKey: "zh-CN" },
      yue: { native: "文字", roman: "man4 zi6", pronunciationKey: "zh-HK" },
      nan: { native: "文字", roman: "bûn-jī", pronunciationKey: null },
      ja:  { native: "文字", roman: "moji / bunji (もじ)", pronunciationKey: "ja-JP" },
      ko:  { native: "문자", roman: "mun-ja (문자)", pronunciationKey: "ko-KR" },
      vi:  { native: "văn tự", roman: "văn tự", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-hua2",
    main: "花", alt: "花",
    meaning: "flower; blossom",
    note: "Korean 'kkot' and Vietnamese 'hoa' show how the same Middle Chinese initial frayed differently across the region.",
    confidence: "High", tags: ["nature"],
    forms: {
      zh:  { native: "花", roman: "huā", pronunciationKey: "zh-CN" },
      yue: { native: "花", roman: "faa1", pronunciationKey: "zh-HK" },
      nan: { native: "花", roman: "hue / hoe", pronunciationKey: null },
      ja:  { native: "花", roman: "hana / ka (はな)", pronunciationKey: "ja-JP" },
      ko:  { native: "화", roman: "hwa (화)", pronunciationKey: "ko-KR" },
      vi:  { native: "hoa", roman: "hoa", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-xin",
    main: "心", alt: "心",
    meaning: "heart; mind",
    note: "In all six cultures the heart, not the brain, is the seat of thought and feeling.",
    confidence: "High", tags: ["body", "emotion"],
    forms: {
      zh:  { native: "心", roman: "xīn", pronunciationKey: "zh-CN" },
      yue: { native: "心", roman: "sam1", pronunciationKey: "zh-HK" },
      nan: { native: "心", roman: "sim", pronunciationKey: null },
      ja:  { native: "心", roman: "kokoro / shin (こころ)", pronunciationKey: "ja-JP" },
      ko:  { native: "심", roman: "sim (심)", pronunciationKey: "ko-KR" },
      vi:  { native: "tâm", roman: "tâm", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-long",
    main: "龍", alt: "龙",
    meaning: "dragon",
    note: "The auspicious East Asian dragon, distinct from the Western wyvern. A shared cultural symbol across all six scripts.",
    confidence: "High", tags: ["mythology", "animals"],
    forms: {
      zh:  { native: "龙", roman: "lóng", pronunciationKey: "zh-CN" },
      yue: { native: "龍", roman: "lung4", pronunciationKey: "zh-HK" },
      nan: { native: "龍", roman: "líng / liông", pronunciationKey: null },
      ja:  { native: "竜", roman: "ryū / tatsu (りゅう)", pronunciationKey: "ja-JP" },
      ko:  { native: "용", roman: "yong (용)", pronunciationKey: "ko-KR" },
      vi:  { native: "long", roman: "long", pronunciationKey: "vi-VN" }
    }
  },
  {
    id: "w-xing2",
    main: "星", alt: "星",
    meaning: "star; planet",
    note: "Three Suns (日) under One Birth (生): stars as small suns awaiting their day. Sei / seong / tinh preserve the old s-initial cleanly.",
    confidence: "High", tags: ["cosmos", "nature"],
    forms: {
      zh:  { native: "星星", roman: "xīngxing", pronunciationKey: "zh-CN" },
      yue: { native: "星", roman: "sing1", pronunciationKey: "zh-HK" },
      nan: { native: "星", roman: "senn / sing", pronunciationKey: null },
      ja:  { native: "星", roman: "hoshi / sei (ほし)", pronunciationKey: "ja-JP" },
      ko:  { native: "별", roman: "byeol / seong (별)", pronunciationKey: "ko-KR" },
      vi:  { native: "tinh", roman: "tinh", pronunciationKey: "vi-VN" }
    }
  }
];
