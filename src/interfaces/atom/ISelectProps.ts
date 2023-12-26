export interface ISelectProps {
  options: { value: string; label: string }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string; // Adiciona a propriedade className
}
