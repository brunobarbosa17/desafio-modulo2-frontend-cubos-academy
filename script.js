// ESTE PROJETO FOI DESENVOLVIDO POR BRUNO DE LUCAS
// @o_brunobarbosa
// https://github.com/brunobarbosa17
// A FUNCIONALIDADE DE PASSAR AS PÁGINAS ROTATIVAS NÃO FOI IMPLEMENTADA // ENTÃO PRECISEI IMPROVISAR UM COMPORTAMENTO ESTÁTICO PARA EVITAR BUGS!!

const divPai = document.querySelector('.movies')
const input = document.querySelector('.input')
let filmePesquisado
const divContainer = document.querySelector('.movies-container')
let proxPag = 0
let inicial = true;
let atual = 0
let paginaAtual = 1
let qntdFilmes = 0
let qntdPaginas = 0
let maxAtual = 0;
let oLink

// Funcionalidade Dark Theme - NÃO IMPLEMENTADA
const darkButtom = document.querySelector('.btn-theme')
darkButtom.addEventListener('click', () => {
    window.alert('Função ainda não disponível!')
})

const promise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(response => {
    const promiseBody = response.json()
    promiseBody.then(body => {
        qntdFilmes = body.results.length;
        qntdPaginas = qntdFilmes / 5
        for (let i = atual; i < 5; i++) {
            criarElementos(body, i)
        }
    })
})


// PASSAR PÁGINA DIREITA
const pagDireita = document.querySelector('.btn-next')
pagDireita.addEventListener('click', passarPagDireita)


// PASSAR PAGINA ESQUERDA
const pagEsquerda = document.querySelector('.btn-prev')
pagEsquerda.addEventListener('click', passarPagEsquerda)


// PESQUISAR FILME

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value.length >= 1) {
        const allMovies = document.querySelectorAll('.movie')
        allMovies.forEach(movies => {
            movies.remove()
        })
        inicial = false;
        paginaAtual = 1
        const promise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${ input.value }`).then(response => {
            const promiseBody = response.json()
            promiseBody.then(body => {
                qntdFilmes = body.results.length
                qntdPaginas = qntdFilmes / 5
                for (let i = 0; i < 5; i++) {
                    criarElementos(body, i)
                }

            })
        })
        filmePesquisado = input.value
        input.value = ''
    }

    else if (event.key === 'Enter' && input.value.length === 0) {
        document.location.reload(true)
    }
})



// Modal
const filmes = document.querySelector('.movies')
const modal = document.querySelector('.modal.hidden')

filmes.addEventListener('click', (event) => {
    modal.classList.toggle('hidden')
    const modalOpenPromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${ event.target.id }?language=pt-BR`).then(response => {
        const promiseBody = response.json()
        promiseBody.then(body => {
            // coteúdo da modal
            const titleModal = document.querySelector('.modal__title')
            titleModal.textContent = body.title

            const imgModal = document.querySelector('.modal__img')
            if (!body.backdrop_path) {
                imgModal.src = './assets/not-found.jpg'
            } else {
                imgModal.src = body.backdrop_path
            }

            const descricaoModal = document.querySelector('.modal__description')
            descricaoModal.textContent = body.overview

            const nota = document.querySelector('.modal__average')
            nota.textContent = body.vote_average

            const ModalGenres = document.querySelector('.modal__genres')

            const retorno = body.genres

            retorno.forEach(generos => {
                const genres = document.createElement('span')
                genres.textContent = generos.name
                genres.classList.add('modal__genre')
                ModalGenres.append(genres)
            })
        })
    })
})


const botaoFecharModal = document.querySelector('.modal__close')

botaoFecharModal.addEventListener('click', () => {
    const modalAberta = document.querySelector('.modal')
    modalAberta.classList.add('hidden')

    const genresExistentes = document.querySelectorAll('.modal__genre')
    genresExistentes.forEach(e => {
        e.remove()
    })
})



