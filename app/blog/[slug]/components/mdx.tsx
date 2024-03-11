import { cn } from "@/components/ui/utils";
import { useMDXComponent } from "next-contentlayer/hooks";

interface Props {
  code: string;
}

const components = {
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      target="_blank"
      rel="noopener"
      {...props}
      className={cn([className, "text-blue-700 dark:text-sky-500"])}
    />
  ),
};

export function Mdx({ code }: Props) {
  const Component = useMDXComponent(code);

  return (
    <div className="prose prose-slate dark:prose-invert flex-1">
      <Component components={components} />
    </div>
  );
}
