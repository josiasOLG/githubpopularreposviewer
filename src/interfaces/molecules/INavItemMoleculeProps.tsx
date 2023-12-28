import { IconProp } from "@fortawesome/fontawesome-svg-core";
export interface INavItemMoleculeProps {
  to: string;
  label: string;
  name?: string | IconProp; // Para FontAwesome, use IconProp
}
