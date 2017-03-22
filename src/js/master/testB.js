/**
 * xuess
 * 测试JS A
 */
var dialog = require('dialog');
var artTemplate = require('artTemplate');
var md5 = require('md5');

$(function(){
	console.log('this testA.js!!，is do it！！');
	$('h1').html('jquery 修改了内容！！').hide('slow').show('slow');
	console.log(artTemplate);
	console.log(dialog);
	console.log(md5('test'));
});
