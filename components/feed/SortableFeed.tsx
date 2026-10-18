"use client";

import React, { useId } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { UnifiedContentItem } from "@/types/content";
import { SortableContentCard } from "@/components/cards/SortableContentCard";
import { cn } from "@/lib/utils";

interface SortableFeedProps {
  items: UnifiedContentItem[];
  onReorder: (newItems: UnifiedContentItem[]) => void;
  compact?: boolean;
}

export function SortableFeed({
  items,
  onReorder,
  compact = false,
}: SortableFeedProps) {
  const dndContextId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag initiates (prevents accidental drag on click)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(items, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={compact ? verticalListSortingStrategy : rectSortingStrategy}
      >
        <div
          className={cn(
            compact
              ? "space-y-3"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4"
          )}
        >
          {items.map((item) => (
            <SortableContentCard
              key={item.id}
              item={item}
              compact={compact}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
