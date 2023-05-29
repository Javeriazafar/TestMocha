const assert = require("assert");
const greeter = require("../sinon");
const sinon = require("sinon");

describe("testing the greeter", function() {
  it("checks the greet function", function() {
    var clock = sinon.useFakeTimers(new Date(2021, 0, 15));
    assert.equal(greeter.greet('Alice'), 'Hello, Alice! Today is Friday, January 15, 2021');
    clock.restore();
  });
});