/**
 * @fileOverview <p>{@link hotdrink.ModelFactory}</p>
 * @author John Freeman
 */

//provides("hotdrink.ModelFactory");

(function () {

  var ModelFactory = function () {
    this.cgraph = { variables : {}, methods : {}, constraints : {} };
    this.vid = 0;
    this.mid = 0;
    this.cid = 0;
  };

  var fnOnly = function (fnOrExpr) {
    var fn = fnOrExpr;
    if (typeof fnOrExpr === "string") {
      fn = new Function("model", "return (" + fnOrExpr + ");");
    } else {
      ASSERT(typeof fnOrExpr === "function",
        "expected function or expression");
    }
    return fn;
  };

  ModelFactory.prototype = {

    makeVariableName : function () {
      return "__variable" + (this.vid++);
    },
    makeVariable : function (v, cellType) {
      return this.cgraph.variables[v] = { cellType : cellType, usedBy : [] };
    },

    /**
     * Initializer optional. All expressions should be strings with variable
     * references in the form of "model.get(v)".
     */
    addInterface : function (v, initializer) {
      var vv = this.makeVariable(v, "interface");
      if (initializer) {
        vv.initializer = fnOnly(initializer);
      }
    },
    addInput : function (v, initializer) {
      var vv = this.makeVariable(v, "input");
      if (initializer) {
        vv.initializer = fnOnly(initializer);
      }
    },
    /* Initializer is required for constants. */
    addConstant : function (v, initializer) {
      var vv = this.makeVariable(v, "input");
      vv.initializer = fnOnly(initializer);
    },

    addSink : function (v, cellType, body, inputs) {
      if (!Array.isArray(inputs)) {
        inputs = [];
      }
      var vv = this.makeVariable(v, cellType);
      var m = this.addMethod([v], body, inputs);
      this.addConstraint(m);
      return v;
    },
    addExpression : function (v, body, inputs) {
      return this.addSink(v, "logic", body, inputs);
    },
    addInvariant : function (v, body, inputs) {
      return this.addSink(v, "invariant", body, inputs);
    },
    addOutput : function (v, body, inputs) {
      return this.addSink(v, "output", body, inputs);
    },

    makeMethodName : function () {
      return "__method" + (this.mid++);
    },
    addMethod : function (outputs, body, inputs) {
      /* Special case for single output. */
      if (typeof outputs === "string") {
        outputs = [outputs];
      }

      var m = this.makeMethodName();

      var execute = fnOnly(body);

      this.cgraph.methods[m] = {
        inputs : inputs,
        outputs : outputs,
        execute : execute
      };

      inputs.forEach(function (v) {
        this.cgraph.variables[v].usedBy.push(m);
      }, this);

      return m;
    },

    makeConstraintName : function () {
      return "__constraint" + (this.cid++);
    },
    addConstraint : function (/*...*/) {
      var ms = Array.prototype.slice.call(arguments);
      var c = this.makeConstraintName();
      this.cgraph.constraints[c] = { methods : ms };
    },

    close : function (inputs) {
      if (typeof inputs !== "object") {
        inputs = {};
      }

      Object.keys(inputs).forEach(function (v) {
        var vv = this.cgraph.variables[v];
        ASSERT(vv.cellType === "input",
          "pass initializers only for input variables");
        var expr = Object.toJSON(inputs[v]);
        ASSERT(typeof expr === "string",
          "expected expression for initializer");
        var initializer = new Function("model", "return (" + expr + ");");
        ASSERT(typeof initializer === "function",
          "invalid syntax in initializer for \"" + v + "\".");
        vv.initializer = initializer;
      }, this);

      var model = new hotdrink.Model(this.cgraph);
      var modelController = new hotdrink.controller.ModelController(model);

      return modelController;
    }

  };

  namespace.open("hotdrink").makeModelFactory
    = function () { return new ModelFactory(); };

}());
