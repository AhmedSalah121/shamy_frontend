// Self-contained React shim for strict typing and compilation

export interface Context<T> {
  _currentValue: T;
  Provider: any;
  Consumer: any;
}

export type ReactNode = any;
export type FC<P = {}> = (props: P & { key?: any; children?: any }) => any;
export type ReactElement<P = any, T = any> = any;

export interface CSSProperties {
  [key: string]: any;
}

export interface FormEvent<T = any> {
  target: T;
  currentTarget: T;
  preventDefault(): void;
  stopPropagation(): void;
}

export interface ChangeEvent<T = any> {
  target: any;
  currentTarget: any;
  preventDefault(): void;
  stopPropagation(): void;
}

export interface MouseEvent<T = any> {
  target: T;
  currentTarget: T;
  preventDefault(): void;
  stopPropagation(): void;
}

export interface KeyboardEvent<T = any> {
  key: string;
  preventDefault(): void;
}

export function useState<T>(initialState: T | (() => T)): [T, (action: T | ((prevState: T) => T)) => void] {
  let val: any = typeof initialState === 'function' ? (initialState as any)() : initialState;
  return [val, (_newVal: any) => {}];
}

export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void {}
export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly any[]): void {}
export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T {
  return callback;
}
export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T {
  return factory();
}
export function useRef<T>(initialValue?: T): { current: T | undefined } {
  return { current: initialValue };
}
export function useContext<T>(context: Context<T>): T {
  return context._currentValue;
}
export function createContext<T>(defaultValue: T): Context<T> {
  return {
    _currentValue: defaultValue,
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(defaultValue),
  };
}

export const jsx = (type: any, props: any, key?: any) => ({ type, props, key });
export const jsxs = (type: any, props: any, key?: any) => ({ type, props, key });
export const Fragment = ({ children }: any) => children;

const DefaultReact = {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  createContext,
  FC: undefined as any,
};

export default DefaultReact;
