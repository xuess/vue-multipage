/**
 * xuess
 * 测试JS A
 */
var dialog = require('dialog');
var Vue = require('vue');
//vue 模块
var hello = require('hello');
var artTemplate = require('artTemplate');
//require('../css/testA.css');
require('../css/testAless');
require('../css/testAsass');

$(function() {
	console.log('this testA.js!!，is do it！！');
	$('h1').html('jquery 修改了内容！！').hide('slow').show('slow').html('jquery 修改8次修改');
	console.log(artTemplate);
	console.log(dialog);
	console.log(Vue);
	
	
	new Vue({
		el: '#main',
		data: {
			message: "Hello Vue"
		},
		components: {
			hello: hello
		}
	});
});