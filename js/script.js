const baseUrl = 'https://sb-cats.herokuapp.com/api/2/Qwertyuiop0909'

const $field = document.querySelector('[data-field]') 

let openedId = 0;

$field.addEventListener('click', (event) => {
    switch(event.target.dataset.action){
        case 'delete':{
            const $currentCard = event.target.closest('[data-card_id]') 
            const currentId = $currentCard.dataset.card_id;
            api.removeCat(currentId)
                .then((result) => {
                    $currentCard.remove();
                })
                .catch((error) => console.log(`Ошибка: ${error}`))
            break
        } 
        case 'open': {
            console.log(`opened ${event.target}`)
            openedId = event.target.closest('[data-card_id]').dataset.card_id
            api.getCat(openedId)
                .then((responce) => document.body.lastElementChild.insertAdjacentHTML('beforebegin', generateModal(responce.data)))
                .then(() => {
                    const $closeModalButton1 = document.querySelector('#btn1')

                    $closeModalButton1.addEventListener('click', (event) => {
                        event.target.closest(".myModal").remove()
                        openedId = 0;  
                    })
                    const $updateButton = document.querySelector('[data-action="edit"]')

                    $updateButton.addEventListener('click', (event) => {
                        event.target.closest(".myModal").remove()
                        document.querySelector('.myModaledit').classList.remove('hidden')
                    })
                })
                .catch((error) => console.log(`Ошибка: ${error}`))
            break
        }
        default: break
    }
})


const $addButton = document.querySelector('[data-action="add"]')

$addButton.addEventListener('click', (event) => {
    document.querySelector('.myModaladd').classList.remove('hidden')
})


const $closeModalButton = document.querySelectorAll('.btn-close')

$closeModalButton.forEach((btn) => btn.addEventListener('click', (event) => {
    event.target.closest('.myModal').classList.add('hidden')      
}))


document.forms.addCat.addEventListener('submit', (event) =>{
    event.preventDefault()
    
    const formD = new FormData(document.forms.addCat)
    const Data = Object.fromEntries(formD.entries())
    Data.id = +Data.id
    Data.age = +Data.age
    Data.rate = +Data.rate
    Data.favorite = Data.favorite == 'on'
    api.addCat(JSON.stringify(Data))
        .then(() => {
            $field.insertAdjacentHTML("beforeend", generateHTMLCat(Data))
            document.querySelector('.myModaladd').classList.add('hidden')
        })
        .catch((error) => console.log(`Ошибка: ${error}`)) 
})

document.forms.updateCat.addEventListener('submit', (event) =>{
    event.preventDefault()
    
    const formD = new FormData(document.forms.updateCat)
    const Data = Object.fromEntries(formD.entries())
    Data.id = +Data.id
    Data.age = +Data.age
    Data.rate = +Data.rate
    Data.favorite = Data.favorite == 'on'
    let arr = document.querySelectorAll('.myModalEdit .mb-3')
    console.log(Data, arr)
    for (let i = 2; i < 7; i++){
        arr[i-2].value = Data[i];
    }
    // api.updateCat(JSON.stringify(Data))
    //     .then(() => {
    //         $field.insertAdjacentHTML("beforeend", generateHTMLCat(Data))
    //         document.querySelector('.myModaledit').classList.add('hidden')
    //     })
    //     .catch((error) => console.log(`Ошибка: ${error}`)) 
})

const generateHTMLCat = (cat) => `<div data-card_id=${cat.id} class="card" style="width: 18rem;">
<img src="${cat.img_link}" class="card-img-top" alt="${cat.name}">
<div class="card-body">
  <h5 class="card-title">${cat.name}(${cat.id}, age:${cat.age})</h5>
  <p class="card-text">${cat.description}</p>
  <button data-action="open" class="btn btn-primary">Open card</button></a>
  <button data-action="delete" class="btn btn-danger">Delete</button></a>
</div>
</div>`

const generateModal = (cat) => `<div class="myModal myModalopen card">
<div class="myModal__container">
<button class="btn-close" id="btn1" aria-label="Close" style="display: block; margin-bottom: 10px"></button>
<img src="${cat.img_link}" class="card-img-top" alt="${cat.name}" style="width: 300px">
<div class="card-body">
  <h5 class="card-title">-ID: ${cat.id},</h5>
  <h5 class="card-title">-Age: ${cat.age},</h5>
  <h5 class="card-title">-Name: ${cat.name},</h5>
  <h5 class="card-title">-Rate: ${cat.rate},</h5>
  <h5 class="card-title">-Description: ${cat.description},</h5>
  <h5 class="card-title">-Favorite: ${cat.rate ? 'Yes' : 'No'},</h5>
  <h5 class="card-title">-Img link: ${cat.img_link}</h5>
  <button data-action="edit" class="btn btn-primary">Edit</button></a>
</div>
</div>
</div>`

class API{
    constructor(url){
        this.url = url;
    }

    
    async getAllCats(){
        try{
            const responce = await (await fetch(`${this.url}/show`)).json();
            return responce;
        }
        catch (error){
            throw Error(error)
        }
    }

    async getCat(ID){
        try{
            const responce = await (await fetch(`${this.url}/show/${ID}`)).json();
            return responce;
        }
        catch (error){
            throw Error(error)
        }
    }

    async removeCat(ID){
        try{
            const responce = await fetch(`${this.url}/delete/${ID}`, {
                method: 'DELETE'
            });
            const result = await responce.json();

            if (responce.status !== 200){
                throw new Error(result.message)
            }

            return result;
        }
        catch (error){
            throw Error(error)
        }
    }

    async addCat(data){
        try{
            const responce = await fetch(`${this.url}/add`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });
            const result = await responce.json();

            if (responce.message !== 'ok'){
                throw new Error(result.message)
            }

            return result;
        }
        catch (error){
            throw Error(error)
        }
    }

    async updateData(ID){
        try{
            const responce = await fetch(`${this.url}/update/${ID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });
            const result = await responce.json();

            if (responce.message !== 'ok'){
                throw new Error(result.message)
            }

            return result;
        }
        catch (error){
            throw Error(error)
        }
    }
}

const api = new API(baseUrl);

api.getAllCats()
    .then((responce) => responce.data.forEach(
        (a) => $field.insertAdjacentHTML("beforeend", generateHTMLCat(a))
    ))
    .catch((error) => console.log(`Ошибка: ${error}`)) 

