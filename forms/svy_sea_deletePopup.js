/**
 *	To delete a record
 *
 * @author Sanneke Aleman
 * @since 2009-09-09
 * @return  none
 *
 * @properties={typeid:24,uuid:"2dedfb7b-d971-4992-8255-086ff498ab2b"}
 */
function recordDelete()
{
	var _ok = i18n.getI18NMessage('svy.fr.lbl.ok')
	var _no = i18n.getI18NMessage('svy.fr.lbl.no')
	var _answer =  globals.svy_mod_dialogs_global_showQuestionDialog(i18n.getI18NMessage('svy.fr.lbl.record_delete'), i18n.getI18NMessage('svy.fr.dlg.delete'), _ok, _no); 	
	if(_answer == _ok)
	{
		controller.deleteRecord()
	}
}
