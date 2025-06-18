import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value or delay changes, or when the component unmounts
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}