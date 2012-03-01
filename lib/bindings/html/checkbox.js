/**
 * @fileOverview <p>{@link hotdrink.bindings.html.checkbox}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.checkbox");

(function () {

  var common = hotdrink.bindings.html.common;
  var valueB = hotdrink.bindings.behavior.value;
  var enableB = hotdrink.bindings.behavior.enablement;

  var write = function (view, value) {
    ASSERT(typeof value === "boolean",
      "expected boolean value for checkbox");
    //$(view).prop("checked", (value ? "checked" : undefined));
    $(view).prop("checked", value);
  };

  var onChange = function onChange(view, listener) {
    /* keyup instead of keypress, otherwise we'll read the
     * value before the user's edit. */
    $(view).bind("click keyup", listener);
  };

  var read = function (view) {
    var vv = $(view).prop("checked");
    // According to W3C standards, if the checked attribute is present, then it
    // is considered true, even if its literal value is "false". False is
    // represented by the absence of the attribute. However, not all browsers
    // respect this, so we check for truthiness.
    var mv = (vv) ? (true) : (false);
    return { value : mv };
  };

  var bind
    = common.binder(write, onChange, read, common.enable, common.disable);

  namespace.open("hotdrink.bindings.html").bindCheckbox = bind;

}());
