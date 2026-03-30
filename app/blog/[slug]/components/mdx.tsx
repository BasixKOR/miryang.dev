import { cn } from "@/components/ui/utils";
import * as runtime from "react/jsx-runtime";
import { FilterDemo } from "./filter-demo";
import { CodePlayground } from "./code-playground";
import {
	GoldTrophySprite,
	TwitterLikeSprite,
	StepsTimingDemo,
	LikeButtonDemo,
} from "./sprite-demos";

interface Props {
	code: string;
}

function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
	const isGif =
		typeof props.src === "string" && props.src.toLowerCase().endsWith(".gif");
	if (isGif) {
		return (
			<span className="not-prose relative inline-block">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img {...props} alt={props.alt || ""} />
				<span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white">
					GIF
				</span>
			</span>
		);
	}
	// eslint-disable-next-line @next/next/no-img-element
	return <img {...props} alt={props.alt || ""} />;
}

const components = {
	a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
		<a
			target="_blank"
			rel="noopener"
			{...props}
			className={cn([className, "text-primary"])}
		/>
	),
	img: Img,
	Video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => (
		<span className="not-prose relative block">
			<video {...props} />
			<span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white">
				VIDEO
			</span>
		</span>
	),
	FilterDemo,
	CodePlayground,
	GoldTrophySprite,
	TwitterLikeSprite,
	StepsTimingDemo,
	LikeButtonDemo,
};

const useMDXComponent = (code: string) => {
	const fn = new Function(code);
	return fn({ ...runtime }).default;
};

export function Mdx({ code }: Props) {
	const Component = useMDXComponent(code);

	return (
		<div className="prose prose-slate dark:prose-invert flex-1">
			<Component components={components} />
		</div>
	);
}
