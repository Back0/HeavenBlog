1.数据包装
	经过后台服务的数据通过server的包装后返回，有统一的格式
	整体格式
	{
		operate_code:
		heaven_data:
	}
	说明：operate_code为ajax请求成功与否的标识，有两个值，
	1标识成功，0标识失败，当operate_code为0时heaven_data为空，即heaven_data = "",
	否则heaven为一个服务成功后的返回对象
    各个类型服务的heaven_data说明
	此参数为一个对象，包含两个参数
	{
		status：
		data：
	}
	说明：status为服务状态，1标识成功，0标识失败
		data为服务返回数据
			查询类：返回查询到的数据的数组
			插入类：返回一个字符串"ok"或"fail"
			修改类：返回一个字符串"ok"或"fail"
			删除类：返回一个字符串"ok"或"fail"
2.



