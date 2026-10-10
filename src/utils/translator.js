import { pipeline } from "@huggingface/transformers";

let translator = null;
let translatorPromise = null;

const getTranslator = async () => {
    // Already loaded
    if (translator) {
        return translator;
    }

    // Currently loading
    if (translatorPromise) {
        return translatorPromise;
    }

    translatorPromise = pipeline(
        "translation",
        "Xenova/nllb-200-distilled-600M",
        {
            dtype: "q8",
            session_options: {
                graphOptimizationLevel: "basic",
            },
        }
    );

    try {
        translator = await translatorPromise;
        return translator;
    } catch (error) {
        // Important: allow retry if model loading fails
        translatorPromise = null;
        translator = null;

        console.error(
            "Failed to load translation model:",
            error
        );

        throw error;
    }
};

export const translateText = async (
    text,
    targetLanguage
) => {

    if (
        !text ||
        targetLanguage === "eng_Latn"
    ) {
        return text;
    }

    const translatorInstance = await getTranslator();

    const result = await translatorInstance(
        text,
        {
            src_lang: "eng_Latn",
            tgt_lang: targetLanguage,
        }
    );

    return (
        result?.[0]?.translation_text ||
        text
    );
};

export const translateArray = async (
    items = [],
    targetLanguage
) => {

    if (
        !Array.isArray(items) ||
        items.length === 0 ||
        targetLanguage === "eng_Latn"
    ) {
        return items;
    }

    return Promise.all(
        items.map(item =>
            translateText(
                item,
                targetLanguage
            )
        )
    );
};

// import { pipeline } from "@huggingface/transformers";

// let translator = null;
// let translatorPromise = null;

// // Cache translated text
// const translationCache = new Map();

// const getTranslator = async () => {
//     // Already loaded
//     if (translator) {
//         return translator;
//     }

//     // Currently loading
//     if (translatorPromise) {
//         return translatorPromise;
//     }

//     translatorPromise = pipeline(
//         "translation",
//         "Xenova/nllb-200-distilled-600M",
//         {
//             dtype: "q8",
//             session_options: {
//                 graphOptimizationLevel: "basic",
//             },
//         }
//     );

//     try {
//         translator = await translatorPromise;
//         return translator;
//     } catch (error) {
//         // Important: allow retry if model loading fails
//         translatorPromise = null;
//         translator = null;

//         console.error(
//             "Failed to load translation model:",
//             error
//         );

//         throw error;
//     }
// };

// export const translateBatch = async (
//     texts = [],
//     targetLanguage
// ) => {

//     if (
//         !Array.isArray(texts) ||
//         texts.length === 0 ||
//         targetLanguage === "eng_Latn"
//     ) {
//         return texts;
//     }

//     // Keep original indexes
//     const uniqueTexts = [];
//     const uniqueIndexes = new Map();

//     texts.forEach((text, index) => {

//         const value = String(text ?? "").trim();

//         if (!value) {
//             return;
//         }

//         if (!uniqueIndexes.has(value)) {
//             uniqueIndexes.set(value, uniqueTexts.length);
//             uniqueTexts.push(value);
//         }
//     });

//     if (uniqueTexts.length === 0) {
//         return texts;
//     }

//     const results = new Array(uniqueTexts.length);

//     // ------------------------------------------------
//     // CHECK CACHE
//     // ------------------------------------------------

//     const textsToTranslate = [];
//     const indexesToTranslate = [];

//     uniqueTexts.forEach((text, index) => {

//         const cacheKey =
//             `${targetLanguage}:${text}`;

//         if (translationCache.has(cacheKey)) {

//             results[index] =
//                 translationCache.get(cacheKey);

//         } else {

//             textsToTranslate.push(text);
//             indexesToTranslate.push(index);

//         }
//     });


//     // ------------------------------------------------
//     // TRANSLATE ONLY MISSING TEXT
//     // ------------------------------------------------

//     if (textsToTranslate.length > 0) {

//         const translatorInstance =
//             await getTranslator();

//         /**
//          * IMPORTANT:
//          *
//          * Transformers.js translation pipeline
//          * accepts an array of strings.
//          *
//          * This avoids creating one inference
//          * request per text.
//          */

//         const translated =
//             await translatorInstance(
//                 textsToTranslate,
//                 {
//                     src_lang: "eng_Latn",
//                     tgt_lang: targetLanguage,
//                 }
//             );


//         translated.forEach(
//             (item, index) => {

//                 const translatedText =
//                     item?.translation_text ||
//                     textsToTranslate[index];

//                 const originalIndex =
//                     indexesToTranslate[index];

//                 results[originalIndex] =
//                     translatedText;

//                 const cacheKey =
//                     `${targetLanguage}:${textsToTranslate[index]}`;

//                 translationCache.set(
//                     cacheKey,
//                     translatedText
//                 );
//             }
//         );
//     }


//     // ------------------------------------------------
//     // RESTORE ORIGINAL ARRAY
//     // ------------------------------------------------

//     return texts.map(text => {

//         const value =
//             String(text ?? "").trim();

//         if (!value) {
//             return text;
//         }

//         const index =
//             uniqueIndexes.get(value);

//         return results[index] || text;
//     });
// };

// export const translateText = async (
//     text,
//     targetLanguage
// ) => {

//     if (
//         !text ||
//         targetLanguage === "eng_Latn"
//     ) {
//         return text;
//     }

//     const value = String(text).trim();

//     if (!value) {
//         return text;
//     }

//     const cacheKey =
//         `${targetLanguage}:${value}`;

//     // Cache
//     if (translationCache.has(cacheKey)) {
//         return translationCache.get(cacheKey);
//     }

//     const result =
//         await translateBatch(
//             [value],
//             targetLanguage
//         );

//     return result?.[0] || text;
// };

// export const translateArray = async (
//     items = [],
//     targetLanguage
// ) => {

//     if (
//         !Array.isArray(items) ||
//         items.length === 0 ||
//         targetLanguage === "eng_Latn"
//     ) {
//         return items;
//     }

//     return translateBatch(
//         items,
//         targetLanguage
//     );
// };

// export const preloadTranslator = () => {
//     return getTranslator();
// };