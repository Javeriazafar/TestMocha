/*jshint expr: true*/


var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
// require("chai").expect;
// this is the javascript file that is under test
var jsFile = '../test.api.js';

global.context = {
	getVariable: function(s) {},
	setVariable: function(s) {}
};

global.httpClient = {
	send: function(s) {}
};

global.Request = function(s) {};

var contextGetVariableMethod, contextSetVariableMethod;
var httpClientSendMethod;
var requestConstructor;

//sinon.spy --> They don’t change the functionality of your application. They simply report what they see.
//sinon.stub --> With a stub, you will actually change how functions are called in your test. You don’t want to change the subject under test, thus changing the accuracy of your test.

// add a test hook
// This method will execute before every it() method in the test
// we are stubbing all Apigee objects and the methods we need here
beforeEach(function () {
	contextGetVariableMethod = sinon.stub(context, 'getVariable');
	contextSetVariableMethod = sinon.stub(context, 'setVariable');
	//sinon.spy(object, "method") creates a spy that wraps the existing function object.method. The spy will behave exactly like the original method (including when used as a constructor)
	requestConstructor = sinon.spy(global, 'Request');
	httpClientSendMethod = sinon.spy(httpClient, 'send');
});

// restore all stubbed methods back to their original implementation
afterEach(function() {
	contextGetVariableMethod.restore();
	contextSetVariableMethod.restore();
	requestConstructor.restore();
	httpClientSendMethod.restore();
});

// // begin a test suite of one or more tests - this is the Loggly test feature here
describe('feature: Testing the Request function', function() {
	// test a functionality
	it('should log success responses correctly', function() {
		//withArgs Stubs the method only for the provided arguments.
		contextGetVariableMethod.withArgs('organization.name').returns('org1');
		contextGetVariableMethod.withArgs('environment.name').returns('env1');
		contextGetVariableMethod.withArgs('response.status.code').returns('200');



		var errorThrown = false;
		try { requireUncached(jsFile);} catch (e) { errorThrown = true; }

		expect(errorThrown).to.equal(false);
        // to test that httpClient and request method was called for the apigee.js file once 
		// calledOnce - Passes if spy was called once and only once.
		expect(httpClientSendMethod.calledOnce).to.be.true;  // true.to.be.true
		expect(requestConstructor.calledOnce).to.be.true;
		//var temp = contextSetVariableMethod.getCall(0);
		//calledOnce boolean property and the returned object’s args property.
		var requestConstructorArgs = requestConstructor.args[0];

		console.log(requestConstructorArgs);
		//expect(temp.args[0]).to.equal('validateResponseType.isValid');
		expect(requestConstructorArgs[0]).to.equal('https://loggly.com/aaa');		
		expect(requestConstructorArgs[1]).to.equal('POST');		
		expect(requestConstructorArgs[2]['Content-Type']).to.equal('application/json');		
		var logObject = JSON.parse(requestConstructorArgs[3]);

		console.log(logObject);
		expect(logObject.org).to.equal('org1');		
		expect(logObject.env).to.equal('env1');		
		expect(logObject.responseCode).to.equal(200);		
		expect(logObject.isError).to.be.false;
		expect(logObject).to.not.have.property('errorMessage');
	});


	it('should log failure responses correctly', function() {
		contextGetVariableMethod.withArgs('organization.name').returns('org1');
		contextGetVariableMethod.withArgs('environment.name').returns('env1');
		contextGetVariableMethod.withArgs('response.status.code').returns('400');
		contextGetVariableMethod.withArgs('flow.error.message').returns('this is a helpful error message');


		var errorThrown = false;
		try { requireUncached(jsFile);} catch (e) { errorThrown = true; }


		expect(errorThrown).to.equal(false);


		expect(httpClientSendMethod.calledOnce).to.be.true;
		expect(requestConstructor.calledOnce).to.be.true;
		var requestConstructorArgs = requestConstructor.args[0];
		expect(requestConstructorArgs[0]).to.equal('https://loggly.com/aaa');		
		expect(requestConstructorArgs[1]).to.equal('POST');		
		expect(requestConstructorArgs[2]['Content-Type']).to.equal('application/json');		
		var logObject = JSON.parse(requestConstructorArgs[3]);
		expect(logObject.org).to.equal('org1');		
		expect(logObject.env).to.equal('env1');		
		expect(logObject.responseCode).to.equal(400);		
		expect(logObject.isError).to.be.true;
		expect(logObject.errorMessage).to.equal('this is a helpful error message');		
	});
});

// node.js caches modules that is imported using 'require'
// this utility function prevents caching between it() functions - don't forget that variables are global in our javascript file
function requireUncached(module){
	//  the require.resolve use(es) the internal require() machinery to look up the location of a module, but rather than loading the module, just return(s) the resolved filename.
    delete require.cache[require.resolve(module)];
    return require(module);
}