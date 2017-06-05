/**
 * xuess
 * 测试JS A
 */
var dialog = require('dialog');
var artTemplate = require('artTemplate');
require('../../css/testAless');


$(function(){
	console.log('this testA.js!!，is do it！！');
	$('h1').html('jquery 修改了内容！！').hide('slow').show('slow');
	console.log(artTemplate);
	console.log(dialog);
});
