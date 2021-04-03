const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const env = require('./utils/env');

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist/src'),
};
console.log(env.NODE_ENV);

module.exports = {
    mode: env.NODE_ENV,
    watch: env.NODE_ENV === 'development',
    watchOptions: {
        ignored: ['node_modules/**'],
    },
    entry: {
        content: `${PATHS.src}/content/index.ts`,
        background: `${PATHS.src}/background/index.ts`,
        popup: `${PATHS.src}/popup/index.tsx`,
    },
    output: {
        path: PATHS.dist,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(eot|png|svg|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    // MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: `${PATHS.src}/popup/popup.html`, to: PATHS.dist },
            ],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: `${PATHS.src}/content/content.style.css`,
                    to: PATHS.dist,
                },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
};
