/**
 * Decorative 3D "cube" tile group used inside buttons / cards.
 * Hover the parent (.cube-host) to trigger the orange neon transition.
 */
export const CubeBadge = ({ count = 3 }: { count?: number }) => (
  <div className="inline-flex items-end gap-2 pl-2 pt-2">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="cube-tile" />
    ))}
  </div>
);

export default CubeBadge;
