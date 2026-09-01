import type { DriverRun } from '@/mocks/driver';

export default function CompletedRouteTrail({ run }: { run: DriverRun }) {
  return (
    <div className="flex items-center justify-center">
      {run.stops.map((stop, index) => {
        const delay = index * 200;
        return (
          <div key={stop.id} className="flex items-center">
            {index > 0 && (
              <div
                className="animate-connector-fill h-0.5 w-8 rounded-full bg-accent-400"
                style={{ animationDelay: `${delay}ms` }}
              />
            )}
            <span
              className="animate-check-pop w-8 h-8 rounded-full bg-accent-500 text-background-50 flex items-center justify-center shrink-0"
              style={{ animationDelay: `${delay}ms` }}
            >
              <i className="ri-check-line text-base leading-none" />
            </span>
          </div>
        );
      })}
    </div>
  );
}