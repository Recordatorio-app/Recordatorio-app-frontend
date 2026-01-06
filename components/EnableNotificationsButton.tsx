"use client";

import Button from "@/components/ui/button";
import { requestNotificationPermission } from "@/lib/pushNotifications";
import Image from "next/image";

const EnableNotificationsButton = () => {
  const enable = async () => {
    try {
      const token = await requestNotificationPermission();
      console.log("🔥 PUSH TOKEN:", token);
    } catch (err) {
      console.error("❌ Error push:", err);
    }
  };

  return (
    <Button onClick={enable} bg="bg-one" textColor="text-white">
      Activar notificaciones <Image src="/icons/notification.png" alt="Bell" width={20} height={20} className="ml-2 inline" />
    </Button>
  );
};

export default EnableNotificationsButton;
