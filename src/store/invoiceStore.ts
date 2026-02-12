import { create } from "zustand";
import type { InvoiceData, LineItem } from "../types";

const todayISO = new Date().toISOString().slice(0, 10);
const dueISO = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const localeCurrency = Intl.NumberFormat().resolvedOptions().currency ?? "USD";

const defaultInvoice: InvoiceData = {
  meta: {
    currency: localeCurrency,
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    issueDate: todayISO,
    dueDate: dueISO,
  },
  business: {
    logo: undefined,
    name: "Your Business Name",
    address: {
      line1: "Street Address",
      line2: "Suite / Floor",
      state: "State",
      country: "United States",
    },
    phone: "+1 555-0100",
    email: "billing@business.com",
  },
  client: {
    name: "Client Company",
    address: {
      line1: "Client Street",
      line2: "",
      state: "State",
      country: "United States",
    },
    phone: "+1 555-0199",
    email: "accounts@client.com",
  },
  items: [{ id: crypto.randomUUID(), description: "Service Fee", qty: 1, unitPrice: 500 }],
  settings: {
    taxRate: 0,
    discount: 0,
    accentColor: "#7C3AED",
    template: "modern",
  },
  notes: {
    notes: "Thank you for your business.",
    terms: "Payment due within 7 days.",
    footer: "SpeedyBill",
  },
};

interface InvoiceStore {
  invoice: InvoiceData;
  resetInvoice: () => void;
  updateMeta: (patch: Partial<InvoiceData["meta"]>) => void;
  updateBusiness: (patch: Partial<InvoiceData["business"]>) => void;
  updateBusinessAddress: (patch: Partial<InvoiceData["business"]["address"]>) => void;
  updateClient: (patch: Partial<InvoiceData["client"]>) => void;
  updateClientAddress: (patch: Partial<InvoiceData["client"]["address"]>) => void;
  addItem: () => void;
  updateItem: (id: string, patch: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  updateSettings: (patch: Partial<InvoiceData["settings"]>) => void;
  updateNotes: (patch: Partial<InvoiceData["notes"]>) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoice: defaultInvoice,
  resetInvoice: () => set(() => ({ invoice: structuredClone(defaultInvoice) })),
  updateMeta: (patch) =>
    set((state) => ({ invoice: { ...state.invoice, meta: { ...state.invoice.meta, ...patch } } })),
  updateBusiness: (patch) =>
    set((state) => ({ invoice: { ...state.invoice, business: { ...state.invoice.business, ...patch } } })),
  updateBusinessAddress: (patch) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        business: {
          ...state.invoice.business,
          address: { ...state.invoice.business.address, ...patch },
        },
      },
    })),
  updateClient: (patch) =>
    set((state) => ({ invoice: { ...state.invoice, client: { ...state.invoice.client, ...patch } } })),
  updateClientAddress: (patch) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        client: {
          ...state.invoice.client,
          address: { ...state.invoice.client.address, ...patch },
        },
      },
    })),
  addItem: () =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        items: [
          ...state.invoice.items,
          { id: crypto.randomUUID(), description: "", qty: 1, unitPrice: 0 },
        ],
      },
    })),
  updateItem: (id, patch) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        items: state.invoice.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      },
    })),
  removeItem: (id) =>
    set((state) => ({
      invoice: {
        ...state.invoice,
        items: state.invoice.items.filter((item) => item.id !== id),
      },
    })),
  updateSettings: (patch) =>
    set((state) => ({ invoice: { ...state.invoice, settings: { ...state.invoice.settings, ...patch } } })),
  updateNotes: (patch) =>
    set((state) => ({ invoice: { ...state.invoice, notes: { ...state.invoice.notes, ...patch } } })),
}));

export const invoiceSelectors = {
  subtotal: (invoice: InvoiceData) =>
    invoice.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
  taxAmount: (invoice: InvoiceData) =>
    invoiceSelectors.subtotal(invoice) * (Math.max(invoice.settings.taxRate, 0) / 100),
  discountAmount: (invoice: InvoiceData) => Math.max(invoice.settings.discount, 0),
  total: (invoice: InvoiceData) =>
    invoiceSelectors.subtotal(invoice) +
    invoiceSelectors.taxAmount(invoice) -
    invoiceSelectors.discountAmount(invoice),
};
