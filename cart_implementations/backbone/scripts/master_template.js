this["Ultracart"] = this["Ultracart"] || {};
this["Ultracart"]["templates"] = this["Ultracart"]["templates"] || {};

this["Ultracart"]["templates"]["billto_address_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<label class=\"eight columns alpha omega\">\r\n  <span>Addresses on File</span>\r\n  <select id=\"storedBillingAddress\" name=\"storedBillingAddress[number]\">\r\n    <option value=\"0\"></option>\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.customerProfile : stack1)) != null ? stack1.billingAddresses : stack1), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </select>\r\n</label>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "      <option value=\""
    + escapeExpression(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"oid","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.address1 || (depth0 != null ? depth0.address1 : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"address1","hash":{},"data":data}) : helper)))
    + ", "
    + escapeExpression(((helper = (helper = helpers.city || (depth0 != null ? depth0.city : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"city","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"state","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.country : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.country || (depth0 != null ? depth0.country : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"country","hash":{},"data":data}) : helper)));
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<legend>Billing Address</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.customerProfile : stack1)) != null ? stack1.billingAddresses : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n<label class=\"name four columns alpha\">\r\n  <span>*First Name</span>\r\n  <input type=\"text\" id=\"billToFirstName\" name=\"billing[firstName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToFirstName : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>*Last Name</span>\r\n  <input type=\"text\" id=\"billToLastName\" name=\"billing[lastName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToLastName : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"company eight columns alpha\">\r\n  <span>Company</span>\r\n  <input type=\"text\" id=\"billToCompany\" name=\"billing[company]\" class=\"eight columns alpha\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToCompany : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>*Address 1</span>\r\n  <input type=\"text\" id=\"billToAddress1\" name=\"billing[address1]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToAddress1 : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>Address 2</span>\r\n  <input type=\"text\" id=\"billToAddress2\" name=\"billing[address2]\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToAddress2 : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*City</span>\r\n  <input type=\"text\" id=\"billToCity\" name=\"billing[city]\" required class=\"required\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToCity : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*State/Province/Region</span>\r\n  <input type=\"text\" id=\"billToState\" name=\"billing[state]\" required class=\"required\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToState : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Zip/Postal Code</span>\r\n  <input type=\"text\" id=\"billToPostalCode\" name=\"billing[postalCode]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.billToPostalCode : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns omega\">\r\n  <span>*Country</span>\r\n  <select name=\"billing[country]\" id=\"billToCountry\">\r\n    <option value=''>&nbsp;</option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.countries : depth0), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </select>\r\n</label>\r\n</script>\r\n";
},"useData":true});



