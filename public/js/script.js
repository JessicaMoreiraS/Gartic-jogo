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
    var nomesFotosPersonagens = ['rosa.png', 'baseball3.png', 'construtor1.png', 'dinossauro2.png', 'cachorroQuente2.png', 'galinha2.png', 'pombo5.png'];
    var personagemEscolhido = localStorage.getItem('personagemEscolhido');
    if(personagemEscolhido == "" || personagemEscolhido == undefined || personagemEscolhido == null){
        personagemEscolhido = 0;
    }

    var foto =`<img src="../imagens/FallGuys/${nomesFotosPersonagens[personagemEscolhido]}">`
    return foto
}


function recarregarHeader(escolhido, palavra){
    document.getElementById('boxDraw').innerHTML = "";
    if(escolhido){
        document.getElementById('headerPalavra').value = "Desenhe: "+palavra;
        document.getElementById("EscolhidoFerramentas").style= "visibility: visible;";
    }
    if(!escolhido){
        document.getElementById('headerPalavra').value = "";
        document.getElementById("EscolhidoFerramentas").style = "visibility: hidden;";
    }
}

function borracha(){
    document.getElementById("inputColor").value = "#ffffff"
}
