if (typeof String.prototype.trim === 'undefined') {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
if (typeof String.prototype.startsWith === 'undefined') {
  String.prototype.startsWith = function (str) {
    return (this.indexOf(str) === 0);
  };
}
if (typeof String.prototype.endsWith === 'undefined') {
  String.prototype.endsWith = function (str) {
    return (this.length - str.length) == this.lastIndexOf(str);
  }
}


// =================================================
// --- We make 'uc' our global space.
// =================================================
var uc = {
  models: {},
  collections: {},
  commonFunctions: {},
  views: {}
};


// this is a model which will reside within a nested collection.  it should not perform client/server operations.
uc.models.NestedModel = Backbone.Model.extend({
  'fetch': function () {
    throw "This model is a nested Model.  fetch() should not be called.  The top level object will handle fetching.";
  },
  'save': function () {
    throw "This model is a nested Model.  save() should not be called.  the top level object will will handle persistence.";
  }
});

// notice that Cart is a DeepModel (https://github.com/powmedia/backbone-deep-model)
// notice that Cart uses nestCollection for the items array
uc.models.DeepAndNestedModel = Backbone.DeepModel.extend({
  'nested': [],

  'initialize': function () {

    // create a top level property that points to each nested collection.  This top level property will be the means
    // of tying views to the nested collection.
    var thisModel = this;
    _.each(this.nested, function (nest) {
      thisModel[nest.attributeName] = nest.collection.link(thisModel, nest.attributeName);
    });

//    var itemCollection = new app.collections.Items();
//    this.items = itemCollection.link(this, 'items');
  },

  clear: function (options) {
    var thisModel = this;
    _.each(this.nested, function (nest) {
      thisModel[nest.attributeName].reset();
    });

    (options || (options = {})).unset = true;
    return this.set(_.clone(this.attributes), options);
  },


  set: function (attributes, options) {
    // 1. do not allow deep-model sets to nested attributes.  that will mess things up.
    // 2. after setting attributes, scan for nested ones and call reset on the nested collection so it will update.


    // deep model will try to handle deep linking, but we need to intercept that and disallow that.  Implementations
    // should be setting the entire attribute, not deep linking.  If a deep property needs to be changed, that should
    // be done through the nested collection.
    var that = this;
    _.each(this.nested, function (nest) {
      if (_.any(_.keys(attributes), function (attributeName) {
        return attributeName.startsWith(nest.attributeName + '.');
      })) {
        throw nest.attributeName + " must not be updated via deep-model sets().  access it through its collection interface.";
      }
    });

    // should this be Backbone.Model.prototype or Backbone.DeepModel.prototype??
    var result = Backbone.DeepModel.prototype.set.call(this, attributes, options);
    _.each(this.nested, function (nest) {

      // if a nested collection is part of the 'set' data, reset the nested collection
      if (attributes[nest.attributeName]) {
        var nestedList = attributes[nest.attributeName];
        that[nest.attributeName].reset(that, nest.attributeName, nestedList);
      }
    });


    return result;
  }

});


uc.collections.NestedCollection = Backbone.Collection.extend({
  'fetch': function () {
    throw "This collection is a NestedCollection.  fetch() should not be called.  The parent item will handle fetching.";
  },
  'save': function () {
    throw "This collection is a NestedCollection.  save() should not be called.  The parent item will handle persistence.";
  },

  // this is very similar to the reset function found in the backbone source, however, this function accepts
  // an array of *data*, not *models*.  The models are created here and passed to the add function.  This is done
  // so I could call reset and pass it my parent collection's property, which is an array of normal objects, not models.
  'reset': function (parentModel, attributeName, options) {

    options || (options = {});
    if (parentModel) {
      // init the attribute if it doesn't exist yet.  if it doesn't, why is reset being called??
      if (!parentModel.get(attributeName)) {
        parentModel.attributes[attributeName] = [];
      }


      var models = [];
      for (var j = 0, len = parentModel.attributes[attributeName].length; j < len; j++) {
        // copy the values
        var model = new this.model(parentModel.attributes[attributeName][j]);
        // now create linking to the newly copied values.
        parentModel.attributes[attributeName][j] = model.attributes;

        models.push(model);
      }


      this._reset();
      this.add(models, _.extend({silent: true}, options));

    } else {
      this._reset();
    }

    if (!options.silent) this.trigger('reset', this, options);
    return this;
  },

  // We took this code from a comment here: https://gist.github.com/1610397
  // It's purpose is to handle nested collections gracefully.
  'link': function (parentModel, attributeName) {
    // init the attribute if it doesn't exist yet.
    if (!parentModel.get(attributeName)) {
      parentModel.attributes[attributeName] = [];
    }

    //setup nested references
    for (var i = 0; i < this.length; i++) {
      parentModel.attributes[attributeName][i] = this.at(i).attributes;
    }

    this.on('add', function (theAddedModel) {
      // if the parent model doesn't have the attribute yet, add it with a default of an empty array.
      if (!parentModel.get(attributeName)) {
        parentModel.attributes[attributeName] = [];
      }
      // add a placeholder to the parent's array, which I then overwrite with a link to this model's attributes.
      parentModel.get(attributeName).push({});

      // link the newly added array element to the new added model attributes.
      var idx = parentModel.get(attributeName).length - 1;
      parentModel.attributes[attributeName][idx] = theAddedModel.attributes;

    });

    // when a value is deleted from the nested collection, update the parent array.
    // this is done by filtering out the object with the matching id, leaving us with all the rest.
    this.on('remove', function (theDeletedModel) {
      var updateObj = {};
      var sourceArray = parentModel.get(attributeName);
      var idAttribute = theDeletedModel.idAttribute;

      // the raw model doesn't have any notion of cid, since it's not an array of backbone models,
      // so we must delete by id.
      for (var j = 0; j < sourceArray.length; j++) {
        if (sourceArray[j][idAttribute] == theDeletedModel.id) {
          sourceArray.splice(j, 1); // remove the deleted model.
          break;
        }
      }
    });

    return this;
  }

});


uc.collections.PagedCollection = Backbone.Collection.extend({

  pageSize: 0,
  pageNumber: 0,
  totalPages: 0,
  totalRecords: 0,
  queryParameters: {},
  paginationParameters: {'pageSize': 'pageSize', 'pageNumber': 'pageNumber'},
  paginationHeaders: {'pageSize': 'uc-pagination-page-size', 'pageNumber': 'uc-pagination-page-number', 'totalPages': 'uc-pagination-total-pages', 'totalRecords': 'uc-pagination-total-records'},

  'initialize': function () {
    var _url = this.url;
    this.url = function () {
      var pagedUrl = _.isFunction(_url) ? _url() : _url;
      if (this.queryParameters) {
        pagedUrl += '?' + jQuery.param(this.queryParameters);
      }
      return pagedUrl;
    }
  },

  'parse': function (resp, xhr) {

    // check for the 3 pagination headers.
    var pageSize = parseInt(xhr.getResponseHeader(this.paginationHeaders['pageSize']), 10);
    if (isNaN(pageSize)) {
      pageSize = 0;
    }
    this.pageSize = pageSize;

    var pageNumber = parseInt(xhr.getResponseHeader(this.paginationHeaders['pageNumber']), 10);
    if (isNaN(pageNumber)) {
      pageNumber = 0;
    }
    this.pageNumber = pageNumber;

    var totalPages = parseInt(xhr.getResponseHeader(this.paginationHeaders['totalPages']), 10);
    if (isNaN(totalPages)) {
      totalPages = 0;
    }
    this.totalPages = totalPages;

    var totalRecords = parseInt(xhr.getResponseHeader(this.paginationHeaders['totalRecords']), 10);
    if (isNaN(totalRecords)) {
      totalRecords = 0;
    }
    this.totalRecords = totalRecords;


    return resp; // this single line is the default behavior.  everything above is custom page code.
  },

  'hasNext': function () {
    return this.totalPages && this.pageNumber && this.pageNumber < this.totalPages;
  },

  'hasPrev': function () {
    return this.pageNumber && this.pageNumber > 1;
  },

  'nextPage': function () {
    this.queryParameters[this.paginationParameters['pageNumber']] = this.pageNumber + 1;
    this.fetch();
  },

  'prevPage': function () {
    this.queryParameters[this.paginationParameters['pageNumber']] = this.pageNumber - 1;
    this.fetch();
  },

  'gotoPage': function (pageNo) {
    this.queryParameters[this.paginationParameters['pageNumber']] = pageNo;
    this.fetch();
  }



});


/**
 * this method creates/returns a method. The returned method is hardcoded to do content switching on a particular panel
 * in the application.  The showView(view) method will be used often throughout this application to ensure that when
 * content is being updated, the old content is unbound from any event handlers to avoid zombie events.  Think of it
 * like a programming 'destructor' that frees up event binding.
 * @param pane an html element (using a div) id that is used to update content.
 */
//TODO - this should not be a global function.
function createAppView(pane) {
  // notice!  the return value is a new function that is hardwired to operate on whatever element id is passed in.
  return new function () {
    var that = {};
    that.showView = function (view, modal, title, width) {
      if (this.currentView) {
        this.currentView.close();
      }

      this.currentView = view;
      this.currentView.render();

      if (modal) {
        ucLoadPopup2(
                {container: 'modalAppView',
                  title: title,
                  css: {'width': width},
                  content: this.currentView.el,
                  alwaysNew: true
                });
      } else {
        jQuery("#" + pane).html(this.currentView.el);
      }
    };

    that.clearView = function () {
      if (this.currentView) {
        this.currentView.close();
      }

      jQuery("#" + pane).html('');
    };

    return that;
  };
}


// add a close method to the view that does remove AND unbind.  unbind only does dom.
// this is required for the AppView methods above to work, since they call this close() method to clean up bound events
Backbone.View.prototype.close = function () {
  this.remove();
  this.unbind();
  // we'll also need to unbind from the model or collection, but that must be done individually.
  // so if the view has 'onClose' stubbed, call that too.
  if (this.onClose) {
    this.onClose();
  }
};


// ---------------------------------------------------------------------
// --- common functions
// ---------------------------------------------------------------------
uc.commonFunctions.setTabIndexes = function () {
  jQuery(':enabled:visible').each(function (i, e) {
    jQuery(e).attr('tabindex', i);
  });
};


uc.commonFunctions.startPleaseWait = function (msg) {
  var html = "<div class='spaced-div center'>Please be patient.  This operation takes a long time.<br/><span class='ucPleaseWaitMsg'>"
          + (msg ? msg : "The page will refresh when finished.")
          + "</span><br /><img src='/js/jquery.smallhbar.indicator.gif' class='ajaxBusy' alt='busy, please wait'/></div>";
  var title = 'Please Wait';
  ucLoadPopup2(
          {container: 'pleaseWaitDiv',
            title: title,
            css: {'width': '400px'},
            content: html,
            alwaysNew: true
          });
};
uc.commonFunctions.endPleaseWait = function () {
  ucDisablePopup2('pleaseWaitDiv');
};


/**
 * This is a really useful function for extracting an oid from an html element id. For example, if you have a lot
 * of with this kind of id:   'checkbox{{oid}}', then this method can return that oid.
 * So, an id of 'salesCb1024' will return 1024
 * @param id the full html element id
 * @param prefix the prefix of characters before the oid
 */
uc.commonFunctions.parseOidFromId = function (id, prefix) {
  return id.substring(prefix.length);
};


/**
 * returns an array of items based on the supplied item ids
 * @param ids
 * @return an array of itemVO
 */
uc.commonFunctions.getItemsById = function (ids, getCompleteItem) {
  var itemStr = (typeof ids === 'string' ? ids : ids.join(','));
  var filter = getCompleteItem ? '' : '&_detail=description';
  var queryString = 'id=' + encodeURIComponent(itemStr) + filter;
  var response = [];
  jQuery.ajax({
    url: '/rest/merchant/items',
    data: queryString,
    type: 'GET',
    async: false,
    dataType: 'json'
  }).done(function (data) {
            response = data;
          });
  return response;
};

/**
 * returns a hash!!
 * @param oids an array of merchant item oids
 * @return a hash of (itemId:itemVo)
 */
uc.commonFunctions.getItemsByOid = function (oids) {
  var queryString = '_detail=description&oid=' + encodeURIComponent(oids.join(','));
  var response = {};
  jQuery.ajax({
    url: '/rest/merchant/items',
    data: queryString,
    type: 'GET',
    async: false,
    dataType: 'json'
  }).done(function (data) {
            _.each(data, function (item) {
              response[item.merchantItemOid] = item;
            });
          });
  return response;
};

/**
 * retrieves a customer or null if not found, and passes it to the callback.
 * if callback is null, the method runs synchronous and returns back the customer.
 * @param id either the customer oid or email address.  either works
 * @param callback function that accepts the customer object
 * @return nothing
 */
uc.commonFunctions.getCustomer = function (id, callback) {
  var response = null;
  jQuery.ajax({
    url: '/rest/merchant/customers/' + id,
    type: 'GET',
    async: (callback ? true : false),
    dataType: 'json'
  }).done(
          function (data) {
            if (callback) {
              callback(data);
            } else {
              response = data;
            }
          }).fail(function () {
            if (callback) {
              callback(null);
            }
          });
  return response;
};


/**
 *
 * constructor variables needed:
 * template: variable of an already compiled handlebars template
 * context: any context variables
 * className: class for the top level div.
 */
uc.views.GenericBoundView = Backbone.View.extend({
  _modelBinder: undefined,
  events: {
    "focus input[type=text]": "selectText"
  },

  'onClose': function () {
    this._modelBinder.unbind();
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if (arguments && arguments.length) {
      this.options = arguments[0];
    }

    this._modelBinder = new Backbone.ModelBinder();
    _.bindAll(this);
    if (this.options) {
      if (this.options.functions) {
        _.extend(this, this.options.functions);
      }
      if (this.options.events) {
        this.delegateEvents(this.options.events);
      }
    }
  },

  render: function () {
    this.$el.html(this.options.template(this.options.context));
    this._modelBinder.bind(this.model, this.el);
    if (this.options.clazz) {
      this.$el.addClass(this.options.clazz);
    }
    return this;
  },

  selectText: function (event) {
    jQuery(event.target).select();
  }


});
