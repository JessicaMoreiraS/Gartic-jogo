function acessar(){
    event.preventDefault;

    var nome = document.getElementById('nome').value
    var nSala = parseInt(document.getElementById('numeroSala').value)
    if(nome != ""){
        window.localStorage.setItem('username', nome)
        if(nSala == 123){
            window.location.href = '../gartic.html';
        }else{
            alert('sala não encontrada');
        }
    }
}

function fotoAleatoria(){
    var foto ='<img src="https://img.elo7.com.br/product/original/3E26D20/desenho-personalizado-para-perfil-desenho-personalizado.jpg">'
    return foto
}


function recarregarHeader(escolhido, palavra){
    document.getElementById('boxDraw').innerHTML = "";
    if(escolhido){
        document.getElementById('headerPalavra').value = "Desenhe: "+palavra;
    }else{
        document.getElementById('headerPalavra').value = "";
    }
}


