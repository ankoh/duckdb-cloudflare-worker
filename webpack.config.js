import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  target: "webworker",
  mode: "production",
  entry: {
    worker: ["./index.ts"],
  },
  output: {
    path: path.resolve(__dirname, "./build/"),
    filename: "[name].js",
    chunkFilename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext]",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".mjs", ".jsx", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /.*\.wasm$/,
        type: "asset/resource",
        generator: {
          filename: "[name].[contenthash][ext]",
        },
      },
    ],
  },
  plugins: [],
};