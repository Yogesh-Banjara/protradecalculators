import React from "react";

export interface JsonLdProps {
  schema: Record<string, unknown> | readonly Record<string, unknown>[];
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0).replace(/</g, "\\u003c"),
      }}
    />
  );
}
