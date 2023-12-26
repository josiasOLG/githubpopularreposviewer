import React from "react";
import { Meta, Story } from "@storybook/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import MaterialIcon from "@mui/material/Icon";
import Icon from "../Icon";

export default {
  component: Icon,
  title: "Atoms/Icon",
} as Meta;

const Template: Story = (args) => <Icon {...args} />;

export const FontAwesome = Template.bind({});
FontAwesome.args = {
  type: "fontAwesome",
  name: faCoffee,
  className: "text-red-500",
};

export const Material = Template.bind({});
Material.args = {
  type: "material",
  name: "access_alarm",
  className: "text-blue-500",
};
