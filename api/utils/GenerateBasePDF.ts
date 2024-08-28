import PDFDocument from "pdfkit";
import path from "path";

const GenerateBasePDF = (
  title: string,
  callback: (doc: PDFKit.PDFDocument) => void
): PDFKit.PDFDocument => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Correct path to the logo file
  const logoPath = path.resolve(__dirname, "../assets/logo.png");

  // Header
  doc
    .image(logoPath, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text(title, 110, 57)
    .fontSize(10)
    .text("Barber Shop Inc.", 200, 65, { align: "right" })
    .text("1234 Main Street", 200, 80, { align: "right" })
    .text("Anytown, USA 12345", 200, 95, { align: "right" })
    .moveDown();

  // Footer
  doc.on("pageAdded", () => {
    doc
      .fillColor("#444444")
      .fontSize(10)
      .text("Barber Shop Inc.", 50, 770, { align: "center", width: 500 });
  });

  callback(doc);

  doc.end();
  return doc;
};

export default GenerateBasePDF;
