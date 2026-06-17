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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getOrCreateStoryProgress(storyId, variant)
      .then(() => setReady(true))
      .catch(console.error);
  }, [storyId, variant]);

  useEffect(() => {
    getCompletedStories()
      .then((c) => setCompleted(c.includes(storyId)))
      .catch(console.error);
  }, [storyId]);

  const onMarkRead = async () => {
    try {
      await markStoryCompleted(storyId);
      setCompleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8 flex justify-end">
      {completed ? (
        <span className="text-sm text-muted">✓ Leída</span>
      ) : (
        <button
          onClick={onMarkRead}
          disabled={!ready}
          className="px-4 py-2 bg-primary rounded-md font-medium hover:opacity-90 disabled:opacity-50"
        >
          Marcar como leída
        </button>
      )}
    </div>
  );
}
