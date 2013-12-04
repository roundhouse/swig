var ignore = 'ignore',
  missing = 'missing',
  only = 'only',
  alreadyWrappedRE = /^(['"]).*\1$/;

/**
 * Includes a template partial in place. The template is rendered within the current locals variable context.
 *
 * @alias include
 *
 * @example
 * // food = 'burritos';
 * // drink = 'lemonade';
 * {% include "./partial.html" %}
 * // => I like burritos and lemonade.
 *
 * @example
 * // my_obj = { food: 'tacos', drink: 'horchata' };
 * {% include "./partial.html" with my_obj only %}
 * // => I like tacos and horchata.
 *
 * @example
 * {% include "./partial.html" with my_obj drink="agua de jamaica" %}
 * // => I like tacos and agua de jamaica.
 *
 * @example
 * {% include "/this/file/does/not/exist" ignore missing %}
 * // => (Nothing! empty string)
 *
 * @param {string|var}  file      The path, relative to the template root, to render into the current context.
 * @param {literal}     [with]    Literally, "with".
 * @param {object}      [context] Local variable key-value object context to provide to the included file.
 * @param {literal}     [only]    Restricts to <strong>only</strong> passing the <code>with context</code> as local variables–the included template will not be aware of any other local variables in the parent template. For best performance, usage of this option is recommended if possible.
 * @param {literal}     [ignore missing] Will output empty string if not found instead of throwing an error.
 */
exports.compile = function (compiler, args, content, parents, options) {
  var i,
    file = args.shift(),
    onlyIdx = args.indexOf(only),
    onlyCtx = onlyIdx !== -1 ? args.splice(onlyIdx, 1) : false,
    parentFile = args.pop().replace(/\\/g, '\\\\'),
    ignore = args[args.length - 1] === missing ? (args.pop()) : false,
    w = '',
    addl = '{',
    arg;
  while (args.length) {
    arg = args.shift();
    if (typeof arg === "string") {
      w = w + arg;
    } else {
      for (i in arg) {
        if (arg.hasOwnProperty(i)) {
          addl = addl + " \"" + i + "\": " + arg[i] + ",";
        }
      }
    }
  }
  addl = addl.substring(0, addl.length - 1);
  if (addl) {
    addl = addl += "}";
    if (w) {
      w = "_utils.extend({}, " + w + ',' + addl + ")";
    } else {
      w = addl;
    }
  }

  return (ignore ? '  try {\n' : '') +
    '_output += _swig.compileFile(' + file + ', {' +
    'resolveFrom: "' + parentFile + '"' +
    '})(' +
    ((onlyCtx && w) ? w : (!w ? '_ctx' : '_utils.extend({}, _ctx, ' + w + ')')) +
    ');\n' +
    (ignore ? '} catch (e) {}\n' : '');
};

exports.parse = function (str, line, parser, types, stack, opts) {
  var file, w, addl = false,
    addlCtx = {}, addlKey;
  parser.on(types.STRING, function (token) {
    if (!file) {
      file = token.match;
      this.out.push(file);
      return;
    }
    if (this.prevToken.type === types.ASSIGNMENT) {
      addlCtx[addlKey] = token.match.match(alreadyWrappedRE) ? token.match.replace(/'/g, '\\\'') : '"' + token.match.replace(/'/g, '\\\'') + '"';
      return false;
    }
    return true;
  });

  parser.on(types.VAR, function (token) {
    if (!file) {
      file = token.match;
      return true;
    }

    if (!w && token.match === 'with') {
      w = true;
      return;
    }

    if (w && token.match === only && this.prevToken.match !== 'with') {
      this.out.push(token.match);
      return;
    }

    if (token.match === ignore) {
      return false;
    }

    if (token.match === missing) {
      if (this.prevToken.match !== ignore) {
        throw new Error('Unexpected token "' + missing + '" on line ' + line + '.');
      }
      this.out.push(token.match);
      return false;
    }

    if (this.prevToken.match === ignore) {
      throw new Error('Expected "' + missing + '" on line ' + line + ' but found "' + token.match + '".');
    }

    if (this.prevToken.type === types.ASSIGNMENT) {
      addlCtx[addlKey] = parser.checkMatch(token.match.split('.'));
      return false;
    }


    if (w) {
      addlKey = token.match;
      return false;
    }

    return true;
  });


  parser.on(types.ASSIGNMENT, function (token) {
    addl = true;
    return false;
  });

  parser.on('end', function () {
    if (addl) {
      this.out.push(addlCtx);
    }
    if (addlKey && !addl) {
      this.out.push(parser.checkMatch(addlKey.split('.')));
    }
    this.out.push(opts.filename || null);
  });

  return true;
};