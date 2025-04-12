// /app/map/layout.tsx

export default function MapLayout({
    children,
    // overlay,
  }: {
    children: React.ReactNode;
    // overlay: React.ReactNode;
  }) {
    return (
      <>
        {children}
        {/* {overlay} */}
      </>
    );
  }
  