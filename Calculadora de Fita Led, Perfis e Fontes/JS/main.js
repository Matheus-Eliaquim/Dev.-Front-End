//Constante para captação de informações
const entradaReal = document.querySelector("#entrada")
let potenciaFita = Number(document.querySelector("#potenciaFita").value)
let coeficienteSobra = Number(document.querySelector("#Coeficiente").value)
let tamanhoRolo = Number(document.querySelector("#optionRolo").value)
let roloVariavel = document.querySelector("#optionRolo") //variavel para travar campo de rolo de fita caso necessario
let tamanhoPerfil = Number(document.querySelector("#optionPerfil").value)
let perfilVariavel = document.querySelector("#optionPerfil") //variavel para travar campo de perfil caso necessario
let padraoFonte = Number(document.querySelector("#optionPadraoFonte").value)
let semPerfil = document.querySelector("#semPerfil")
let semFita = document.querySelector("#semFita")
const sobras = [] //array para armazenar todas as sobras para calular as barras utilizadas
let sobra = 0 //variavel apenas para salvar temporariamente o valor da sobra individual de cada entrada
const msgErro = document.querySelector("#erro")

//variavel para calcular total de barras
const btn = document.querySelector("#btnCalculo")

//contagem de barras, rolos e metragem total
let barraParcial = 0
let totalBars = 0
let barrasFormadas = 0 //variavel para calcular quantas barras são formadas a partir das sobras
let totalRols = 0
let totalMets = 0

//variaveis para a contagem geral de fontes
const tabelaComFontes = document.querySelector("#metragemFontes")
const tabelaDeCortes = document.querySelector("#cortes")
let fonteDe200w = 0
let fonteDe150w = 0
let fonteDe100w = 0
let fonteDe72w = 0
let fonteDe65w = 0
let fonteDe60w = 0
let fonteDe48w = 0
let fonteDe36w = 0
let fonteDe24w = 0
let fonteDe18w = 0

//função para atualizar valores de entrada
function attValoresEntrada() {
    potenciaFita = Number(document.querySelector("#potenciaFita").value)
    coeficienteSobra = Number(document.querySelector("#Coeficiente").value)
    tamanhoRolo = Number(document.querySelector("#optionRolo").value)
    tamanhoPerfil = Number(document.querySelector("#optionPerfil").value)
    padraoFonte = Number(document.querySelector("#optionPadraoFonte").value)
}

//função para travar o seleção do tamanho de fita e de perfil 
function travarCampo() {
    if (semPerfil.checked) {
        tamanhoPerfil = 0
        totalRols = 0
        perfilVariavel.disabled = true
    } else if (semPerfil) {
        tamanhoPerfil = Number(document.querySelector("#optionPerfil").value)
        perfilVariavel.disabled = false
    }

    if (semFita.checked) {
        tamanhoRolo = 0
        roloVariavel.disabled = true
    } else if (semFita) {
        tamanhoRolo = Number(document.querySelector("#optionRolo").value)
        roloVariavel.disabled = false
    }
}

function travarEntradas() {
    const trava = document.querySelector("#potenciaFita")
    trava.readOnly = true
}

//função para calcular quantas quantas barras consigo formar com as sobras
function calculandoSobras() {
    barrasFormadas = 0
    barrasFormadas = 0
    for (let i = 0; i < sobras.length; i++) {
        sobras[i] = Number(sobras[i].toFixed(2))
    }

    while (sobras.length > 0) {
        let soma = 0

        for (let i = 0; i < sobras.length; i++) {
            if ((soma + sobras[i]) <= tamanhoPerfil) {
                soma += sobras[i]
                sobras.splice(i, 1)
                //o metodo .splice é usado para remover indices de um array
                //"i" é a variavel que vai indicar o indice que será excluido
                //"1" é a quantidade de numeros que são excluir, sendo o indice "i" o primeiro numero
                i--
            }
        }
        if (soma > 0 && soma <= tamanhoPerfil) {
            barrasFormadas++
        } else {
            break
        }
    }
    return barrasFormadas
}

//evento para trancar o campo de perfis ou fitas
semPerfil.addEventListener("change", travarCampo)
semFita.addEventListener("change", travarCampo)

//evento para atualizar valores de entrada do calculo de fonte, da potencia da fita, do tamanho do rolo e do tamanho do perfil
document.querySelectorAll("#optionPadraoFonte, #potenciaFita, #optionRolo, #optionPerfil").forEach((el) => {
    el.addEventListener("change", attValoresEntrada)
})

btn.addEventListener("mousedown", () => {
    const barraSobras = calculandoSobras() + totalBars
    document.querySelector("#outBars").innerText = barraSobras
}, { once: true } )

entradaReal.addEventListener("keydown", (e) => {
    travarCampo()
    if (e.key === "Enter" && Number(entradaReal.value) > 0 && tamanhoPerfil > 0) {

        if (potenciaFita < 1) {
            msgErro.textContent = "Preencher"
            msgErro.style.display = "inline"
            return;
        } else {
            msgErro.style.display = "none"
        }

        const entradaTamanho = Number(entradaReal.value)
        const novaLinha = tabelaDeCortes.insertRow()

        //função para decrementar a barra
        function decrementandoBarra() {
            let decrement = Number(entradaReal.value)
            let reps = Math.ceil(entradaTamanho / tamanhoPerfil)

            while (decrement >= tamanhoPerfil) {
                decrement = decrement - tamanhoPerfil
                totalBars++
                barraParcial++
            }

            if (decrement > 0 && decrement < tamanhoPerfil) {
                sobras.push(decrement)
                sobra = decrement
            }

        }

        for (let i = 0; i < 3; i++) {
            const novaColuna = novaLinha.insertCell()
            if (i === 0) {
                novaColuna.textContent = `${entradaTamanho.toFixed(2)}m`
            } else if (i === 1) {
                decrementandoBarra()
                novaColuna.textContent = barraParcial
                barraParcial = 0
            } else if (i === 2) {
                novaColuna.textContent = `${sobra.toFixed(2)}m`
                sobra = 0
            }
        }
    }
})

