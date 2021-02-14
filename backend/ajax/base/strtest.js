
let checkNum = /[0-9]/;
let checkEng = /[a-zA-Z]/;
let checkSpc = /[~!@#$%^&*()_+|<>?:{}]/;
let checkKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

module.exports = {
    testLen : function testLen(str, minlen, maxlen){
    	len = str.length;
    	if(len>=minlen && len<=maxlen){
    		return true;
    	} else {
    		return false;
    	}
    },

    testNumber : function testNumber(str){
    	return checkNum.test(str);
    },

    testEng : function testEng(str){
    	return checkEng.test(str);
    },

    testSpc : function testSpc(str){
    	return checkSpc.test(str);
    },

    testKor : function testKor(str){
    	return checkKor.test(str);
    }
};