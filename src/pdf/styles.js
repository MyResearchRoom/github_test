import { StyleSheet } from "@react-pdf/renderer";

export default StyleSheet.create({

    page: {
        fontFamily: "NotoSansDevanagari",
        backgroundColor: "#fff",
        paddingTop: 110,
        paddingBottom: 90,
        paddingHorizontal: 40,
        fontSize: 11,
        // fontFamily: "Helvetica"
    },

    watermark: {
        position: "absolute",

        top: "35%",
        left: "22%",

        width: 300,
        height: 300,

        opacity: 0.08,

        zIndex: -1,
    },

    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingBottom: 5,

        borderBottomWidth: 1,
        borderBottomColor: "#000",
        borderBottomStyle: "solid",
    },

    footer: {
        position: "absolute",
        bottom: 20,
        borderTop: 1,
        paddingTop: 8,
        fontSize: 10
    },

    title:{
        textAlign:"center",
        fontSize:18,
        marginBottom:10,
        fontWeight:"bold"
    },

    row:{
        flexDirection:"row"
    },

    col:{
        flex:1
    },

    headerPriscription: {
        backgroundColor: "#f4f7ee",       // very light olive tint for the whole header block
        paddingTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 14,
        borderBottomWidth: 3,
        borderBottomColor: "#5c6e1f",     // olive green rule under header
    },
    headerBand: {
        backgroundColor: "#1f3d1f",       // dark green band (top strip)
        height: 16,
        marginBottom: 6,
    },
    footerPriscription: {
        backgroundColor: "#f4f7ee",
        paddingTop: 6,
        paddingHorizontal: 14,
        paddingBottom: 6,
        borderTopWidth: 3,
        borderTopColor: "#5c6e1f",
    },
    footerBand: {
        backgroundColor: "#5c6e1f",       // olive band above footer text
        height: 4,
        marginTop: 4,
        marginBottom: 4,
    },

});