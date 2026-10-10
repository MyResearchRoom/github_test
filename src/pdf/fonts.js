// fonts.js

import { Font } from "@react-pdf/renderer";

import NotoRegular from "../assets/fonts/NotoSansDevanagari-Regular.ttf";
import NotoBold from "../assets/fonts/NotoSansDevanagari-Bold.ttf";

Font.register({
    family: "NotoSansDevanagari",
    fonts: [
        {
            src: NotoRegular,
            fontWeight: "normal",
        },
        {
            src: NotoBold,
            fontWeight: "bold",
        },
    ],
});