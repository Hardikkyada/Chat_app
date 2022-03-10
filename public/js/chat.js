
const socket = io()

const $msg_form = document.querySelector('#msg-form');
const $msg_form_input = document.querySelector('input');
const $msg_form_button  = document.querySelector('button');
const $loc = document.querySelector('#loc')
const $msgs = document.querySelector("#messages")

const temp = document.querySelector('#msg-template').innerHTML
const loctemp = document.querySelector('#loc-msg-template').innerHTML
const sidebartemp = document.querySelector('#sidbar-temp').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = ()=>{


    //new message
    const $newmsg = $msgs.lastElementChild
    //style new message
    const newmsgstyle = getComputedStyle($newmsg)
    const newmsgmargin = parseInt(newmsgstyle.marginBottom)
    const newmsgheight = $newmsg.offsetHeight + newmsgmargin    

    //console.log(newmsgstyle); 

    //visible heght
    const visibleheight = $msgs.offsetHeight

    //height of container
    const containerheight = $msgs.scrollHeight

    const scolleroffset = $msgs.scrollTop + visibleheight

    if(containerheight - newmsgheight <=  scolleroffset){
        $msgs.scrollTop = $msgs.scrollHeight 
    }
}


socket.on('message',(msg)=>{
    console.log(msg);
    const html = Mustache.render(temp,{
        username :msg.username,
        message :  msg.text,
        createAt : moment(msg.createAt).format('h:mm a')
    })
    $msgs.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('loc_message',(msg)=>{
    console.log(msg);
    const html = Mustache.render(loctemp,{
        username:msg.username,
        url:msg.url,
        createAt : moment(msg.createAt).format('h:mm a')
    })
    $msgs.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomdata',({room,users})=>{
    console.log(room);
    console.log(users);

    const html  = Mustache.render(sidebartemp,{
        room,
        users        
    })

    document.querySelector('#sidebar').innerHTML = html
})

$msg_form.addEventListener('submit',(e)=>{
    e.preventDefault()

    $msg_form_button.setAttribute('disabled','disabled')
    const msg = $msg_form_input.value;

    socket.emit('sendMsg',msg,(error)=>{
        $msg_form_button.removeAttribute('disabled')
        $msg_form_input.value = ''
        $msg_form_input.focus()

        if(error){
            return console.log(error);
        }

        console.log('meaage is delivered');
    });
})

$loc.addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation is not supported')
    }

    $loc.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position);
        socket.emit('sendLoc',{
            lat:position.coords.latitude,
            long:position.coords.longitude
        },()=>{
            console.log('Location Shared');    
            $loc.removeAttribute('disabled')  
        })
    })
})

socket.emit('join',{username,room},(error) => {
    if(error){
         alert(error)
         location.href = '/'
     }
});

/*
socket.on('countUpdated',(count) =>
{
    console.log('updated',count);
})

document.querySelector('#inc').addEventListener('click',()=>{
    console.log('click');
    socket.emit('inc')
})
*/
