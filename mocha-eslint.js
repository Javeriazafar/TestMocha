/*jshint expr: true*/

var expect = require('chai').expect;
const fs = require('fs');
const fp = 'D:/EslintApigee/apigee.js';

var filedata = fs.readFileSync(fp,'utf8')
var designername = filedata.trim().split('\n')[1];
var devname = filedata.trim().split('\n')[2];
var datemodified = filedata.trim().split('\n')[3];

// // begin a test suite of one or more tests - this is the Loggly test feature here
describe('feature: Testing the Request function', function() {
	// test a functionality
	it('should log success responses correctly', function() {
		//withArgs Stubs the method only for the provided arguments.
		expect(designername.toLowerCase()).to.include('designer name','Please add designer details')
		expect(devname.toLowerCase()).to.include('developer name','Please add developer details')
		expect(datemodified.toLowerCase()).to.include('modified date','Please add the date of modification of the file ')

		expect(filedata).to.include('try','Please use a try catch block to follow the standards')
		
		//expect(temp.args[0]).to.equal('processInputRequest.isValid','Please follow the standard naming convention for the  error flag');
		
	});


});

