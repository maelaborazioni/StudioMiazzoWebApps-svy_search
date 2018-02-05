/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3E345F0B-3F69-4AAB-8EE5-F6DA8776D159",variableType:12}
 */
var vSearchFilter = null;

/**
 *	Filter the data uses vFoundsetFilter
 *
 * @author Sanneke Aleman
 * @since 2007-11-24
 * @return  none
 * 
 * @properties={typeid:24,uuid:"31A9C7F4-DD5E-43BF-B558-5F8213DE4901"}
 * @AllowToRunInFind
 */
function filter() {
	if (controller.find()) {	
		name = '#%' + vSearchFilter + '%';	
		controller.search();
	}
}
