(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['billto_address_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<label class=\"eight columns alpha omega\">\r\n  <span>Addresses on File</span>\r\n  <select id=\"storedBillingAddress\" name=\"storedBillingAddress[number]\">\r\n    <option value=\"0\"></option>\r\n    ";
  stack1 = helpers.each.call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.customerProfile)),stack1 == null || stack1 === false ? stack1 : stack1.billingAddresses), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n      <option value=\"";
  if (helper = helpers.oid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.oid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.address1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.state) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.state); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.country), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.country), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program5(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

  buffer += "<legend>Billing Address</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.customerProfile)),stack1 == null || stack1 === false ? stack1 : stack1.billingAddresses), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>*First Name</span>\r\n  <input type=\"text\" id=\"billToFirstName\" name=\"billing[firstName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToFirstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>*Last Name</span>\r\n  <input type=\"text\" id=\"billToLastName\" name=\"billing[lastName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToLastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"company eight columns alpha\">\r\n  <span>Company</span>\r\n  <input type=\"text\" id=\"billToCompany\" name=\"billing[company]\" class=\"eight columns alpha\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToCompany)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>*Address 1</span>\r\n  <input type=\"text\" id=\"billToAddress1\" name=\"billing[address1]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToAddress1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>Address 2</span>\r\n  <input type=\"text\" id=\"billToAddress2\" name=\"billing[address2]\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToAddress2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*City</span>\r\n  <input type=\"text\" id=\"billToCity\" name=\"billing[city]\" required class=\"required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToCity)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*State/Province/Region</span>\r\n  <input type=\"text\" id=\"billToState\" name=\"billing[state]\" required class=\"required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToState)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Zip/Postal Code</span>\r\n  <input type=\"text\" id=\"billToPostalCode\" name=\"billing[postalCode]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.billToPostalCode)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns omega\">\r\n  <span>*Country</span>\r\n  <select name=\"billing[country]\" id=\"billToCountry\">\r\n    <option value=''>&nbsp;</option>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.countries), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n</script>";
  return buffer;
  });
templates['coupons_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<div class=\"couponRemove one column omega\">\r\n  <button type=\"button\" class=\"btnRemove removeCouponButton\" id='couponRemove_"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>x</button>\r\n</div>\r\n<label class=\"name four columns alpha\">\r\n  <span class=\"bold\">";
  if (helper = helpers.couponCode) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.couponCode); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n</label>\r\n<br class=\"clear\">\r\n";
  return buffer;
  }

  buffer += "<legend>Coupons</legend>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>Enter Coupon Code</span>\r\n  <input type=\"text\" id=\"couponField\"/>\r\n  <button type=\"button\" id=\"addCouponButton\">Apply</button>\r\n</label>\r\n<br class=\"clear\">\r\n\r\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.coupons), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['credentials_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\r\n  <span class=\"credentials-main-buttons four columns alpha\">\r\n    <button type=\"button\" class=\"btnLogin\" id=\"btnLoginShow\">Login</button>\r\n    <button type=\"button\" class=\"btnRegister\" id=\"btnRegisterShow\">Register</button>\r\n  </span>\r\n";
  }

function program3(depth0,data) {
  
  
  return "\r\n  <span class=\"credentials-main-buttons four columns alpha\">\r\n    <button type=\"button\" class=\"btnLogout\" id=\"btnLogoutSubmit\">Logout</button>\r\n  </span>\r\n";
  }

function program5(depth0,data) {
  
  
  return "\r\n<label class=\"login-email three columns alpha\">\r\n  <span>Email Address:</span>\r\n  <input type=\"text\" class='credentialField' id=\"loginEmail\" name=\"login[email]\" value=\"\"/>\r\n</label>\r\n<label class=\"login-password three columns alpha\">\r\n  <span>Password:</span>\r\n  <input type=\"password\" class='credentialField' id=\"loginPassword\" name=\"login[password]\" value=\"\"/>\r\n</label>\r\n  <span class=\"four columns alpha\">\r\n    <button type=\"button\" class=\"btnLogin\" id=\"btnLoginSubmit\">Login</button>\r\n    <button type=\"button\" class=\"btnCancel\">Cancel</button>\r\n  </span>\r\n";
  }

