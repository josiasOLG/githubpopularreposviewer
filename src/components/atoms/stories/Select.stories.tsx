import React from "react";
import { Story, Meta } from "@storybook/react";
import Select from "../Select";
import { ISelectProps } from "../../../interfaces/atom/ISelectProps";

export default {
  title: "SeuProjeto/Atoms/Select",
  component: Select,
} as Meta;

const Template: Story<ISelectProps> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    // Adicione mais opções conforme necessário
  ],
};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  ...Default.args,
  className: "border-red-500 bg-gray-100",
};
