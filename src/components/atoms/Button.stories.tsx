import React from "react";
import { Meta, Story } from "@storybook/react";
import Button from "./Button";

export default {
  component: Button,
  title: "Atoms/Button",
} as Meta;

const Template: Story = (args) => (
  <Button className="bg-red-500 hover:bg-red-700 text-white" {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: "Primary Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: "Secondary Button",
  className: "bg-red-500 hover:bg-red-600", // Exemplo de classe personalizada
};
