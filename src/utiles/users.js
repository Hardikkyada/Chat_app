const users = [];

const adduser = ({id,username,room}) =>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:'user name and room are Required'
        }
    }

    const existinguser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existinguser){
        return{
            error:'username is use!..'
        }
    }

    const user = {id,username,room};
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getuser = (id)=>{
    return users.find((user)=> user.id === id)
}
const getroom = (room) =>{
    room = room.trim().toLowerCase();
     return users.filter((u) => u.room === room)
}
/*
adduser({
    id:12,
    username:"hardik",
    room:'as'
})


adduser({
    id:13,
    username:"darshik",
    room:'as'
})


adduser({
    id:14,
    username:"jaydeep",
    room:'ax'
})

const user  = getuser(120);
const room = getroom('ax')
console.log(room);
console.log(user);
console.log(users);
*/

module.exports = {
    adduser,
    getroom,
    getuser,
    removeUser
}