function program7(depth0,data) {
  
  
  return "\r\n<label class=\"register-email three columns alpha\">\r\n  <span>Email Address:</span>\r\n  <input type=\"text\" class='credentialField' id=\"registerEmail\" name=\"register[email]\" value=\"\"/>\r\n</label>\r\n<label class=\"register-password three columns alpha\">\r\n  <span>Password:</span>\r\n  <input type=\"password\" class='credentialField' id=\"registerPassword\" name=\"register[password]\" value=\"\"/>\r\n</label>\r\n  <span class=\"four columns alpha\">\r\n    <button type=\"button\" class=\"btnRegister\" id=\"btnRegisterSubmit\">Register</button>\r\n    <button type=\"button\" class=\"btnCancel\">Cancel</button>\r\n  </span>\r\n";
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.showButtons), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.showLogout), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.showLogin), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.showRegister), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['gift_certificate_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "Remove";
  }

function program3(depth0,data) {
  
  
  return "Apply";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<span class='giftCertificateSpan'>Amount Applied:</span><span class='giftCertificateButtonSpan'><span\r\n  class='giftCertificateSummary'>";
  if (helper = helpers.giftCertificateAmount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.giftCertificateAmount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></span>\r\n<br class=\"clear\">\r\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<span class='giftCertificateSpan'>Remaining Balance:</span><span class='giftCertificateButtonSpan'><span\r\n  class='giftCertificateSummary'>";
  if (helper = helpers.giftCertificateRemainingBalanceAfterOrder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.giftCertificateRemainingBalanceAfterOrder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></span>\r\n<br class=\"clear\">\r\n";
  return buffer;
  }

  buffer += "<legend>Gift Certificate</legend>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>Enter Gift Certificate</span>\r\n  <input type=\"text\" id=\"giftCertificateField\"/>\r\n  <button type=\"button\" id=\"updateGiftCertificateButton\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.giftCertificate), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</button>\r\n</label>\r\n<br class=\"clear\">\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasGiftCertificateAmount), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.giftCertificateRemainingBalanceAfterOrder), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['item_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n  <img src=\"";
  if (helper = helpers.imageUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imageUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"thumb\" alt=\"thumb\"/>\r\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n  <br class=\"clear\">\r\n\r\n  <div class=\"itemOption\">\r\n    <span>";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(4, program4, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "single", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "single", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(6, program6, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "fixed", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "fixed", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "multiline", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "multiline", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(10, program10, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "dropdown", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "dropdown", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(14, program14, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "radio", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "radio", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(18, program18, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "hidden", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "hidden", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucCompare || (depth0 && depth0.ucCompare),options={hash:{
    'operator': ("==")
  },inverse:self.noop,fn:self.program(20, program20, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "file attachment", options) : helperMissing.call(depth0, "ucCompare", (depth0 && depth0.type), "file attachment", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </div>\r\n  ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <input type='text' size='20' value=\"";
  if (helper = helpers.selectedValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.selectedValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class='singleQualifier'\r\n           id='singleQualifier_";
  if (helper = helpers.optionOid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.optionOid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'/>\r\n    ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <input type='text' size='20' value=\"";
  if (helper = helpers.selectedValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.selectedValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class='fixedQualifier'\r\n           id='fixedQualifier_";
  if (helper = helpers.optionOid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.optionOid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'/>\r\n    ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <textarea rows='3' cols='45' class='multiQualifier'\r\n              id='multiQualifier_";
  if (helper = helpers.optionOid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.optionOid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (helper = helpers.selectedValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.selectedValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\r\n    ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <select class='selectQualifier' id='selectQualifier_";
  if (helper = helpers.optionOid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.optionOid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\r\n      ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.values), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </select>\r\n    ";
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n      ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.value), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.value), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      ";
  return buffer;
  }
function program12(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program14(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n      <span class='radioQualifierContainer' id='radioQualifier_";
  if (helper = helpers.optionOid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.optionOid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\r\n      ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.values), {hash:{},inverse:self.noop,fn:self.programWithDepth(15, program15, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      </span>\r\n    ";
  return buffer;
  }
function program15(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n        <input type='radio' class='radioQualifier'\r\n               name='radioQualifier_"
    + escapeExpression(((stack1 = (depth1 && depth1.optionOid)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'\r\n              ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.selected), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n              value='";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'/> ";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<br/>\r\n      ";
  return buffer;
  }
function program16(depth0,data) {
  
  
  return " checked='checked' ";
  }

function program18(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<em>unsupported option type</em>\r\n    <input type='hidden' value=\"";
  if (helper = helpers.selectedValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.selectedValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class='hiddenQualifier' id='hiddenQualifier_";
  if (helper = helpers.optionOid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.optionOid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'/>\r\n    ";
  return buffer;
  }

function program20(depth0,data) {
  
  
  return "<em>unsupported option type</em>";
  }

  buffer += "<!-- the surrounding div tag for this item is created within the backbone view code. -->\r\n<div class=\"itemRemove one column omega\">\r\n  <button type=\"button\" class=\"btnRemove\">x</button>\r\n</div>\r\n<div class=\"itemInfo nine columns alpha\">\r\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.imageUrl), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <span class=\"itemName\">";
  if (helper = helpers.itemId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.itemId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><br>\r\n\r\n  <div class=\"itemAmount\">";
  if (helper = helpers.unitCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.unitCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n  <br>I\r\n  <div class=\"itemDescription\">\r\n    <p>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n  </div>\r\n\r\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n</div>\r\n<div class=\"itemQuantity two columns omega\">\r\n  <input type=\"number\" class=\"itemQty\" name=\"items[";
  if (helper = helpers.position) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.position); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "].quantity\" value=\"";
  if (helper = helpers.quantity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.quantity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" maxlength=\"5\"/>\r\n</div>\r\n<br class=\"clear\">";
  return buffer;
  });
templates['items_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.stillLoading), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\r\nLoading shopping cart. Please wait...\r\n";
  }

function program4(depth0,data) {
  
  
  return "\r\nYour cart is empty, good sir.\r\n";
  }

function program6(depth0,data) {
  
  
  return "\r\n<header>\r\n  <div class=\"itemInfo offset-by-one nine columns alpha\">Item</div>\r\n  <div class=\"itemQuantity two columns omega\">Qty</div>\r\n</header>\r\n\r\n<!-- individual items will be inserted here by the view code -->\r\n<footer class=\"twelve columns alpha omega\">\r\n  <!--<button type=\"button\" class=\"btnCartUpdate\">Update</button>-->\r\n</footer>\r\n";
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.noItems), {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['payment_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<label class=\"sixteen columns alpha\">\r\n  <span>Select a card on File</span>\r\n  <select id=\"customerProfileCreditCardId\" name=\"creditCard[customerProfileCreditCardId]\">\r\n    <option value=\"0\"></option>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.storedCards), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n\r\n<label class=\"sixteen columns alpha\">\r\n  <span>or enter a new card:</span>\r\n</label>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n      ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.id), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.id), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  if (helper = helpers.cardType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cardType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.cardNumber) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cardNumber); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.status) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.status); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.card), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.card), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program6(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.card) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.card); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.month), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.month), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program9(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.year), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.year), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program12(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.year) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.year); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program14(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n<label class=\"sixteen columns alpha\">\r\n  <span>\r\n    ";
  stack1 = (helper = helpers.ucCheckboxSelect2 || (depth0 && depth0.ucCheckboxSelect2),options={hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.storeCreditCard), true, options) : helperMissing.call(depth0, "ucCheckboxSelect2", ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.storeCreditCard), true, options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    save this card for future use\r\n  </span>\r\n</label>\r\n\r\n";
  return buffer;
  }
function program15(depth0,data) {
  
  
  return "<input type=\"checkbox\" id=\"storeCreditCard\"\r\n                                                        name=\"creditCard[storeCreditCard]\" value='true'/>";
  }

  buffer += "<legend>Payment Information</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.storedCards), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n\r\n<label class=\"three columns alpha\">\r\n  <span>Credit Card Type</span>\r\n  <select id=\"creditCardType\" name=\"creditCard[creditCardType]\" required class=\"required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.creditCardType)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    <option value=\"\">-</option>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.ccTypes), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>Credit Card #</span>\r\n  <input type=\"text\" id=\"creditCardNumber\" name=\"creditCard[number]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.creditCardNumber)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"two columns alpha\">\r\n  <span>Expiration Date</span>\r\n  <br class=\"clear\">\r\n\r\n  <select id=\"creditCardExpirationMonth\" name=\"creditCard[expMonth]\" class=\"two columns alpha\">\r\n    <option value=\"0\">Month</option>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.ccMonths), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n\r\n<label class=\"two columns alpha\">\r\n  <span>&nbsp;</span>\r\n  <br class=\"clear\">\r\n\r\n  <select id=\"creditCardExpirationYear\" name=\"creditCard[expYear]\" class=\"two columns alpha\">\r\n    <option value=\"0\">Year</option>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.ccYears), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n\r\n<label class=\"five columns alpha\">\r\n  <span>Card Verification #</span>\r\n  <br class=\"clear\">\r\n  <input type=\"number\" id=\"creditCardVerificationNumber\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.creditCardVerificationNumber)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\r\n         name=\"creditCard[verification]\" required\r\n         class=\"required one column alpha\"/>\r\n  <span class=\"ccv-help-link\">help finding this number</span>\r\n  <br class=\"clear\">\r\n\r\n  <div class=\"ccv_message\"></div>\r\n\r\n</label>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.loggedIn), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['paypal_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n      <span class='paypal_link fake_hyper'>\r\n        <img src=\"";
  if (helper = helpers.button) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.button); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt='";
  if (helper = helpers.alt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.alt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'/>\r\n      </span>\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.paypal), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['shipping_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\r\nNo available shipping methods found.\r\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.showDropdown), {hash:{},inverse:self.program(8, program8, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<select class='selectShippingPreference' name=\"shipping[preference]\">\r\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.methods), {hash:{},inverse:self.noop,fn:self.programWithDepth(5, program5, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</select>\r\n";
  return buffer;
  }
function program5(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n  ";
  stack1 = (helper = helpers.ucSelectOption2 || (depth0 && depth0.ucSelectOption2),options={hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.name), (depth1 && depth1.selectedMethod), options) : helperMissing.call(depth0, "ucSelectOption2", (depth0 && depth0.name), (depth1 && depth1.selectedMethod), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  if (helper = helpers.cost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.methods), {hash:{},inverse:self.noop,fn:self.programWithDepth(9, program9, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program9(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n<label>\r\n  ";
  stack1 = (helper = helpers.ucCheckboxSelect2 || (depth0 && depth0.ucCheckboxSelect2),options={hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.name), (depth1 && depth1.selectedMethod), options) : helperMissing.call(depth0, "ucCheckboxSelect2", (depth0 && depth0.name), (depth1 && depth1.selectedMethod), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <span>";
  if (helper = helpers.displayName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.displayName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.cost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n</label>\r\n";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<input type=\"radio\" name=\"shipping[preference]\"\r\n                                                      class=\"inputShippingPreference\"\r\n                                                      value='";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'/>";
  return buffer;
  }

  buffer += "<legend>Shipping Preference</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.noShippingMethods), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['shipto_address_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<label class=\"eight columns alpha omega\">\r\n  <span>Addresses on File</span>\r\n  <select id=\"storedShippingAddress\" name=\"storedShippingAddress[number]\">\r\n    <option value=\"0\"></option>\r\n    ";
  stack1 = helpers.each.call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.customerProfile)),stack1 == null || stack1 === false ? stack1 : stack1.shippingAddresses), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <option value=\"";
  if (helper = helpers.oid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.oid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.address1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.state) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.state); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n    ";
  stack1 = (helper = helpers.ucSelectOption1 || (depth0 && depth0.ucSelectOption1),options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.country), (depth0 && depth0.selected), options) : helperMissing.call(depth0, "ucSelectOption1", (depth0 && depth0.country), (depth0 && depth0.selected), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    ";
  return buffer;
  }
function program5(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program7(depth0,data) {
  
  
  return "<input type=\"checkbox\" id=\"shipToResidential\"\r\n                                                      name=\"shipping[isBusiness]\" value='true'/>";
  }

function program9(depth0,data) {
  
  
  return "<input type=\"checkbox\" id=\"shippingIsBilling\" name=\"shipping[isBilling]\"\r\n                                                 value=\"true\"/>";
  }

  buffer += "<legend>Shipping Address</legend>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.customerProfile)),stack1 == null || stack1 === false ? stack1 : stack1.shippingAddresses), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>*First Name</span>\r\n  <input type=\"text\" id=\"shipToFirstName\" name=\"shipping[firstName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToFirstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"name four columns alpha\">\r\n  <span>*Last Name</span>\r\n  <input type=\"text\" id=\"shipToLastName\" name=\"shipping[lastName]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToLastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"company\">\r\n  <span>Company</span>\r\n  <input type=\"text\" id=\"shipToCompany\" name=\"shipping[company]\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToCompany)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>*Address 1</span>\r\n  <input type=\"text\" id=\"shipToAddress1\" name=\"shipping[address1]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToAddress1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"address four columns alpha\">\r\n  <span>Address 2</span>\r\n  <input type=\"text\" id=\"shipToAddress2\" name=\"shipping[address2]\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToAddress2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*City</span>\r\n  <input type=\"text\" id=\"shipToCity\" name=\"shipping[city]\" required class=\"required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToCity)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*State/Province/Region</span>\r\n  <input type=\"text\" id=\"shipToState\" name=\"shipping[state]\" required class=\"required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToState)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Zip/Postal Code</span>\r\n  <input type=\"text\" id=\"shipToPostalCode\" name=\"shipping[postalCode]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToPostalCode)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Country</span>\r\n  <select name=\"shipping[country]\" id=\"shipToCountry\">\r\n    <option value=''>&nbsp;</option>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.countries), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  </select>\r\n</label>\r\n\r\n<br class=\"clear\">\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Email Address</span>\r\n  <input type=\"email\" id=\"email\" name=\"shipping[email]\" required class=\"required\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label class=\"four columns alpha\">\r\n  <span>*Phone</span>\r\n  <input type=\"text\" id=\"shipToPhone\" name=\"shipping[phone]\" required class=\"required\"\r\n         value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.cart)),stack1 == null || stack1 === false ? stack1 : stack1.shipToPhone)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n</label>\r\n\r\n<label>\r\n  ";
  stack1 = (helper = helpers.ucCheckboxSelect2 || (depth0 && depth0.ucCheckboxSelect2),options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.shipToResidential), true, options) : helperMissing.call(depth0, "ucCheckboxSelect2", (depth0 && depth0.shipToResidential), true, options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <span class=\"bold\">This address is a business</span>\r\n</label>\r\n\r\n<label>\r\n  ";
  stack1 = (helper = helpers.ucCheckboxSelect1 || (depth0 && depth0.ucCheckboxSelect1),options={hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.shippingIsBilling), options) : helperMissing.call(depth0, "ucCheckboxSelect1", (depth0 && depth0.shippingIsBilling), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <span class=\"bold\">Same as Billing Address</span>\r\n</label>";
  return buffer;
  });
templates['subtotal_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>Subtotal</header>\r\n<div class=\"cartSubtotal\">";
  if (helper = helpers.subtotal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtotal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n<button type=\"button\" class=\"btnContinueShopping\">Continue Shopping</button>";
  return buffer;
  });
templates['summary_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n  <span class=\"title\">BuySafe:</span><span class=\"value\">";
  if (helper = helpers.cartBondCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cartBondCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n  <br class=\"clear\">\r\n\r\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.buysafeBondFree), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n  <br class=\"clear\">\r\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\r\n\r\n  <div class=\"buySafeInfo\">\r\n    <div class=\"buySafe_button\">\r\n      <div class=\"buySafe_logo\"></div>\r\n      <div class=\"buySafe_button_info\">\r\n        <strong>YOUR PURCHASE IS GUARANTEED WITH A BOND</strong>\r\n      </div>\r\n      <div class=\"buySafe_bonded\"></div>\r\n    </div>\r\n    <div class=\"buySafe_message\"></div>\r\n    <br class=\"clear\">\r\n  </div>\r\n\r\n  ";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n\r\n  <div class=\"buySafeInfo\">\r\n    <div class=\"buySafe_button_option\">\r\n      <div class=\"buySafe_logo_option\"></div>\r\n      <div class=\"buySafe_button_info_option\">\r\n        <strong>YOUR PURCHASE IS GUARANTEED WITH A BOND</strong>\r\n      </div>\r\n      <div class=\"buySafe_bonded_option ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.buysafeBondWanted), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"></div>\r\n    </div>\r\n    <div class=\"buySafe_message_option\"></div>\r\n    <br class=\"clear\">\r\n  </div>\r\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.buysafeBondWanted), {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n  ";
  return buffer;
  }
function program5(depth0,data) {
  
  
  return " ";
  }

function program7(depth0,data) {
  
  
  return "buysafe_no";
  }

function program9(depth0,data) {
  
  
  return "\r\n  <p class=\"buySafeSubtext\">(Optional service click to remove)</p>\r\n  ";
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n  <p class=\"buySafeSubtext\">Click to bond your purchase for only ";
  if (helper = helpers.buysafeBondCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.buysafeBondCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n  ";
  return buffer;
  }

  buffer += "\r\n<span class=\"fieldTitle\">Summary</span>\r\n\r\n<div class=\"summary\">\r\n  <span class=\"title\">Subtotal:</span><span class=\"value\">";
  if (helper = helpers.subtotal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtotal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n  <br class=\"clear\">\r\n  <span class=\"title\">Tax:</span><span class=\"value\">";
  if (helper = helpers.tax) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tax); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n  <br class=\"clear\">\r\n  <span class=\"title\">Shipping:</span><span class=\"value\">";
  if (helper = helpers.shippingHandling) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.shippingHandling); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n  <br class=\"clear\">\r\n\r\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.buysafeBondAvailable), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n  <span class=\"title\">Total:</span><span class=\"value\">";
  if (helper = helpers.total) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.total); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n  <br class=\"clear\">\r\n</div>";
  return buffer;
  });
templates['total_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<button type=\"submit\" id=\"btnFinalize\">Finalize Order</button>";
  });
})();