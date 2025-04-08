import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEraser } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [penThickness, setPenThickness] = useState(5); // Default pen thickness
  const [mode, setMode] = useState("pen"); // Mode to switch between pen, eraser, and other tools
  const [selectedOption, setSelectedOption] = useState("Option 1"); // Dropdown value

  // Initialize the canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        setCtx(context);
        context.lineWidth = penThickness; // Set default line width
        context.lineCap = "round"; // Rounded line caps for smoother lines
        context.strokeStyle = "black"; // Set default stroke color
      }
    }
  }, [penThickness]); // Re-run whenever penThickness changes

  // Start drawing when mouse is pressed
  const startDrawing = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setLastX(e.clientX - rect.left);
      setLastY(e.clientY - rect.top);
      setIsDrawing(true);
    }
  };

  // Draw on the canvas when mouse is moving
  const draw = (e: any) => {
    if (!isDrawing || !ctx) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      if (mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out"; // Eraser effect
        ctx.lineWidth = penThickness * 2; // Make eraser bigger than pen for better effect
      } else {
        ctx.globalCompositeOperation = "source-over"; // Normal drawing mode
        ctx.lineWidth = penThickness; // Use current pen thickness
      }
      ctx.stroke();
      setLastX(x);
      setLastY(y);
    }
  };

  // Stop drawing when mouse is released
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Handle mouse events
  const handleMouseDown = (e: any) => startDrawing(e);
  const handleMouseMove = (e: any) => draw(e);
  const handleMouseUp = () => stopDrawing();

  // Handle touch events for mobile devices
  const handleTouchStart = (e: any) => startDrawing(e.touches[0]);
  const handleTouchMove = (e: any) => draw(e.touches[0]);
  const handleTouchEnd = () => stopDrawing();

  // Clear the canvas
  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Heading and Paragraphs */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-2">Canvas Drawing Project</h1>
        <p className="text-lg text-gray-700">
          This is a simple drawing application where you can create and save
          your artwork. Use the tools above to draw and erase as needed.
        </p>
      </div>

      {/* Dropdown Box */}
      <div className="absolute top-4 right-4">
        <select
          className="bg-white border border-gray-300 rounded-md p-2"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </select>
      </div>

      {/* Tool Options Above Canvas */}
      <div className="flex mb-4 space-x-4">
        <button
          onClick={() => setMode("pen")}
          className={`border ${
            mode === "pen"
              ? "border-blue-500 text-blue-500"
              : "border-gray-500 text-gray-500"
          } p-2 rounded-md hover:bg-blue-100`}
        >
          <i className="fa-solid fa-pen"></i>
        </button>
        <button
          onClick={() => setMode("eraser")}
          className={`border ${
            mode === "eraser"
              ? "border-red-500 text-red-500"
              : "border-gray-500 text-gray-500"
          } p-2 rounded-md hover:bg-red-100`}
        >
          <i className="fa-solid fa-eraser"></i>
        </button>
        <label className="text-sm text-gray-600">Pen Thickness:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={penThickness}
          onChange={(e) => setPenThickness(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1"
        />
        <button
          onClick={clearCanvas}
          className="border border-gray-500 text-gray-500 p-2 rounded-md hover:bg-gray-100"
        >
          Clear
        </button>
      </div>

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-gray-700"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Submit Button */}
      <button
        onClick={() => alert("Submitted!")}
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Submit
      </button>
    </div>
  );
}
