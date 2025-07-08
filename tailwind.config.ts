import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    backdropBlur: {
      sm: "4px",
      DEFAULT: "8px"
    }
  },
  plugins: [],
});

