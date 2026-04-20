import { datasetList, type DatasetId } from "@/lib/datasets";
import { cn } from "@/lib/utils";

type Props = {
  active: DatasetId;
  onChange: (id: DatasetId) => void;
};

const SHORT: Record<DatasetId, string> = {
  windCompare: "Wind • Compare",
  sst: "SST • ERA5",
  windEra: "Wind • ERA5",
};

export const WavyMenu = ({ active, onChange }: Props) => {
  return (
    <ul className="wavy-menu flex items-stretch gap-1 text-sm">
      {datasetList.map((d) => (
        <li
          key={d.id}
          onClick={() => onChange(d.id)}
          className={cn(
            "px-5 h-12 grid place-items-center rounded-md cursor-pointer select-none",
            "text-muted-foreground hover:text-foreground transition-colors",
            active === d.id && "active text-foreground"
          )}
        >
          {SHORT[d.id]}
        </li>
      ))}
    </ul>
  );
};

export default WavyMenu;
