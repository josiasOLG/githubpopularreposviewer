import React from "react";
import { Story, Meta } from "@storybook/react";
import Avatar from "./Avatar";
import { IAvatarProps } from "../../interfaces/atom/IAvatarProps";

export default {
  title: "Avatar",
  component: Avatar,
  argTypes: {
    imageUrl: {
      control: "text",
    },
    altText: {
      control: "text",
    },
    className: {
      control: "text",
    },
  },
} as Meta;

const Template: Story<IAvatarProps> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  imageUrl: "http://example.com/avatar.jpg",
  altText: "Avatar Image",
};
