import React from "react";
import { Story, Meta } from "@storybook/react";
import { IInputFieldProps } from "../../../interfaces/atom/IInputFieldProps";
import InputField from "../InputField";

export default {
  title: "SeuProjeto/Atoms/InputField",
  component: InputField,
} as Meta;

const Template: Story<IInputFieldProps> = (args) => <InputField {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: "text",
  value: "",
  placeholder: "Digite algo...",
  // Adicione mais props conforme necessário
};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  ...Default.args,
  className: "bg-gray-100 border-red-500",
};
