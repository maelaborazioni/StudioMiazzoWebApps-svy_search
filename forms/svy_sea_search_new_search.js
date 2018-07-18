/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"62c5340f-1a7a-4f35-b70d-aad66fe579b9"}
 */
var search_name = '';

/**
 *	To save the last search for a user
 *
 * @author Sanneke Aleman
 * @since 2007-11-09
 * @param {JSEvent} _event
 * @return  none
 *
 * @properties={typeid:24,uuid:"b31110d9-ac47-485a-acd1-e97a3e125f3e"}
 */
function btn_ok(_event)
{
	
	var _form = globals.nav.form_view_01
	if(databaseManager.getSQL(forms[_form].foundset))
	{
		/** @type {JSFoundSet<db:/svy_framework/search_criteria>} */
		var _foundset = databaseManager.getFoundSet(forms.svy_sea_search_criteria_dtl.controller.getDataSource())
		_foundset.newRecord()
		_foundset.sql_statement = databaseManager.getSQL(forms[_form].foundset)
		_foundset.program_name = globals.nav_program_name
		_foundset.user_id = globals.svy_sec_lgn_user_id;
		_foundset.organization_id = globals.svy_sec_lgn_organization_id;
		_foundset.name = search_name
		_foundset.parameters =  databaseManager.getSQLParameters(forms[_form].foundset)
		databaseManager.saveData()
	}
	globals.svy_mod_closeForm(_event)
}

/**
 *	Close a form in dialog
 *
 * @author Sanneke Aleman
 * @since 2007-11-09
 * @param {JSEvent} _event
 * @return  none
 *
 * @properties={typeid:24,uuid:"6d53b097-3d3d-4083-bcab-673a7fbe277c"}
 */
function btn_cancel(_event)
{
	globals.svy_mod_closeForm(_event)
}

/**
 *	Onshow - focus on the first field
 *
 * @author Sanneke Aleman
 * @since 2007-11-09
 * @return  none
 *
 * @properties={typeid:24,uuid:"1d35aebb-329b-4832-a75f-dac80cfc5d5d"}
 */
function onShow()
{
	controller.focusFirstField()
}
