'use client';

import { MouseEventHandler, useEffect, useRef } from 'react';
import { IoIosClose } from 'react-icons/io';

interface Props {
    visible: boolean
    onHide?: () => void
    children: React.ReactNode
    className?: string
}

export default function Dialog({ visible, onHide, children, className }: Props) {
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
  }, [visible]);

  return (
    <dialog ref={dialogElement} className={`${className}`}>
      <div
        onClick={onHide}
        className="fixed top-0 left-0 w-full h-full bg-black/80 cursor-pointer px-1"
      >
        <div
          onClick={onClickContent}
          className="slide-in bg-slate-950 text-white max-w-[500px] border-2 border-white/30 rounded-xl shadow-xl cursor-auto p-6 mt-[20dvh] mx-auto"
        >
          {children}
        </div>
        <button className="absolute top-3 right-3 text-white">
          <IoIosClose size={50} />
        </button>
      </div>
    </dialog>
  );
}
