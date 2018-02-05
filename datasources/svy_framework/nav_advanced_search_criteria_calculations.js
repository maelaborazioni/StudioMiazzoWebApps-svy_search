/**
 * The node text for the tree showing the advanced search criterias
 * 
 * @properties={type:12,typeid:36,uuid:"43A46C95-99C3-4737-AE50-5C5B5D5E6AB3"}
 *
 */
function criteria_tree_node_text()
{	
	//TODO : Pradipta
	var _form = solutionModel.getForm(globals.nav.form_view_01);
	var _field = field_name;
	var _labels = _form.getLabels();
	for (var i = 0; i < _labels.length && field_name; i++) {
		if (_labels[i].labelFor == field_name) {
			_field = _labels[i].text;
			break;
		}
	}
				
	if (is_group == 1)
		return '<html><body>' +(operator ? operator : '') + ' ' + group_name + '</body></html>'; 
	else {
		var _retText = '<html><body>' + (operator ? operator : '') + ' <b>' + _field +'</b> ';
		
		switch (filter_operator) {
			case '=': _retText += 'equals';break;
			case '<': _retText += 'is less than';break;
			case '<=': _retText += 'is less than equals';break;
			case '>': _retText += 'is greater than';break;
			case '>=': _retText += 'is greater than equals';break;
			case 'CONTAINS': _retText += 'contains';break;
		}
		
		_retText += ' <b>'+ filter_value + '</b></body></html>';
		return _retText;
	}
}
