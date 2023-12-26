import React from "react";
import { Story, Meta } from "@storybook/react";
import Label from "../Label";
import { ILabelProps } from "../../../interfaces/atom/ILabelProps";

export default {
  title: "SeuProjeto/Atoms/Label",
  component: Label,
  // Adicione argumentos para controlar o comportamento do componente
  argTypes: {
    text: { control: "text" },
    htmlFor: { control: "text" },
    className: { control: "text" },
  },
} as Meta;

const Template: Story<ILabelProps> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: "Label padrão",
  htmlFor: "inputId",
};

export const CustomStyle = Template.bind({});
CustomStyle.args = {
  ...Default.args,
  className: "text-blue-600",
};

// Adicione mais variações se necessário
