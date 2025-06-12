// /app/map/layout.tsx

export default function MapLayout({
    children,
    // overlay,
  }: {
    children: React.ReactNode;
    // overlay: React.ReactNode;
  }) {
    return (
      <div className="map-page">
        {children}
        {/* {overlay} */}
      </div>
    );
  }
  