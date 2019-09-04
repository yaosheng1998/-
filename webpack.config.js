let path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            // {
            //     test: /\.less$/,
            //     use: ["style-loader", "css-loader", "less-loader"]
            // },
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        name: "[name].[ext]",
                        limit: 100000,
                        outputPath: 'img'
                    }
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {
                        attr: ["img:src"]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    devServer: {
        port: 9090,
        contentBase: 'dist'
    }
}