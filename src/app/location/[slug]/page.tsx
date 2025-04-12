export default function LocationPage({ params }) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Location: {params.slug}</h1>
        {/* full-page version, SEO-crawlable */}
      </div>
    );
  }