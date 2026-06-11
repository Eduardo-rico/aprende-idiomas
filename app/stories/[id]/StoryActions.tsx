"use client";
import { useState, useEffect } from "react";
import {
  getOrCreateStoryProgress,
  markStoryCompleted,
  getCompletedStories,
} from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

export function StoryActions({ storyId }: { storyId: string }) {
  const { variant } = useSettings();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    getOrCreateStoryProgress(storyId, variant).catch(console.error);
    getCompletedStories()
      .then((c) => setCompleted(c.includes(storyId)))
      .catch(console.error);
  }, [storyId, variant]);

  const onMarkRead = async () => {
    await markStoryCompleted(storyId);
    setCompleted(true);
  };

  return (
    <div className="mt-8 flex justify-end">
      {completed ? (
        <span className="text-sm text-muted">✓ Leída</span>
      ) : (
        <button
          onClick={onMarkRead}
          className="px-4 py-2 bg-primary rounded-md font-medium hover:opacity-90"
        >
          Marcar como leída
        </button>
      )}
    </div>
  );
}
