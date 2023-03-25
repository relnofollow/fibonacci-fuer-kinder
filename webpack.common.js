const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const i18nHtmlWebpackPlugins = [new HtmlWebpackPlugin({
    favicon: 'images/favicon.ico',
    template: 'i18n/index.html',
})];

const LOCALES = ['de', 'ru'];

for (let locale of LOCALES) {
    i18nHtmlWebpackPlugins.push(new HtmlWebpackPlugin({
        favicon: 'images/favicon.ico',
        template: `i18n/${locale}/index.html`,
        filename: `${locale}/index.html`
    }))
}

module.exports = {
    entry: {
        main: './src/index.js',
    },
    plugins: [
        ...i18nHtmlWebpackPlugins,
        new CopyPlugin({
            patterns: [
                { from: 'robots.txt' },
                { from: 'sitemap.xml' },
                { from: 'images/**/*' }
            ],
        }),
    ],
    output: {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
};
