import React from 'react';

const WHATSAPP_NUMBER_E164 = '254796535120';
const DEFAULT_MESSAGE = 'Hi Amari! I would like help planning a destination wedding in Kenya.';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
  >
    <path d="M19.11 17.34c-.27-.14-1.57-.77-1.81-.86-.24-.09-.41-.14-.58.14-.17.27-.67.86-.82 1.04-.15.17-.3.2-.57.07-.27-.14-1.12-.41-2.14-1.31-.79-.7-1.33-1.57-1.49-1.83-.15-.27-.02-.42.12-.56.12-.12.27-.3.41-.45.14-.15.17-.27.27-.45.09-.17.05-.34-.02-.48-.07-.14-.58-1.4-.79-1.92-.2-.48-.41-.42-.58-.42-.15 0-.32 0-.49 0-.17 0-.45.07-.68.34-.24.27-.89.86-.89 2.1 0 1.24.92 2.44 1.05 2.62.14.17 1.81 2.77 4.39 3.88.61.27 1.09.43 1.46.55.61.19 1.17.16 1.61.1.49-.07 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.06-.12-.23-.19-.5-.33z" />
    <path d="M16.02 3C8.83 3 3 8.82 3 16.01c0 2.29.6 4.44 1.65 6.31L3 29l6.86-1.6a12.94 12.94 0 0 0 6.16 1.56h.01c7.19 0 13.01-5.82 13.01-13.01C29.04 8.82 23.21 3 16.02 3zm0 23.39h-.01c-1.94 0-3.84-.52-5.48-1.51l-.39-.23-4.07.95.97-3.96-.25-.41a10.87 10.87 0 0 1-1.67-5.79C5.12 9.6 10 4.73 16.02 4.73c2.92 0 5.66 1.14 7.73 3.21a10.86 10.86 0 0 1 3.21 7.72c0 6.02-4.88 10.73-10.94 10.73z" />
  </svg>
);

const WhatsAppChat: React.FC = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      tabIndex={0}
      className="fixed z-40 bottom-6 left-6 inline-flex items-center gap-2 sm:gap-3 rounded-full bg-amari-500/90 backdrop-blur-md text-white px-3 sm:px-5 py-3 shadow-xl hover:bg-amari-600 transition-colors select-none"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 pointer-events-none">
        <WhatsAppIcon className="w-5 h-5" />
      </span>
      <span className="font-bold hidden sm:inline pointer-events-none">Chat with us</span>
    </a>
  );
};

export default WhatsAppChat;
