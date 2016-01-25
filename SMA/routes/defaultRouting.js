	
	var registerRoutings=function(app,smaLocals,passport){



		registerRoutings.prototype.register=function(app,smaLocals,callback){


		//console.log('BEGIN DEBUG  ____ROUTINGS___')
		//console.log('the layout name is : '+smaLocals.activeUser.layoutName);
		//console.log('the header name is : '+smaLocals.activeUser.headerName);
		//console.log('the footer name is : '+smaLocals.activeUser.footerName);
		for(var i=0;i<smaLocals.activeUser.menuItems.length;i++){
			//console.log('menus  --->'+smaLocals.activeUser.menuItems[i].screenName);
			//console.log('menus  --->'+smaLocals.activeUser.menuItems[i].pageTitle);
			//console.log('menus  --->'+smaLocals.activeUser.menuItems[i].viewName);

		}


		for(var i=0;i<smaLocals.activeUser.languageItems.length;i++){
			//console.log('languages --->'+smaLocals.activeUser.languageItems[i].languageName+'---->'+smaLocals.languageItems[i].languageGUID);
		}

		//console.log('END DEBUG  ____ROUTINGS___')


			





			defaultPost(app,smaLocals);

			//defaultGet(app,smaLocals);
		
			trialGet(app,smaLocals);
			callback();
		}





		




		function  defaultPost(app,smaLocals){
			app.post('/',function(req,res){
				postIndex(req,res);
			});
			app.post('/index.ejs',function(req,res){
				postIndex(req,res);
			});
			app.post('/about.ejs',function(req,res){

			});

			app.post('/login', passport.authenticate('local-login', {
		        successRedirect : '/', // redirect to the secure profile section
		        failureRedirect : '/error.ejs', // redirect back to the signup page if there is an error
		        failureFlash : true // allow flash messages
		    }));

		    
		}
		function defaultGet(app,smaLocals){
			app.get('/',function(req,res){
				getIndex(req,res);
			});
			app.get('/index.ejs',function(req,res){
				getIndex(req,res);
			});
			app.get('/logout.ejs',function(req,res){
				logOut(smaLocals);
				res.redirect('/')
			});
			

		}
		function trialGet(app,smaLocals){
			var allArr=smaLocals.activeUser.menuItems.concat(smaLocals.activeUser.additionalMenuItems);
			//console.dir(allArr)
			app.get('/',function(req,res){
				trialGetAll(req,res); 
			});
			app.get('/index.ejs',function(req,res){
				trialGetAll(req,res);
			});
			
			app.get('/logout.ejs',function(req,res){
				logOut(smaLocals);
				res.redirect('/')
			});
			
			for(var pages in allArr){
				//console.log("the  pages  routed   are  :.....    "+allArr[pages].viewName);
				app.get('/'+allArr[pages].viewName,function(req,res){
					trialGetAll(req,res)
				});
			}

			app.get('/*',function(req,res){

				res.render('visitor/error.ejs',smaLocals.locals());

			})

			
		}
 
		//__________________________________GET________________________________________________________

		var getIndex=function(req,res){
						//console.dir(req)
						//console.dir('___query  aris    ____   '+req.query.queryGParam);
						//console.log('default page was requested  by GET')
						//smaLocals.setActivePage(req.originalUrl);
						smaLocals.setActivePage(req.path);
						res.render(smaLocals.activeUser.userType+'/'+smaLocals.activeUser.defaultPage.viewName,smaLocals.locals());

						}
		var getWithDefaults=function(req,res){
							//console.log('default page was requested  by GET')
							smaLocals.setActivePage(req.originalUrl);
							res.render()
						}
		var trialGetAll =function(req,res){
									//console.log('_____________________________activating..............  '+req.path);
									//console.dir('___query  aris    ____   '+req.query.queryGParam);
									//smaLocals.setActivePage(req.originalUrl);
									smaLocals.dataSet=undefined;			
									//res.render(smaLocals.activeUser.userType+req.originalUrl,smaLocals.locals(),function(err,html){
									smaLocals.setActivePage(req.path);	
									//console.dir(smaLocals.activePage)

									if(req.query.queryGParam!==undefined){
										smaLocals.initializeDataSetFromRequestedQueryGUID(req.query.queryGParam,function(dataset){
												smaLocals.dataSet=dataset;

														
												res.render(smaLocals.activeUser.userType+req.path,smaLocals.locals(),function(err,html){
													if(err){
														console.dir(err);
														res.redirect(404,'pages/error.ejs',smaLocals.locals())
													}else{
														res.send(html);
													}
												});
										
										});
									}else{
										//smaLocals.setActivePage(req.path);
											if(smaLocals.activePage.defaultDataSetQuery!=undefined){
												smaLocals.initializeDefaultPageDataSet(smaLocals.activePage.defaultDataSetQuery.toString(),function(dataset){
													smaLocals.dataSet=dataset;

													res.render(smaLocals.activeUser.userType+req.path,smaLocals.locals(),function(err,html){
														if(err){
															console.dir(err);
															res.redirect(404,'pages/error.ejs',smaLocals.locals())
														}else{
															res.send(html);
														}
													});
												});
											}
											else{	
												res.render(smaLocals.activeUser.userType+req.path,smaLocals.locals(),function(err,html){
													if(err){
														console.dir(err);
														res.redirect(404,'pages/error.ejs',smaLocals.locals())
													}else{
														res.send(html);
													}
												});
											}
									}
									
									
									/*
									res.render(smaLocals.activeUser.userType+req.path,smaLocals.locals(),function(err,html){
										if(err){
											//console.log('1111111111');
											res.redirect(404,'pages/error.ejs',smaLocals.locals())
										}else{
											res.send(html);
										}
									});
									*/
								
							};
		//_________________________________POST_________________________________________________________
		var postIndex=function(req,res){
						//console.log('page was requested  by  POST')
						smaLocals.setSelectedLanguage(req.body.language,function(){
							//console.log('rendering with ....'+smaLocals.activeUser.selectedLanguage);
							res.render(smaLocals.activeUser.userType+'/'+smaLocals.activePage.viewName,smaLocals.locals(),function(err,html){
								if(err){
									console.log('Error  while  rendering page ....');
									res.redirect(404,'pages/error.ejs',smaLocals.locals())
								}else{
									res.send(html);
								}
							});
						});
						
					}
		//________________________________ERROR__________________________________________________________
		var renderError=function(req,res){
			
		}
		var logOut=function(smaLocals){
			for(userIndex in smaLocals.smaUsers){
              //console.log(smaLocals.smaUsers[userIndex].userType+' VS '+ozkartUser.userRole)
              if(smaLocals.smaUsers[userIndex].userType=='visitor'){
                //console.dir(smaLocals.smaUsers[userIndex]);
                smaLocals.activeUser=smaLocals.smaUsers[userIndex];
                smaLocals.activeUser.isAuthenticated=true;
                break;
              }
            }
		}
	}




		
//_________________________________________________________________________________________________________________________
module.exports.registerRoutings=registerRoutings;
