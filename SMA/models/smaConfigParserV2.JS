var async =  require ('async');
var fs=require('fs');
var xmlObject=require('xml2js');

var   configReader=function(usersObject,users,dbConnector){
	//this.app=app;
	
	this.usersObject=usersObject;
	this.users=users;
	this.k='ozKart';

    //----------------------------------------------------------------------------------
	configReader.prototype.parseConfig=function (callback){
	//var data=fs.readFileSync('./configurations/SMAconfig.0.01.XML','utf8');
	var data=fs.readFileSync('./config/application/SMAconfig.0.02.XML','utf8');
	
	var parser=new xmlObject.Parser();
	parser.parseString(data,function(err,result){
							users.configInJSON=result;
							//initLayoutVariables();


							initLayoutVariablesTrial_version_05(function(){
								callback();
							});
						
						});
	}
	//____________________________SUB_FUNCTIONS__________________________________________

	var initLayoutVariablesTrial_version_05=function(callback){
		initDefaultVariables(function(){
			initDefaultLanguages(function(){
				async.forEach(users.configInJSON.SMA.user_specific,function(userSection,callback1){
							async.forEach(userSection.user,function(user,callback2){
									var isAuthenticated=false;

									var userType=user.user_type.toString();
									var layoutName;
									var headerName;
									var footerName;
									var logoName;

									var languageObject=[];
									var menusObject=[];
									var actionQueriesObject=[];
									var additionalMenusObject=[];
									var defaultPageObject;
									//___________________________JSONS_____________________________________________
									var languageObjectJSON=user.languages;
									var menusObjectJSON=user.menus;
									var defaultPageObjectJSON=user.default_page;
									var additionalMenuObjectJSON=user.additional_menu;

									if(user.layout_name != undefined & user.layout_name!=''){
										layoutName=user.layout_name.toString();
									}else{
										layoutName=users.default_layout_name;
									}

									if(user.header_name != undefined & user.header_name!=''){
										headerName=user.header_name.toString();
									}else{
										headerName=users.default_header_name;
									}
									if(user.footer_name != undefined & user.footer_name!=''){
										footerName=user.footer_name.toString();
									}else{
										footerName=users.default_footer_name;
									}
									if(user.logo_name != undefined & user.logo_name!=''){
										logoName=user.logo_name.toString();										
									}else{
										logoName=users.logoImageName;										
									}
									//_______________________BIG_IF_______________________________
									if(languageObjectJSON!=undefined){
										initUsersLanguages(user.languages[0],languageObject,function(){
											initMenu(menusObjectJSON,menusObject,actionQueriesObject,function(){
												initAdditionalMenu(additionalMenuObjectJSON,additionalMenusObject,function(){
													initDefaultPage(defaultPageObjectJSON,defaultPageObject,function(pgo){
															users.DefaultActivePage=pgo;
															//console.dir(actionQueriesObject);
															defaultPageObject=pgo;
															if(userType=='visitor'){
																isAuthenticated=true;
															}
															//     PUSH  NEW  USERS  
															var user=new usersObject.userLevelObject(isAuthenticated,userType,layoutName,headerName,footerName,logoName,languageObject,menusObject,additionalMenusObject,defaultPageObject,actionQueriesObject);
															users.smaUserLevels.push(user);
															if(isAuthenticated){
																users.DefaultUserLevel=user;
															}
															callback2();
													});
												});
											});
										});
									}else{
										languageObject=users.languageItems;
										initMenu(menusObjectJSON,menusObject,actionQueriesObject,function(){
												initAdditionalMenu(additionalMenuObjectJSON,additionalMenusObject,function(){
													initDefaultPage(defaultPageObjectJSON,defaultPageObject,function(pgo){
															users.DefaultActivePage=pgo;
															defaultPageObject=pgo;
															if(userType=='visitor'){
																isAuthenticated=true;
															}
															//     PUSH  NEW  USERS   to    smaLocal
															var user=new usersObject.userLevelObject(isAuthenticated,userType,layoutName,headerName,footerName,logoName,languageObject,menusObject,additionalMenusObject,defaultPageObject,actionQueriesObject);
															users.smaUserLevels.push(user);
															if(isAuthenticated){
																users.DefaultUserLevel=user;
															}
															callback2();
													});
												});
											});
									}
									//______________________END_BIG_IF_____________________________



								},function(err){
								callback1();
							});
					},function(err){
					//   TRANSLATE ACTIVE
					//users.translateActiveUser(function(){
						callback();
				});				
			});
		});
	}

	var initDefaultVariables=function(callback){
		users.default_layout_name=users.configInJSON.SMA.layout_name.toString();
		users.default_header_name=users.configInJSON.SMA.header_name.toString();
		users.default_footer_name=users.configInJSON.SMA.footer_name.toString();
		users.logoImageName=users.configInJSON.SMA.logo_name.toString();
		callback();
	}

	var initDefaultLanguages=function(call2){
		async.forEachSeries(users.configInJSON.SMA.languages[0]['language_variable'],function(lang,callback){
				dbConnector.getLnaguageDisplayName(lang,function(languageDisp,languageSys){
				
					dbConnector.getLanguageGUID(languageSys,function(guid,language){
						    if(guid==undefined | language==undefined){
								callback()	;
							}
							else{
								users.languageItems.push(new usersObject.languageObject(guid,languageDisp,languageSys));
								callback()	;
							}
							
					});				
				});		
		},function(err){
			call2();
		});
	}

	var initUsersLanguages=function(languageOBJ,userLanguage,call2){
		async.forEachSeries(languageOBJ['language_variable'],function(lang,callback0){
				dbConnector.getLnaguageDisplayName(lang,function(languageDisp,languageSys){
				
					dbConnector.getLanguageGUID(languageSys,function(guid,language){
						    if(guid==undefined | language==undefined){
								callback0()	;
							}
							else{
								userLanguage.push(new usersObject.languageObject(guid,languageDisp,languageSys));
								callback0()	;
							}
							
					});				
				});			
		},function(err){
			call2();
		});
	} 

	var initMenu_BUG_FOUND=function(menusObjectJSON,menusObject,actionQueriesObject,call5){
		if(menusObjectJSON != undefined){
					for(var menu_item in menusObjectJSON[0]['menu_item']){
						initPanelItems(menusObjectJSON[0]['menu_item'][menu_item],actionQueriesObject,function(panelItemsObject){
								var defaultDataSetSQL=menusObjectJSON[0]['menu_item'][menu_item].default_list_dataset[0].data_query;


								menusObject.push(new usersObject.menuItem(menusObjectJSON[0]['menu_item'][menu_item].screen_name,
																  menusObjectJSON[0]['menu_item'][menu_item].screen_page[0].page_title,
																  menusObjectJSON[0]['menu_item'][menu_item].screen_page[0].page_view_name,
																  panelItemsObject,defaultDataSetSQL
																  
												)
								);
						});
					}
				} 
		call5();
	}

	var initMenu=function(menusObjectJSON,menusObject,actionQueriesObject,call5){
		if(menusObjectJSON != undefined){
					async.forEach(menusObjectJSON[0]['menu_item'],function(menu_item,callback){
						initPanelItems(menu_item,actionQueriesObject,function(panelItemsObject){

								var defaultDataSetSQL=menu_item.default_list_dataset[0].data_query;
								menusObject.push(new usersObject.menuItem(menu_item.screen_name,
																  menu_item.screen_page[0].page_title,
																  menu_item.screen_page[0].page_view_name,
																  panelItemsObject,defaultDataSetSQL
																  
												)
								);
								callback();	
						});
					},function(err){
						call5()
					});
				}
		else{
			call5();
		} 
		//
	}

	var initPanelItems=function(menuItemJSON,actionQueriesObject,callback2){
		if(menuItemJSON.left_panel!==undefined){
			var  panelItemsObject=[];
			async.forEach(menuItemJSON.left_panel[0]['panel_item'],function(panelItemObject,callback){
				dbConnector.newguid(function(guid){
					panelItemsObject.push(new usersObject.panelItem(panelItemObject.screen_name,guid));
					actionQueriesObject.push(new usersObject.queryObject(guid,panelItemObject.data_query))
					callback();
				});
				
			},function(err){
				
				callback2(panelItemsObject);
			});
		}
		else{
			callback2();
		}
	
	}

	var initAdditionalMenu=function(additionalMenuObjectJSON,additionalMenuObject,callback){
		if(additionalMenuObjectJSON != undefined){
					for(var menu_item in additionalMenuObjectJSON[0]['menu_item']){
						additionalMenuObject.push(new usersObject.menuItem(additionalMenuObjectJSON[0]['menu_item'][menu_item].screen_name,
																  additionalMenuObjectJSON[0]['menu_item'][menu_item].screen_page[0].page_title,
																  additionalMenuObjectJSON[0]['menu_item'][menu_item].screen_page[0].page_view_name
							));
					}
				}
		callback();
	}

	var initDefaultPage=function(defaultPageObjectJSON,defaultPageObject,call6){
		if(defaultPageObjectJSON != undefined){

					defaultPageObject=new usersObject.defaultPageObject(defaultPageObjectJSON[0]['page_title'],
																defaultPageObjectJSON[0]['page_view_name']);
					
				}				
		call6(defaultPageObject);
	}
};


module.exports.configReader=configReader;