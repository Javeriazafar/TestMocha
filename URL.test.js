// Import necessary libraries
/*jshint expr: true*/

var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
//const codeToBeTested = require('../test.api');

// Import the code to be tested
var jsFile = 'D:/EslintApigee/URLtest.js';

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
var postRequestHeaders;


beforeEach(function () {
	contextGetVariableMethod = sinon.stub(context, 'getVariable');
	contextSetVariableMethod = sinon.stub(context, 'setVariable');
	//sinon.spy(object, "method") creates a spy that wraps the existing function object.method. The spy will behave exactly like the original method (including when used as a constructor)
	requestConstructor = sinon.spy(global, 'Request');
	httpClientSendMethod = sinon.stub(httpClient, 'send');
    postRequestHeaders = sinon.stub();
});

afterEach(function() {
	contextGetVariableMethod.restore();
	contextSetVariableMethod.restore();
	requestConstructor.restore();
	httpClientSendMethod.restore();
});

describe('Apigee Code', () => {
  // Define test cases
  it('should send a POST request to assign a role', async () => {
    // Stub the httpClient.send method
    
    contextGetVariableMethod.withArgs('message.content').returns(JSON.stringify({ emailId: 'example@example.com', roles: { role: [{ organization: 'org1', role: 'role1' }] } }))
    contextGetVariableMethod.withArgs('message.header.Authorization').returns('BasicAuthHeader')
    //postRequestHeaders.returns({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'BasicAuthHeader'})
    var errorThrown = false;
    try { requireUncached(jsFile);} catch (e) { errorThrown = true; }
    expect(errorThrown).to.equal(false);
    expect(httpClientSendMethod.calledOnce).to.be.true;  // true.to.be.true
    expect(requestConstructor.calledOnce).to.be.true;
    var requestConstructorArgs = requestConstructor.args[0];

		//expect(temp.args[0]).to.equal('validateResponseType.isValid');
		expect(requestConstructorArgs[0]).to.equal('http://10.21.180.112:4041/v1/organizations//userroles//users');		
		expect(requestConstructorArgs[1]).to.equal('POST');		
		expect(requestConstructorArgs[2]['Content-Type']).to.equal('application/x-www-form-urlencoded');	
    
  });

  it('should send a DELETE request to remove a role', async () => {
    // Stub the httpClient.send method
    const httpClient = {
      send: sinon.stub().returns({ isSuccess: true, getResponse: sinon.stub().returns({ status: 204 }) }),
    };

    // Set up the necessary context variables
    const context = {
      getVariable: sinon.stub()
        .withArgs('message.content').returns(JSON.stringify({ emailId: 'example@example.com', roles: { role: [{ organization: 'org1', role: 'role1' }] } }))
        .withArgs('message.header.Authorization').returns('BasicAuthHeader'),
      setVariable: sinon.stub(),
    };

    expect(httpClient.send.calledOnce).to.be.true;
    expect(httpClient.send.firstCall.args[0].url).to.equal('http://10.21.180.112:4041/v1/o/org1/userroles/role1/users/example@example.com');
    expect(httpClient.send.firstCall.args[0].method).to.equal('DELETE');
    expect(httpClient.send.firstCall.args[0].headers.Authorization).to.equal('BasicAuthHeader');
  });
});

function requireUncached(module){
	//  the require.resolve use(es) the internal require() machinery to look up the location of a module, but rather than loading the module, just return(s) the resolved filename.
    delete require.cache[require.resolve(module)];
    return require(module);
}

