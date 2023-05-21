//CRIAR SERVIDOR PARA O CHAT
// Importando o módulo 'express' e atribuindo-o à constante 'app'
const app = require('express')();
// Importando o módulo 'http' e criando um servidor com ele, atribuindo-o à constante 'http'
const http = require('http').createServer(app);
// Importando o módulo 'socket.io' e passando o servidor 'http' como parâmetro, atribuindo-o à constante 'io'
const io = require('socket.io')(http);


//armazenar id do socket associado ao nome e pontuacao
var conectados = [];
//palavras para o jogador desenhar
var palavras = ['placa-mãe', 'computador', 'servidor', 'nuvem', 'dado', 'teclado', 'headset','programador', 'café', 'linux', 'mouse', 'rede', 'PHP', 'Java', 'Ruby', 'gabinete', 'mousepad', 'monitor', 'código'];
var palavra;
var i = 0;
var jogadorDaVez;



//usa todas as paginas do public
const express = require('express');
//const { Script } = require('vm');
app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => res.sendFile(__dirname + '/public/gartic.html'));

// Evento para quando o cliente se conecta ao servidor via Socket.io
io.on('connection', (socket) => {
    //console.log('Usuário conectado ' + socket.id);

    socket.on('entrou', (infoUser) => {
        var id = socket.id

        console.log(`Conectado: ${socket.id} - ${infoUser.nome}`);
        conectados.push([socket.id, infoUser.nome, infoUser.pontuacao]);
        
        //var usersAnteriores = conectados
        io.emit('entrou', {infoUser, id, conectados});

        if(conectados.length == 1){
            var numero = Math.floor(Math.random() * (palavras.length-1) + 1);
            var aPalavra = palavras[numero];
            palavra = aPalavra;

            var idDoDesenhista = conectados[0][0];
            var primeiraPartida = true
            //socket.emit('start', {aPalavra, idDoDesenhista, primeiraPartida});
            jogadorDaVez= idDoDesenhista
            i=1;
            io.emit('start', {aPalavra, idDoDesenhista, primeiraPartida});
        }else{
            infoUser.aPalvra = palavra;
        }
    })

    socket.on('chat message', (data) => io.emit('chat message', data));
    
    //Evento para escolher alguem do conectados[][] para poder desenhar e escolher uma palavra de palavras[]
    socket.on('start', (dados) => {
        var numero = Math.floor(Math.random() * (palavras.length-1) + 1);
        if(i>=conectados.length){
            i=conectados.length-1; //0 --testar
        }
        dados.aPalavra = palavras[numero];
        dados.primeiraPartida = false
        dados.idDoDesenhista = conectados[i][0];
        console.log('dados.idDoDesenhista: '+ dados.idDoDesenhista+ ' e i: '+i);
        jogadorDaVez = dados.idDoDesenhista
        palavra = dados.aPalavra
        
        if(dados.idDaTentativa != null && dados.idDaTentativa != undefined){
            for(x=0; x<conectados.length; x++){
                if(conectados[x][0] == dados.idDaTentativa){
                    conectados[x][2] += 5;
                    console.log('aumenta pontos de '+conectados[x]);
                    var oId = conectados[x][0] 
                }
            }
        }
        //socket.emit('start', {dados});
        io.emit('start', dados);
        i++;
        if(i >= conectados.length){
            i=0
        }
    });

    //atualizar a pontucao de quem acertou a ultima rodada
    socket.on('atualizaCard', (oId) => {
        for(var x=0; x<conectados.length; x++){
            if(conectados[x][0]== oId.idDaTentativa){
                oId.pontuacao = conectados[x][2]
                console.log('esta passando: '+ oId.pontuacao);
            }
        }
        io.emit('atualizaCard', oId)
    });
    
    // Evento para quando o cliente envia um desenho via Socket.io
    socket.on('desenharDesafio', (posicao) => io.emit('desenharDesafio', posicao));

    // Evento para quando o cliente se desconecta do servidor via Socket.io
    socket.on('disconnect', () => {
        console.log('Usuário desconectado: '+ socket.id);
        for(var a=0; a<conectados.length; a++){
            if(conectados[a][0] == socket.id){

                console.log(jogadorDaVez +' == '+ conectados[a][0])                
                if(jogadorDaVez == conectados[a][0] && conectados.length>1){
                    console.log('conectados '+conectados.length)
                    console.log('a: '+a)
                    if(a+1 < conectados.length && i==0){
                        i= a+1;
                    }
                    var numero = Math.floor(Math.random() * (palavras.length-1) + 1);
                    dados={};
                    dados.aPalavra = palavras[numero];
                    dados.primeiraPartida = false;
                    dados.idDoDesenhista = conectados[i][0];
                    
                    palavra = dados.aPalavra;
                    jogadorDaVez = dados.idDoDesenhista;
                    
                    io.emit('start', dados);
                    
                    i++;
                    if(i >= conectados.length){
                        i=0
                    }
                }
                apagarDeConectados(a)
            }
        }
        console.log("disconectado "+socket.id);
    });
});

function apagarDeConectados(a){
    conectados.splice(a,1);
}

const portaChat = 3000;
http.listen(portaChat, () => {
  console.log(`Servidor CHAT rodando na porta ${portaChat} - Link http://localhost:${portaChat}`);
});



