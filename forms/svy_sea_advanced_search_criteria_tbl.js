/**
 *	Delete record
 *
 * @author Sanneke Aleman
 * @since 2007-11-24
 * @return  none
 * 
 * @properties={typeid:24,uuid:"6188FFAB-27FA-4263-BF75-BC03B7765C96"}
 */
function deleteRecord() {

	if (foundset.getSize()) {
		var _ok = i18n.getI18NMessage('svy.fr.lbl.ok');
		var _no = i18n.getI18NMessage('svy.fr.lbl.no');
		var _answer =  globals.svy_mod_dialogs_global_showQuestionDialog(i18n.getI18NMessage('svy.fr.lbl.record_delete'), i18n.getI18NMessage('svy.fr.dlg.delete'), _ok, _no); 	
		if(_answer == _ok) {
			if (databaseManager.hasRecords(foundset.nav_advanced_search_criteria$same_label)) {
				var _otherChilds = foundset.nav_advanced_search_criteria$same_label.duplicateFoundSet();
				_otherChilds.sort('ordering asc');
				
				for (var i=1; i<= _otherChilds.getSize(); i++) {
					var _rec = _otherChilds.getRecord(i);
					
					if (_rec.sequence > foundset.sequence) {
						_rec.sequence -= 1;
						_rec.ordering = _rec.parent_id && 
								databaseManager.hasRecords(_rec.nav_advanced_search_criteria$parent) && 
								_rec.nav_advanced_search_criteria$parent.ordering ? 
										_rec.nav_advanced_search_criteria$parent.ordering + '.' + _rec.sequence : _rec.sequence;
						if (_rec.sequence == 0)
							_rec.operator = '';
					}
				}
			}
			foundset.deleteRecord();
		}
	}
	else
		globals.svy_mod_dialogs_global_showInfoDialog(i18n.getI18NMessage('i18n:svy.fr.dlg.delete_criteria'), 
			i18n.getI18NMessage('i18n:svy.fr.dlg.no_criteria_found'), i18n.getI18NMessage('i18n:svy.fr.lbl.ok'));
}

/**
 *	Create record
 *
 * @author Sanneke Aleman
 * @since 2007-11-24
 * @return  none
 * 
 * @properties={typeid:24,uuid:"B15BEDEB-9FDB-439B-8BED-30D345FBA0BE"}
 * @SuppressWarnings(wrongparameters)
 */
function newRecord() {

	var _title = i18n.getI18NMessage('i18n:svy.fr.dlg.new_criteria');
	var _msg = i18n.getI18NMessage('i18n:svy.fr.dlg.select_option_to_create_record');
	var _createGrpOption = i18n.getI18NMessage('i18n:svy.fr.dlg.condition_group') ? i18n.getI18NMessage('i18n:svy.fr.dlg.condition_group') : 'Create Group';
	var _criteriaOption = i18n.getI18NMessage('i18n:svy.fr.dlg.criteria') ? i18n.getI18NMessage('i18n:svy.fr.dlg.criteria') : 'Criteria';
	var _cancelOption = i18n.getI18NMessage('i18n:svy.fr.dlg.cancel') ? i18n.getI18NMessage('i18n:svy.fr.dlg.cancel') : 'Cancel';
	var _optionYes = i18n.getI18NMessage('i18n:svy.fr.lbl.yes') ? i18n.getI18NMessage('i18n:svy.fr.lbl.yes') : 'Yes';
	var _optionNo = i18n.getI18NMessage('i18n:svy.fr.lbl.no') ? i18n.getI18NMessage('i18n:svy.fr.lbl.no') : 'No';
	var _selection = '';
	var _curParent = null;
	var _group = null;
	
	_selection = globals.svy_mod_dialogs_global_showQuestionDialog(_title, _msg, _createGrpOption, _criteriaOption, _cancelOption);
	
	if (!_selection || (_selection && _selection == _cancelOption))
		return;
	
	if (_selection == _createGrpOption) {			// Create group
		if (foundset && foundset.getSize() > 0 && is_group == 1) {
			var nesGrpSelection = globals.svy_mod_dialogs_global_showQuestionDialog(_title, i18n.getI18NMessage('i18n:svy.fr.dlg.create_nested_group'), 
				_optionYes, _optionNo, _cancelOption);
			
			if (!nesGrpSelection || ( nesGrpSelection && nesGrpSelection == _cancelOption))
				return;
			else if (nesGrpSelection && nesGrpSelection == _optionYes)
				_curParent = advanced_search_criteria_id;
			else
				_curParent = (parent_id ? parent_id : 0);
		}
		else if (foundset && foundset.getSize() > 0 && is_group == 0 && parent_id != 0)
			_curParent = parent_id;
		
		// Create group
		_group = 1;
	}
	else if (_selection == _criteriaOption) {		// Create Criteria
		if (foundset && foundset.getSize() > 0 && is_group == 1)
			_curParent = advanced_search_criteria_id;
		else if (foundset && foundset.getSize() > 0 && is_group == 0 && parent_id != 0)
			_curParent = parent_id;
		
		// Create Criteria
		_group = 0;
	}
	
	// Start Transaction and create record
	if (databaseManager.hasTransaction())
		databaseManager.rollbackTransaction();
	databaseManager.startTransaction();
	
	// Create Record in Search criteria table
	controller.newRecord(false);
	is_group = _group;
	group_name = _group ? 'New Condition group' : '';
	parent_id = (_curParent ? _curParent : 0);
	sequence = databaseManager.hasRecords(nav_advanced_search_criteria$same_label) ? nav_advanced_search_criteria$same_label.getSize() : 0;	// Sequence starts from zero onwards
	ordering = parent_id ? nav_advanced_search_criteria$parent.ordering + '.' + sequence : sequence; 
	databaseManager.saveData();
	
	forms.svy_sea_advanced_search_criteria_dtl.filterValueString = null;
	forms.svy_sea_advanced_search_criteria_dtl.filterValueDatetime = null;
	
	forms.svy_sea_advanced_search_criteria_dtl.controller.focusFirstField();
	
	// get selection array for tree
	var fs = foundset.duplicateFoundSet();
	fs.selectRecord(advanced_search_criteria_id)
	var arr = new Array();
	arr.push(fs.advanced_search_criteria_id)
	while (fs.parent_id) {
		
		fs.selectRecord(fs.parent_id);
		arr.push(fs.advanced_search_criteria_id);
	}
	
	refreshTree();														// Refresh tree
	elements.dbTreeCriteria.selectionPath = arr ? arr.reverse() : arr;	// Select the new node
	
	// Show add dialog
	editRecord();
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"6A5ED242-9B32-4973-9291-105D71D03F9E"}
 */
