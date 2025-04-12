// Placeholder for page.tsx
import React from 'react';
// url: /post/[id]
export default function Page({ params }) {
    const { id } = params;
    return <div>Page Component
current url: /post/{id}

    </div>;
    }