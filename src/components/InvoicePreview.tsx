import { forwardRef } from "react";
import { invoiceSelectors } from "../store/invoiceStore";
import type { InvoiceData } from "../types";
import { formatDate, formatMoney } from "../utils/invoice";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  scale?: number;
  transformOrigin?: string;
}

const templateClassMap = {
  modern: "border-t-8",
  classic: "border-y-4",
  minimal: "border-l-4",
};

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, scale = 1, transformOrigin = "top center" }, ref) => {
  const subtotal = invoiceSelectors.subtotal(invoice);
  const taxAmount = invoiceSelectors.taxAmount(invoice);
  const discountAmount = invoiceSelectors.discountAmount(invoice);
  const total = invoiceSelectors.total(invoice);

  return (
    <div
      className="print-surface mx-auto w-fit transition-transform duration-300 ease-out"
      style={{
        transform: `scale(${scale})`,
        transformOrigin,
        marginLeft: transformOrigin === "top left" ? "0" : undefined,
        marginRight: transformOrigin === "top left" ? "auto" : undefined,
      }}
    >
      <article
        ref={ref}
        className={`invoice-document mx-auto flex flex-col p-10 shadow-paper ${templateClassMap[invoice.settings.template]}`}
        style={{ borderColor: invoice.settings.accentColor }}
      >
        <header className="mb-10 grid grid-cols-2 gap-6">
          <section>
            {invoice.business.logo ? (
              <img src={invoice.business.logo} alt="Business logo" className="mb-4 h-14 w-auto object-contain" />
            ) : null}
            <h1 className="text-2xl font-bold">{invoice.business.name}</h1>
            <p className="mt-2 text-sm text-gray-600">{invoice.business.address.line1}</p>
            {invoice.business.address.line2 ? (
              <p className="text-sm text-gray-600">{invoice.business.address.line2}</p>
            ) : null}
            <p className="text-sm text-gray-600">
              {invoice.business.address.state}, {invoice.business.address.country}
            </p>
            <p className="mt-2 text-sm text-gray-600">{invoice.business.email}</p>
            <p className="text-sm text-gray-600">{invoice.business.phone}</p>
          </section>

          <section className="text-right">
            <h2 className="text-4xl font-black uppercase tracking-tight" style={{ color: invoice.settings.accentColor }}>
              Invoice
            </h2>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Invoice #:</span> {invoice.meta.invoiceNumber}
              </p>
              <p>
                <span className="font-semibold">Issue Date:</span> {formatDate(invoice.meta.issueDate)}
              </p>
              <p>
                <span className="font-semibold">Due Date:</span> {formatDate(invoice.meta.dueDate)}
              </p>
            </div>
          </section>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">From</p>
            <p className="font-semibold">{invoice.business.name}</p>
            <p className="text-sm text-gray-600">{invoice.business.address.line1}</p>
            {invoice.business.address.line2 ? <p className="text-sm text-gray-600">{invoice.business.address.line2}</p> : null}
            <p className="text-sm text-gray-600">
              {invoice.business.address.state}, {invoice.business.address.country}
            </p>
            <p className="text-sm text-gray-600">{invoice.business.email}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Bill To</p>
            <p className="font-semibold">{invoice.client.name}</p>
            <p className="text-sm text-gray-600">{invoice.client.address.line1}</p>
            {invoice.client.address.line2 ? <p className="text-sm text-gray-600">{invoice.client.address.line2}</p> : null}
            <p className="text-sm text-gray-600">
              {invoice.client.address.state}, {invoice.client.address.country}
            </p>
            <p className="text-sm text-gray-600">{invoice.client.email}</p>
          </div>
        </section>

        <table className="mb-8 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="px-3 py-3 text-left font-semibold">Description</th>
              <th className="px-3 py-3 text-right font-semibold">Qty</th>
              <th className="px-3 py-3 text-right font-semibold">Unit Price</th>
              <th className="px-3 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="px-3 py-3 align-top">{item.description || "-"}</td>
                <td className="px-3 py-3 text-right">{item.qty}</td>
                <td className="px-3 py-3 text-right">{formatMoney(item.unitPrice, invoice.meta.currency)}</td>
                <td className="px-3 py-3 text-right font-semibold">
                  {formatMoney(item.qty * item.unitPrice, invoice.meta.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="ml-auto mb-10 w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, invoice.meta.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatMoney(taxAmount, invoice.meta.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatMoney(discountAmount, invoice.meta.currency)}</span>
          </div>
          <div className="my-2 border-t border-gray-300" />
          <div className="flex justify-between text-2xl font-extrabold" style={{ color: invoice.settings.accentColor }}>
            <span>Total</span>
            <span>{formatMoney(total, invoice.meta.currency)}</span>
          </div>
        </section>

        <section className="space-y-6 text-sm">
          {invoice.notes.notes ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</p>
              <p className="mt-1 whitespace-pre-wrap text-gray-700">{invoice.notes.notes}</p>
            </div>
          ) : null}
          {invoice.notes.terms ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Terms</p>
              <p className="mt-1 whitespace-pre-wrap text-gray-700">{invoice.notes.terms}</p>
            </div>
          ) : null}
        </section>

        <footer className="mt-auto pt-10 text-center text-xs text-gray-500">{invoice.notes.footer}</footer>
      </article>
    </div>
  );
  },
);

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;
