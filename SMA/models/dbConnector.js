var dbConnector=function(sql){
	this.sql=sql;
	this.connectionJson={
		user:'node.js',
		password:'12qwert12',
		server:'78.139.172.254',
		database:'smaDataBase',
		options: {
        	encrypt: true // Use this if you're on Windows Azure 
    	}
	};

//Data Source=OZKART-PC;Initial Catalog=smaDataBase;Integrated Security=True


	dbConnector.prototype.getLanguageList=function(){

			var connection = new this.sql.Connection(this.connectionJson, function(err) {
		    // ... error checks 
		    //console.log(err.toString());
		    // Query 
		    
		    var request = new sql.Request(connection); // or: var request = connection.request(); 
		    request.query('select * from languages', function(err, recordset) {
		        // ... error checks 
		        //console.log(err.toString());
		        
		        //console.log('value from db is '+recordset[0]['languageName']);
		    });
		    
		 
			});
	}
	dbConnector.prototype.getLanguageGUID=function(languageSysName,callback){
			var connection = new this.sql.Connection(this.connectionJson, function(err) {
		    	var request=new sql.Request(connection);
				request.input('languageName', sql.VarChar, languageSysName);
			    //request.output('output_parameter', sql.VarChar(50));
			    request.execute('getLanguageGUID', function(err, recordsets, returnValue) {
			        // ... error checks 
			        //console.log('began  db  '+languageSysName.toString());
				        if( recordsets != undefined ){
				        	if( recordsets[0] != undefined ){
					        		if( recordsets[0][0] != undefined ){
					        		 //console.log(recordsets[0][0]);
							        //console.log(languageSysName+' __ '+recordsets[0][0].languageGUID);
							        callback(recordsets[0][0].languageGUID,languageSysName);
							       // return recordsets[0][0].languageGUID;
							    }else{
						    		console.log('broken  party!!!');
						    		callback(undefined,undefined);
						    	}
				        	}else{
						    		console.log('broken  party!!!');
						    		callback(undefined,undefined);
						    	}							       
				    	}else{
					    		console.log('broken  party!!!');
					    		callback(undefined,undefined);
					    	}

	    			});
		 
			});

 
	}

	dbConnector.prototype.getLnaguageDisplayName=function(languageSysName,callback){
		if(languageSysName==undefined){
			callback(undefined,undefined);
		}
		console.log('Requested the  Display Name');
		var connection = new this.sql.Connection(this.connectionJson, function(err) {
			    	var request=new sql.Request(connection);
					request.input('languageName', sql.VarChar, languageSysName);
				    //request.output('output_parameter', sql.VarChar(50));
				    request.execute('getLanguageDisplayName', function(err, recordsets, returnValue) {
				        // ... error checks 
				       // console.log('began  db  '+languageSysName.toString());
					        if( recordsets != undefined ){
					        	if( recordsets[0] != undefined ){
						        		if( recordsets[0][0] != undefined ){
						        		 //console.log(recordsets[0][0]);
								       // console.log(languageSysName+' __ '+recordsets[0][0].languageDisplayName);
								        callback(recordsets[0][0].languageDisplayName,languageSysName);
								       // return recordsets[0][0].languageDisplayName;
								    }else{
							    		console.log('broken  party!!!');
							    		callback(undefined,undefined);
							    	}
					        	}else{
							    		console.log('broken  party!!!');
							    		callback(undefined,undefined);
							    	}							       
					    	}else{
						    		console.log('broken  party!!!');
						    		callback(undefined,undefined);
						    	}

		    			});
			 
				});

		}


	dbConnector.prototype.getVariableTranslated=function(languageGUID,variableName,callback){
		var connection=new this.sql.Connection(this.connectionJson,function(error){
			var request=new sql.Request(connection);
			request.input('languageGUID',sql.VarChar,languageGUID);
			request.input('variableName',sql.VarChar,variableName);
			request.execute('getTranslatedVariableValue',function(err,recordsets,returnValue){
				//console.log('translation..............');
				//console.log('getTranslatedVariableValue '+languageGUID+'  ,  '+variableName)

				if(recordsets!= undefined){
					if(recordsets[0]!=undefined){
						if(recordsets[0][0]!=undefined){
							//console.log(recordsets[0][0].value);
							callback(recordsets[0][0].value.toString());
						}else{
							callback(undefined);
						}
					}else{
						callback(undefined);
					}
				}else{
						callback(undefined);
					}
				
			});
		});
	}

	dbConnector.prototype.newguid=function(callback){
		var connection=new this.sql.Connection(this.connectionJson,function(error){
			var request=new sql.Request(connection);
			request.query('select newid() as guid',function(error,recordsets){
				//console.log('___guid____request')
				//console.dir(recordsets[0].guid.toString());
				if(recordsets!= undefined){
					if(recordsets[0]!=undefined){
						if(recordsets[0].guid!=undefined){
							//console.log(recordsets[0][0].value);
							callback(recordsets[0].guid.toString());
						}else{
							callback(undefined);
						}
					}else{
						callback(undefined);
					}
				}else{
						callback(undefined);
					}
			});
		});
	}
	
	dbConnector.prototype.executeReadFromStringQuery=function(query,callback){
		console.log('query  to execute  is  '+ query)
		var connection=new this.sql.Connection(this.connectionJson,function(error){
			var request=new sql.Request(connection);
			request.query(query,function(error,recordsets){
				
				callback(recordsets);
			});
		});
	}

	dbConnector.prototype.signUp=function(languageGUID,levelGUID,email,emailCinfirmed,passwordHash,salt,phoneNumber,phoneNumberConfirmed,accessFailedCount,userName,firstName,lastName,passportID,callback){
		var connection=new this.sql.Connection(this.connectionJson,function(error){
			var request=new sql.Request(connection);
			request.input('languageGUID',sql.VarChar,languageGUID);
			request.input('levelGUID',sql.VarChar,levelGUID);
			request.input('email',sql.VarChar,email);
			request.input('emailConfirmed',sql.VarChar,emailCinfirmed);
			request.input('passwordHash',sql.VarChar,passwordHash);
			request.input('salt',sql.VarChar,salt);
			request.input('phoneNumber',sql.VarChar,phoneNumber);
			request.input('phoneNumberConfirmed',sql.VarChar,phoneNumberConfirmed);
			request.input('accessFailedCount',sql.Int,accessFailedCount);
			request.input('userName',sql.VarChar,userName);
			request.input('firstName',sql.VarChar,firstName);
			request.input('lastName',sql.VarChar,lastName);
			request.input('passportID',sql.VarChar,passportID);


			request.execute('registerUser',function(err,recordsets,returnValue){


				console.dir(err);
				console.dir(returnValue);
				if(recordsets!= undefined){
					if(recordsets[0]!=undefined){
						if(recordsets[0][0]!=undefined){
							console.log(recordsets[0][0].value);
							callback(recordsets[0][0].LevelName.toString());
						}else{
							callback(undefined);
						}
					}else{
						callback(undefined);
					}
				}else{
						callback(undefined);
					}
				
			});
		});




		//callback('client');
	}

	dbConnector.prototype.signIn=function(email,passport,callback){
		callback('client');
	}

	dbConnector.prototype.getAccessLevelGUID=function(levelName,callback){
		var connection=new this.sql.Connection(this.connectionJson,function(error){
			var request=new sql.Request(connection);
			request.query('select levelGUID from accessLevels where levelName=\''+levelName+'\''.toString(),function(error,recordsets){
				if(recordsets!= undefined){
					if(recordsets[0]!=undefined){
						if(recordsets[0].levelGUID!=undefined){
							callback(recordsets[0].levelGUID.toString());
						}else{
							callback(undefined);
						}
					}else{
						callback(undefined);
					}
				}else{
						callback(undefined);
					}
			});
		});
	}	
};




module.exports.dbConnector=dbConnector;