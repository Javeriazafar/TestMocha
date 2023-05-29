var requestbody = context.getVariable("message.content");
try {


    var assignRoleRequest = new Request("http://10.21.180.112:4041/v1/organizations/"+"/userroles/"+"/users","POST", { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'basicAuth'}, "id=example@example.com");    
                var addReq = httpClient.send(assignRoleRequest);
    if(requestbody !== null){
        var requestbody = JSON.parse(context.getVariable("message.content"));
        var email = requestbody.emailId;
        var len = requestbody.roles.role.length;
        
        const action = [];
        const role_name = [];
        const org_name = [];
        const obj = [];
        var removeAction = 0;
        var addAction = 0;
        
        for(var i=0; i<(len); i++){
            obj[i] = requestbody.roles.role[i];
            for(var key in obj[i]){
                    if(key !== 'organization'){
                    role_name.push([key]);
                    action.push([obj[i][key]]);
                    action[i] = action[i].toString().toLowerCase();
                    if(action[i]=='remove'){
                        removeAction++;
                    }
                    if(action[i] =='add'){
                        addAction++;
                    }
                }
            }
            org_name[i] =  requestbody.roles.role[i].organization;
        }
        
        var responseCount =0;
        var assignRoleStatus = 0;
        var removeRoleStatus = 0;
        var success = 0;
        var unauthorized = 0;
        
        var basicAuth = context.getVariable("message.header.Authorization");
        var deleteRequestHeaders = {'Authorization': basicAuth};
        var postRequestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': basicAuth};
        var params = "id="+email;
        for(var i=0; i<len; i++){
            //assignRole
            if(action[i] == 'add'){
                var assignRoleRequest = new Request("http://10.21.180.112:4041/v1/organizations/"+"/userroles/"+"/users","POST", { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'basicAuth'}, "id=example@example.com");    
                var addReq = httpClient.send(assignRoleRequest);
                addReq.waitForComplete();
                if (addReq.isSuccess()){
                    
                    response = addReq.getResponse();
                    var responseCode = response.status;
                    
                    if(responseCode == 200){
                        success++;
                    }
                    if(responseCode == 401){
                        unauthorized++;
                    }
                    else if(responseCode != 200 && responseCode != 401){
                        context.setVariable('resp.success.isValid', 'false');
                        var responseBody = JSON.parse(response.content);
                        context.setVariable('processingError.httpStatusCode', responseCode);
                        context.setVariable('processingError.errorCode', JSON.stringify(responseBody.code));
                        context.setVariable('processingError.errorMessage', JSON.stringify(responseBody.message));
                        context.setVariable('processingError.errorReason', JSON.stringify(responseBody.message));
                        break;
                        
                    }
                    
                }
            }
            //removeRole
            if(action[i] =='remove'){
                var removeRoleRequest = new Request("http://10.21.180.112:4041/v1/o/"+org_name[i]+"/userroles/"+role_name[i]+"/users/"+email, "DELETE", deleteRequestHeaders);
                var removeReq = httpClient.send(removeRoleRequest);
                removeReq.waitForComplete();
                
                if (removeReq.isSuccess()){
                    
                    response = removeReq.getResponse();
                    var responseCode = response.status;
                    
                    if(responseCode == 204){
                        success++;
                    }
                    
                    if(responseCode == 401){
                        unauthorized++;
                    }
                    else if(responseCode != 204 && responseCode != 401){
                        context.setVariable('resp.success.isValid', 'false');
                        var responseBody = JSON.parse(response.content);
                        context.setVariable('processingError.httpStatusCode', responseCode);
                        context.setVariable('processingError.errorCode', JSON.stringify(responseBody.code));
                        context.setVariable('processingError.errorMessage', JSON.stringify(responseBody.message));
                        context.setVariable('processingError.errorReason', JSON.stringify(responseBody.message));
                        break;
                    }
                    
                }
            }
        }
        if( success == len ){
            context.setVariable('responseCode', '200');
            context.setVariable('resp.success.isValid', 'true');
        }
        if( unauthorized == len ){
            context.setVariable('resp.success.isValid', false);
            context.setVariable("processingError.httpStatusCode", 401);
            context.setVariable('processingError.errorCode', 'API.401');
            context.setVariable('processingError.errorMessage', 'Invalid credentials');
            context.setVariable('processingError.errorReason', 'Invalid credentials');
        }
    }
} catch (e) {
    context.setVariable('processingError.httpStatusCode', '500');
    context.setVariable('processingError.errorCode', 'API.500.1');
    context.setVariable('processingError.errorMessage', 'Service Encountered Error');
    context.setVariable('processingError.errorReason', 'JS-CreateUserResponse:' + e);
}