// VIDEO HIGHLIGHT
const promiseHighlight = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(response => {
    const promiseBody = response.json()
    promiseBody.then(body => {
        // highlight
        const titulo = document.querySelector('.highlight__title')
        titulo.textContent = body.title

        const fundoCinza = document.createElement('div')
        fundoCinza.classList.add('fundo__cinza')
        const backImg = document.querySelector('.highlight__video')
        backImg.style.backgroundImage = `url(${ body.backdrop_path }) `
        backImg.append(fundoCinza)

        const rating = document.querySelector('.highlight__rating')
        rating.textContent = body.vote_average.toFixed(1)

        const genero = document.querySelector('.highlight__genres')
        genero.textContent = `${ body.genres[0].name }, ${ body.genres[1].name }, ${ body.genres[2].name }`

        const dia = Number(body.release_date.substr(8, 10))
        const mes = Number(body.release_date.substr(5, 2))
        const ano = Number(body.release_date.substr(0, 4))
        monName = new Array("i", "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO")
        const dataLancamento = document.querySelector('.highlight__launch')
        dataLancamento.textContent = `${ dia } DE ${ monName[mes] } DE ${ ano }`

        const descricao = document.querySelector('.highlight__description')
        descricao.textContent = body.overview

    })
})

const videoPromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(response => {
    const promiseBody = response.json()
    promiseBody.then(body => {
        // video
        const video = document.querySelector('.highlight__video-link')
        video.href = `https://www.youtube.com/watch?v=${ body.results[0].key }`
    })
})
// FIM HIGHLIGHT

// FUNCAO PASSAR PARA DIREITA
function passarPagDireita(e) {
    if (atual >= 19 || paginaAtual + 1 > qntdPaginas) {
        window.alert('Não há mais resultados!')
        e.preventDefault();
    } else {
        if (inicial) {
            oLink = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'
        } else {
            oLink = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${ filmePesquisado }`
        }
        const promise = fetch(oLink).then(response => {
            const promiseBody = response.json()
            promiseBody.then(body => {
                qntdFilmes = body.results.length;
                const allMovies = document.querySelectorAll('.movie')

                allMovies.forEach(filmes => {
                    filmes.remove()
                })

                proxPag = atual + 5
                for (let i = atual + 1; i < proxPag + 1; i++) {
                    criarElementos(body, i)
                }
            })
        })
        paginaAtual++
    }
}
// FIM PAG DIREITA


// PASSAR PAG ESQUERDA
function passarPagEsquerda(e) {
    if (paginaAtual === 1) {
        window.alert('Não há mais resultados!')
        e.preventDefault();
    } else {

        if (inicial) {
            oLink = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'
        } else {
            oLink = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${ filmePesquisado }`
        }

        if (paginaAtual == 2) {
            atual = 0;
            maxAtual = 4;
        }

        if (paginaAtual == 3) {
            atual = 5;
            maxAtual = 9;
        }

        if (paginaAtual == 4) {
            atual = 10;
            maxAtual = 14;
        }

        const promise = fetch(oLink).then(response => {
            const promiseBody = response.json()
            promiseBody.then(body => {
                qntdFilmes = body.results.length;
                const allMovies = document.querySelectorAll('.movie')

                allMovies.forEach(filmes => {
                    filmes.remove()
                })
                for (let i = atual; i < maxAtual + 1; i++) {
                    criarElementos(body, i)
                }
            })
            paginaAtual--
        })
    }
}



// FUNCAO REMOVER E CRIAR ELEMENTOS

function criarElementos(body, i) {
    const divFilho = document.createElement('div')
    divFilho.classList.add('movie')
    divFilho.id = String(body.results[i].id)
    const divInfo = document.createElement('div')
    divInfo.classList.add('movie__info')

    const spanTitle = document.createElement('span')
    spanTitle.classList.add('movie__title')
    spanTitle.textContent = body.results[i].original_title

    const estrela = document.createElement('img')
    estrela.src = './assets/estrela.svg'
    estrela.classList.add('estrela')

    const spanRating = document.createElement('span')
    spanRating.classList.add('movie__rating')
    spanRating.textContent = body.results[i].vote_average

    const img = document.createElement('img')
    if (!body.results[i].poster_path) {
        img.src = './assets/not-found.jpg'
    } else {
        img.src = body.results[i].poster_path
    }

    spanTitle.id = String(body.results[i].id)
    img.id = String(body.results[i].id)
    spanRating.id = String(body.results[i].id)
    estrela.id = String(body.results[i].id)
    divInfo.append(spanTitle, estrela, spanRating)
    divFilho.append(img, divInfo)
    divPai.append(divFilho)
    atual = i;
}