import React from 'react';

interface RichTextDisplayProps {
  content?: string;
  fallback?: string;
  className?: string;
}

export function cleanHtmlString(rawHtml?: string): string {
  if (!rawHtml) return '';

  let str = rawHtml;

  // Decode escaped HTML entities if present (e.g. &lt;p&gt; -> <p>, &amp;nbsp; -> &nbsp;)
  for (let i = 0; i < 2; i++) {
    if (str.includes('&lt;') || str.includes('&gt;') || str.includes('&amp;') || str.includes('&quot;') || str.includes('&#39;')) {
      str = str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }
  }

  // Replace &nbsp; and non-breaking space entities with normal spaces
  str = str.replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ');

  return str;
}

export default function RichTextDisplay({
  content,
  fallback = 'Belum ada deskripsi yang ditulis.',
  className = 'text-xs md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal p-0 min-h-0 border-none select-text'
}: RichTextDisplayProps) {
  const cleaned = cleanHtmlString(content);

  if (!cleaned || !cleaned.trim()) {
    return <p className={className}>{fallback}</p>;
  }

  // Check if content contains HTML tags
  const hasTags = /<[a-z][\s\S]*>/i.test(cleaned);

  if (hasTags) {
    return (
      <div
        className={`ql-editor ${className}`}
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  return <p className={className}>{cleaned}</p>;
}
