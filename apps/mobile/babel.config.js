module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      function ({ types: t }) {
        return {
          visitor: {
            MetaProperty(path) {
              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('env'),
                    t.objectExpression([
                      t.objectProperty(
                        t.identifier('MODE'),
                        t.stringLiteral(process.env.NODE_ENV || 'development'),
                      ),
                    ]),
                  ),
                ]),
              );
            },
          },
        };
      },
    ],
  };
};
