// Global ambient declarations for process, CSS imports and React namespace

declare var process: {
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};

declare module '*.css';

declare namespace React {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P & { key?: any; children?: any }) => any;
  export type FormEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type KeyboardEvent<T = any> = any;
}
