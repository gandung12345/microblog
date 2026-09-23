import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

export default function CategoryTree({ categories, selectedSlug, onSelectCategory }) {
  // Ensure categories is an array before processing
  const categoryList = Array.isArray(categories) 
    ? categories 
    : categories?.results && Array.isArray(categories.results) 
      ? categories.results 
      : [];

  if (categoryList.length === 0) return null;

  return (
    <div className="space-y-1">
      {categoryList.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          selectedSlug={selectedSlug}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
}

function CategoryNode({ category, selectedSlug, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && Array.isArray(category.children) && category.children.length > 0;
  const isSelected = selectedSlug === category.slug;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="select-none">
      <div
        onClick={() => onSelectCategory(category.slug)}
        className={`group flex items-center justify-between px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'bg-[#EADECA] text-[#2C3531] shadow-sm'
            : 'text-[#4A5568] hover:bg-[#F2EFE9] hover:text-[#2D312E]'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="p-1 rounded-full hover:bg-black/5 text-[#718096] transition-colors"
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {hasChildren && isOpen ? (
            <FolderOpen size={16} className={isSelected ? 'text-[#2C3531]' : 'text-[#8C9A8E]'} />
          ) : (
            <Folder size={16} className={isSelected ? 'text-[#2C3531]' : 'text-[#A0AEC0]'} />
          )}

          <span className="truncate">{category.name}</span>
        </div>
      </div>

      {/* Recursive Nested Subcategories */}
      {hasChildren && isOpen && (
        <div className="ml-5 pl-2 border-l border-[#E2E8F0] space-y-1 mt-1">
          <CategoryTree
            categories={category.children}
            selectedSlug={selectedSlug}
            onSelectCategory={onSelectCategory}
          />
        </div>
      )}
    </div>
  );
}
