import { IconProp } from "@fortawesome/fontawesome-svg-core";
type IconType = "fontAwesome" | "material";

export interface IIconProps {
  type: IconType;
  name: string | IconProp; // Para FontAwesome, use IconProp
  className?: string;
}
