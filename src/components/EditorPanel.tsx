import { useMemo } from "react";
import {
  Button,
  Card,
  Flex,
  RadioCards,
  Select,
  Tabs,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { Plus, Trash2 } from "lucide-react";
import { useInvoiceStore, invoiceSelectors } from "../store/invoiceStore";
import { formatMoney, toDataUrl } from "../utils/invoice";

export default function EditorPanel() {
  const {
    invoice,
    updateMeta,
    updateBusiness,
    updateBusinessAddress,
    updateClient,
    updateClientAddress,
    addItem,
    updateItem,
    removeItem,
    updateSettings,
    updateNotes,
  } = useInvoiceStore();

  const subtotal = useMemo(() => invoiceSelectors.subtotal(invoice), [invoice]);
  const total = useMemo(() => invoiceSelectors.total(invoice), [invoice]);

  const handleLogoUpload = async (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const logo = await toDataUrl(file);
    updateBusiness({ logo });
  };

  return (
    <aside className="no-print h-[calc(100vh-68px)] overflow-y-auto border-r border-purple-100 bg-white/80 p-5">
      <Flex direction="column" gap="4">
        <Card>
          <Text size="2" weight="medium">
            Template
          </Text>
          <RadioCards.Root
            mt="2"
            columns="3"
            value={invoice.settings.template}
            onValueChange={(value) =>
              updateSettings({ template: value as "modern" | "classic" | "minimal" })
            }
          >
            <RadioCards.Item value="modern">Modern</RadioCards.Item>
            <RadioCards.Item value="classic">Classic</RadioCards.Item>
            <RadioCards.Item value="minimal">Minimal</RadioCards.Item>
          </RadioCards.Root>
        </Card>

        <Tabs.Root defaultValue="details">
          <Tabs.List>
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <Tabs.Trigger value="items">Items</Tabs.Trigger>
            <Tabs.Trigger value="customize">Customization</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="details" className="mt-4 space-y-4">
            <Card>
              <Flex direction="column" gap="3">
                <Text weight="medium">Invoice Meta</Text>
                <label>
                  <Text size="2">Currency</Text>
                  <Select.Root
                    value={invoice.meta.currency}
                    onValueChange={(currency) => updateMeta({ currency })}
                  >
                    <Select.Trigger className="w-full" />
                    <Select.Content>
                      <Select.Item value="USD">USD</Select.Item>
                      <Select.Item value="EUR">EUR</Select.Item>
                      <Select.Item value="GBP">GBP</Select.Item>
                      <Select.Item value="INR">INR</Select.Item>
                      <Select.Item value="CAD">CAD</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </label>
                <label>
                  <Text size="2">Invoice Number</Text>
                  <TextField.Root
                    value={invoice.meta.invoiceNumber}
                    onChange={(e) => updateMeta({ invoiceNumber: e.target.value })}
                  />
                </label>
                <label>
                  <Text size="2">Issue Date</Text>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    type="date"
                    value={invoice.meta.issueDate}
                    onChange={(e) => updateMeta({ issueDate: e.target.value })}
                  />
                </label>
                <label>
                  <Text size="2">Due Date</Text>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    type="date"
                    value={invoice.meta.dueDate}
                    onChange={(e) => updateMeta({ dueDate: e.target.value })}
                  />
                </label>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="3">
                <Text weight="medium">Business Details</Text>
                <label>
                  <Text size="2">Logo (PNG/JPG up to 2MB)</Text>
                  <input
                    className="mt-1 block w-full text-sm"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => {
                      const [file] = Array.from(e.target.files ?? []);
                      void handleLogoUpload(file);
                    }}
                  />
                </label>
                <TextField.Root
                  placeholder="Business Name"
                  value={invoice.business.name}
                  onChange={(e) => updateBusiness({ name: e.target.value })}
                />
                <TextField.Root
                  placeholder="Address Line 1"
                  value={invoice.business.address.line1}
                  onChange={(e) => updateBusinessAddress({ line1: e.target.value })}
                />
                <TextField.Root
                  placeholder="Address Line 2"
                  value={invoice.business.address.line2}
                  onChange={(e) => updateBusinessAddress({ line2: e.target.value })}
                />
                <TextField.Root
                  placeholder="State"
                  value={invoice.business.address.state}
                  onChange={(e) => updateBusinessAddress({ state: e.target.value })}
                />
                <TextField.Root
                  placeholder="Country"
                  value={invoice.business.address.country}
                  onChange={(e) => updateBusinessAddress({ country: e.target.value })}
                />
                <TextField.Root
                  placeholder="Phone"
                  value={invoice.business.phone}
                  onChange={(e) => updateBusiness({ phone: e.target.value })}
                />
                <TextField.Root
                  placeholder="Email"
                  value={invoice.business.email}
                  onChange={(e) => updateBusiness({ email: e.target.value })}
                />
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="3">
                <Text weight="medium">Client Details</Text>
                <TextField.Root
                  placeholder="Client Name"
                  value={invoice.client.name}
                  onChange={(e) => updateClient({ name: e.target.value })}
                />
                <TextField.Root
                  placeholder="Address Line 1"
                  value={invoice.client.address.line1}
                  onChange={(e) => updateClientAddress({ line1: e.target.value })}
                />
                <TextField.Root
                  placeholder="Address Line 2"
                  value={invoice.client.address.line2}
                  onChange={(e) => updateClientAddress({ line2: e.target.value })}
                />
                <TextField.Root
                  placeholder="State"
                  value={invoice.client.address.state}
                  onChange={(e) => updateClientAddress({ state: e.target.value })}
                />
                <TextField.Root
                  placeholder="Country"
                  value={invoice.client.address.country}
                  onChange={(e) => updateClientAddress({ country: e.target.value })}
                />
                <TextField.Root
                  placeholder="Phone"
                  value={invoice.client.phone}
                  onChange={(e) => updateClient({ phone: e.target.value })}
                />
                <TextField.Root
                  placeholder="Email"
                  value={invoice.client.email}
                  onChange={(e) => updateClient({ email: e.target.value })}
                />
              </Flex>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="items" className="mt-4 space-y-4">
            <Card>
              <Flex direction="column" gap="3">
                {invoice.items.map((item) => (
                  <div key={item.id} className="rounded-md border border-gray-200 p-3">
                    <Flex direction="column" gap="2">
                      <TextField.Root
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addItem();
                          }
                        }}
                      />
                      <Flex gap="2">
                        <TextField.Root
                          type="number"
                          min={0}
                          placeholder="Qty"
                          value={item.qty.toString()}
                          onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) || 0 })}
                        />
                        <TextField.Root
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="Unit price"
                          value={item.unitPrice.toString()}
                          onChange={(e) =>
                            updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })
                          }
                        />
                      </Flex>
                      <Flex align="center" justify="between">
                        <Text size="2" color="gray">
                          Total: {formatMoney(item.qty * item.unitPrice, invoice.meta.currency)}
                        </Text>
                        <Button variant="ghost" color="red" onClick={() => removeItem(item.id)}>
                          <Trash2 size={14} /> Remove
                        </Button>
                      </Flex>
                    </Flex>
                  </div>
                ))}
                <Button onClick={addItem}>
                  <Plus size={14} /> Add Item
                </Button>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="2">
                <Text size="2">Subtotal: {formatMoney(subtotal, invoice.meta.currency)}</Text>
                <label>
                  <Text size="2">Tax Rate %</Text>
                  <TextField.Root
                    type="number"
                    min={0}
                    step="0.01"
                    value={invoice.settings.taxRate.toString()}
                    onChange={(e) => updateSettings({ taxRate: Number(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  <Text size="2">Discount ({invoice.meta.currency})</Text>
                  <TextField.Root
                    type="number"
                    min={0}
                    step="0.01"
                    value={invoice.settings.discount.toString()}
                    onChange={(e) => updateSettings({ discount: Number(e.target.value) || 0 })}
                  />
                </label>
                <Text weight="bold">Total: {formatMoney(total, invoice.meta.currency)}</Text>
              </Flex>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="customize" className="mt-4 space-y-4">
            <Card>
              <Flex direction="column" gap="3">
                <Text weight="medium">Appearance</Text>
                <label>
                  <Text size="2">Accent Color</Text>
                  <input
                    className="mt-1 h-10 w-full cursor-pointer rounded border border-gray-300"
                    type="color"
                    value={invoice.settings.accentColor}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                  />
                </label>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="3">
                <Text weight="medium">Notes & Terms</Text>
                <TextArea
                  placeholder="Notes"
                  value={invoice.notes.notes}
                  onChange={(e) => updateNotes({ notes: e.target.value })}
                />
                <TextArea
                  placeholder="Terms and Conditions"
                  value={invoice.notes.terms}
                  onChange={(e) => updateNotes({ terms: e.target.value })}
                />
                <TextField.Root
                  placeholder="Footer Message"
                  value={invoice.notes.footer}
                  onChange={(e) => updateNotes({ footer: e.target.value })}
                />
              </Flex>
            </Card>
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </aside>
  );
}
