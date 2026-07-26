import React from "react";
import {
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { Controls } from "@/src/features/visualizer/components/Controls";
import { useVisualizer } from "@/src/features/visualizer/hooks/useVisualizer";

function TestVisualizer() {
  const visualizer = useVisualizer({
    algorithmName: "Bubble Sort",
    input: [5, 3, 8, 4, 1, 2],
  });

  return (
    <Controls
      isPlaying={visualizer.isPlaying}
      play={visualizer.play}
      pause={visualizer.pause}
      next={visualizer.next}
      prev={visualizer.prev}
      reset={visualizer.reset}
      index={visualizer.index}
      total={visualizer.total}
    />
  );
}

describe("Interactive Algorithm Visualizer", () => {
  test("Next button moves to the next step", async () => {
    const { getByText } = await render(<TestVisualizer />);

    fireEvent.press(getByText("Next"));

    await waitFor(() => {
      expect(getByText(/Step 2/)).toBeTruthy();
    });
  });

  test("Previous button returns to Step 1", async () => {
    const { getByText } = await render(<TestVisualizer />);

    fireEvent.press(getByText("Next"));

    await waitFor(() => {
      expect(getByText(/Step 2/)).toBeTruthy();
    });

    fireEvent.press(getByText("Prev"));

    await waitFor(() => {
      expect(getByText(/Step 1/)).toBeTruthy();
    });
  });
});