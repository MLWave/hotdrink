/**
 * @fileOverview <p>{@link hotdrink.bindings.Controller}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.Controller");

(function () {

  var Controller = function Controller() {
    this.binders = {};
  };

  /* A binder takes a DOM element, a model, and some options. */
  /* @param binders Map from names to binders. */
  Controller.prototype.addBinders = function addBinders(newBinders) {
    /* TODO: Need an Object.extend */
    Object.keys(newBinders).forEach(function (name) {
      this.binders[name] = newBinders[name];
    }, this);
  };

  /* Views in all contexts should be considered of unknown type, but eligible as
   * an argument for $(). */
  Controller.prototype.bind = function bind(view, model) {
    var self = this;
    view = $(view);

    /* For each bound view, ... */
    view.each(function () {
      LOG("Trying to bind #" + $(this).attr("id"));

      /* Parse its bindings string. */
      var bindingString = $(this).attr("data-bind");
      //var bindingString = "";

      /* Credit to Knockout.js for this. */
      var functionBody = "with (model) { return ({ " + bindingString + " }); } ";
      LOG("functionBody = " + functionBody);
      try {
        var bindingMonad = new Function("model", functionBody);
      } catch (e) {
        throw new Error(
          "Error parsing bindings:\n  " + bindingString + "\n==>\n  " + e);
      }

      /* bindings is an object mapping a name of a binder to the value of its
       * options. In the context of the options:
       *
       * - Expressions have already been evaluated.
       * - A variable reference (rather than value) will be represented by its
       *   getter from the proxy. It has a member named "target" that holds the
       *   variable name.
       * - This means we cannot yet bind to an expression. To do so will require
       *   parsing the bindingString ourselves.
       */
      var bindings = bindingMonad(model.proxy());

      /* For each binding, call the named binder. */
      var elt = this;
      Object.keys(bindings).forEach(function (binderName) {
        var binder = self.binders[binderName];
        if (!binder) {
          throw new Error("No binder for " + binderName);
        }
        binder(elt, model, bindings[binderName]);
      });
    });
  };

  namespace.open("hotdrink.bindings").Controller = Controller;

}());
