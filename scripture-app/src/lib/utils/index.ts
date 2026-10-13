import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function withModifiedProps<T>(
  element: React.ReactElement<any>,
  additionalProps: Partial<T>
): React.ReactElement<T> {
  return React.cloneElement(element, {
    ...element.props,
    ...additionalProps,
  });
}