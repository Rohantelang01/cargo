"use client";

interface MapFilterPanelProps {
  filterType: 'all' | 'driver' | 'owner' | 'combo';
  onFilterTypeChange: (v: 'all' | 'driver' | 'owner' | 'combo') => void;
  distanceFilterKm: number;
  onDistanceChange: (km: number) => void;
}

export default function MapFilterPanel({
  filterType,
  onFilterTypeChange,
  distanceFilterKm,
  onDistanceChange,
}: MapFilterPanelProps) {
  const typeOptions: Array<'all' | 'driver' | 'owner' | 'combo'> = ['all', 'driver', 'owner', 'combo'];
  const distanceOptions = [10, 25, 50, 100];

  return (
    <div className="flex items-center gap-4">
      {/* Type filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Type:</span>
        <div className="flex gap-1">
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => onFilterTypeChange(type)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                filterType === type
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-input bg-background hover:bg-muted text-foreground'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Distance filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Distance:</span>
        <div className="flex gap-1">
          {distanceOptions.map(km => (
            <button
              key={km}
              onClick={() => onDistanceChange(km)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                distanceFilterKm === km
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-input bg-background hover:bg-muted text-foreground'
              }`}
            >
              {km}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">km</span>
      </div>
    </div>
  );
}
