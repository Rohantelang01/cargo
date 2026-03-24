interface StatusDotProps {
  status?: string;
}

export function StatusDot({ status }: StatusDotProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500';
      case 'ON_TRIP':
      case 'SCHEDULED':
        return 'bg-amber-500';
      default:
        return 'bg-muted-foreground/40';
    }
  };

  return (
    <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${getStatusColor()}`} />
  );
}
