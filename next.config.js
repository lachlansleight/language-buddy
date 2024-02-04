const CopyPlugin = require("copy-webpack-plugin");

const wasmPaths = [
    "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd.jsep.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm",
    "./node_modules/onnxruntime-web/dist/ort-training-wasm-simd.wasm",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
        config.resolve.fallback = {
            ...config.resolve.fallback,

            fs: false,
        };

        //local dev server - copy wasm into static/chunks/app
        config.plugins.push(
            new CopyPlugin({ patterns: wasmPaths.map(p => ({ from: p, to: "static/chunks/app" })) })
        );

        //vercel - copy wasm into static/chunks
        config.plugins.push(
            new CopyPlugin({ patterns: wasmPaths.map(p => ({ from: p, to: "static/chunks" })) })
        );

        return config;
    },
};

module.exports = nextConfig;
