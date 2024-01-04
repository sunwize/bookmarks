'use client';

import { Drawer as DrawerPrimitive } from 'vaul';

interface Props {
    visible: boolean
    onHide?: () => void
    children: React.ReactNode
}

export default function Drawer({ visible, onHide, children }: Props) {
  const onVisibilityChange = (visible: boolean) => {
    if (!visible && onHide) {
      onHide();
    }
  };

  return (
    <DrawerPrimitive.Root
      open={visible}
      onOpenChange={onVisibilityChange}
      shouldScaleBackground={true}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DrawerPrimitive.Content className="w-full max-w-[650px] max-h-[100dvh] fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border bg-slate-950 mx-auto border-white/20 focus-visible:outline-0">
          <div className="h-8 shrink-0 w-full bg-white/10 rounded-t-xl flex items-center justify-center">
            <div className="h-2 w-20 bg-white/20 rounded" />
          </div>
          <div className="overflow-y-auto">
            {children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
