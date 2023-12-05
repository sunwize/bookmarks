'use client';

import { MouseEventHandler, useEffect, useRef } from 'react';
import { IoIosClose } from 'react-icons/io';

interface Props {
    visible: boolean
    onHide?: () => void
    children: React.ReactNode
}

export default function Drawer({ visible, onHide, children }: Props) {
  const dialogElement = useRef<HTMLDialogElement>(null);

  const onClickContent: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    if (visible) {
      dialogElement.current?.show();
    } else {
      dialogElement.current?.close();
    }

    document.body.classList.toggle('overflow-hidden', visible);
  }, [visible]);

  return (
    <dialog ref={dialogElement}>
      <div
        onClick={onHide}
        className="overflow-y-auto scrollbar-hidden fixed z-20 top-0 left-0 flex flex-col w-full h-full bg-black/80 cursor-pointer"
      >
        <div className="sticky flex justify-end top-0">
          <button className="text-white/50 active:text-white md:hover:text-white outline-0">
            <IoIosClose size={50} />
          </button>
        </div>
        <div className="slide-in relative flex-1">
          <div
            onClick={onClickContent}
            className="absolute w-full h-full mt-[50dvh] top-0 left-1/2 -translate-x-1/2 bg-slate-950 text-white rounded-t-3xl overflow-hidden cursor-auto max-w-[650px]"
          >
            <div className="bg-white/10 w-full flex items-center justify-center py-3">
              <div className="w-14 h-1 bg-white/50 rounded" />
            </div>
            <div className="p-3 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
