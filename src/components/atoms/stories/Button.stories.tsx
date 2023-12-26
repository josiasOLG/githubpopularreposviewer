import React from "react";
import { Meta, Story } from "@storybook/react";
import Button from "../Button";

export default {
  component: Button,
  title: "Atoms/Button",
} as Meta;

// Definição da Template Function
const ButtonTemplate: Story = (args) => <Button {...args} />;

// Botão Primário
export const Primary = ButtonTemplate.bind({});
Primary.args = {
  children: "Primary Button",
  className: "text-white bg-blue-500 hover:bg-blue-600", // Classe Tailwind para o botão primário
};

// Botão Secundário
export const Secondary = ButtonTemplate.bind({});
Secondary.args = {
  children: "Secondary Button",
  className: "text-black bg-green-500 hover:bg-green-600", // Exemplo de classe para botão secundário
};
