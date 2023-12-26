import React, { ReactNode } from "react";

type TextProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
};

const Text: React.FC<TextProps> = ({
  as: Component = "p",
  className,
  children,
}) => {
  return (
    <Component className={`dark:text-white ${className}`}>{children}</Component>
  );
};

export default Text;
