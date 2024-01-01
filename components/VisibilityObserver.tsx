import { useEffect, useRef } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

type Props = {
  isLoading: boolean
  onVisible: () => void
}

export default function VisibilityObserver({ isLoading, onVisible }: Props) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      });
    }, {
      threshold: 0,
      rootMargin: '30%',
    });

    observer.observe(el.current);

    return () => {
      observer.disconnect();
    };
  }, [onVisible]);

  return (
    <div
      ref={el}
    >
      {
        isLoading && (
          <div className="flex justify-center pt-3">
            <AiOutlineLoading
              size={40}
              className="animate-spin opacity-50"
            />
          </div>
        )
      }
    </div>
  );
}
