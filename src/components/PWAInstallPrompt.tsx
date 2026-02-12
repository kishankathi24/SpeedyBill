import { useEffect, useState } from "react";
import { Button, Card, Flex, Text } from "@radix-ui/themes";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!promptEvent) return null;

  return (
    <div className="no-print fixed bottom-4 right-4">
      <Card>
        <Flex gap="3" align="center">
          <Text size="2">Install SpeedyBill for offline use</Text>
          <Button
            onClick={async () => {
              await promptEvent.prompt();
              await promptEvent.userChoice;
              setPromptEvent(null);
            }}
          >
            Install
          </Button>
        </Flex>
      </Card>
    </div>
  );
}
