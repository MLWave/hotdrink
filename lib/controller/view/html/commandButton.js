/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.commandButton}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.commandButton");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var button = "<p><button type=\"button\" id=\"" + id + "\">"
               + tree.options.label + "</button></p>";
    tree.html = { box : button };
  };

  var onChange = function (view, listener) {
    common.addListener1(view.elts, ["click"], listener);
  };

  var read = function (view) {
    alert("You synthesized the parameters\n" + view.elts.value);
  };

  var write = function (view, value) {
    view.elts.value = Object.toJSON(value);
  };

  var CommandButtonController = Class.create(common.ViewController,
    common.singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindRead(this, onChange, read, model, options.value);
        valueB.bindWrite(model, options.value, write, this);
      }
    }
  });

  namespace.extend("hotdrink.controller.view.html.commandButton", {
    compile : compile,
    Controller : CommandButtonController
  });

}());
