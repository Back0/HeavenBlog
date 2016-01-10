/**
 * Created by Anne on 16/1/10.
 */


Number.prototype.leading = function(){
    return this <= 9 ? '0' + this : this;
};



module.exports = {
    format : function (date){
        return date.getFullYear() + '年'
            + date.getMonth() + 1 + '月'
            + date.getDate() + '日 '
            + date.getHours().leading()+ ':'
            + date.getMinutes().leading() + ':'
            + date.getSeconds().leading()

    }

};