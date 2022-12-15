import { Variants } from "framer-motion";
import { set } from "lodash-es";

type FadeDirection = "up" | "down" | "left" | "right";
export const fadeVariants = (
  direction: FadeDirection,
  duration = 0.5,
  pixelMagnitude = 50
): Variants => {
  const axis: "x" | "y" =
    direction === "up" || direction === "down" ? "y" : "x";
  const visibleValue = 0;
  let hiddenValue = 0;
  switch (direction) {
    case "up":
      hiddenValue = 50;
      break;
    case "right":
      hiddenValue = -50;
      break;
    case "left":
      hiddenValue = 50;
      break;
    case "down":
      hiddenValue = -50;
      break;
    default:
      break;
  }
  const variants: Variants = {
    visible: {
      opacity: 1,
      transition: {
        duration: duration,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: duration,
      },
    },
  };
  set(variants, `visible.${axis}`, visibleValue);
  set(variants, `hidden.${axis}`, hiddenValue);

  return variants;
};
