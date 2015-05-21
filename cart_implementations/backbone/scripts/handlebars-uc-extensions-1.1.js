// Comparison Helper for handlebars.js
// Pass in two values that you want and specify what the operator should be
// e.g. {{#compare val1 val2 operator="=="}}{{/compare}}


Handlebars.registerHelper("formatPrice", function(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  var price;

  price = parseFloat(value);
  if (isNaN(price)) {
    return value;
  }
  return price.toFixed(2);
});

/** provides both a zero-based index (@index) and 1-based index (@pos) for displaying counters to users starting with 1. */
Handlebars.registerHelper('ucEach', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if (context && context.length > 0) {
    for (var i = 0, j = context.length; i < j; i++) {
      if (data) {
        data.index = i;
        // only difference between handlebars each and ucEach is the following line
        data.position = (i + 1);
      }
      ret = ret + fn(context[i], { data: data });
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('ucCompare', function(lvalue, rvalue, options) {

  if (arguments.length < 3)
    throw new Error("Handlebars Helper 'compare' needs 2 parameters");

  operator = options.hash.operator || "==";

  var operators = {
    '==':       function(l, r) {
      return l == r;
    },
    '===':      function(l, r) {
      return l === r;
    },
    '!=':       function(l, r) {
      return l != r;
    },
    '<':        function(l, r) {
      return l < r;
    },
    '>':        function(l, r) {
      return l > r;
    },
    '<=':       function(l, r) {
      return l <= r;
    },
    '>=':       function(l, r) {
      return l >= r;
    },
    'typeof':   function(l, r) {
      return typeof l == r;
    }
  };

  if (!operators[operator])
    throw new Error("Handlebars Helper 'compare' doesn't know the operator " + operator);

  var result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('ucCheckboxSelect1', function(value, options) {
  var checkboxHtml = options.fn(this); // this will evaluate the block inside this helper and return the output.
  // find the /> and insert selected='selected' if valid.
  if (value) {
    checkboxHtml = checkboxHtml.replace("/>", " checked='checked'/>");
  }
  return checkboxHtml;
});

Handlebars.registerHelper('ucCheckboxSelect2', function(value, target, options) {
  var checkboxHtml = options.fn(this); // this will evaluate the block inside this helper and return the output.
  // find the /> and insert selected='selected' if valid.
  if (value && target && value == target) {
    checkboxHtml = checkboxHtml.replace("/>", " checked='checked'/>");
  }
  return checkboxHtml;
});


Handlebars.registerHelper('ucSelectOption1', function(value, conditional, options) {
  var html = "<option value='" + Handlebars.Utils.escapeExpression(value) + "'";
  if (conditional) {
    html += " selected='selected'";
  }
  html += ">" + Handlebars.Utils.escapeExpression(options.fn(this)) + "</option>";
  return html;
});

Handlebars.registerHelper('ucSelectOption2', function(value, target, options) {
  var html = "<option value='" + Handlebars.Utils.escapeExpression(value) + "'";
  if (value && target && value == target) {
    html += " selected='selected'";
  }
  html += ">" + Handlebars.Utils.escapeExpression(options.fn(this)) + "</option>";
  return html;
});


//var tmpl = Handlebars.compile('{{#ucCheckboxSelect gooby gahby}}<input type="checkbox" name="{{gooby}}" />{{/ucCheckboxSelect}}');
//var context = {'gooby':'doowah', 'gahby': 'doowah'};
//console.log('output follows:');
//console.log(tmpl(context));
//
//tmpl = Handlebars.compile('{{#ucSelectOption gooby gahby}}<>whoo hoo{{/ucSelectOption}}');
//context = {'gooby':'doowah', 'gahby': 'doowah'};
//console.log('output follows:');
//console.log(tmpl(context));