this["Ultracart"]["templates"]["coupons_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "<div class=\"couponRemove one column omega\">\r\n  <button type=\"button\" class=\"btnRemove removeCouponButton\" id='couponRemove_"
    + escapeExpression(lambda((data && data.index), depth0))
    + "'>x</button>\r\n</div>\r\n<label class=\"name four columns alpha\">\r\n  <span class=\"bold\">"
    + escapeExpression(((helper = (helper = helpers.couponCode || (depth0 != null ? depth0.couponCode : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"couponCode","hash":{},"data":data}) : helper)))
    + "</span>\r\n</label>\r\n<br class=\"clear\">\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<legend>Coupons</legend>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>Enter Coupon Code</span>\r\n  <input type=\"text\" id=\"couponField\"/>\r\n  <button type=\"button\" id=\"addCouponButton\">Apply</button>\r\n</label>\r\n<br class=\"clear\">\r\n\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.coupons : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});



this["Ultracart"]["templates"]["credentials_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <span class=\"credentials-main-buttons four columns alpha\">\r\n    <button type=\"button\" class=\"btnLogin\" id=\"btnLoginShow\">Login</button>\r\n    <button type=\"button\" class=\"btnRegister\" id=\"btnRegisterShow\">Register</button>\r\n  </span>\r\n";
  },"3":function(depth0,helpers,partials,data) {
  return "  <span class=\"credentials-main-buttons four columns alpha\">\r\n    <button type=\"button\" class=\"btnLogout\" id=\"btnLogoutSubmit\">Logout</button>\r\n  </span>\r\n";
  },"5":function(depth0,helpers,partials,data) {
  return "<label class=\"login-email three columns alpha\">\r\n  <span>Email Address:</span>\r\n  <input type=\"text\" class='credentialField' id=\"loginEmail\" name=\"login[email]\" value=\"\"/>\r\n</label>\r\n<label class=\"login-password three columns alpha\">\r\n  <span>Password:</span>\r\n  <input type=\"password\" class='credentialField' id=\"loginPassword\" name=\"login[password]\" value=\"\"/>\r\n</label>\r\n  <span class=\"four columns alpha\">\r\n    <button type=\"button\" class=\"btnLogin\" id=\"btnLoginSubmit\">Login</button>\r\n    <button type=\"button\" class=\"btnCancel\">Cancel</button>\r\n  </span>\r\n";
  },"7":function(depth0,helpers,partials,data) {
  return "<label class=\"register-email three columns alpha\">\r\n  <span>Email Address:</span>\r\n  <input type=\"text\" class='credentialField' id=\"registerEmail\" name=\"register[email]\" value=\"\"/>\r\n</label>\r\n<label class=\"register-password three columns alpha\">\r\n  <span>Password:</span>\r\n  <input type=\"password\" class='credentialField' id=\"registerPassword\" name=\"register[password]\" value=\"\"/>\r\n</label>\r\n  <span class=\"four columns alpha\">\r\n    <button type=\"button\" class=\"btnRegister\" id=\"btnRegisterSubmit\">Register</button>\r\n    <button type=\"button\" class=\"btnCancel\">Cancel</button>\r\n  </span>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.showButtons : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.showLogout : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.showLogin : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.showRegister : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});



this["Ultracart"]["templates"]["gift_certificate_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "Remove";
  },"3":function(depth0,helpers,partials,data) {
  return "Apply";
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<span class='giftCertificateSpan'>Amount Applied:</span><span class='giftCertificateButtonSpan'><span\r\n  class='giftCertificateSummary'>"
    + escapeExpression(((helper = (helper = helpers.giftCertificateAmount || (depth0 != null ? depth0.giftCertificateAmount : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"giftCertificateAmount","hash":{},"data":data}) : helper)))
    + "</span></span>\r\n<br class=\"clear\">\r\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<span class='giftCertificateSpan'>Remaining Balance:</span><span class='giftCertificateButtonSpan'><span\r\n  class='giftCertificateSummary'>"
    + escapeExpression(((helper = (helper = helpers.giftCertificateRemainingBalanceAfterOrder || (depth0 != null ? depth0.giftCertificateRemainingBalanceAfterOrder : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"giftCertificateRemainingBalanceAfterOrder","hash":{},"data":data}) : helper)))
    + "</span></span>\r\n<br class=\"clear\">\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<legend>Gift Certificate</legend>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>Enter Gift Certificate</span>\r\n  <input type=\"text\" id=\"giftCertificateField\"/>\r\n  <button type=\"button\" id=\"updateGiftCertificateButton\">";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.giftCertificate : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</button>\r\n</label>\r\n<br class=\"clear\">\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hasGiftCertificateAmount : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.giftCertificateRemainingBalanceAfterOrder : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});



this["Ultracart"]["templates"]["item_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <img src=\""
    + escapeExpression(((helper = (helper = helpers.imageUrl || (depth0 != null ? depth0.imageUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"imageUrl","hash":{},"data":data}) : helper)))
    + "\" class=\"thumb\" alt=\"thumb\"/>\r\n";
},"3":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "  <br class=\"clear\">\r\n\r\n  <div class=\"itemOption\">\r\n    <span>"
    + escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"label","hash":{},"data":data}) : helper)))
    + "</span>\r\n";
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "single", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(4, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "fixed", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(6, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "multiline", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(8, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "dropdown", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(10, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "radio", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(14, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "    ";
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "hidden", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(18, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "    ";
  stack1 = ((helpers.ucCompare || (depth0 && depth0.ucCompare) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "file attachment", {"name":"ucCompare","hash":{
    'operator': ("==")
  },"fn":this.program(20, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <input type='text' size='20' value=\""
    + escapeExpression(((helper = (helper = helpers.selectedValue || (depth0 != null ? depth0.selectedValue : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectedValue","hash":{},"data":data}) : helper)))
    + "\" class='singleQualifier'\r\n           id='singleQualifier_"
    + escapeExpression(((helper = (helper = helpers.optionOid || (depth0 != null ? depth0.optionOid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"optionOid","hash":{},"data":data}) : helper)))
    + "'/>\r\n";
},"6":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <input type='text' size='20' value=\""
    + escapeExpression(((helper = (helper = helpers.selectedValue || (depth0 != null ? depth0.selectedValue : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectedValue","hash":{},"data":data}) : helper)))
    + "\" class='fixedQualifier'\r\n           id='fixedQualifier_"
    + escapeExpression(((helper = (helper = helpers.optionOid || (depth0 != null ? depth0.optionOid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"optionOid","hash":{},"data":data}) : helper)))
    + "'/>\r\n";
},"8":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <textarea rows='3' cols='45' class='multiQualifier'\r\n              id='multiQualifier_"
    + escapeExpression(((helper = (helper = helpers.optionOid || (depth0 != null ? depth0.optionOid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"optionOid","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.selectedValue || (depth0 != null ? depth0.selectedValue : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectedValue","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n";
},"10":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "    <select class='selectQualifier' id='selectQualifier_"
    + escapeExpression(((helper = (helper = helpers.optionOid || (depth0 != null ? depth0.optionOid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"optionOid","hash":{},"data":data}) : helper)))
    + "'>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.values : depth0), {"name":"each","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </select>\r\n";
},"11":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "      ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.value : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(12, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"12":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)));
  },"14":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "      <span class='radioQualifierContainer' id='radioQualifier_"
    + escapeExpression(((helper = (helper = helpers.optionOid || (depth0 != null ? depth0.optionOid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"optionOid","hash":{},"data":data}) : helper)))
    + "'>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.values : depth0), {"name":"each","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </span>\r\n";
},"15":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "        <input type='radio' class='radioQualifier'\r\n               name='radioQualifier_"
    + escapeExpression(lambda((depths[1] != null ? depths[1].optionOid : depths[1]), depth0))
    + "'\r\n              ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.selected : depth0), {"name":"if","hash":{},"fn":this.program(16, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n              value='"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "'/> "
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "<br/>\r\n";
},"16":function(depth0,helpers,partials,data) {
  return " checked='checked' ";
  },"18":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<em>unsupported option type</em>\r\n    <input type='hidden' value=\""
    + escapeExpression(((helper = (helper = helpers.selectedValue || (depth0 != null ? depth0.selectedValue : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectedValue","hash":{},"data":data}) : helper)))
    + "\" class='hiddenQualifier' id='hiddenQualifier_"
    + escapeExpression(((helper = (helper = helpers.optionOid || (depth0 != null ? depth0.optionOid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"optionOid","hash":{},"data":data}) : helper)))
    + "'/>\r\n";
},"20":function(depth0,helpers,partials,data) {
  return "<em>unsupported option type</em>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<!-- the surrounding div tag for this item is created within the backbone view code. -->\r\n<div class=\"itemRemove one column omega\">\r\n  <button type=\"button\" class=\"btnRemove\">x</button>\r\n</div>\r\n<div class=\"itemInfo nine columns alpha\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.imageUrl : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  <span class=\"itemName\">"
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "</span><br>\r\n\r\n  <div class=\"itemAmount\">"
    + escapeExpression(((helper = (helper = helpers.unitCost || (depth0 != null ? depth0.unitCost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"unitCost","hash":{},"data":data}) : helper)))
    + "</div>\r\n  <br>I\r\n  <div class=\"itemDescription\">\r\n    <p>"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\r\n  </div>\r\n\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.options : depth0), {"name":"each","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n</div>\r\n<div class=\"itemQuantity two columns omega\">\r\n  <input type=\"number\" class=\"itemQty\" name=\"items["
    + escapeExpression(((helper = (helper = helpers.position || (depth0 != null ? depth0.position : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"position","hash":{},"data":data}) : helper)))
    + "].quantity\" value=\""
    + escapeExpression(((helper = (helper = helpers.quantity || (depth0 != null ? depth0.quantity : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"quantity","hash":{},"data":data}) : helper)))
    + "\" maxlength=\"5\"/>\r\n</div>\r\n<br class=\"clear\">";
},"useData":true,"useDepths":true});



this["Ultracart"]["templates"]["items_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.stillLoading : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  return "Loading shopping cart. Please wait...\r\n";
  },"4":function(depth0,helpers,partials,data) {
  return "Your cart is empty, good sir.\r\n";
  },"6":function(depth0,helpers,partials,data) {
  return "<header>\r\n  <div class=\"itemInfo offset-by-one nine columns alpha\">Item</div>\r\n  <div class=\"itemQuantity two columns omega\">Qty</div>\r\n</header>\r\n\r\n<!-- individual items will be inserted here by the view code -->\r\n<footer class=\"twelve columns alpha omega\">\r\n  <!--<button type=\"button\" class=\"btnCartUpdate\">Update</button>-->\r\n</footer>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.noItems : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});



this["Ultracart"]["templates"]["payment_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<label class=\"sixteen columns alpha\">\r\n  <span>Select a card on File</span>\r\n  <select id=\"customerProfileCreditCardId\" name=\"creditCard[customerProfileCreditCardId]\">\r\n    <option value=\"0\"></option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.storedCards : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </select>\r\n</label>\r\n\r\n<label class=\"sixteen columns alpha\">\r\n  <span>or enter a new card:</span>\r\n</label>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "      ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.id : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.cardType || (depth0 != null ? depth0.cardType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cardType","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.cardNumber || (depth0 != null ? depth0.cardNumber : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cardNumber","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"status","hash":{},"data":data}) : helper)));
},"5":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.card : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"6":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.card || (depth0 != null ? depth0.card : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"card","hash":{},"data":data}) : helper)));
  },"8":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.month : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)));
  },"11":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.year : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(12, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"12":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"year","hash":{},"data":data}) : helper)));
  },"14":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "<label class=\"sixteen columns alpha\">\r\n  <span>\r\n    ";
  stack1 = ((helpers.ucCheckboxSelect2 || (depth0 && depth0.ucCheckboxSelect2) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.storeCreditCard : stack1), true, {"name":"ucCheckboxSelect2","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n    save this card for future use\r\n  </span>\r\n</label>\r\n\r\n";
},"15":function(depth0,helpers,partials,data) {
  return "<input type=\"checkbox\" id=\"storeCreditCard\"\r\n                                                        name=\"creditCard[storeCreditCard]\" value='true'/>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<legend>Payment Information</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.storedCards : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n\r\n<label class=\"three columns alpha\">\r\n  <span>Credit Card Type</span>\r\n  <select id=\"creditCardType\" name=\"creditCard[creditCardType]\" required class=\"required\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.creditCardType : stack1), depth0))
    + "\">\r\n    <option value=\"\">-</option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.ccTypes : depth0), {"name":"each","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </select>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>Credit Card #</span>\r\n  <input type=\"text\" id=\"creditCardNumber\" name=\"creditCard[number]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.creditCardNumber : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"two columns alpha\">\r\n  <span>Expiration Date</span>\r\n  <br class=\"clear\">\r\n\r\n  <select id=\"creditCardExpirationMonth\" name=\"creditCard[expMonth]\" class=\"two columns alpha\">\r\n    <option value=\"0\">Month</option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.ccMonths : depth0), {"name":"each","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </select>\r\n</label>\r\n\r\n<label class=\"two columns alpha\">\r\n  <span>&nbsp;</span>\r\n  <br class=\"clear\">\r\n\r\n  <select id=\"creditCardExpirationYear\" name=\"creditCard[expYear]\" class=\"two columns alpha\">\r\n    <option value=\"0\">Year</option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.ccYears : depth0), {"name":"each","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </select>\r\n</label>\r\n\r\n<label class=\"five columns alpha\">\r\n  <span>Card Verification #</span>\r\n  <br class=\"clear\">\r\n  <input type=\"number\" id=\"creditCardVerificationNumber\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.creditCardVerificationNumber : stack1), depth0))
    + "\"\r\n         name=\"creditCard[verification]\" required\r\n         class=\"required one column alpha\"/>\r\n  <span class=\"ccv-help-link\">help finding this number</span>\r\n  <br class=\"clear\">\r\n\r\n  <div class=\"ccv_message\"></div>\r\n\r\n</label>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.loggedIn : depth0), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});



this["Ultracart"]["templates"]["paypal_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "      <span class='paypal_link fake_hyper'>\r\n        <img src=\""
    + escapeExpression(((helper = (helper = helpers.button || (depth0 != null ? depth0.button : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"button","hash":{},"data":data}) : helper)))
    + "\" alt='"
    + escapeExpression(((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"alt","hash":{},"data":data}) : helper)))
    + "'/>\r\n      </span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.paypal : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});



this["Ultracart"]["templates"]["shipping_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "No available shipping methods found.\r\n";
  },"3":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.showDropdown : depth0), {"name":"if","hash":{},"fn":this.program(4, data, depths),"inverse":this.program(8, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"4":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "<select class='selectShippingPreference' name=\"shipping[preference]\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.methods : depth0), {"name":"each","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</select>\r\n";
},"5":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "  ";
  stack1 = ((helpers.ucSelectOption2 || (depth0 && depth0.ucSelectOption2) || helperMissing).call(depth0, (depth0 != null ? depth0.name : depth0), (depths[1] != null ? depths[1].selectedMethod : depths[1]), {"name":"ucSelectOption2","hash":{},"fn":this.program(6, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"6":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.cost || (depth0 != null ? depth0.cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cost","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"displayName","hash":{},"data":data}) : helper)));
},"8":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.methods : depth0), {"name":"each","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"9":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<label>\r\n  ";
  stack1 = ((helpers.ucCheckboxSelect2 || (depth0 && depth0.ucCheckboxSelect2) || helperMissing).call(depth0, (depth0 != null ? depth0.name : depth0), (depths[1] != null ? depths[1].selectedMethod : depths[1]), {"name":"ucCheckboxSelect2","hash":{},"fn":this.program(10, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  <span>"
    + escapeExpression(((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"displayName","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.cost || (depth0 != null ? depth0.cost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cost","hash":{},"data":data}) : helper)))
    + "</span>\r\n</label>\r\n";
},"10":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<input type=\"radio\" name=\"shipping[preference]\"\r\n                                                      class=\"inputShippingPreference\"\r\n                                                      value='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'/>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "<legend>Shipping Preference</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.noShippingMethods : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.program(3, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});



this["Ultracart"]["templates"]["shipto_address_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<label class=\"eight columns alpha omega\">\r\n  <span>Addresses on File</span>\r\n  <select id=\"storedShippingAddress\" name=\"storedShippingAddress[number]\">\r\n    <option value=\"0\"></option>\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.customerProfile : stack1)) != null ? stack1.shippingAddresses : stack1), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </select>\r\n</label>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <option value=\""
    + escapeExpression(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"oid","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.address1 || (depth0 != null ? depth0.address1 : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"address1","hash":{},"data":data}) : helper)))
    + ", "
    + escapeExpression(((helper = (helper = helpers.city || (depth0 != null ? depth0.city : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"city","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"state","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    ";
  stack1 = ((helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1) || helperMissing).call(depth0, (depth0 != null ? depth0.country : depth0), (depth0 != null ? depth0.selected : depth0), {"name":"ucSelectOption1","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.country || (depth0 != null ? depth0.country : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"country","hash":{},"data":data}) : helper)));
  },"7":function(depth0,helpers,partials,data) {
  return "<input type=\"checkbox\" id=\"shipToResidential\"\r\n                                                      name=\"shipping[isBusiness]\" value='true'/>";
  },"9":function(depth0,helpers,partials,data) {
  return "<input type=\"checkbox\" id=\"shippingIsBilling\" name=\"shipping[isBilling]\"\r\n                                                 value=\"true\"/>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<legend>Shipping Address</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.customerProfile : stack1)) != null ? stack1.shippingAddresses : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n<label class=\"name four columns alpha\">\r\n  <span>*First Name</span>\r\n  <input type=\"text\" id=\"shipToFirstName\" name=\"shipping[firstName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToFirstName : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>*Last Name</span>\r\n  <input type=\"text\" id=\"shipToLastName\" name=\"shipping[lastName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToLastName : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"company\">\r\n  <span>Company</span>\r\n  <input type=\"text\" id=\"shipToCompany\" name=\"shipping[company]\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToCompany : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>*Address 1</span>\r\n  <input type=\"text\" id=\"shipToAddress1\" name=\"shipping[address1]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToAddress1 : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>Address 2</span>\r\n  <input type=\"text\" id=\"shipToAddress2\" name=\"shipping[address2]\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToAddress2 : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*City</span>\r\n  <input type=\"text\" id=\"shipToCity\" name=\"shipping[city]\" required class=\"required\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToCity : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*State/Province/Region</span>\r\n  <input type=\"text\" id=\"shipToState\" name=\"shipping[state]\" required class=\"required\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToState : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Zip/Postal Code</span>\r\n  <input type=\"text\" id=\"shipToPostalCode\" name=\"shipping[postalCode]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToPostalCode : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Country</span>\r\n  <select name=\"shipping[country]\" id=\"shipToCountry\">\r\n    <option value=''>&nbsp;</option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.countries : depth0), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </select>\r\n</label>\r\n\r\n<br class=\"clear\">\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Email Address</span>\r\n  <input type=\"email\" id=\"email\" name=\"shipping[email]\" required class=\"required\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.email : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Phone</span>\r\n  <input type=\"text\" id=\"shipToPhone\" name=\"shipping[phone]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cart : depth0)) != null ? stack1.shipToPhone : stack1), depth0))
    + "\"/>\r\n</label>\r\n\r\n<label>\r\n  ";
  stack1 = ((helpers.ucCheckboxSelect2 || (depth0 && depth0.ucCheckboxSelect2) || helperMissing).call(depth0, (depth0 != null ? depth0.shipToResidential : depth0), true, {"name":"ucCheckboxSelect2","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n  <span class=\"bold\">This address is a business</span>\r\n</label>\r\n\r\n<label>\r\n  ";
  stack1 = ((helpers.ucCheckboxSelect1 || (depth0 && depth0.ucCheckboxSelect1) || helperMissing).call(depth0, (depth0 != null ? depth0.shippingIsBilling : depth0), {"name":"ucCheckboxSelect1","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  <span class=\"bold\">Same as Billing Address</span>\r\n</label>";
},"useData":true});



this["Ultracart"]["templates"]["subtotal_template"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<header>Subtotal</header>\r\n<div class=\"cartSubtotal\">"
    + escapeExpression(((helper = (helper = helpers.subtotal || (depth0 != null ? depth0.subtotal : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"subtotal","hash":{},"data":data}) : helper)))
    + "</div>\r\n<button type=\"button\" class=\"btnContinueShopping\">Continue Shopping</button>";
},"useData":true});



this["Ultracart"]["templates"]["summary_template"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "  <span class=\"title\">BuySafe:</span><span class=\"value\">"
    + escapeExpression(((helper = (helper = helpers.cartBondCost || (depth0 != null ? depth0.cartBondCost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cartBondCost","hash":{},"data":data}) : helper)))
    + "</span>\r\n  <br class=\"clear\">\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.buysafeBondFree : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  <br class=\"clear\">\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "\r\n  <div class=\"buySafeInfo\">\r\n    <div class=\"buySafe_button\">\r\n      <div class=\"buySafe_logo\"></div>\r\n      <div class=\"buySafe_button_info\">\r\n        <strong>YOUR PURCHASE IS GUARANTEED WITH A BOND</strong>\r\n      </div>\r\n      <div class=\"buySafe_bonded\"></div>\r\n    </div>\r\n    <div class=\"buySafe_message\"></div>\r\n    <br class=\"clear\">\r\n  </div>\r\n\r\n";
  },"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\r\n  <div class=\"buySafeInfo\">\r\n    <div class=\"buySafe_button_option\">\r\n      <div class=\"buySafe_logo_option\"></div>\r\n      <div class=\"buySafe_button_info_option\">\r\n        <strong>YOUR PURCHASE IS GUARANTEED WITH A BOND</strong>\r\n      </div>\r\n      <div class=\"buySafe_bonded_option ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.buysafeBondWanted : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\"></div>\r\n    </div>\r\n    <div class=\"buySafe_message_option\"></div>\r\n    <br class=\"clear\">\r\n  </div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.buysafeBondWanted : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.program(11, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"5":function(depth0,helpers,partials,data) {
  return " ";
  },"7":function(depth0,helpers,partials,data) {
  return "buysafe_no";
  },"9":function(depth0,helpers,partials,data) {
  return "  <p class=\"buySafeSubtext\">(Optional service click to remove)</p>\r\n";
  },"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <p class=\"buySafeSubtext\">Click to bond your purchase for only "
    + escapeExpression(((helper = (helper = helpers.buysafeBondCost || (depth0 != null ? depth0.buysafeBondCost : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"buysafeBondCost","hash":{},"data":data}) : helper)))
    + "</p>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n<span class=\"fieldTitle\">Summary</span>\r\n\r\n<div class=\"summary\">\r\n  <span class=\"title\">Subtotal:</span><span class=\"value\">"
    + escapeExpression(((helper = (helper = helpers.subtotal || (depth0 != null ? depth0.subtotal : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"subtotal","hash":{},"data":data}) : helper)))
    + "</span>\r\n  <br class=\"clear\">\r\n  <span class=\"title\">Tax:</span><span class=\"value\">"
    + escapeExpression(((helper = (helper = helpers.tax || (depth0 != null ? depth0.tax : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tax","hash":{},"data":data}) : helper)))
    + "</span>\r\n  <br class=\"clear\">\r\n  <span class=\"title\">Shipping:</span><span class=\"value\">"
    + escapeExpression(((helper = (helper = helpers.shippingHandling || (depth0 != null ? depth0.shippingHandling : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"shippingHandling","hash":{},"data":data}) : helper)))
    + "</span>\r\n  <br class=\"clear\">\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.buysafeBondAvailable : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  <span class=\"title\">Total:</span><span class=\"value\">"
    + escapeExpression(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total","hash":{},"data":data}) : helper)))
    + "</span>\r\n  <br class=\"clear\">\r\n</div>";
},"useData":true});



this["Ultracart"]["templates"]["total_template"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<button type=\"submit\" id=\"btnFinalize\">Finalize Order</button>";
  },"useData":true});