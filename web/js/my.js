 /* LINK
 * https://opentdb.com/api.php?amount=10&category=18&difficulty=easy
 * 
 * A dificuldade pode ser easy ou medium
 * categoria 21 - Desporto
 * categoria 15 - video jogos
 * categoria 18 - computadores/informatica
 * 
 */

$(document).ready(function(){
    //$("#contentor").load("inicio_menu.html");
    
    var dificuldade; //dificuldade facil(easy) / dificuldade media(medium)
    var sdificuldade;
    var categoria;
    var scategoria;
    var perguntas = new Array();
    var nrpergunta = -1;
    var nomeJogador;
    var pontuacaoFinal;
    //no array respotas tera o valor 3 caso tenha acertado na respota e tera o valor 0;1;2 caso tenha errada na pergunta e o seu valor ira corresponder a sau posicao no array de incorretas
    var respostas = new Array();
    var topTen = new Array(10);
    var FavQuestions = new Array();
    var arrayCategorias = new Array();
    
//    localStorage.clear();
    
    if (typeof(Storage) !== "undefined") {
        //localStorage.setItem('topTen', JSON.stringify(topTen));
        var retrievedObject = localStorage.getItem('FavQuestions');
        FavQuestions = JSON.parse(retrievedObject);
        if(FavQuestions == null){
            FavQuestions = new Array();
        }
        var retrievedObject2 = localStorage.getItem('topTen');
        topTen = JSON.parse(retrievedObject2);
        if(topTen == null){
            topTen = new Array(10);
            for(var i = 0;i<topTen.length;i++){
                topTen[i] = new Array(4);
                topTen[i][0] = "";
                topTen[i][1] = 0;
                topTen[i][2] = "";
                topTen[i][3] = "";
            }
        }
        var nrper = localStorage.getItem('nrpergunta');
        if(nrper != null){
            nrpergunta = parseInt(nrper);
            nomeJogador = localStorage.getItem('nomeJogador');
            var retrievedObject3 = localStorage.getItem('perguntas');
            perguntas = JSON.parse(retrievedObject3);
            var retrievedObject4 = localStorage.getItem('respostas');
            respostas = JSON.parse(retrievedObject4);
            dificuldade = localStorage.getItem('dificuldade');
            sdificuldade = localStorage.getItem('sdificuldade');
            categoria = localStorage.getItem('categoria');
            scategoria = localStorage.getItem('scategoria');
            $("#contentor").html("<div id='random_menu'>\n\
                            <h1>The previous game was not finished, you prefer to end the game or starting a new one?</h1>\n\
                            <button id='butaoAcabarJogo' type='button' style=' margin:30px; height: 100px; font-size: 35px;' class='btn btn-primary'>Finish the game</button>\n\
                            <button id='butaoComecarNovo' type='button' style=' margin:30px; height: 100px; font-size: 35px;' class='btn btn-primary'>Restart the game</button>\n\
                            </div>");
            //comecarAsPerguntas((nrpergunta));
        }
    } else {
        alert("Your browser does not support Web Storage...");
    }
    
    $(document).on("click","#butaoAcabarJogo",function(){
        comecarAsPerguntas((nrpergunta));
    });
    
    $(document).on("click","#butaoComecarNovo",function(){
        resetVariaveis();
        $("#contentor").html("<div id='div_butoes_inicio_menu'>\n\
                            <img src='imagens/trivia.png' alt='triviaimg' height='100px' width='200px'>\n\
                            <button id='butaoIniciarJogo' type='button' style='display: block; margin:15px; width:250px ; height: 125px; font-size: 35px;' class='btn btn-primary btn-lg' >Start game</button>\n\
                         </div>");
    });
    
    //REMOVER O COMENTARIO PARA O CODIGO FUNCIONAR
    //Butao adicionar
    if(nrpergunta == -1){
        $("#contentor").html("<div id='div_butoes_inicio_menu'>\n\
                            <img src='imagens/trivia.png' alt='triviaimg' height='100px' width='200px'>\n\
                            <button id='butaoIniciarJogo' type='button' style='display: block; margin:15px; width:250px ; height: 125px; font-size: 35px;' class='btn btn-primary btn-lg' >Start game</button>\n\
                         </div>");
    }
    

    $(document).on("click","#butaoIniciarJogo",function(){
        $("#contentor").html("<div id='div_escolher_dificuldade'>\n\
                                <h1>Choose a difficulty</h1>\n\
                                <button id='butaoDificuldadeFacil' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Easy</button>\n\
                                <button id='butaoDificuldadeMedia' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Medium</button>\n\
                            </div>");  
    });
    
    $("#btnHome").click(function(){
        resetVariaveis();
        $("#contentor").html("<div id='div_butoes_inicio_menu'>\n\
                                <button id='butaoIniciarJogo' type='button' style='display: block; margin:15px; width:250px ; height: 125px; font-size: 35px;' class='btn btn-primary btn-lg' >Start game</button>\n\
                             </div>");
    });
    
    
    
    $(document).on("click","#btnTopTen",function(event){
        topTenf();
        event.preventDefault();
    });
    
    function topTenf(){
        var html = "<div id='divTopTen'>\n\
                        <h1>Top 10 Players</h1>\n\
                        <table id='tableTopTen'>\n\
                            <tr>\n\
                              <th>   Name   </th>\n\
                              <th>Score</th>\n\
                              <th>Difficulty</th>\n\
                              <th>Category</th>\n\
                            </tr>";
        for(var i = 0;i<topTen.length;i++){
            if(topTen[i][0] == ""){
                html += "<tr>\n\
                        <td> </td>\n\
                        <td> </td>\n\
                        <td> </td>\n\
                        <td> </td>\n\
                    </tr>";
            }else{
                html += "<tr>\n\
                        <td>"+ topTen[i][0] +"</td>\n\
                        <td>"+ topTen[i][1] +"</td>\n\
                        <td>"+ topTen[i][2] +"</td>\n\
                        <td>"+ topTen[i][3] +"</td>\n\
                    </tr>";
            }
        }
        html+="</table>\n\
                <button id='butaoResetarTopTen' type='button' style='margin:15px; height: 50px;' class='btn btn-primary btn-lg' >Reset top 10 players</button>\n\
               </div>"
        $("#contentor").html(html);
    }
    
    $(document).on("click","#butaoResetarTopTen",function(event){
        if (typeof(Storage) !== "undefined") {
            topTen = new Array(10);
            for(var i = 0;i<topTen.length;i++){
                topTen[i] = new Array(2);
                topTen[i][0] = "";
                topTen[i][1] = 0;
                topTen[i][2] = "";
                topTen[i][3] = "";
            }
            localStorage.setItem('topTen', JSON.stringify(topTen));
            topTenf();
        } else {
            alert("Your browser does not support Web Storage...");
        }
    });
    
    $(document).on("click","#btnFavQuestion",function(event){
        favQuestions();
        event.preventDefault();
    });
    
    function favQuestions(){
        var html = "<div id='divFavQuestion'>";
        for(var i = 0;i<FavQuestions.length;i++){
            if(FavQuestions[i].type == "boolean"){
                //codigo de html com os botoes verdadeiro e falso.
                html += "<div id='div_true_falseFavQuestion' class='divsFavQuestions'>\n\
                             <h2>" + FavQuestions[i].question + "</h2>";
                    html += "<button id='botaoRespostaCorretaFavQuestion' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-success'>" + FavQuestions[i].correct_answer + "</button>";
                    html += "<button id='botaoRespostaIncorretaFavQuestion' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-danger'>" + FavQuestions[i].incorrect_answers; + "</button>";
                    html += "<button id='perguntafavFavQuestions' type='button' class='butaofav_color' value='" + i + "'>\n\
                            </div>";
            }else{
                html += "<div id='div_escolha_multiplaFavQuestion' class='divsFavQuestions'>\n\
                            <h2>" +  FavQuestions[i].question + "</h2>";
                html += "<button id='botaoRespostaCorretaFavQuestion' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-success'>" + FavQuestions[i].correct_answer + "</button>";
                for(var ii=0;ii<3;ii++){
                    //adicionar a variavel butoes um botao com a incorrectanswers
                    html += "<button id='botaoRespostaIncorretaFavQuestion' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-danger'>" + FavQuestions[i].incorrect_answers[ii]; + "</button>"; 
                }
                html += "<button id='perguntafavFavQuestions' type='button' class='butaofav_color' value='" + i + "'>\n\
                            </div>";
            }
        }
        html+="</div>"
        
        if(FavQuestions.length == 0){
            html = "<div id='random_div' style='text-align: center;'><h1>You don't have any question marked as favorite, so play some games and some questions!</h1>";
            html += "<button id='playGameFromFav' type='button' style=' margin:30px;  height: 100px; font-size: 50px;' class='btn btn-primary'>Play</button></div>";
        }
        
        $("#contentor").html(html);
    }
    
    $(document).on("click","#playGameFromFav",function(){
        $("#contentor").html("<div id='div_escolher_dificuldade'>\n\
                                <h1>Choose a difficulty</h1>\n\
                                <button id='butaoDificuldadeFacil' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Easy</button>\n\
                                <button id='butaoDificuldadeMedia' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Medium</button>\n\
                            </div>");  
    });
    
    $(document).on("click","#perguntafavFavQuestions",function(){
        FavQuestions.splice($(this).val(),1);
        localStorage.setItem('FavQuestions', JSON.stringify(FavQuestions));
        favQuestions();
    });
    
    
    
    $(document).on("click","#butaoDificuldadeFacil",function(){
	sdificuldade = "Easy";
        escolherDificuldade("easy");
    });
    $(document).on("click","#butaoDificuldadeMedia",function(){
	sdificuldade = "Medium";
        escolherDificuldade("medium");
    });
    
    
    function escolherDificuldade(id){
        dificuldade = id;
        var link = "https://opentdb.com/api_category.php";
        $.getJSON(link, function(data) {
            arrayCategorias = data.trivia_categories;
            var html = "<div id='div_escolher_categoria'>";
            if(arrayCategorias == null){
                html += "<h1>ERROR LOADING DATABASE DATA</h1>";
            }else{
                html +="<h1>Choose a category</h1><br><button type='button' id='botaoRandom' class='btn btn-primary butoesCategoriaRandom'>Random</button><br>";
                for(var i = 0;i <arrayCategorias.length;i++){
                    html += "<button type='button' value='"+arrayCategorias[i].id+"' class='btn btn-primary butoesCategoria'>"+ arrayCategorias[i].name +"</button><br>";
                }
            }
            html += "</div>";
            $("#contentor").html(html);
        });
    }
    
    
    $(document).on("click",".butoesCategoria",function(){
        escolherCategoria($(this).val(),$(this).text());
    });
    
    $(document).on("click","#botaoRandom",function(){
        escolherCategoria(-1,"");
    });
    
    
    function escolherCategoria(cat,scat){
        categoria = cat;
        scategoria = scat;
        if(cat == -1){
            var random = Math.floor((Math.random() * arrayCategorias.length));
            categoria = arrayCategorias[random].id;
            scategoria = arrayCategorias[random].name;
        }
        iniciarJogo();
        //generarLinkAPI();
    }
	
    function iniciarJogo(){
        $("#contentor").html("<div id='div_iniciar_jogo'>\n\
                        <h2>Game settings</h2><br>\n\
                        <h3>Difficulty: "+ sdificuldade +"</h3><br>\n\
                        <h3>Category: "+ scategoria +" </h3><br>\n\
                        <input type='text' id='username' name='username' placeholder='Your name...' style=text-align:center><br>\n\
                        <button id='iniciarJogoUsername' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Start</button>\n\
                    </div>"); 
      
    }

    $(document).on("click","#iniciarJogoUsername",function(){
            nomeJogador = $('#username').val();
            if(nomeJogador != "" && nomeJogador.length > 2){
                generarLinkAPI();
            }else{
                alert("Name must have at least 3 characters!");
            }
    });
    
    function generarLinkAPI(){
        var link = "https://opentdb.com/api.php?amount=10&category=" + categoria + "&difficulty="+ dificuldade;
        $.getJSON(link, function(data) {
            if(data.response_code == 0){
                //data is the JSON string
                //criar array com isto, e assim que s saca a informacao do data
                perguntas = data.results;
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem('perguntas', JSON.stringify(perguntas));
                    localStorage.setItem('nomeJogador', nomeJogador);
                    localStorage.setItem('dificuldade', dificuldade);
                    localStorage.setItem('sdificuldade', sdificuldade);
                    localStorage.setItem('categoria', categoria);
                    localStorage.setItem('scategoria', scategoria);
                    //get local storage
                    //var retrievedObject = localStorage.getItem('perguntas');
                    //perguntas = JSON.parse(retrievedObject);

                    //Envio o 0 para comecar a contar desde o 0;
                    comecarAsPerguntas(0);
                } else {
                    alert("Your browser does not support Web Storage...");
                }
            }else{
                $("#contentor").html("<div id='div_escolher_dificuldade'><h1>Something went bad, try with another parameter</h1><br><button id='escolherDificuldadeAgain' type='button' style=' margin:30px; width:500px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Change parameters</button></div>"); 
            }
        });
    }
    
    $(document).on("click","#escolherDificuldadeAgain",function(){
        $("#contentor").html("<div id='div_escolher_dificuldade'>\n\
                                <h1>Choose a difficulty</h1>\n\
                                <button id='butaoDificuldadeFacil' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Easy</button>\n\
                                <button id='butaoDificuldadeMedia' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Medium</button>\n\
                            </div>");  
    });
    
    function comecarAsPerguntas(id){
        localStorage.setItem('respostas', JSON.stringify(respostas));
        nrpergunta = id;
        localStorage.setItem('nrpergunta', nrpergunta);
        if(perguntas[nrpergunta].type == "boolean"){
            //codigo de html com os botoes verdadeiro e falso.
            var random = Math.floor((Math.random() * 2) + 1);
            var butoes = "<div class='div_true_false'>\n\
                            <h2>" + (nrpergunta+1) + " - " + perguntas[nrpergunta].question + "</h2>";
            //para a correta n ficar sempre em cima
            if(random == 1){
                 butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primary'>" + perguntas[nrpergunta].correct_answer + "</button>";
                 butoes += "<button id='botaoRespostaIncorreta0' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primary'>" + perguntas[nrpergunta].incorrect_answers; + "</button>";
            }else{
                 butoes += "<button id='botaoRespostaIncorreta0' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primary'>" + perguntas[nrpergunta].incorrect_answers; + "</button>";
                 butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primary'>" + perguntas[nrpergunta].correct_answer + "</button>";
            }
                butoes += "<button id='perguntafav' type='button' class='butaofav_empty'></button>\n\
                       </div>";
            $("#contentor").html(butoes);
        }else{
            //codigo para escolher um botao aleatoriamente para ser a opcao certa.
            //O primeiro numero do array vai ser o numero que tera a resposta correta
            var correto = Math.floor((Math.random() * 4) + 1);
            var butoes = "<div class='div_escolha_multipla'>\n\
                            <h2>" + (nrpergunta+1) + " - " + perguntas[nrpergunta].question + "</h2>";
            var ii = 0;	
            for(var i=1;i<=4;i++){
                if(i == correto){
                    //adicionar a variavel butoes um botao com a respota correta
                    butoes += "<button id='botaoRespostaCorreta' type='button' style='display: block; margin:30px; height: 50px; font-size: 20px;' class='btn btn-primary'>" + perguntas[nrpergunta].correct_answer + "</button>";
                }else{
                    //adicionar a variavel butoes um botao com a incorrectanswers
                    butoes += "<button id='botaoRespostaIncorreta" + ii + "' type='button' style='display: block; margin:30px;  height: 50px; font-size: 20px;' class='btn btn-primary'>" + perguntas[nrpergunta].incorrect_answers[ii]; + "</button>";
                    ii++;
                }
            }
            
            //butoes += "</div>";
            butoes += "     <button id='perguntafav' type='button' class='butaofav_empty'></button>\n\
                       </div>";
            
            //adicionar a variavel butoes butoes para adicionar aos favs. FALTA FAZER ISTO
            //codigo de html com 4 botoes para fazer os 4 opcoes de escolhas.
            $("#contentor").html(butoes);
        }
    }
    
    $(document).on("click","#perguntafav",function(){
        if($('#perguntafav').hasClass('butaofav_empty')){
            $('#perguntafav').removeClass('butaofav_empty');
            $('#perguntafav').addClass('butaofav_color');
            FavQuestions.push(perguntas[nrpergunta]);
            localStorage.setItem('FavQuestions', JSON.stringify(FavQuestions));
        }else{
            $('#perguntafav').removeClass('butaofav_color');
            $('#perguntafav').addClass('butaofav_empty');
            FavQuestions.pop();
            localStorage.setItem('FavQuestions', JSON.stringify(FavQuestions));
        }
    });
    
    
    $(document).on("click","#botaoRespostaCorreta",function(){
        respostas.push("3");
        proximaPergunta();
    });
    
    $(document).on("click","#botaoRespostaIncorreta0",function(){
        respostas.push("0");
        proximaPergunta();
    });
    
    $(document).on("click","#botaoRespostaIncorreta1",function(){
        respostas.push("1");
        proximaPergunta();
    });
    
    $(document).on("click","#botaoRespostaIncorreta2",function(){
        respostas.push("2");
        proximaPergunta();
    });
    
    function proximaPergunta(){
        localStorage.setItem('respostas', JSON.stringify(respostas));
        if((nrpergunta+1) == (perguntas.length)){
            //CODIGO PARA ACABAR AS PERGUNTAS - mostrar pontuacao
            mostrarPontuacao();
            verificarTopTen();
            //RESET DO JOGO //RESETAR VARIAVEIS GUARDADAS NO BROWSER
            resetAlgumasVariaveis();
            //resetVariaveis();
            //VOLTAR A PAGINA INICIAL
        }else{
            comecarAsPerguntas((nrpergunta+1));
        }
    }
    
    function mostrarPontuacao(){
        var pont = 0;
        //fazer as contas apra a pontuacao
        for(var i = 0; i<= respostas.length; i++){
            if(respostas[i] == 3){
                pont++;
            }
        }
        pontuacaoFinal = pont;
        //generar html com os resultados finais
        // style='overflow-y: scroll;height:100%;'
        var correto = 0;
         
        var html =  "<div id='pontuacao' >\n\
                        <h1 style='text-align: center' id='hpontuacao'>FINAL SCORE: " + pont + "/" + perguntas.length + "</h1><br><br><br>";
        html += "<div id='butoesRepetir'>\n\
                    <button type='button' id='botaoRepetirIgual' class='btn btn-primary jogarNovamente'>Play again with same parameters</button>\n\
                    <button type='button' id='botaoRepetir' class='btn btn-primary jogarNovamente2'>Play again</button>\n\
                 </div>";
        for(var i = 0; i < perguntas.length; i++){
            html +="<div id='divpontuacao" + i + "' class='divpontuacoes'>\n\
                        <h3>" + (i+1) + " - " + perguntas[i].question + "</h3>\n\
                        <h4>Correct answer:</h4><button type='button' style='margin:30px; height: 50px; font-size: 20px;' class='btn btn-success'>" + perguntas[i].correct_answer + "</button>";
            
            if(respostas[i] != 3){
                html += "<h4>Selected answer:</h4><button type='button' style='margin:30px; height: 50px; font-size: 20px;' class='btn btn-danger'>" + perguntas[i].incorrect_answers[respostas[i]] + "</button>";
            }else{
                correto = 1;
                html += "<h4>Selected answer:</h4><button type='button' style='margin:30px; height: 50px; font-size: 20px;' class='btn btn-success'>" + perguntas[i].correct_answer + "</button>";
            }
            if(correto == 1){
                html +="<img src='imagens/right.png' class='imagens'>";
                correto = 0;
            }else{
                html +="<img src='imagens/cross.png' class='imagens'>";
            }
            html += "</div>";
        }
        html += "<div id='butoesRepetir'>\n\
                    <button type='button' id='botaoRepetirIgual' class='btn btn-primary jogarNovamente'>Play again with same parameters</button>\n\
                    <button type='button' id='botaoRepetir' class='btn btn-primary jogarNovamente2'>Play again</button>\n\
                 </div>";
        html += "</div>"
        $("#contentor").html(html); 
    }
    
    $(document).on("click","#botaoRepetirIgual",function(){
        respostas = new Array();
        pontuacaoFinal = 0;
        generarLinkAPI();
    });
    
    $(document).on("click","#botaoRepetir",function(){
        resetVariaveis();
        $("#contentor").html("<div id='div_escolher_dificuldade'>\n\
                                <h1>Escolha a Dificuldade</h1>\n\
                                <button id='butaoDificuldadeFacil' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Easy</button>\n\
                                <button id='butaoDificuldadeMedia' type='button' style=' margin:30px; width:200px ; height: 100px; font-size: 35px;' class='btn btn-primary'>Medium</button>\n\
                            </div>"); 
    });
    
    function verificarTopTen(){
        for(var i = 0;i<topTen.length;i++){
            if(topTen[i][1] < pontuacaoFinal){
                var a = [nomeJogador,pontuacaoFinal,dificuldade,scategoria ];
                topTen.splice(i, 0, a);
                topTen.pop();
                localStorage.setItem('topTen', JSON.stringify(topTen));
                break;
            }
        }
    }
    
    function resetVariaveis(){
        dificuldade = "";
        sdificuldade = "";
        categoria = "";
        scategoria = "";
        perguntas = new Array();
        nrpergunta = -1;
        nomeJogador = "";
        pontuacaoFinal = 0;
        respostas = new Array();
        localStorage.removeItem("respostas");
        localStorage.removeItem("nrpergunta");
        localStorage.removeItem("perguntas");
        localStorage.removeItem("nomeJogador");
        localStorage.removeItem("dificuldade");
        localStorage.removeItem("sdificuldade");
        localStorage.removeItem("categoria");
        localStorage.removeItem("scategoria");
    }
    
    function resetAlgumasVariaveis(){
        perguntas = new Array();
        nrpergunta = -1;
        pontuacaoFinal = 0;
        respostas = new Array();
        localStorage.removeItem("respostas");
        localStorage.removeItem("nrpergunta");
        localStorage.removeItem("perguntas");
    }
    
    //https://www.w3schools.com/html/html5_webstorage.asp
    
});


