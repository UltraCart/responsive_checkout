/**
 * helper method designed to allow for money calculations on the client side.
 * Only those currencies supported by UltraCart are implemented here.
 * @param currencyCode this should be the cart.currencyCode
 * @param amount amount to be formatted
 * @return {*} A string formatted in the desired currency.
 */
function formatMoney(currencyCode, amount) {
  if (isNaN(amount)) {
    return "";
  }

  /**
   * takes a number and adds thousandths separators
   * @param n
   * @param thouSep thousandth separator, usually a comma
   * @param decSep decimal separator, usually a period
   * @return {string}
   */
  function numberWithSeparators(n, thouSep, decSep) {
    var parts = n.toString().split(decSep);
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thouSep) + (parts[1] ? decSep + parts[1] : "");
  }

  var formats = {
    "AUD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' AUD', 'fractionDigits': 2},
    "BRL": {'prefix': 'R$', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
    "CAD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' CAD', 'fractionDigits': 2},
    "CHF": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' Sfr', 'fractionDigits': 2},
    "EUR": {'prefix': '', 'thousandth': '.', 'decimalSeparator': ',', suffix: ' ' + '\u20AC', 'fractionDigits': 2},
    "GBP": {'prefix': '\u00A3', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
    "JPY": {'prefix': '\u00A5', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 0},
    "MXN": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' MXN', 'fractionDigits': 2},
    "NOK": {'prefix': 'kr', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
    "NZD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' NZD', 'fractionDigits': 2},
    "RUB": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' \u0440\u0443\u0431', 'fractionDigits': 2},
    "SEK": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' Kr', 'fractionDigits': 2},
    "SGD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' SGD', 'fractionDigits': 2},
    "TRY": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' YTL', 'fractionDigits': 2},
    "USD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2}
  };

  var format = null;
  if (formats.hasOwnProperty(currencyCode)) {
    format = formats[currencyCode];
  }


  if (format) {
    var fixedAmount = amount.toFixed(format.fractionDigits);
    var fixedAmountStr = fixedAmount.toString();
    var hasNegativeSign = false;

    if(fixedAmountStr.indexOf('-') == 0){
      hasNegativeSign = true;
      fixedAmountStr = fixedAmountStr.substr(1);
    }

    return (hasNegativeSign ? "-" : "") + format.prefix + numberWithSeparators(fixedAmountStr, format.thousandth, format.decimalSeparator) + format.suffix;
  }

  return amount.toFixed(2); // nothing to do but fail gracefully.

}
