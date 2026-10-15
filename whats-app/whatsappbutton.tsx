import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phone = "+97517875268"; // country code + number
  const message = encodeURIComponent("Hello! I'd like to know more.");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float"
    >
      <FaWhatsapp size={32} color="#fff" />
    </a>
  );
}