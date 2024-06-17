async function save(element) {
    const item = element.parentElement
    let formData = new FormData()
    const file = item.querySelector('.item-photo').files[0]
    const name = item.querySelector('.item-name').value
    const description = item.querySelector('.item-text').value
    const collection = item.querySelector('.col-type').value
    

    formData.append('photo', file)
    formData.append('productName', name)
    formData.append('description', description)
    formData.append('collection', collection)
    
    
    
    const request = new Request('http://localhost:3000/upload', {
        method: 'POST',
        mode: 'cors',
        body: formData,
    })

    console.log(request.body)

    const response = await fetch(request)
    if (response.status == 200) {
        window.location.replace('http://localhost:3000/')
    }
}