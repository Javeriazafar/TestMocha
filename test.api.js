try {
	var responseCode = parseInt(context.getVariable('response.status.code'));
	context.setVariable('validateResponseType.isValid',false);

	var myData = {
		org: context.getVariable('organization.name'),
		env: context.getVariable('environment.name'),
		responseCode: responseCode,
		isError: (responseCode >= 400)
	};

	if (myData.isError) {
		myData.errorMessage = context.getVariable('flow.error.message');
	}

	var myDataRequest = new Request(
			'https://loggly.com/aaa', 
			'POST', 
			{'Content-Type': 'application/json'}, 
			JSON.stringify(myData)
	);
	httpClient.send(myDataRequest);
} catch (e) {}