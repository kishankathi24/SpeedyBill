export interface Address {
  line1: string;
  line2: string;
  state: string;
  country: string;
}

export interface InvoiceMeta {
  currency: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

export interface Party {
  logo?: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
}

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface InvoiceSettings {
  taxRate: number;
  discount: number;
  accentColor: string;
  template: "modern" | "classic" | "minimal";
}

export interface InvoiceNotes {
  notes: string;
  terms: string;
  footer: string;
}

export interface InvoiceData {
  meta: InvoiceMeta;
  business: Party;
  client: Omit<Party, "logo">;
  items: LineItem[];
  settings: InvoiceSettings;
  notes: InvoiceNotes;
}
