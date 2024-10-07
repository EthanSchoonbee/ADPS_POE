// babel.config.js
module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react', // Add React preset
    ],
    plugins: [
        '@babel/plugin-proposal-private-property-in-object', // Required for some dependencies
    ],
};