function onDataChangeFieldName(oldValue, newValue, event) {
	//TODO : Remove method after testing. May not be used

	if (databaseManager.getTable(globals._to_nav_program.server_name, globals._to_nav_program.table_name).getColumn(foundset.field_name).getType() == JSColumn.DATETIME) {
		foundset.date_format = i18n.getDefaultDateFormat();
	} else {
		foundset.date_format = null;
	}
	return true
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A6E7DD74-8DFA-48A8-99F5-49A8311E36EE"}
 */
function onShow(firstShow, event) {
	if (firstShow)
		refreshTree();								// Refresh tree
}

/**
 * Method to refresh the dbTree showing the search criteria
 * 
 * @properties={typeid:24,uuid:"702FA004-B88F-49C8-92B9-F9FF044557DC"}
 */
function refreshTree() {

	globals.svy_sea_advancedSearchId = advanced_search_id;
	
	/** @type {JSBean} */
	elements.dbTreeCriteria.removeAllRoots()
	
	var searchCriteriaDataSource = controller.getDataSource();

	var groupFs = globals.nav_advanced_search_to_nav_advanced_search_criteria$roots;

	/** @type {Binding} */
	var groupBinding = elements.dbTreeCriteria.createBinding(searchCriteriaDataSource);
	groupBinding.setTextDataprovider('criteria_tree_node_text');
	groupBinding.setNRelationName('nav_advanced_search_criteria_to_nav_advanced_search_criteria$childs');
	groupBinding.setCallBackInfo(treeCallback, 'advanced_search_criteria_id');
	groupBinding.setMethodToCallOnDoubleClick(treeDoubleClick, 'advanced_search_criteria_id');

	groupFs.loadAllRecords();
	groupFs.setSelectedIndex(1)
	elements.dbTreeCriteria.addRoots(groupFs);
	
	// Select node
	elements.dbTreeCriteria.selectionPath = [groupFs.advanced_search_criteria_id];
	
}

/**
 * callback method for dbtree view showing the search criteria
 * 
 * @param {Number} criteriaId Primary key for the selected node
 * 
 * @properties={typeid:24,uuid:"A8648DE2-C264-4D7C-BE08-90214FAC2F0C"}
 */
function treeCallback (criteriaId) {
	// Select the record in foundset
	foundset.selectRecord(criteriaId);	
}

/**
 * Call back method for tree when double clicked on any node
 * 
 * @param {JSEvent} event the event that triggered the action
 * @param {Object} criteriaId
 *
 * @properties={typeid:24,uuid:"4D9441C3-F4A0-41E5-A9A6-B8CA7766E30F"}
 */
function treeDoubleClick(event, criteriaId) {
	// Select the record in foundset and show edit dialog
	foundset.selectRecord(criteriaId);	
	editRecord();
}

/**
 * Perform the element default action.
 *
 * @properties={typeid:24,uuid:"DA8CC926-F487-488A-9DD5-4403D7A41FDB"}
 */
function editRecord() {
	if (!foundset.getSize()) {
		globals.svy_mod_dialogs_global_showInfoDialog(i18n.getI18NMessage('i18n:svy.fr.dlg.edit_criteria'),
			i18n.getI18NMessage('i18n:svy.fr.dlg.no_criteria_record_found_for_editing'), i18n.getI18NMessage('i18n:svy.fr.lbl.ok'));
		return;
	}
		
	if (!databaseManager.hasTransaction())
		databaseManager.startTransaction();
	
	// Show edit dialog  
	
	if (is_group) {
		var window = application.createWindow('win_group',JSWindow.MODAL_DIALOG);
		window.title = i18n.getI18NMessage('svy.fr.dlg.add_edit_search_criteria') ? i18n.getI18NMessage('svy.fr.dlg.add_edit_search_criteria') : 'Add/Edit search criteria';
		window.resizable = false;
		
		forms.svy_sea_advanced_search_Group_dtl.foundset.loadRecords(foundset);
		window.show(forms.svy_sea_advanced_search_Group_dtl);
	}
	else {
		var win = application.createWindow('win_criteria',JSWindow.MODAL_DIALOG);
		win.title = i18n.getI18NMessage('svy.fr.dlg.add_edit_search_criteria') ? i18n.getI18NMessage('svy.fr.dlg.add_edit_search_criteria') : 'Add/Edit search criteria';
		win.resizable = false;
		
		forms.svy_sea_advanced_search_criteria_dtl.foundset.loadRecords(foundset);		
		win.show(forms.svy_sea_advanced_search_criteria_dtl);
	}
}
