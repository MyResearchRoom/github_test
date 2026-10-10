export default {
  page: {
    fontFamily: "NotoSansDevanagari",
    fontSize: 10,
    // backgroundColor: "#f7f6ec",
    paddingTop: 115,       // Raised from 90 to ensure body content doesn't hit header graphics
    paddingBottom: 80,    // Re-enabled and set to 80 to protect footer vector overlaps
    paddingHorizontal: 0,
    height: "100%",        // Forces the page viewport container to span the entire A4 canvas height
    position: "relative",  // Establishes the boundary anchor for absolute child alignment
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingHorizontal: 24,
    paddingTop: 14,
    zIndex: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 10,
  },
  watermark: {
    position: "absolute",
    top: "42%",            // Visually balanced vertically in the document center
    left: "50%",
    width: 220,            // Enlarged slightly from 160 for a more premium background presence
    height: 220,
    marginLeft: -110,      // Precise center alignment calculation (half of width)
    marginTop: -110,       // Precise center alignment calculation (half of height)
    opacity: 0.04,         // Lightened from 0.06 so black billing text remains perfectly legible
  },
};
