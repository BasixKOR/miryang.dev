"use client";

import { PaletteIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_FILTERS = {
	brightness: 100,
	contrast: 100,
	hue: 0,
	saturate: 100,
	sepia: 0,
	grayscale: 0,
	invert: 0,
};

type Filters = typeof DEFAULT_FILTERS;

const SLIDER_CONFIG: {
	key: keyof Filters;
	label: string;
	min: number;
	max: number;
	unit: string;
}[] = [
	{ key: "brightness", label: "Brightness", min: 25, max: 200, unit: "%" },
	{ key: "contrast", label: "Contrast", min: 25, max: 200, unit: "%" },
	{ key: "hue", label: "Hue", min: -180, max: 180, unit: "deg" },
	{ key: "saturate", label: "Saturation", min: 0, max: 200, unit: "%" },
	{ key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%" },
	{ key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
	{ key: "invert", label: "Invert", min: 0, max: 100, unit: "%" },
];

export function FilterDemo() {
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
	const overlayRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				panelRef.current &&
				!panelRef.current.contains(target) &&
				buttonRef.current &&
				!buttonRef.current.contains(target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const buildFilterCSS = useCallback((f: Filters) => {
		return [
			f.brightness !== 100 ? `brightness(${f.brightness}%)` : "",
			f.contrast !== 100 ? `contrast(${f.contrast}%)` : "",
			f.hue !== 0 ? `hue-rotate(${f.hue}deg)` : "",
			f.saturate !== 100 ? `saturate(${f.saturate}%)` : "",
			f.sepia !== 0 ? `sepia(${f.sepia}%)` : "",
			f.grayscale !== 0 ? `grayscale(${f.grayscale}%)` : "",
			f.invert !== 0 ? `invert(${f.invert}%)` : "",
		]
			.filter(Boolean)
			.join(" ");
	}, []);

	const hasActiveFilters = buildFilterCSS(filters).length > 0;

	const handleChange = (key: keyof Filters, value: number) => {
		setFilters((prev) => {
			const next = { ...prev, [key]: value };
			return next;
		});
	};

	const handleReset = () => {
		setFilters(DEFAULT_FILTERS);
	};

	const filterCSS = buildFilterCSS(filters);

	return (
		<>
			{/* Backdrop filter overlay */}
			{hasActiveFilters && (
				<div
					ref={overlayRef}
					aria-hidden="true"
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 1000,
						pointerEvents: "none",
						backdropFilter: filterCSS,
						WebkitBackdropFilter: filterCSS,
						willChange: "backdrop-filter",
					}}
				/>
			)}

			{/* Open button */}
			<button
				type="button"
				ref={buttonRef}
				onClick={() => setIsOpen((prev) => !prev)}
				className="not-prose inline-flex items-center gap-2 border-2 border-primary px-2 py-1.5 text-sm font-semibold transition-colors hover:opacity-90 dark:text-foreground rounded"
			>
				<PaletteIcon className="h-4 w-4" />
				필터 컨트롤 열기...
			</button>

			{/* Control panel */}
			{isOpen && (
				<div
					ref={panelRef}
					style={{ zIndex: 1001 }}
					className="not-prose fixed bottom-4 right-4 w-72 rounded-xl bg-black/80 p-4 text-white shadow-2xl backdrop-blur-sm"
				>
					<h3 className="mb-3 text-sm font-semibold">Visual Preferences</h3>

					<div className="flex flex-col gap-2.5">
						{SLIDER_CONFIG.map(({ key, label, min, max }) => (
							<div key={key}>
								<div className="mb-0.5 flex items-center justify-between">
									<label
										htmlFor={`vf-${key}`}
										className="text-xs text-white/70"
									>
										{label}
									</label>
									<span className="text-xs tabular-nums text-white/50">
										{filters[key]}
									</span>
								</div>
								<input
									type="range"
									id={`vf-${key}`}
									min={min}
									max={max}
									value={filters[key]}
									onChange={(e) => handleChange(key, e.target.valueAsNumber)}
									className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
								/>
							</div>
						))}
					</div>

					<button
						type="button"
						onClick={handleReset}
						className="mt-3 w-full rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/20 hover:text-white"
					>
						Reset
					</button>
				</div>
			)}
		</>
	);
}
