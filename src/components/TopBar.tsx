import { FileText, Download, Printer, RotateCcw, Moon, Sun } from "lucide-react";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";

interface TopBarProps {
  onNew: () => void;
  onPrint: () => void;
  onDownload: () => void;
  appearance: "light" | "dark";
  onToggleTheme: () => void;
}

export default function TopBar({
  onNew,
  onPrint,
  onDownload,
  appearance,
  onToggleTheme,
}: TopBarProps) {
  const isDark = appearance === "dark";

  return (
    <header className="no-print z-10 border-b border-purple-100 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <Flex className="mx-auto max-w-[1400px] flex-col gap-3 px-3 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Flex align="center" gap="3">
          <div className="rounded-lg bg-purple-600 p-2 text-white">
            <FileText size={18} />
          </div>
          <Heading size="5">SpeedyBill</Heading>
        </Flex>

        <Flex align="center" gap="2" wrap="wrap" justify="end">
          <Text size="2" color="gray" className="hidden lg:block">
            Create invoices in seconds
          </Text>
          <Button size="2" variant="soft" onClick={onNew}>
            <RotateCcw size={16} /> New
          </Button>
          <Button size="2" variant="soft" onClick={onPrint}>
            <Printer size={16} /> Print
          </Button>
          <Button size="2" onClick={onDownload}>
            <Download size={16} /> Download
          </Button>
          <Button
            size="2"
            variant="outline"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </Flex>
      </Flex>
    </header>
  );
}
