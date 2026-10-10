// Next.js Link and Navigation shims

export function useRouter() {
  return {
    push: (url: string) => {},
    replace: (url: string) => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
}

export function useParams(): Record<string, string | string[]> {
  return { id: '1' };
}

export function usePathname(): string {
  return '/';
}

export function useSearchParams() {
  return {
    get: (name: string) => null,
  };
}

export const Link = ({ href, children, className, ...props }: any) => {
  return { type: 'a', props: { href, className, children, ...props } };
};

export default Link;
