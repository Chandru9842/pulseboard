"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UnifiedContentItem } from "@/types/content";
import { ContentCard } from "./ContentCard";

interface SortableContentCardProps {
  item: UnifiedContentItem;
  compact?: boolean;
}

export function SortableContentCard({ item, compact }: SortableContentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ContentCard
        item={item}
        compact={compact}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}
