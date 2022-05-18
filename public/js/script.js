const textArea = document.querySelector('#textarea');
const submitBtn = document.querySelector('#submit-btn'); 
const typingDiv = document.querySelector('.typing')
let socket = io(); //provides socket methods
let user;

do {
    user = prompt("Enter your Name : ");
} while (!user);

let timerId = null;
const debounce = function(func, timer){
    if(timerId){
        clearTimeout(timerId);
    }
    timerId = setTimeout(()=>{
        func();
    },timer)
}
const appendToDom = function(data){
    const litag = `
    <li class="comment">
        <div class="card border-light mb-3">
            <div class="card-body">
                <h6>${data.username}</h6>
                <p>${data.comment}</p>
                <div>
                <span class="material-symbols-outlined">schedule</span>
                <small>${moment(data.time).format('LT')}</small>
                </div>
            </div>
        </div>
    </li>
    `
    commentBox.insertAdjacentHTML('beforeend', litag);
}
const broadcastComment = function(data){
    //socket
    socket.emit('comment', (data))
}
const postComment = function(comment){
    //apend to dom
    let data = {
        username: user,
        comment
    }
    appendToDom(data);
    textArea.value = "";
    //broadcast
    // taaki aur logo tk pahuche
    broadcastComment(data);
    //sync with mdb
    syncWithDB(data);

}
const commentBox = document.querySelector('.comment-box');

submitBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    let comment = textArea.value.trim();

    if(!comment) return;
    postComment(comment);
})
textArea.addEventListener('keyup', (e)=>{
    socket.emit('typing', {username : user});
})
socket.on('comment', (data) => {
    appendToDom(data);
})
socket.on('typing', (data)=>{
    //after the events stops coming, after the below given time we will clear the text
    debounce(function(){
        typingDiv.innerText = '';
    },1000);
    typingDiv.innerText = `${data.username} is typing...`;
});
//API CALLS
async function syncWithDB(data){
    const headers = {
        'Content-Type': 'application/json'
    }
    const res = await fetch('/api/comments', {
        method:"POST",
        body:JSON.stringify(data),
        headers
    });
    const resfinal = await res.json();
}
async function fetchComments(){
    const res =  await fetch('/api/comments/');
    const resfinal = await res.json();
    resfinal.forEach(cmnt => {
        cmnt.time = cmnt.createdAt;
        appendToDom(cmnt);
    });
}
window.addEventListener('load', fetchComments);