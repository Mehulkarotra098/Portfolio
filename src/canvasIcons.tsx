// Small 16px icons for the canvas tools, drawn to match Figma's UI weight.
const I = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg className="ci" viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export const IcMove = () => <I fill d="M3.5 2.2 12.6 7.1 8.4 8.2 6.3 12.3Z" />
export const IcHand = () => <I d="M5.5 8V3.6a1 1 0 0 1 2 0V7.5M7.5 7V2.8a1 1 0 0 1 2 0V7.5M9.5 7.2V3.6a1 1 0 0 1 2 0v5.2c0 2.6-1.7 4.7-4.3 4.7-1.6 0-2.6-.7-3.4-1.9L2.4 9.2a1 1 0 0 1 1.6-1.2L5.5 9.5" />
export const IcComment = () => <I d="M8 2.5c3.1 0 5.5 2.1 5.5 4.8S11.1 12 8 12c-.6 0-1.2-.1-1.7-.2L3 13.3l.9-2.6C3 9.8 2.5 8.6 2.5 7.3 2.5 4.6 4.9 2.5 8 2.5Z" />
export const IcLayers = () => <I d="M8 2.5 13.5 5.5 8 8.5 2.5 5.5ZM2.5 8.3 8 11.3l5.5-3M2.5 10.9 8 13.9l5.5-3" />
export const IcUndo = () => <I d="M5.5 4 2.8 6.7l2.7 2.7M3 6.7h6.2a3.6 3.6 0 0 1 0 7.2H6.5" />
export const IcReset = () => <I d="M13 8a5 5 0 1 1-1.5-3.6M13 2.8v2.6h-2.6" />
export const IcEye = () => <I d="M1.8 8S4 3.8 8 3.8 14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8ZM8 9.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" />
export const IcEyeOff = () => <I d="M2.5 2.5l11 11M6.6 4C7 3.9 7.5 3.8 8 3.8c4 0 6.2 4.2 6.2 4.2a11 11 0 0 1-1.9 2.4M4 5.3A10.6 10.6 0 0 0 1.8 8S4 12.2 8 12.2c1 0 1.9-.3 2.7-.7" />
export const IcLock = () => <I d="M4.5 7.2h7v5.6h-7ZM5.8 7.2V5.4a2.2 2.2 0 0 1 4.4 0v1.8" />
export const IcUnlock = () => <I d="M4.5 7.2h7v5.6h-7ZM5.8 7.2V5.4a2.2 2.2 0 0 1 4.3-.7" />
export const IcFrame = () => <I d="M5 2v12M11 2v12M2 5h12M2 11h12" />
export const IcPhone = () => <I d="M5 1.8h6a1 1 0 0 1 1 1v10.4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2.8a1 1 0 0 1 1-1ZM7 12.2h2" />
export const IcDesktop = () => <I d="M2.2 3h11.6v7.6H2.2ZM6 13.2h4M8 10.6v2.6" />
export const IcText = () => <I d="M3 3.5h10M8 3.5v9.5M6.2 13h3.6" />
export const IcClose = () => <I d="M4 4l8 8M12 4l-8 8" />
export const IcSend = () => <I d="M2.5 7.8 13.5 2.5 9.8 13.5 7.6 8.6Z" />
