function RichText({ text }) {
  if (!text || text.length === 0) return null;
  return (
    <>
      {text.map((t, i) => {
        const content = t.plain_text;
        if (!content) return null;

        if (t.href) {
          return (
            <a
              key={i}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {content}
            </a>
          );
        }

        let el = <span key={i}>{content}</span>;
        if (t.annotations?.code)
          el = (
            <code
              key={i}
              className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono"
            >
              {content}
            </code>
          );
        if (t.annotations?.bold) el = <strong key={i}>{el}</strong>;
        if (t.annotations?.italic) el = <em key={i}>{el}</em>;
        if (t.annotations?.strikethrough) el = <s key={i}>{el}</s>;

        return el;
      })}
    </>
  );
}

export function Block({ block, onNavigate }) {
  const type = block.type;
  const data = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p className="mb-3 text-gray-800 dark:text-gray-200 leading-relaxed">
          <RichText text={data.rich_text} />
        </p>
      );

    case 'heading_1':
      return (
        <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">
          <RichText text={data.rich_text} />
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100">
          <RichText text={data.rich_text} />
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">
          <RichText text={data.rich_text} />
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li className="ml-5 mb-1 list-disc text-gray-800 dark:text-gray-200">
          <RichText text={data.rich_text} />
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="ml-5 mb-1 list-decimal text-gray-800 dark:text-gray-200">
          <RichText text={data.rich_text} />
        </li>
      );

    case 'to_do':
      return (
        <div className="flex items-start gap-2 mb-1">
          <input type="checkbox" checked={data.checked} readOnly className="mt-1" />
          <span
            className={`text-gray-800 dark:text-gray-200 ${data.checked ? 'line-through text-gray-400' : ''}`}
          >
            <RichText text={data.rich_text} />
          </span>
        </div>
      );

    case 'code':
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto text-sm">
          <code className="font-mono text-gray-800 dark:text-gray-200">
            {data.rich_text.map(t => t.plain_text).join('')}
          </code>
          {data.language && (
            <span className="block mt-2 text-xs text-gray-400">{data.language}</span>
          )}
        </pre>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-3 italic text-gray-600 dark:text-gray-400">
          <RichText text={data.rich_text} />
        </blockquote>
      );

    case 'callout':
      return (
        <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <span className="text-xl leading-none mt-0.5">
            {data.icon?.type === 'emoji' ? data.icon.emoji : '💡'}
          </span>
          <div className="text-gray-800 dark:text-gray-200">
            <RichText text={data.rich_text} />
          </div>
        </div>
      );

    case 'divider':
      return <hr className="my-6 border-gray-200 dark:border-gray-700" />;

    case 'child_page':
      return (
        <button
          onClick={() => onNavigate?.(block.id)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-2 text-sm"
        >
          📄 {data.title || 'Untitled'}
        </button>
      );

    case 'child_database':
      return (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2 text-sm">
          🗄️ {data.title || 'Untitled'}
          <span className="text-xs text-gray-400">(database)</span>
        </div>
      );

    case 'image': {
      const src =
        data.type === 'external' ? data.external?.url : data.file?.url;
      if (!src) return null;
      return (
        <figure className="mb-4">
          <img
            src={src}
            alt={data.caption?.map(t => t.plain_text).join('') || ''}
            className="max-w-full rounded-lg"
          />
          {data.caption?.length > 0 && (
            <figcaption className="text-sm text-gray-500 mt-1 text-center">
              <RichText text={data.caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case 'toggle':
      return (
        <details className="mb-2">
          <summary className="cursor-pointer text-gray-800 dark:text-gray-200 font-medium">
            <RichText text={data.rich_text} />
          </summary>
          {block.children && (
            <div className="ml-4 mt-2">
              <BlockList blocks={block.children} onNavigate={onNavigate} />
            </div>
          )}
        </details>
      );

    default:
      return (
        <p className="text-xs text-gray-400 italic mb-1">[{type} block]</p>
      );
  }
}

export function BlockList({ blocks, onNavigate }) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-gray-400 italic text-sm">No content blocks.</p>;
  }
  return (
    <div>
      {blocks.map(block => (
        <Block key={block.id} block={block} onNavigate={onNavigate} />
      ))}
    </div>
  );
}
