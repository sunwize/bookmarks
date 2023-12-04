interface Props {
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
    className?: string
}

export default function Button({ onClick, disabled = false, children, className }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-white text-black rounded-xl font-medium transition active:scale-95 outline-white outline-2 outline-offset-2 hover:outline px-3 py-2
        disabled:opacity-50 disabled:pointer-events-none
        ${className}
      `}
    >
      {children}
    </button>
  );
}
