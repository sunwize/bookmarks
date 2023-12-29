'use client';

import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

interface Props {
    visible: boolean
    onHide?: () => void
    fullscreen?: boolean
    children: React.ReactNode
}

export default function Drawer({ visible, onHide, fullscreen = false, children }: Props) {
  const fullscreenClass = fullscreen ? 'h-[100dvh]' : '';

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
        <DrawerPrimitive.Content className={cn(`w-full max-w-[650px] fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border bg-slate-950 mt-24 mx-auto border-white/20 ${fullscreenClass}`)}>
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
