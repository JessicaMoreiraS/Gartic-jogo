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
var palavras = ['placa-mãe', 'computador', 'servidor', 'nuvem', 'dado', 'teclado', 'headset','programador', 'café', 'linux']
var palavra;

var i = 1;



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
        io.emit('entrou', {infoUser, id});
        console.log(`Conectado: ${socket.id} - ${infoUser.nome}`);
        conectados.push([socket.id, infoUser.nome, 0]);
        
        if(conectados.length == 1){
            var numero = Math.floor(Math.random() * (palavras.length-1) + 1);
            var aPalavra = palavras[numero];
            palavra = aPalavra;

            var idDoDesenhista = conectados[0][0];
            var primeiraPartida = true
            //socket.emit('start', {aPalavra, idDoDesenhista, primeiraPartida});
            io.emit('start', {aPalavra, idDoDesenhista, primeiraPartida});
        }else{
            infoUser.aPalvra = palavra;
        }
    })

    socket.on('chat message', (data) => io.emit('chat message', data));
    
    //Evento para escolher alguem do conectados[][] para poder desenhar e escolher uma palavra de palavras[]
    socket.on('start', (dados) => {
        var numero = Math.floor(Math.random() * (palavras.length-1) + 1);
        dados.aPalavra = palavras[numero];
        dados.primeiraPartida = false
        dados.idDoDesenhista = conectados[i][0];
        palavra = dados.aPalavra
        
        if(dados.idDaTentativa != null && dados.idDaTentativa != undefined){
            for(x=0; x<conectados.length; x++){
                if(conectados[x][0] == dados.idDaTentativa){
                    conectados[x][2] += 5;
                    console.log('aumenta pontos de '+conectados[x]);
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

    
    // socket.on('play', idAcertou =>{
    //     console.log('aquiii '+idAcertou)

    //     io.emit('replay', idAcertou);

    //     var numero = Math.floor(Math.random() * (palavras.length-1) + 1);
    //     var palavraDaVez = palavras[numero];
    //     socket.emit('start', palavraDaVez);
            
    //     var socketId = conectados[i][0];
    //     console.log(socketId);
    //     console.log(i);
    //     socket.emit('escolhido', socketId);
        
    //     console.log('i é '+i);
    //     console.log(conectados);
    // })

    
    // Evento para quando o cliente envia um desenho via Socket.io
    socket.on('desenharDesafio', (posicao) => io.emit('desenharDesafio', posicao));

    // Evento para quando o cliente se desconecta do servidor via Socket.io
    socket.on('disconnect', () => {
        console.log('Usuário desconectado: '+ socket.id);
        for(var a=0; a<conectados.length; a++){
            if(conectados[a][0] == socket.id){
                conectados.splice(a,1);
            }
        }
        console.log("disconectado "+socket.id);
    });
});



const portaChat = 3000;
http.listen(portaChat, () => {
  console.log(`Servidor CHAT rodando na porta ${portaChat} - Link http://localhost:${portaChat}`);
});



