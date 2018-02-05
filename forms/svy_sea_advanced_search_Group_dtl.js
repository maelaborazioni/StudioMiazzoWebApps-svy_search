/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2529B8C7-E7B8-4E6B-AA3A-897A235757B2",variableType:12}
 */
var errorMessage = null;

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"84C00BAB-10FF-415B-AE2C-FE8B9B967371"}
 */
function onShow(firstShow, event) {
	setupFields();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"CA6B6A1C-11ED-4076-9EA4-0A8CCBCB77F6"}
 */
function saveEdit(event) {
	
	if (!validateRequiredFields()) {		// When required field validation failed
		return;
	}
	
	if (databaseManager.hasTransaction()) {
		databaseManager.commitTransaction(true);
	}
	
	application.getWindow('win_group').destroy();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5AE654FB-E20C-4A41-8485-63EA88510D2A"}
 */
function cancelEdit(event) {
	if (databaseManager.hasTransaction()) {
		databaseManager.rollbackTransaction();
	}
	
	application.getWindow('win_group').destroy();
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"3A1ECA92-953B-4A63-9501-B77064BE88B0"}
 */
function onHide(event) {
	if (databaseManager.hasTransaction()) {
		databaseManager.rollbackTransaction();
	}
	
	return true
}

/**
 * @properties={typeid:24,uuid:"4856768A-03E1-43A1-96F7-5F4CD5781763"}
 */
function setupFields() {
	
	errorMessage = '';
	elements.operator.enabled = !sequence ? false : true;
	elements.group_name.visible = true;
}

/**
 * @properties={typeid:24,uuid:"0404F31B-309E-460D-A81F-D4D53FB0B1A7"}
 */
function validateRequiredFields() {
	
	errorMessage = ''; 
	var isFailed = false;
	
	// Validate the required fields for a group
	if (is_group) {
		if (sequence > 0 && !operator ? true : false) {
			errorMessage = errorMessage ? errorMessage + ', Operator' : 'Operator'; 
			!isFailed ? elements.operator.requestFocus() : '';
			isFailed = true;
		}
		if (!group_name) {
			errorMessage = errorMessage ? errorMessage + ', Group name' : 'Group name';
			!isFailed ? elements.group_name.requestFocus() : '';
			isFailed = true;
		}
	}
	
	errorMessage ? errorMessage = 'Required fields : ' + errorMessage : errorMessage;
	return !isFailed;
}
