import { useEffect, useRef } from "react";

export default function useDebouncedEffect(effect, delay, deps) {
  const timeout = useRef(null);
  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(effect, delay);
    return () => clearTimeout(timeout.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
