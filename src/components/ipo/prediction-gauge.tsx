type PredictionGaugeProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
};

export function PredictionGauge({
  value,
  size = 100,
  strokeWidth = 10,
}: PredictionGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getStrokeColor = () => {
    if (value >= 75) return 'hsl(var(--chart-1))'; // Golden Yellow for high scores
    if (value >= 50) return 'hsl(var(--chart-3))'; // An orange/amber shade
    return 'hsl(var(--destructive))'; // Red
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-2xl font-bold font-headline" style={{ color: getStrokeColor() }}>
        {value}
      </span>
    </div>
  );
}
