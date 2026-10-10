// newbillStyle.js
import { StyleSheet } from "@react-pdf/renderer";

export default StyleSheet.create({
  page: {
    fontSize: 10,
    // backgroundColor: "#f7f6ec",
    margin: 0,
    padding: 0,
  },

  // STEP 1: outer border + skeleton layout
  outerBorder: {
    height: "100%",
    margin: 14,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderStyle: "solid",
  },
  row: {
    height: "100%",
    flexDirection: "row",
  },
  halfColumn: {
    flex: 1,
    height: "100%",
    position: "relative",
    flexDirection: "column",
  },

  headerWrapper: {
    position: "relative",
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // headerContentRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   zIndex: 2, // sits above the swoosh
  //   position: "relative",
  //   paddingLeft: 44,
  // },

  headerContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 44,
  },

  logoBlock: {
    flexDirection: "row",
    alignItems: "center",
  },

  // logoCircle: {
  //   width: 34,
  //   height: 34,
  //   borderRadius: 17,
  //   borderWidth: 1.5,
  //   borderColor: "#1e4d2b",
  //   backgroundColor: "#ffffff",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginRight: 8,
  // },

  logoCircle: {
    width: 40,
    height: 40,
    // borderRadius: 17,
    // borderWidth: 1.5,
    // borderColor: "#1e4d2b",
    overflow: "hidden",
    marginRight: 8,
    marginLeft:2,
  },

  logoImage: {
    width: "100%",
    height: "100%",
    // borderRadius: 17,
    objectFit: "cover",
  },

  logoInitials: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e4d2b",
  },

  // hospitalNameBlock: {
  //   flexDirection: "column",
  // },

  hospitalNameBlock: {
    flexDirection: "column",
    flexShrink: 1,
  },

  hospitalNameEn: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e4d2b",
  },

  hospitalSubEn: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1e4d2b",
    marginTop:2,
  },

  hospitalNameMr: {
    fontFamily: "NotoSansDevanagari",
    fontSize: 6.5,
    color: "#1e4d2b",
    marginTop: 1,
  },

  contactBlock: {
    flexDirection: "column",
    alignItems: "flex-end",
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  contactTextGroup: {
    flexDirection: "column",
    marginLeft: 4,
  },

  contactLineMr: {
    fontFamily: "NotoSansDevanagari",
    fontSize: 8,
    color: "#333333",
    textAlign: "right",
  },

  contactPhone: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#1e4d2b",
    marginTop: 2,
  },

  copyBadgeRow: {
    alignItems: "center",
    marginTop: 18,
    zIndex: 2,
    position: "relative",
  },

  copyBadgeText: {
    backgroundColor: "#1e4d2b",
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  placeholderLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e4d2b",
  },

  // gutter holding the dashed cutline + scissors
  gutter: {
    width: 26,
    height: "100%",
    position: "relative",
  },
  dashedLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 0,
    borderLeftWidth: 1,
    borderLeftColor: "#999999",
    borderLeftStyle: "dashed",
  },
  scissorMark: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    left: "50%",
    marginLeft: -7,
    backgroundColor: "#f7f6ec",
    borderWidth: 1,
    borderColor: "#999999",
    alignItems: "center",
    justifyContent: "center",
  },
  scissorTop: {
    top: -7,
  },
  scissorBottom: {
    bottom: -7,
  },
  scissorText: {
    fontSize: 7,
    color: "#666666",
  },

  // Section Title Badges (kept from your original, for later steps)
  badgeRow: {
    alignItems: "center",
    marginVertical: 8,
  },
  badgeText: {
    backgroundColor: "#1e4d2b",
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Table Card Styling (kept for later steps)
  card: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    marginBottom: 10,
    padding: 8,
    backgroundColor: "transparent",
  },
  cardTitleBadge: {
    backgroundColor: "#1e4d2b",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: -14,
    marginBottom: 6,
  },
  cardTitleText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },

  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  gridRowLast: {
    flexDirection: "row",
    marginBottom: 0,
  },
  col50: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  col100: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    width: "30%",
    fontSize: 8.5,
    color: "#333333",
    fontWeight: "bold",
  },
  labelLong: {
    width: "15%",
    fontSize: 7.5,
    color: "#333333",
    fontWeight: "bold",
  },
  colon: {
    width: "5%",
    fontSize: 7.5,
    color: "#333333",
  },
  colonLong: {
    width: "2.5%",
    fontSize: 7.5,
    color: "#333333",
  },
  value: {
    width: "65%",
    fontSize: 8,
    color: "#000000",
    fontFamily: "NotoSansDevanagari",
  },
  valueBold: {
    width: "65%",
    fontSize: 7.5,
    color: "#000000",
    fontWeight: "bold",
  },
  valueLong: {
    width: "82.5%",
    fontSize: 8,
    color: "#000000",
  },
  valueLongBold: {
    width: "82.5%",
    fontSize: 7.5,
    color: "#000000",
    fontWeight: "bold",
  },

  // body code
  bodyContainer: {
    paddingTop: 10,
    paddingBottom: 95,
    paddingHorizontal: 20,
    flex: 1,
    zIndex: 5,
    position: "relative", // needed so the watermark anchors correctly inside it
  },

  // watermark: {
  //   position: "absolute",
  //   bottom: 60, // sits just above the footer text, inside body area
  //   left: "50%",
  //   width: 130,
  //   height: 130,
  //   marginLeft: -65,
  //   opacity: 0.06,
  //   zIndex: 1,
  // },

  watermark: {
    position: "absolute",
    top: "42%",            // Visually balanced vertically in the document center
    left: "50%",
    width: 200,            // Enlarged slightly from 160 for a more premium background presence
    height: 200,
    marginLeft: -110,      // Precise center alignment calculation (half of width)
    marginTop: -110,       // Precise center alignment calculation (half of height)
    opacity: 0.04,         // Lightened from 0.06 so black billing text remains perfectly legible
  },

  // Notes + signature row
  notesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
    zIndex: 5,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    padding: 8,
  },

  notesBlock: {
    width: "62%",
  },

  notesTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 2,
  },

  notesLine: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 2,
  },

  signatureBlock: {
    width: "34%",
    alignItems: "center",
  },

  signatureLine: {
    width: "80%",
    height: 1,
    // left blank on purpose — no image/path, just the underline for now
    marginBottom: 3,
  },

  signatureLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333333",
  },

  // footer code

  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160, // matches BottomRightSwoosh's viewBox height
    width: "100%",
  },

  footerTextBlock: {
    position: "absolute",
    bottom: 85, // sits above the swoosh curve, not on top of it
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },

  footerThankYou: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e4d2b",
    marginBottom: 2,
  },

  footerWish: {
    fontSize: 7,
    color: "#333333",
  },

  footerWish2: {
    fontSize: 7,
    color: "#fff",
    position: "absolute",
    bottom: 35,
    left: 0,
    right: 0,
    textAlign: "center",
  },
});
