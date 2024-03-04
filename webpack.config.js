const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        view: {
            import: './src/view.js'
        },
        board: {
            import: './src/board.js'
        },
        popup: {
            import: './src/popup.js'
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ["@babel/preset-react", {"runtime": "automatic"}]]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ]
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'all',
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public" },
            ],
        }),
    ],
};