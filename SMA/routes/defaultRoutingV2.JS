	
	var registerRoutings=function(app,usersObject,users,dbConnector){



		registerRoutings.prototype.register=function(app,usersObject,users,dbConnector,callback){



     		//defaultPost(app,users,dbConnector);

			
			trialGet(app,usersObject,users,dbConnector);

			trialPost(app,usersObject,users,dbConnector);

			callback();
		}

		function trialPost(app,usersObject,users,dbConnector){
			app.post('/signup',function(req,res){
				var currentSession=req.session;
				dbConnector.signUp(req.body.email,req.body.password,function(userType){
					users.getUserLevelWithUserType(userType,function(userLevel){
						console.dir(userLevel);
						console.log('___________________________________________')
						dbConnector.newguid(function(sessionGUID){
								//console.log(guid);
								currentSession.sessionGUID=sessionGUID;
								users.userPool.push(new usersObject.userPoolObject(sessionGUID,'',userLevel,userLevel.defaultPage))
								res.redirect('/');
						});
						
					});
				
				});
				
			});
		}


		
		function trialGet(app,usersObject,users,dbConnector){
			
	

			app.get('/',function(req,res){
				trialGetAll(req,res);
			});	
			app.get('/index.ejs',function(req,res){
				trialGetAll(req,res);
			});	
			console.dir(users);
			var allArr=users.DefaultUserLevel.menuItems.concat(users.DefaultUserLevel.additionalMenuItems);
				

			for(var pages in allArr){
					app.get('/'+allArr[pages].viewName,function(req,res){
						trialGetAll(req,res)
					});
				}

			app.get('/404',function(req,res){
				res.render('visitor/error.ejs',users.locals());
			});

			app.get('/logout.ejs',function(req,res){
				req.session.sessionGUID=undefined;
				res.redirect('/');
			});
			
		}
 
		//__________________________________GET________________________________________________________
		
		var trialGetAll =function(req,res){
			var currentSession=req.session;

			initSessionAndUser(currentSession,function(currentUser){
				currentUser.dataset=undefined;
				currentUser.setActivePage(req.path);

				if(req.query.queryGParam!==undefined){
										currentUser.initializeDataSetFromRequestedQueryGUID(req.query.queryGParam,function(dataset){
												currentUser.dataSet=dataset;

														
												res.render(currentUser.activeUserLevel.userType+req.path,currentUser.locals(),function(err,html){
													if(err){
														console.dir(err);
														res.redirect(404,'pages/error.ejs',currentUser.locals())
													}else{
														res.send(html);
													}
												});
										
										});
				}else{
						if(currentUser.activePage.defaultDataSetQuery!=undefined){
												currentUser.initializeDefaultPageDataSet(currentUser.activePage.defaultDataSetQuery.toString(),function(dataset){
													currentUser.dataSet=dataset;

													res.render(currentUser.activeUserLevel.userType+req.path,currentUser.locals(),function(err,html){
														if(err){
															console.dir(err);
															res.redirect(404,'pages/error.ejs',currentUser.locals())
														}else{
															res.send(html);
														}
													});
												});
											}
											else{	
												res.render(currentUser.activeUserLevel.userType+req.path,currentUser.locals(),function(err,html){
													if(err){
														console.dir(err);
														res.redirect(404,'pages/error.ejs',currentUser.locals())
													}else{
														res.send(html);
													}
												});
											}
				}
				
			});
			
						
								
		};

		var initSessionAndUser=function(currentSession,callback){
			if(!currentSession.sessionGUID){
							console.log('sessionGUID is empty')
							dbConnector.newguid(function(sessionGUID){
								//console.log(guid);
								currentSession.sessionGUID=sessionGUID;
								users.userPool.push(new usersObject.userPoolObject(sessionGUID,'',users.DefaultUserLevel,users.DefaultActivePage))
								users.findUserWithSessionGUID(currentSession.sessionGUID,function(currentUser){
									callback(currentUser)
								});

								
							});
						}else{
							users.findUserWithSessionGUID(currentSession.sessionGUID,function(currentUser){
									callback(currentUser);
								});
							
						}
		}
		//_________________________________POST_________________________________________________________
		var postIndex=function(req,res){
						
					}
		//________________________________ERROR__________________________________________________________
		var renderError=function(req,res){
			
		}
		var logOut=function(users){
			
		}
	}




		
//_________________________________________________________________________________________________________________________
module.exports.registerRoutings=registerRoutings;