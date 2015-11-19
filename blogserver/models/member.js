
//
/**
 * 用户对象的构造函数，每个用户需要
 * member对象为传入参数，以此来创建用户对象
 * name：为用户昵称（必须）
 * password：登陆密码（必须）
 * email：邮箱账号，用户的唯一标识，以此作为登陆名
 * 
 */
function Member(member) {
	this.nickname = member.nickName;
	this.password = member.password;
	this.email = member.email;
};

module.exports = Member;