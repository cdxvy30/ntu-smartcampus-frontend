import { useRef } from "react";

export const useMemoizedValue = (value) => {
  const memoizedValue = useRef(value);
  if (memoizedValue.current !== value) {
    memoizedValue.current = value;
  }
  return memoizedValue.current;
};