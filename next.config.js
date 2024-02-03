const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
    
          fs: false,
        };
    
        //local dev server
        config.plugins.push(
          new CopyPlugin({
            patterns: [
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.jsep.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/onnxruntime-web/dist/ort-training-wasm-simd.wasm",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
                to: "static/chunks/app",
              },
              {
                from: "./node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
                to: "static/chunks/app",
              },
            ],
          })
        );

        //vercel
        config.plugins.push(
            new CopyPlugin({
              patterns: [
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.jsep.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/onnxruntime-web/dist/ort-training-wasm-simd.wasm",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
                  to: "static/chunks",
                },
                {
                  from: "./node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
                  to: "static/chunks",
                },
              ],
            })
          );
    
        return config;
      },
};

module.exports = nextConfig;
