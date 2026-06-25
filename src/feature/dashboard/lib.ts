import { Style, Avatar as DiceBearAvatar } from "@dicebear/core";
import definition from "@dicebear/styles/initials.json" with { type: "json" };
/**
 * Generates an SVG Data URL using your specific DiceBear schema definition
 */
export const getCustomDicebearAvatar = (name: string): string => {
  const style = new Style(definition);
  const avatarInstance = new DiceBearAvatar(style, {
    seed: name || "Guest",
  });

  // Convert the raw SVG string into a safe browser-renderable Data URI
  const svgString = avatarInstance.toString();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};
