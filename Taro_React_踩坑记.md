# Taro

Taro是啥我就不介绍了，基于react，多端渲染框架。

个人感觉其实主要用在小程序上面，因为API对小程序的支持力度是最大的。

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

