"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Demo 1: SpriteFilmStrip
 * 스프라이트시트를 필름 스트립처럼 보여주며, 슬라이더로 프레임을 넘기는 시각화
 */
export function SpriteFilmStrip() {
  const [frame, setFrame] = useState(0);
  const TOTAL_FRAMES = 5;
  const FRAME_WIDTH = 200;
  const FRAME_HEIGHT = 400;

  return (
    <div className="not-prose my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-6">
        {/* 전체 스프라이트시트 (축소) */}
        <div className="w-full">
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            스프라이트시트 (전체 이미지)
          </p>
          <div className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
            <div className="relative">
              <img
                src="https://www.joshwcomeau.com/images/sprites/gold-trophy-sprite.png"
                alt="Gold trophy spritesheet"
                className="w-full"
                draggable={false}
              />
              {/* 현재 프레임 하이라이트 */}
              <div
                className="absolute top-0 h-full border-2 border-blue-500 bg-blue-500/10 transition-all duration-200"
                style={{
                  width: `${100 / TOTAL_FRAMES}%`,
                  left: `${(frame / TOTAL_FRAMES) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 현재 보이는 프레임 */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            현재 프레임 (뷰포트에서 보이는 부분)
          </p>
          <div
            className="overflow-hidden rounded-lg border-2 border-blue-500"
            style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
          >
            <img
              src="https://www.joshwcomeau.com/images/sprites/gold-trophy-sprite.png"
              alt="Current trophy frame"
              draggable={false}
              style={{
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT,
                objectFit: "cover",
                objectPosition: `${frame * 25}% 0%`,
              }}
            />
          </div>
        </div>

        {/* 슬라이더 */}
        <div className="flex w-full max-w-xs flex-col items-center gap-2">
          <input
            type="range"
            min={0}
            max={TOTAL_FRAMES - 1}
            step={1}
            value={frame}
            onChange={(e) => setFrame(Number(e.target.value))}
            className="w-full cursor-pointer accent-blue-500"
          />
          <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
            프레임 {frame + 1} / {TOTAL_FRAMES}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Demo 2: ObjectPositionDemo
 * object-position 속성을 슬라이더로 조절하며 이미지의 어느 부분이 보이는지 보여주는 데모
 */
export function ObjectPositionDemo() {
  const [position, setPosition] = useState(0);

  return (
    <div className="not-prose my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div
            className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ width: 200, height: 400 }}
          >
            <img
              src="https://www.joshwcomeau.com/images/sprites/gold-trophy-sprite.png"
              alt="Trophy with adjustable object-position"
              draggable={false}
              style={{
                width: 200,
                height: 400,
                objectFit: "cover",
                objectPosition: `${position}% 0%`,
              }}
            />
          </div>
        </div>

        <div className="flex w-full max-w-xs flex-col items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="w-full cursor-pointer accent-blue-500"
          />
          <code className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700">
            object-position: {position}% 0%
          </code>
        </div>
      </div>
    </div>
  );
}

/**
 * Demo 3: StepsTimingDemo
 * linear vs steps() 타이밍 함수를 시각적으로 비교하는 데모
 */
export function StepsTimingDemo() {
  const [timing, setTiming] = useState<"linear" | "steps">("steps");
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 2000;
  const STEPS = 5;

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      let rawProgress = (elapsed % DURATION) / DURATION;

      if (timing === "steps") {
        rawProgress = Math.floor(rawProgress * STEPS) / STEPS;
      }

      setProgress(rawProgress);
      rafRef.current = requestAnimationFrame(animate);
    },
    [timing]
  );

  useEffect(() => {
    if (isPlaying) {
      startRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, animate]);

  return (
    <div className="not-prose my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-5">
        {/* 타이밍 함수 선택 */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setTiming("linear")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              timing === "linear"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            linear
          </button>
          <button
            type="button"
            onClick={() => setTiming("steps")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              timing === "steps"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            steps(5)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying((p) => !p);
              startRef.current = 0;
            }}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            {isPlaying ? "⏸ 일시정지" : "▶ 재생"}
          </button>
        </div>

        {/* 진행 바 시각화 */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              애니메이션 진행률
            </p>
            <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-lg bg-blue-500 transition-none"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* 단계 그래프 */}
          <div>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              시간 vs 진행률 그래프
            </p>
            <div className="relative h-40 w-full rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
              {/* 그리드 라인 */}
              {[0.2, 0.4, 0.6, 0.8].map((v) => (
                <div
                  key={v}
                  className="absolute left-0 right-0 border-t border-dashed border-gray-200 dark:border-gray-700"
                  style={{ bottom: `${v * 100}%` }}
                />
              ))}
              {/* steps() 경로 */}
              {timing === "steps" ? (
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={Array.from({ length: STEPS }, (_, i) => {
                      const x1 = (i / STEPS) * 100;
                      const x2 = ((i + 1) / STEPS) * 100;
                      const y = 100 - (i / STEPS) * 100;
                      return `${x1},${y} ${x2},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ) : (
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="100"
                    x2="100"
                    y2="0"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )}
              {/* 현재 위치 */}
              <div
                className="absolute h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-red-500 shadow"
                style={{
                  left: `${((Date.now() % DURATION) / DURATION) * 100}%`,
                  bottom: `${progress * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {timing === "linear"
            ? "linear: 부드럽게 진행됩니다"
            : "steps(5): 5개의 단계로 끊어져서 진행됩니다 — 경사로 대신 계단!"}
        </p>
      </div>
    </div>
  );
}

/**
 * Demo 4: LikeButtonDemo
 * 클릭할 때마다 랜덤한 파티클이 생성되는 좋아요 버튼
 */
interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}

const PARTICLE_COLORS = [
  "#e74c3c",
  "#e91e63",
  "#ff5722",
  "#ff9800",
  "#f44336",
  "#ec407a",
  "#ff7043",
  "#ef5350",
];

export function LikeButtonDemo() {
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scale, setScale] = useState(1);
  const [ringScale, setRingScale] = useState(0);
  const nextId = useRef(0);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);

    if (newLiked) {
      // 스케일 애니메이션
      setScale(0.6);
      setTimeout(() => setScale(1.2), 100);
      setTimeout(() => setScale(1), 250);

      // 링 애니메이션
      setRingScale(0);
      requestAnimationFrame(() => setRingScale(1));

      // 파티클 생성
      const count = 10 + Math.floor(Math.random() * 6);
      const newParticles: Particle[] = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        return {
          id: nextId.current++,
          x: 0,
          y: 0,
          angle,
          distance: 20 + Math.random() * 30,
          size: 3 + Math.random() * 5,
          color:
            PARTICLE_COLORS[
              Math.floor(Math.random() * PARTICLE_COLORS.length)
            ],
          delay: Math.random() * 100,
        };
      });
      setParticles(newParticles);

      setTimeout(() => setParticles([]), 700);
      setTimeout(() => setRingScale(0), 400);
    } else {
      setParticles([]);
      setRingScale(0);
    }
  };

  return (
    <div className="not-prose my-8 flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900">
      <div className="relative">
        {/* 파티클 */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="like-particle"
            style={
              {
                "--px": `${Math.cos(p.angle) * p.distance}px`,
                "--py": `${Math.sin(p.angle) * p.distance}px`,
                "--size": `${p.size}px`,
                "--delay": `${p.delay}ms`,
                "--color": p.color,
                position: "absolute",
                left: "50%",
                top: "50%",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                backgroundColor: p.color,
                transform: "translate(-50%, -50%)",
                animation: `like-particle-move 600ms ${p.delay}ms ease-out forwards`,
                opacity: 0,
                pointerEvents: "none" as const,
              } as React.CSSProperties
            }
          />
        ))}

        {/* 확산 링 */}
        {ringScale > 0 && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-400"
            style={{
              width: 60,
              height: 60,
              transition: "transform 300ms ease-out, opacity 300ms ease-out",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: ringScale > 0.5 ? 0 : 1,
            }}
          />
        )}

        {/* 하트 버튼 */}
        <button
          type="button"
          onClick={handleClick}
          className="relative z-10 flex items-center justify-center rounded-full p-3 transition-transform"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 150ms ease-out",
          }}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
        >
          <svg
            viewBox="0 0 24 24"
            width={40}
            height={40}
            fill={liked ? "#e74c3c" : "none"}
            stroke={liked ? "#e74c3c" : "currentColor"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "fill 150ms, stroke 150ms",
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {liked
          ? "클릭할 때마다 파티클이 다르게 생성됩니다!"
          : "하트를 클릭해 보세요"}
      </p>

      <style>{`
        @keyframes like-particle-move {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--px), var(--py)) scale(0);
          }
        }
      `}</style>
    </div>
  );
}
