import type { Preview } from "@storybook/react";
// .storybook/preview.js
import "../src/index.css"; // Substitua com o caminho correto para seu arquivo Tailwind CSS

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
