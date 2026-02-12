import { FileText, Download, Printer, RotateCcw } from "lucide-react";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";

interface TopBarProps {
  onNew: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export default function TopBar({ onNew, onPrint, onDownload }: TopBarProps) {
  return (
    <header className="no-print sticky top-0 z-10 border-b border-purple-100 bg-white/95 backdrop-blur">
      <Flex className="mx-auto max-w-[1400px] items-center justify-between px-6 py-3">
        <Flex align="center" gap="3">
          <div className="rounded-lg bg-purple-600 p-2 text-white">
            <FileText size={18} />
          </div>
          <Heading size="5">SpeedyBill</Heading>
        </Flex>

        <Flex align="center" gap="4">
          <Text size="2" color="gray" className="hidden lg:block">
            Create invoices in seconds
          </Text>
          <Button variant="soft" onClick={onNew}>
            <RotateCcw size={16} /> New
          </Button>
          <Button variant="soft" onClick={onPrint}>
            <Printer size={16} /> Print
          </Button>
          <Button onClick={onDownload}>
            <Download size={16} /> Download
          </Button>
        </Flex>
      </Flex>
    </header>
  );
}
