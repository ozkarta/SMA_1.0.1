var async=require('async');
var sql=require('mssql');
var db=require('./dbConnector.js');

var dbConnector=new db.dbConnector(sql);

var users=function(){

	this.configInJSON;

	this.default_layout_name;
	this.default_header_name;
	this.default_footer_name;
	this.logoImageName;
    
    this.languageItems=[];
	this.DefaultSelectedLanguage='georgian';

	this.userPool=[];
	this.smaUserLevels=[];  // defines all user levels
    this.DefaultUserLevel;
    this.DefaultActivePage;

    users.prototype.findUserWithSessionGUID=function(sessionGUID,callback){
    	this.userPool.forEach(function(user){
    		if(user.sessionGUID==sessionGUID){
    			callback(user);
    		}
    	});
    }

    users.prototype.locals=function(){
		//console.dir(this.activeUser)
		var toReturn={
				locals: {
					'menuItems' : this.DefaultUserLevel.menuItems,
					'additionalMenuItems': this.DefaultUserLevel.additionalMenuItems,
					'leftPanel':this.DefaultActivePage.panelItems,
					'logoName': this.DefaultUserLevel.logoName,
					'languageItems': this.DefaultUserLevel.languageItems,
					'currentLanguage':this.DefaultUserLevel.selectedLanguage,
					'activePage':this.DefaultActivePage,
					'dataset':undefined
					}
				}
		return  toReturn;

	}

	users.prototype.getUserLevelWithUserType=function(userType,callback){
		console.dir(this.smaUserLevels);
		this.smaUserLevels.forEach(function(userLevel){
			if(userLevel.userType==userType){
				callback(userLevel);
			}
		});
	}
}
var userPoolObject=function(sessionGUID,userGUID,activeUserLevel,activePage){
	this.sessionGUID=sessionGUID;   //  GUID  which is generated  when signing in
    this.userGUID=userGUID;           //  value from DB
	

	this.selectedLanguage='georgian';
	this.activeUserLevel=activeUserLevel;   //  identifies current  user  level
	this.activePage=activePage;     //  active page  
    this.dataSet=undefined;   //  dataset  generated  for the user


    userPoolObject.prototype.setActivePage=function(viewName){
		console.log('Setting active page')
		
		var k=this.activeUserLevel.menuItems.concat(this.activeUserLevel.additionalMenuItems);
		//console.dir(k);
		if(viewName=='/'){
				viewName='/'+this.activeUserLevel.defaultPage.viewName;
			}
		for(var view in k){
			//console.log('opa1')
			
			console.log(viewName +' VS '+ '/'+k[view].viewName)


			if (viewName == '/'+k[view].viewName){

				this.activePage=k[view];
				break;
			}

		}
		
	}
	userPoolObject.prototype.initializeDataSetFromRequestedQueryGUID=function(guid,callback){
		for (var i in this.activeUserLevel.actionQueries){
			//console.log(this.actionQueries[i].query.toString());
			if (this.activeUserLevel.actionQueries[i].guid===guid){
				//console.log(this.actionQueries[i].query.toString());
				dbConnector.executeReadFromStringQuery(this.activeUserLevel.actionQueries[i].query.toString(),function(recordsets){
					//smaLocals.dataSet=recordsets;
					//console.log('dataset  from  DB  was populated  ')
					//console.dir(smaLocals.dataSet);
					callback(recordsets);
				});
				break;
			}
		}

	}
	userPoolObject.prototype.locals=function(){
		//console.dir(this.activeUser)
		var toReturn={
				locals: {
					'menuItems' : this.activeUserLevel.menuItems,
					'additionalMenuItems': this.activeUserLevel.additionalMenuItems,
					'leftPanel':this.activePage.panelItems,
					'logoName': this.activeUserLevel.logoName,
					'languageItems': this.activeUserLevel.languageItems,
					'currentLanguage':this.activeUserLevel.selectedLanguage,
					'activePage':this.activePage,
					'dataset':this.dataSet
					}
				}
		return  toReturn;

	}
	userPoolObject.prototype.initializeDefaultPageDataSet=function(query,callback){
		dbConnector.executeReadFromStringQuery(query.toString(),function(recordsets){
					//smaLocals.dataSet=recordsets;
					//console.log('dataset  from  DB  was populated  ')
					//console.dir(smaLocals.dataSet);
					callback(recordsets);
				});

	}

}

//___________________________HELPERS_________________________________________
var menuItem=function(screenName,pageTitle,viewName,panelItems,defaultDataSetQuery){
	this.screenName=screenName;
	this.systemName=screenName;
	this.pageTitle=pageTitle;
	this.viewName=viewName;
    this.panelItems=panelItems;
    this.defaultDataSetQuery=defaultDataSetQuery;
}

var defaultPageObject=function(pageTitle,viewName){
	this.pageTitle=pageTitle;
	this.viewName=viewName;
}

var languageObject=function(languageGUID,languageName,languageSystemName){
	this.languageGUID=languageGUID;
	this.languageName=languageName;
	this.languageSystemName=languageSystemName;
}

var userLevelObject=function(isAuthenticated,userType,layoutName,headerName,footerName,logoName,languageItems,menuItems,additionalMenuItems,defaultPage,actionQueries){
	//this.isAuthenticated=isAuthenticated;


	this.userType=userType;
	this.layoutName=layoutName;
	this.headerName=headerName;
	this.footerName=footerName;
	this.logoName=logoName;

	this.languageItems=languageItems;
	this.selectedLanguage='georgian';

	this.menuItems=menuItems;
	this.additionalMenuItems=additionalMenuItems;
	this.defaultPage=defaultPage;
    this.actionQueries=actionQueries;
	
	//this.userInSession=new userSession('','','','visitor');
}

var userSession=function(guid,email,password,userRole){
	
	this.guid=guid;
	this.email=email;
	this.passpord=password;
	this.userRole=userRole;
}

var panelItem=function(itemName,itemActionQueryGUID){
	this.itemName=itemName;
	this.itemActionQueryGUID=itemActionQueryGUID;
}
var queryObject=function(guid,query){
	this.guid=guid;
	this.query=query;
}


module.exports.users=users;
module.exports.userPoolObject=userPoolObject;
module.exports.menuItem=menuItem;
module.exports.defaultPageObject=defaultPageObject;
module.exports.languageObject=languageObject
module.exports.userLevelObject=userLevelObject
module.exports.panelItem=panelItem;
module.exports.queryObject=queryObject;