"use client";

import { useState } from "react";
import {
  readStorage,
  writeStorage,
} from "@/lib/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [value, setValue] = useState<T>(() => {
    return readStorage<T>(key, initialValue);
  });

  const updateValue = (
    nextValue: T | ((current: T) => T)
  ) => {
    setValue((current) => {
      const next =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(current)
          : nextValue;

      writeStorage(key, next);

      return next;
    });
  };

  return [value, updateValue] as const;
}