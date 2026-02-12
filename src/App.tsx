import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TopBar from "./components/TopBar";
import EditorPanel from "./components/EditorPanel";
import InvoicePreview from "./components/InvoicePreview";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { useInvoiceStore } from "./store/invoiceStore";

export default function App() {
  const invoice = useInvoiceStore((state) => state.invoice);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: invoice.meta.invoiceNumber,
    pageStyle: `
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  const handleDownload = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: previewRef.current.scrollWidth,
      height: previewRef.current.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: previewRef.current.scrollWidth,
      windowHeight: previewRef.current.scrollHeight,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    pdf.addImage(imageData, "PNG", 0, 0, 210, 297, undefined, "FAST");
    pdf.save(`${invoice.meta.invoiceNumber || "invoice"}.pdf`);
  };

  return (
    <main className="min-h-screen">
      <TopBar onNew={resetInvoice} onPrint={() => void handlePrint()} onDownload={() => void handleDownload()} />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[minmax(360px,40%)_minmax(0,60%)]">
        <EditorPanel />
        <section className="overflow-auto p-4 lg:p-8">
          <InvoicePreview ref={previewRef} invoice={invoice} />
        </section>
      </div>

      <PWAInstallPrompt />
    </main>
  );
}
