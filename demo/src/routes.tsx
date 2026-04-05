import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import BasicSpriteDemo from "./examples/BasicSpriteDemo";
import AnimatedSpriteDemo from "./examples/AnimatedSpriteDemo";
import SpriteSheetDemo from "./examples/SpriteSheetDemo";
import AnimationControlDemo from "./examples/AnimationControlDemo";
import PerformanceDemo from "./examples/PerformanceDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "basic-sprite",
        element: <BasicSpriteDemo />,
      },
      {
        path: "animated-sprite",
        element: <AnimatedSpriteDemo />,
      },
      {
        path: "sprite-sheet",
        element: <SpriteSheetDemo />,
      },
      {
        path: "animation-control",
        element: <AnimationControlDemo />,
      },
      {
        path: "performance",
        element: <PerformanceDemo />,
      },
    ],
  },
]);