import { useEffect, useMemo, useState } from "react";
import { algorithmRegistry } from "../algorithmRegistry";

export function useVisualizer({
    algorithmName,
    input,
    speed = 100, // 100 ms per step
}: { // type definition
    algorithmName: string;
    input: number[];
    speed?: number;
}) {
    const steps = useMemo(() => { // memoization
        const selected = algorithmRegistry.find(algo => algo.name === algorithmName);
        return selected?.run(input) || [];
    }, [algorithmName, input]); // rerun only when algorithmKey or input changes

    // states
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const step = steps[index];

    useEffect(() => {
        if (!playing) return;

        // play timer after given speed
        const id = setInterval(() => {
            setIndex((current) => {
                // if we are at last step pause playing
                if (current >= steps.length - 1) {
                    setPlaying(false);
                    return current;
                }
                // else return next step
                return current + 1;
            });
        }, speed);

        // turn off the timer
        return () => clearInterval(id);
    }), [playing, speed, steps.length];

    // return controller 
    return {
        step,
        index,
        total: steps.length,
        isPlaying: playing,
        play: () => setPlaying(true),
        pause: () => setPlaying(false),
        reset: () => {
            setIndex(0);
            setPlaying(false);
        },
        next: () => {
            setIndex((i) => Math.min(i + 1, steps.length - 1)) // ensure that it doesnt go over
        },
        prev: () => {
            setIndex((i) => Math.max(i - 1, 0));
        }
    }
}