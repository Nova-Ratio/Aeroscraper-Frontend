import { animate, AnimationControls, AnimationPlaybackControls } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface CounterProps {
  from: string;
  to: string;
  duration?: number,
  fixed?: number
}

export const CounterUp = ({ from, to, duration = 1, fixed = 2 }: CounterProps) => {
  const nodeRef = useRef<HTMLParagraphElement>(null);
  const controls = useRef<AnimationControls | AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (nodeRef.current) {
      const node = nodeRef.current;

      controls.current = animate(parseFloat(from), parseFloat(to), {
        duration: duration,
        onUpdate(value) {
          node.textContent = fixed ? value.toFixed(fixed) : value.toString();
        },
      });
    }

    return () => {
      if (controls.current) {
        controls.current.stop();
      }
    };
  }, [from, to]);

  return <span ref={nodeRef} />;
}