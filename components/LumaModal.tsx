import React, { useEffect } from "react";

interface LumaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LumaModal: React.FC<LumaModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "min(600px, 92vw)",
          maxHeight: "90vh",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <iframe
          src="https://luma.com/embed/event/evt-tRkE3lQWZiSHobe/simple"
          width="100%"
          height="450"
          frameBorder="0"
          style={{ border: "1px solid #bfcbda88", borderRadius: 4, display: "block" }}
          allow="fullscreen; payment"
          aria-hidden="false"
          tabIndex={0}
        />
      </div>
    </div>
  );
};

export default LumaModal;
