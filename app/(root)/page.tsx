"use client"
import Modal from "@/components/ui/modal"
import Image from "next/image";

const SetupPage = () => {
  return (
    <div className="p-4">
      <Modal title="Test" description="Test Desc" isOpen onClose={() => {}}>
        Children
      </Modal>
    </div>
  );
}

export default SetupPage;