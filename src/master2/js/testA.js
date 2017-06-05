/**
 * xuess
 * 测试JS A
 */
 import Vue from 'vue';
 import hello from 'hello';
 import artTemplate from 'artTemplate';
require('../css/testAless');
//require('../css/testAsass');

//$(function() {
//	console.log('this testA.js!!，is do it！！');
//	$('h1').html('jquery 修改了内容！！').hide('slow').show('slow').html('jquery 修改8次修改');
//	console.log(artTemplate);
//	console.log(Vue);
	
	new Vue({
		el: '#mainTest',
		data: {
			message: "Hello Vue3！！"
		},
		components: {
			hello: hello
		}
	});
