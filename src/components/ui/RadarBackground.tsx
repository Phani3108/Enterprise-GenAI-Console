'use client';

export default function RadarBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Concentric rings */}
        {[200, 300, 400, 500].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-[#4F46E5]/10"
            style={{
              width: size,
              height: size,
              top: -size / 2,
              left: -size / 2,
            }}
          />
        ))}
        {/* Sweep line */}
        <div
          className="absolute animate-radar origin-bottom"
          style={{
            width: 2,
            height: 250,
            bottom: 0,
            left: -1,
            background: 'linear-gradient(to top, #4F46E5 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}
