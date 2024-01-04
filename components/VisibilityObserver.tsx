import { useEffect, useRef } from 'react';

type Props = {
  onVisible: () => void
}

export default function VisibilityObserver({ onVisible }: Props) {
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
    <div ref={el} />
  );
}
