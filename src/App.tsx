import { useLayoutEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Theme } from "@radix-ui/themes";
import { X } from "lucide-react";
import TopBar from "./components/TopBar";
import EditorPanel from "./components/EditorPanel";
import InvoicePreview from "./components/InvoicePreview";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { useInvoiceStore } from "./store/invoiceStore";

const PREVIEW_PADDING_PX = 24;

export default function App() {
  const invoice = useInvoiceStore((state) => state.invoice);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);
  const desktopPreviewRef = useRef<HTMLDivElement>(null);
  const exportPreviewRef = useRef<HTMLDivElement>(null);
  const previewHostRef = useRef<HTMLElement>(null);
  const mobilePreviewHostRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [mobilePreviewScale, setMobilePreviewScale] = useState(1);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [appearance, setAppearance] = useState<"light" | "dark">("light");

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", appearance === "dark");
    document.documentElement.style.colorScheme = appearance;
  }, [appearance]);

  useLayoutEffect(() => {
    const host = previewHostRef.current;
    const invoiceNode = desktopPreviewRef.current;
    if (!host || !invoiceNode) return;

    const updateScale = () => {
      const availableWidth = Math.max(1, host.clientWidth - PREVIEW_PADDING_PX);
      const availableHeight = Math.max(1, host.clientHeight - PREVIEW_PADDING_PX);
      const contentWidth = Math.max(1, invoiceNode.scrollWidth);
      const contentHeight = Math.max(1, invoiceNode.scrollHeight);

      const widthScale = availableWidth / contentWidth;
      const heightScale = availableHeight / contentHeight;
      const nextScale = Math.min(1, widthScale, heightScale);
      setPreviewScale(Number.isFinite(nextScale) ? Math.max(0.05, nextScale) : 1);
    };

    const hostObserver = new ResizeObserver(updateScale);
    const invoiceObserver = new ResizeObserver(updateScale);
    hostObserver.observe(host);
    invoiceObserver.observe(invoiceNode);
    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      hostObserver.disconnect();
      invoiceObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [invoice]);

  useLayoutEffect(() => {
    if (!isMobilePreviewOpen) return;
    const host = mobilePreviewHostRef.current;
    const invoiceNode = mobilePreviewRef.current;
    if (!host || !invoiceNode) return;

    const updateScale = () => {
      const availableWidth = Math.max(1, host.clientWidth - PREVIEW_PADDING_PX);
      const availableHeight = Math.max(1, host.clientHeight - PREVIEW_PADDING_PX);
      const contentWidth = Math.max(1, invoiceNode.scrollWidth);
      const contentHeight = Math.max(1, invoiceNode.scrollHeight);

      const widthScale = availableWidth / contentWidth;
      const heightScale = availableHeight / contentHeight;
      const nextScale = Math.min(1, widthScale, heightScale);
      setMobilePreviewScale(Number.isFinite(nextScale) ? Math.max(0.05, nextScale) : 1);
      host.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const hostObserver = new ResizeObserver(updateScale);
    const invoiceObserver = new ResizeObserver(updateScale);
    hostObserver.observe(host);
    invoiceObserver.observe(invoiceNode);
    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      hostObserver.disconnect();
      invoiceObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [isMobilePreviewOpen, invoice]);

  const handlePrint = useReactToPrint({
    contentRef: exportPreviewRef,
    documentTitle: invoice.meta.invoiceNumber,
    pageStyle: `
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  const handleDownload = async () => {
    if (!exportPreviewRef.current) return;

    const sourceNode = exportPreviewRef.current;

    const tempRoot = document.createElement("div");
    tempRoot.style.position = "fixed";
    tempRoot.style.left = "0";
    tempRoot.style.top = "0";
    tempRoot.style.width = `${sourceNode.scrollWidth}px`;
    tempRoot.style.background = "#ffffff";
    tempRoot.style.opacity = "0";
    tempRoot.style.pointerEvents = "none";
    tempRoot.style.zIndex = "-1";

    const clonedNode = sourceNode.cloneNode(true) as HTMLDivElement;
    clonedNode.style.transform = "none";
    clonedNode.style.margin = "0";
    clonedNode.style.boxShadow = "none";
    clonedNode.style.width = `${sourceNode.scrollWidth}px`;
    clonedNode.style.minHeight = `${sourceNode.scrollHeight}px`;

    tempRoot.appendChild(clonedNode);
    document.body.appendChild(tempRoot);

    try {
      if ("fonts" in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }

      const captureOptions = {
        scale: Math.max(2, window.devicePixelRatio || 1),
        useCORS: true,
        backgroundColor: "#ffffff",
        width: clonedNode.scrollWidth,
        height: clonedNode.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clonedNode.scrollWidth,
        windowHeight: clonedNode.scrollHeight,
      } as const;

      const hasVisiblePixels = (canvas: HTMLCanvasElement): boolean => {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return false;
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < data.length; i += 16) {
          const alpha = data[i + 3];
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          if (alpha > 0 && !(red > 248 && green > 248 && blue > 248)) {
            return true;
          }
        }
        return false;
      };

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(clonedNode, {
          ...captureOptions,
          foreignObjectRendering: true,
        });
        if (!hasVisiblePixels(canvas)) {
          canvas = await html2canvas(clonedNode, {
            ...captureOptions,
            foreignObjectRendering: false,
          });
        }
      } catch {
        canvas = await html2canvas(clonedNode, {
          ...captureOptions,
          foreignObjectRendering: false,
        });
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, Math.max(297, (canvas.height / canvas.width) * 210)],
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageData = canvas.toDataURL("image/png");
      pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");

      pdf.save(`${invoice.meta.invoiceNumber || "invoice"}.pdf`);
    } finally {
      document.body.removeChild(tempRoot);
    }
  };

  return (
    <Theme
      appearance={appearance}
      accentColor="purple"
      grayColor="sand"
      radius="medium"
      scaling="100%"
    >
      <main className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_#f4ecff_0%,_#faf9f6_45%)] text-gray-900 dark:bg-[radial-gradient(circle_at_top_right,_#26183f_0%,_#0f1117_45%)] dark:text-zinc-100">
        <TopBar
          onNew={resetInvoice}
          onPrint={() => void handlePrint()}
          onDownload={() => void handleDownload()}
          onViewPdf={() => setIsMobilePreviewOpen(true)}
          appearance={appearance}
          onToggleTheme={() =>
            setAppearance((mode) => (mode === "dark" ? "light" : "dark"))
          }
        />

        <div className="animate-fade-in mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[minmax(340px,40%)_minmax(0,60%)]">
          <section className="animate-slide-up min-h-0 overflow-hidden p-2 lg:p-4">
            <div className="h-full overflow-hidden rounded-2xl border border-purple-100 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/50">
              <EditorPanel />
            </div>
          </section>
          <section
            ref={previewHostRef}
            className="animate-fade-in hidden min-h-0 overflow-hidden p-2 lg:block lg:p-4"
          >
            <div className="h-full overflow-hidden rounded-2xl border border-purple-100 bg-white/70 p-1 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="h-full overflow-hidden rounded-xl">
                <InvoicePreview
                  ref={desktopPreviewRef}
                  invoice={invoice}
                  scale={previewScale}
                />
              </div>
            </div>
          </section>
        </div>

        {isMobilePreviewOpen ? (
          <section className="no-print fixed inset-0 z-50 flex flex-col bg-zinc-950 lg:hidden">
            <div className="flex items-center justify-between border-b border-white/20 bg-black px-4 py-3 text-white">
              <p className="text-sm font-semibold">Invoice Preview</p>
              <button
                type="button"
                className="rounded-md border border-white/30 bg-white/10 p-2"
                aria-label="Close preview"
                onClick={() => setIsMobilePreviewOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div ref={mobilePreviewHostRef} className="min-h-0 flex-1 overflow-auto p-2">
              <InvoicePreview
                ref={mobilePreviewRef}
                invoice={invoice}
                scale={mobilePreviewScale}
                transformOrigin="top left"
              />
            </div>
          </section>
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
        >
          <InvoicePreview ref={exportPreviewRef} invoice={invoice} scale={1} />
        </div>

        {!isMobilePreviewOpen ? <PWAInstallPrompt /> : null}
      </main>
    </Theme>
  );
}
