 /* 
designer name:Javeria Zafar
Developer name:Javeria Zafar
Modified Date:<Date>
 */

context.setVariable('processInputRequest.isValid',false);

try {
    context.setVariable('processInputRequest.isValid',false);
} catch (error) {
    context.setVariable('vendor',defaultProvider);

}

var validate = function (context) {

    var defaultProvider = context.getVariable('GSMA-LOCAL-PROVIDER-PATH');
    
    if (defaultProvider === null || defaultProvider === "" || typeof defaultProvider === 'undefined') {
        context.setVariable('processingError.httpStatusCode', '400');
        context.setVariable('processingError.errorCode', 'GSMA-LOCAL-PROVIDER-PATH.NoOpreatorConfigured');
        context.setVariable('processingError.errorMessage', 'Invalid App configuration no subject defined');
        return;
    }

        context.setVariable('processInputRequest.isValid',true)
        context.setVariable('vendor',defaultProvider);
  
        
}

validate(context);