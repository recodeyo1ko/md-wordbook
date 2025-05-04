type Props = {
  tags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
};

export default function TagFilter({
  tags,
  selectedTag,
  setSelectedTag,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setSelectedTag(null)}
        className={`px-3 py-1 rounded ${
          selectedTag === null ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        全てのタグ
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          className={`px-3 py-1 rounded ${
            selectedTag === tag ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
