# Taro

Taro是啥我就不介绍了，基于react，多端渲染框架。

个人感觉其实这个框架仍然主要用在小程序上面，因为API对小程序的支持力度是最大的。
基于react，支持redux状态管理，完全的组件化实现，用起来我觉得OK。
	
	ps：在这里要吐槽一下wepy，wepy也是一个小程序的框架，
		这个框架最开始我觉得既然是基于vue，那用起来应该都还OK，
		事实是，wepy并非真正的vue，
		有点像是一个阉割、魔改之后的东西，
		缺少完全的组件化支持、缺少状态管理、父子组件通信全部用event bus实现
		最终写出来的代码可维护性并不强，所以最后，割肉放弃，换了Taro。

## 第一个坑：@connect

这个其实不是Taro本身的坑，而是react踩到的坑。

	Taro给出的例子是这样的，
	设为【写法1】：
		import { add, minus, asyncAdd } from '../../actions/counter'
	    @connect(({ counter }) => ({
	        counter
	    }), (dispatch) => ({
	        add () {
	            dispatch(add())
	        },
	        dec () {
	            dispatch(minus())
	        },
	        asyncAdd () {
	            dispatch(asyncAdd())
	        }
	    }))
	
	@connect是 connect(mapState,mapActions)(ComponentName)的语法糖，
	而mapActions，这里采用了枚举的方式去映射actions
	其实可以借助redux提供的bindActionCreators方法，批量映射actions，
	设为【写法2】，like this：
	
	import { bindActionCreators } from "redux";
	import * as COUNTER from '../../actions/counter'
	@connect(({ counter }) => ({
	  counter
	}), (dispatch)=>{
	  return {
	    actions:bindActionCreators({
	      ...COUNTER
	    },dispatch)
	  }
	})
	
	在 componentWillMount 的生命周期里，
	this.props里面会有一个actions对象，里面放了add, minus, asyncAdd三个方法，
	接着，我们给某个元素绑定onClick事件，在onClick事件中，console.log(this.props),
	
	会发现！！！
	actions不见了！里面的add, minus, asyncAdd三个方法不见了！actions值为null！

最后直接说结论吧，这个涉及到bindActionCreators的原理。

	比如这里 import * as COUNTER from '../../actions/counter'
	COUNTER是一个对象，里面有三个函数：{ add, minus, asyncAdd }
	
	(dispatch)=>{
	  return {
	    actions:bindActionCreators({
	      ...COUNTER
	    },dispatch)
	  }
	}
	这一段的结果就是返回了一个对象： { actions:{ add () {dispatch(add()), ... } } }
	并且在 componentWillMount 里面的this.props中，
	add，minus，asyncAdd都是在actions这个对象里面，这显然与【写法1】的结果不一样啊
	bindActionCreators函数调用本身返回的是一个对象，里面包含了那些actions
	
	正确的写法：
	(dispatch) => ({
	   ...bindActionCreators({
	     ...LIST_ACTIONS
	   },dispatch)
	})
	
	这个写法的效果等同于【写法1】

## 第二个坑：条件渲染

	vue的条件渲染写法是这样的：
		<div v-if="isShow"></div>
	
	react的条件渲染是这样的：
		{ this.state.isShow && <div v-if="isShow"></div> }

	有一些极端的情况，多条件语句，前置条件应用括号括起来

	错误的示例：
		{ this.state.isShow || this.state.isLicence && <div v-if="isShow"></div> }

	正确的示例：
		{ (this.state.isShow || this.state.isLicence) && <div v-if="isShow"></div> }

	当然，react还可以在render函数的return之前，使用if语句自定义一个jsx变量的赋值，
	来决定渲染哪一块的内容，总的来看，还是直接写jsx里面舒服些。

## 第三个坑：微信小程序富文本渲染

	在微信小程序下会用到wxParse这个东西来达到html转换wxml的效果，
	但是这是在Taro下，官方给出了一个混写的示例。
	在这里，封装一个组件，命名为WxParseComponent.js
	
	WxParseComponent.js
		import Taro, { Component } from '@tarojs/taro'
		import { View } from '@tarojs/components'
		import WxParse from '../../assets/js/wxParse/wxParse'
		import '../../assets/css/wxParse.less'
		export default class ParseComponent extends Component {
		    componentDidMount () { }
		    defaultProps = {
		        mark:""
		    }
		    render () {
		    	//在这里进行转化
		        if(this.props.mark){
		            let domText = this.props.mark;
		            WxParse.wxParse('domText', 'html', domText, this.$scope, 5);
		        }
		        return (
		            <View>
		                    {	
		                    	/* 在此处进行判断环境，决定是否渲染wxParse的内容 */
		                        process.env.TARO_ENV === 'weapp' ? 
		                        <View>
		                            <import src='../../assets/js/wxParse/wxParse.wxml' />
		                            <template is='wxParse' data='{{wxParseData:domText.nodes}}'/>
		                        </View> : <View>只在小程序里支持</View>
		                    }
		            </View>
		        )
		    }
		}

		外部引用：
			<ParseComponent mark={this.state.remark}></ParseComponent>
			其中，this.state.remark为带html标签的富文本字符串

## 第四个坑：数据更新，视图没有更新

	vue里面有这个问题，主要原因是给对象赋予了新的属性后出现，新的属性不具备响应式的特征。

	react的主要是出现在redux状态管理中，在更新state的reducer操作中，对state的操作具有了副作用，将会导致数据更新，而视图没有更新。

