/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6C332916-134D-4011-A3F0-0715CCE56A32"}
 */
var errorMessage = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"E7008A4B-EC7B-4B8E-8796-A2800F089300",variableType:93}
 */
var filterValueDatetime = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CDF649FB-53B8-4514-B10A-A331A5A22393"}
 */
var filterValueString = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"5A2DE16C-B360-4EA9-8F7A-5CD6EA219C0B"}
 */
var filterValueValuelist = null;

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"63526A34-87B9-4B3E-8ACC-22C556977E57"}
 */
function onDataChangeDateFormat(oldValue, newValue, event) {
	if (foundset.field_name && isColumnDatetime()) {
		elements.filterValueDatetime.format = foundset.date_format;
		foundset.filter_value = utils.dateFormat(filterValueDatetime, foundset.date_format);
	}
	
	return true
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
 * @private
 *
 * @properties={typeid:24,uuid:"B506C49C-E95B-4971-ADBF-FAD951F99F1E"}
 */
function onDataChangeFieldName(oldValue, newValue, event) {
	switchDataType();
	
	if (foundset.field_name && isValuelistAttached())
		setFieldValueValuelist();
	
	return true
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
 * @private
 *
 * @properties={typeid:24,uuid:"AE565C9B-E8C2-4FFB-8387-013084502948"}
 */
function onDataChangeFilterValue(oldValue, newValue, event) {
	if (foundset.field_name && isColumnDatetime()) {
		foundset.filter_value = utils.dateFormat(filterValueDatetime, foundset.date_format);
	} else if (foundset.field_name && isValuelistAttached()) {
		foundset.filter_value = filterValueValuelist;
	} else {
		foundset.filter_value = filterValueString;
	}

	switchDataType()
	return true
}

/**
 * 
 * @properties={typeid:24,uuid:"4DF07496-D6A7-4F1F-B133-CC0E918E5C0A"}
 */
function switchDataType() {
	// TODO : Pradipta
	if (foundset.field_name) {
		var _isDatetime = isColumnDatetime();
		var _isValAttached = isValuelistAttached();		
		
		if (_isDatetime) {
			elements.filterValueDatetime.visible = true;
			elements.filterValueString.visible = false;
			elements.filterValueValuelist.visible = false;
		}
		else if (_isValAttached) {
			elements.filterValueDatetime.visible = false;
			elements.filterValueString.visible = false;
			elements.filterValueValuelist.visible = true;
		}
		else {
			elements.filterValueDatetime.visible = false;
			elements.filterValueString.visible = true;
			elements.filterValueValuelist.visible = false;
		}
		
		if (_isDatetime) {
			filterValueString = null;
			filterValueValuelist = null;//foundset.filter_value = null;								// reset field in db
			
			elements.date_format.enabled = true;
			if (!foundset.date_format) {
				foundset.date_format = i18n.getDefaultDateFormat();
			}
		} else if (_isValAttached) {
			filterValueString = null;
			filterValueDatetime = null;//foundset.filter_value = null;								// reset field in db
			
			elements.date_format.enabled = false;
			foundset.date_format = null;
		} else {
			filterValueDatetime = null;
			filterValueValuelist = null;
			
			elements.date_format.enabled = false;
			foundset.date_format = null;
		}
	}
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3D940F74-EE32-4F26-BF4E-5C22DD078ABB"}
 */
function onRecordSelection(event) {
	setupFields();
	switchDataType();
	
	if (foundset.field_name && isValuelistAttached())
		setFieldValueValuelist();
	
	if (foundset.field_name) {
		if (foundset.field_name && isColumnDatetime()) {
			filterValueDatetime = new Date(filter_value);
			elements.filterValueDatetime.format = foundset.date_format;
		} else if (foundset.field_name && isValuelistAttached()) {
			filterValueValuelist = filter_value;
		} else {
			filterValueString = foundset.filter_value;
		}
	}
	else {
		filterValueDatetime = null;
		filterValueValuelist = null;
		filterValueString = null;
	}
}

/**
 * @properties={typeid:24,uuid:"FD758D26-C4A0-46F7-8898-E9AF4D04C021"}
 */
function isColumnDatetime() {
	if (!foundset.field_name)
		return false;
	
	if (foundset.field_name.lastIndexOf('.') >= 0) {
		var _relation = utils.stringLeft(foundset.field_name, foundset.field_name.lastIndexOf('.'));
		var _column = utils.stringMiddle(foundset.field_name, foundset.field_name.lastIndexOf('.') + 2, foundset.field_name.length - foundset.field_name.lastIndexOf('.') + 2);
		return databaseManager.getTable(forms[globals.nav.form_view_01].foundset[_relation]).getColumn(_column).getType() == JSColumn.DATETIME;
	} else {
		return databaseManager.getTable(forms[globals.nav.form_view_01].foundset).getColumn(foundset.field_name).getType() == JSColumn.DATETIME;
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9A2318FB-3547-4BD1-BF9D-38E05C7EDA94"}
 */
function onShow(firstShow, event) {
	setupFields();
	switchDataType();
	elements.operator.enabled = !sequence ? false : true ;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"88A26FA1-7788-4A7B-AA0D-D4FE64EC435C"}
 */
function saveEdit(event) {
	
	if (!validateRequiredFields()) {						// When required field validation failed
		elements.operator.enabled = !sequence ? false : true ;
		return;
	}
	
	if (databaseManager.hasTransaction()) {
		databaseManager.commitTransaction(true);
	}
	
	application.getWindow('win_criteria').destroy();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0A6C7AB5-6167-42DB-9849-820E9417276D"}
 */
function cancelEdit(event) {
	if (databaseManager.hasTransaction()) {
		databaseManager.rollbackTransaction();
	}
	
	application.getWindow('win_criteria').destroy();
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"600287C6-2885-4DE6-BF74-724AD5D85DCB"}
 */
function onHide(event) {
	if (databaseManager.hasTransaction()) {
		databaseManager.rollbackTransaction();
	}
	
	return true
}

/**
 * @properties={typeid:24,uuid:"07446488-FFAB-4AFD-B4DF-0F19ACCBA605"}
 */
function setupFields() {
	//TODO : Pradipta
	
	errorMessage = '';
	// Criteria record
	elements.operator.enabled = !sequence ? false : true;
	
	if (!foundset.field_name) {
		elements.field_name.enabled = true;
		elements.filter_operator.enabled = true;
		elements.filterValueString.visible = true;
		elements.filterValueDatetime.visible = false;
		elements.filterValueValuelist.visible = false;
	}
	else if (isColumnDatetime) {
		elements.field_name.enabled = true;
		elements.filter_operator.enabled = true;
		elements.filterValueString.visible = false;
		elements.filterValueDatetime.visible = true;
		elements.filterValueValuelist.visible = false;
	}
	else if (isValuelistAttached()) {
		elements.field_name.enabled = true;
		elements.filter_operator.enabled = true;
		elements.filterValueString.visible = false;
		elements.filterValueDatetime.visible = false;
		elements.filterValueValuelist.visible = true;
	}
}

/**
 * @properties={typeid:24,uuid:"E3DE37B1-010C-4716-A94D-6CAC07FE1461"}
 */
function validateRequiredFields() {
	
	errorMessage = ''; 
	var isFailed = false;
	
	// Validate the required fields 
	if (sequence > 0 && !operator ? true : false) {
		errorMessage = errorMessage ? errorMessage + ', Operator' : 'Operator';
		!isFailed ? elements.operator.requestFocus() : '';
		isFailed = true;
	}
	if (!field_name) {
		errorMessage = errorMessage ? errorMessage + ', Field name' : 'Field name';
		!isFailed ? elements.field_name.requestFocus() : '';
		isFailed = true;
	}
	if (!filter_operator) {
		errorMessage = errorMessage ? errorMessage + ', Filter operator' : 'Filter operator';
		!isFailed ? elements.filter_operator.requestFocus() : '';
		isFailed = true;
	}
	if (filter_operator && filter_operator == 'CONTAINS' && isColumnDatetime()) {						// CONTAINS operator is invalid for datetime field
		errorMessage = 'CONTAINS operator is invalid for datetime field.';
		!isFailed ? elements.filter_operator.requestFocus() : '';
		isFailed = true;
		return !isFailed;
	}
	if (foundset.field_name && isColumnDatetime() && !filterValueDatetime) {
		errorMessage = errorMessage ? errorMessage + ', value' : 'value';
		!isFailed ? elements.filterValueDatetime.requestFocus() : '';
		isFailed = true;
	} else if (foundset.field_name && isValuelistAttached() && !filterValueValuelist){
		errorMessage = errorMessage ? errorMessage + ', Value' : 'Value';
		!isFailed ? elements.filterValueValuelist.requestFocus() : '';
		isFailed = true;
	} else if (foundset.field_name && !isColumnDatetime() && !isValuelistAttached() && !filterValueString){
		errorMessage = errorMessage ? errorMessage + ', Value' : 'Value';
		!isFailed ? elements.filterValueString.requestFocus() : '';
		isFailed = true;
	}
	if (foundset.field_name && isColumnDatetime() && !date_format) {
		errorMessage = errorMessage ? errorMessage + ', Date format' : 'Date format';
		!isFailed ? elements.filterValueString.requestFocus() : '';
		isFailed = true;
	}
	
	errorMessage ? errorMessage = 'Required fields : ' + errorMessage : errorMessage;
	return !isFailed;
}

/**
 * @properties={typeid:24,uuid:"2424C411-3B7E-4D3A-9119-3D57C5AF0CE9"}
 * @AllowToRunInFind
 */
function setFieldValueValuelist () {
	
	var _valueListRealValues = new Array();
	var _valueListDisplayValues = new Array();
	var _val = solutionModel.getValueList('sea_field_values');
	
	var _form = solutionModel.getForm(globals.nav.form_view_01);
	var _field = _form.getField(field_name);
	var _valuelist = _field.valuelist;
	var i = 0
	
	if (_valuelist) {
		
		try {		
			if (_valuelist.valueListType == JSValueList.CUSTOM_VALUES) {									// Custom value list
				_val.globalMethod = null;
				_val.valueListType = JSValueList.CUSTOM_VALUES;
				
				var _arr =  _valuelist.customValues.split('\n');
				for ( i= 0 ; i< _arr.length; i++)
					_arr[i] = utils.stringTrim(_arr[i]);
					
				application.setValueListItems('sea_field_values', _arr, _arr);
			}
			
			else if (_valuelist.valueListType == JSValueList.DATABASE_VALUES) {								// Table based value list
				_val.globalMethod = null;
				_val.valueListType = JSValueList.CUSTOM_VALUES;
				
				var _sql = 'SELECT (' + _valuelist.getDisplayDataProviderIds().join('||') + '), (' +
					_valuelist.getReturnDataProviderIds().join('||') + ') FROM ' + _valuelist.tableName + ' ';
					
				if (_valuelist.relationName) {																// relation exists
				
					var _rels = _valuelist.relationName.split('.');
					
					for (i = 0 ;i < _rels.length; i++) {
					
						var _jsRel = solutionModel.getRelation(_rels[i]);
						
						var primary = _jsRel.primaryDataSource;
						var foreign = _jsRel.foreignDataSource;
						
						_sql += _jsRel.joinType == JSRelation.INNER_JOIN ? 
									'INNER JOIN ' : 'LEFT OUTER JOIN ';										// Set join type in relation
						_sql += foreign.split('/')[2] + ' ';
						_sql += 'ON ';
						var relItems = _jsRel.getRelationItems();
						
						for (var k = 0 ; k< relItems.length; k++) {
							if (k > 0)
								_sql += 'AND ';																// Add new join criteria
							_sql += primary.split('/')[2] + '.' + relItems[k].primaryDataProviderID + ' ';	// Set Join criteria
							_sql += relItems[k].operator  + ' ';
							_sql += foreign.split('/')[2] + '.' + relItems[k].foreignColumnName  + ' ';
						}
					}
				}
				
				if (_valuelist.sortOptions)
					_sql += 'ORDER BY ' + _valuelist.sortOptions;
				
//				application.output(_sql + ":"+_valuelist.serverName)
				
				var _ds = databaseManager.getDataSetByQuery(_valuelist.serverName, _sql, null, 1000);	
					
				if (_ds) {
					
					_valueListDisplayValues = _ds.getColumnAsArray(1);
					_valueListRealValues = _ds.getColumnAsArray(2);	
					
					application.setValueListItems('sea_field_values', _valueListDisplayValues, _valueListRealValues);
				}	
			}
			
			else if (_valuelist.globalMethod) {																// Global method based value list
			
				_val.globalMethod = _valuelist.globalMethod;
			}
		
		}catch (exception) {
			
		}
	}
	else {																								// Remove value list items
		application.setValueListItems('sea_field_values', [], []);
	}
	
	controller.recreateUI();
	application.updateUI();
	elements.operator.enabled = !sequence ? false : true ;
	elements.filterValueDatetime.visible = false;
	elements.filterValueString.visible = false;
	elements.date_format.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"BA8D38F4-B354-422B-8C0D-2E93BEC91244"}
 */
function isValuelistAttached() {//return true;
	if (!foundset.field_name)
		return false;
	
	var _form = solutionModel.getForm(globals.nav.form_view_01);
	var _field = _form.getField(field_name);
	
	var _valuelist = _field.valuelist;
	if (_valuelist) {
		return true;
	}
	
	return false;
}