//evento para calcular potencia de fonte e metragem de fita
entradaReal.addEventListener("keydown", (e) => {
    travarCampo()
    if (e.key === "Enter" && Number(entradaReal.value) > 0) {
        if (potenciaFita < 1) {
            msgErro.textContent = "Preencher"
            msgErro.style.display = "inline"
            return;
        } else {
            msgErro.style.display = "none"
        }
        const novaLinha = tabelaComFontes.insertRow()
        const entradaTamanho = Number(entradaReal.value)
        let qtdFonte = Math.ceil(entradaTamanho / padraoFonte) //Math.ceil arredonda a quantidade de fontes para numero inteiro que seja mais proximo e maior que o numero declarado
        let potenciaFonte = ((entradaTamanho * potenciaFita) / qtdFonte) * ((coeficienteSobra + 100) / 100)

        //arredondar valor da potencia da fonte
        function potenciaArred() {
            if (potenciaFonte <= 200 && potenciaFonte > 150) {
                potenciaFonte = 200
            } else if (potenciaFonte <= 150 && potenciaFonte > 100) {
                potenciaFonte = 150
            } else if (potenciaFonte <= 100 && potenciaFonte > 72) {
                potenciaFonte = 100
            } else if (potenciaFonte <= 72 && potenciaFonte > 65) {
                potenciaFonte = 72
            } else if (potenciaFonte <= 65 && potenciaFonte > 60) {
                potenciaFonte = 65
            } else if (potenciaFonte <= 60 && potenciaFonte > 48) {
                potenciaFonte = 60
            } else if (potenciaFonte <= 48 && potenciaFonte > 36) {
                potenciaFonte = 48
            } else if (potenciaFonte <= 36 && potenciaFonte > 24) {
                potenciaFonte = 36
            } else if (potenciaFonte <= 24 && potenciaFonte > 18) {
                potenciaFonte = 24
            } else if (potenciaFonte <= 18 && potenciaFonte > 0) {
                potenciaFonte = 18
            }
        }

        //função para incrementar a quantidade de fontes na tabela
        function incrementarTabelaFontes() {
            if (potenciaFonte === 200) {
                fonteDe200w = fonteDe200w + qtdFonte
                document.querySelector("#fonte200").innerText = fonteDe200w
            } else if (potenciaFonte === 150) {
                fonteDe150w = fonteDe150w + qtdFonte
                document.querySelector("#fonte150").innerText = fonteDe150w
            } else if (potenciaFonte === 100) {
                fonteDe100w = fonteDe100w + qtdFonte
                document.querySelector("#fonte100").innerText = fonteDe100w
            } else if (potenciaFonte === 72) {
                fonteDe72w = fonteDe72w + qtdFonte
                document.querySelector("#fonte72").innerText = fonteDe72w
            } else if (potenciaFonte === 65) {
                fonteDe65w = fonteDe65w + qtdFonte
                document.querySelector("#fonte65").innerText = fonteDe65w
            } else if (potenciaFonte === 60) {
                fonteDe60w = fonteDe60w + qtdFonte
                document.querySelector("#fonte60").innerText = fonteDe60w
            } else if (potenciaFonte === 48) {
                fonteDe48w = fonteDe48w + qtdFonte
                document.querySelector("#fonte48").innerText = fonteDe48w
            } else if (potenciaFonte === 36) {
                fonteDe36w = fonteDe36w + qtdFonte
                document.querySelector("#fonte36").innerText = fonteDe36w
            } else if (potenciaFonte === 24) {
                fonteDe24w = fonteDe24w + qtdFonte
                document.querySelector("#fonte24").innerText = fonteDe24w
            } else if (potenciaFonte === 18) {
                fonteDe18w = fonteDe18w + qtdFonte
                document.querySelector("#fonte18").innerText = fonteDe18w
            }
        }

        //loop para criar cada uma das 3 colunas e ja adicinar seus respectivos valres
        for (let i = 0; i < 3; i++) {
            if (tamanhoRolo > 0) {
                const novaColuna = novaLinha.insertCell()


                if (i === 0 && tamanhoRolo > 0) {
                    novaColuna.textContent = `${entradaTamanho.toFixed(2)}m`
                } else if (i === 1 && tamanhoRolo > 0) {
                    if (qtdFonte < 10) {
                        novaColuna.textContent = `0${qtdFonte}`
                    } else {
                        novaColuna.textContent = qtdFonte
                    }
                } else if (i === 2 && tamanhoRolo > 0) {
                    potenciaArred()
                    novaColuna.textContent = `${potenciaFonte}W`
                }
            }
        }
        if (tamanhoRolo === 0) {
            entradaReal.value = "" //zerando o valor de entrada            
            document.querySelector("#outMetros").innerText = `${totalMets.toFixed(2)}m`
            document.querySelector("#outRolos").innerText = totalRols
        } else if (tamanhoRolo > 0) {
            entradaReal.value = "" //zerando o valor de entrada
            incrementarTabelaFontes()
            totalMets = totalMets + entradaTamanho //calculando a quantidade total de metros lineares de fita
            document.querySelector("#outMetros").innerText = `${totalMets.toFixed(2)}m`
            totalRols = Math.ceil(totalMets / tamanhoRolo)
            document.querySelector("#outRolos").innerText = totalRols
        }
    }
})




