type ConstellationBranchProps = {
  x: number;
  y: number;
  color: string;
  active: boolean;
};

const ConstellationBranch = ({ x, y, color, active }: ConstellationBranchProps) => {
  return (
    <path
      d={`M 50 50 L ${x} ${y}`}
      fill="none"
      stroke={color}
      strokeWidth="0.35"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      pathLength="1"
      className="transition-[stroke-dashoffset,opacity] duration-700 ease-out"
      style={{
        strokeDasharray: "1",
        strokeDashoffset: active ? "0" : "1",
        opacity: active ? "0.9" : "0",
        filter: `drop-shadow(0 0 5px ${color})`,
      }}
    />
  );
};

export default ConstellationBranch;