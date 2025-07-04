/*
* Request desk wizard
* Used on [[c:User:Zanahary/Request desk]]
* Created by [[User:Chaotic Enby]] with functions taken from [[w:MediaWiki:AFC-submit-wizard.js]] by [[User:SD0001]]
* Dual-licensed: MIT and CC BY-SA 4.0
*/

(function () {

var title = "User:Zanahary/Request_desk"; // To be changed once page is moved

$.when(
	$.ready,
	mw.loader.using([
		'mediawiki.util', 'mediawiki.api', 'mediawiki.Title',
		'mediawiki.widgets', 'oojs-ui-core', 'oojs-ui-widgets'
	])
).then(function () {
	if (mw.config.get('wgPageName') !== title ||
		mw.config.get('wgAction') !== 'view') {
		return;
	}
	init();
});

var ui = {}, wizard = {};

function init(){
	var apiOptions = {
		parameters: {
			format: 'json',
			formatversion: '2'
		},
		ajax: {
			headers: {
				'Api-User-Agent': 'c:User:Chaotic Enby/Request desk.js'
			}
		}
	};

	wizard.api = new mw.Api(apiOptions);
	wizard.lookupApi = new mw.Api(apiOptions);
	wizard.lookupApi.get({
		"action": "query",
		"prop": "revisions",
		"titles": "User:Zanahary/Request_desk",
		"rvprop": "content",
		"rvslots": "main",
	}).then(getPageData);
	
	ui.fieldset = new OO.ui.FieldsetLayout({
	classes: [ 'container' ],
	items: [
		ui.workLayout = new OO.ui.FieldLayout(ui.workInput = new OO.ui.TextInputWidget({type: "url"}), {
			label: "Link to the work",
			align: 'top',
		}),
		
		ui.authorLayout = new OO.ui.FieldLayout(ui.authorInput = new OO.ui.TextInputWidget({}), {
			label: "Name or alias of the author",
			align: 'top',
		}),
		
		ui.authorContactLayout = new OO.ui.FieldLayout(ui.authorContactInput = new OO.ui.MultilineTextInputWidget({}), {
			label: "Contact information",
			align: 'top',
		}),
		
		ui.reasonLayout = new OO.ui.FieldLayout(ui.reasonInput = new OO.ui.MultilineTextInputWidget({}), {
			label: "Reason for relicensing",
			align: 'top',
		}),
		
		ui.submitLayout = new OO.ui.FieldLayout(ui.submitButton = new OO.ui.ButtonWidget({
			label: "Submit",
			flags: [ 'progressive', 'primary' ],
		}))
		]
	});
	$('#wizard-fieldset').css("margin-left", "20%").css("margin-right", "20%").empty().append(ui.fieldset.$element);
	ui.submitButton.on('click', onClick);
	ui.fields = [ui.workInput, ui.authorInput, ui.authorContactInput, ui.reasonInput];
	ui.fieldLayouts = [ui.workLayout, ui.authorLayout, ui.authorContactLayout, ui.reasonLayout];
}

function getPageData(json){
	wizard.text = json.query.pages[0].revisions[0].slots.main.content;
	console.log(wizard.text);
}

function onClick(){
	text = prepareText();
	savePage(text).then(reloadPage);
}

function prepareText(){
	text = wizard.text;
	text += "\n== Media request (~~"+ "~" +"~~) ==\n\n";
	text = ui.fields.reduce((t, f, i) => t + "'''" + ui.fieldLayouts[i].label + "'''" + "\n\n" + f.getValue() + "\n\n", text);
	text += "~~" + "~~\n";
	console.log(text);
	return text;
}

function savePage(text){
	var editParams = {
		"action": "edit",
		"title": title,
		"text": text,
		"summary": "Adding new request"
	};
	return wizard.api.postWithEditToken(editParams);
}

function reloadPage(data){
	location.href = "https://commons.wikimedia.org/wiki/User:Zanahary/Request_desk#";
}

})();
