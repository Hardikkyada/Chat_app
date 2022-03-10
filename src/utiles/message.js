const genMsg = (username,text) =>{
    return{
        username,
        text:text,
        createAt:new Date().getTime()
    }
}

const genLoc = (username,url) =>{
    return{
        username,
        url,
        createAt:new Date().getTime()
    }
}

module.exports = {
    genMsg,genLoc
}