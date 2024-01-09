type Props = {
  className?: string
  children: React.ReactNode
}

type ItemProps = {
  value: string
  selectedTab?: string
  onClick?: (value: string) => void
  children: React.ReactNode
}

type ContentProps = {
  value: string
  selectedTab?: string
  children: React.ReactNode
}

function Tab({ className, children }: Props) {
  return (
    <div className={className}>{children}</div>
  );
}

Tab.Item = ({ value, selectedTab, onClick, children }: ItemProps) => {
  return (
    <button
      onClick={() => onClick?.(value)}
      className={`
        text-center font-medium flex-1 bg-white/10 rounded-xl outline-offset-2 outline-2 px-3 py-2
        hover:outline
        ${selectedTab === value ? '!bg-white text-black' : ''}
      `}
    >
      {children}
    </button>
  );
};

Tab.Content = ({ value, selectedTab, children }: ContentProps) => {
  return (
    <div className={`${selectedTab === value ? 'block' : 'hidden'}`}>
      {children}
    </div>
  );
};

export default Tab;
