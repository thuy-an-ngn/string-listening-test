function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];

        // Swap a and b
        if (Math.random() > 0.5) {
            [array[currentIndex].a, array[currentIndex].b] = [array[currentIndex].b, array[currentIndex].a]
        }
    }
    return array
}

function loadTest(json) {
    json.forEach((round, i) => {
        rounds.push({
            id: i,
            a: `${round[0].violin}-${round[0].player}-${round[0].session}.wav`,
            b: `${round[1].violin}-${round[1].player}-${round[1].session}.wav`,
        })
    })

    // In-Place
    shuffle(rounds)
    console.log(rounds)
    return rounds
}

function render(rounds) {
    rounds.forEach((round, i) => {
        // Create timeline
        let step = document.createElement('li')
        steps.insertBefore(step, steps.lastElementChild)

        let formSection = document.createElement('div')
        formSection.classList.add('form-step')
        formSection.innerHTML = `
        <similarity-test
            path-x="${ROOT}/${round.a}"
            path-y="${ROOT}/${round.b}"
        >
        </similarity-test>
        `
        form.insertBefore(formSection, form.lastElementChild)

    })

    updatePage(page)
}

function updatePage(page) {
    // Pause all audios in the page
    document.querySelectorAll('similarity-test').forEach(test => test.pause())

    history.replaceState({}, '', `#${page}`)

    // Update timeline
    progress.style.setProperty('--progress', (page - 1) / (steps.childElementCount - 1))

    // Update prev/next buttons
    prev.setAttribute('data-disabled', page == 1)
    next.setAttribute('data-disabled', page == form.childElementCount)

    for (child of steps.children) { child.classList.remove('active') }
    steps.children[page - 1].classList.add('active')

    for (child of form.children) { child.classList.remove('active') }
    form.children[page - 1].classList.add('active')
}

const ROOT = 'audio/final/'

let rounds = []
fetch('test.json')
    .then((response) => response.json())
    .then((json) => render(loadTest(json)));

let page = window.location.hash ? parseInt(location.hash.substring(1)) : 1

const steps = document.querySelector('#steps')
const progress = document.querySelector('#progress')
const form = document.querySelector('form')

const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

next.addEventListener('click', () => {
    page = page < form.childElementCount ? page + 1 : page
    updatePage(page)
})

prev.addEventListener('click', () => {
    page = page > 1 ? page - 1 : page
    updatePage(page)
})

document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
        page = page > 1 ? page - 1 : page
        updatePage(page)
    }

    if (event.key == 'ArrowRight') {
        page = page < form.childElementCount ? page + 1 : page
        updatePage(page)
    }
})

function click(button) {
    let audio = button.querySelector('audio')
    let paused = audio.paused

    document.querySelectorAll('audio').forEach(audio => audio.pause())
    document.querySelectorAll('label').forEach(label => label.classList.remove('active'))

    if (paused) {
        audio.currentTime = 0
        audio.play()
    } else {
        audio.pause()
    }

    audio.addEventListener('timeupdate', (e) => {
        let seekPosition = e.target.currentTime * (100 / e.target.duration)
        button.style.setProperty('--progress-value', seekPosition)
    })

    button.classList.add('active')
}

document.querySelectorAll('.form-step label.audio').forEach(
    button => button.addEventListener('click', (e) => {
        click(button)
    })
)

const saveBtn = document.querySelector('#conclu button')
saveBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let results = []
    document.querySelectorAll('similarity-test').forEach((test, i) => {
        results.push({
            test: rounds[i],
            result: test.getResults()
        })
    })
    const json = JSON.stringify(results)
    const name = "sample.json"
    const type = "text/plain"

    // create file
    const a = document.createElement("a")
    const file = new Blob([json], { type: type })
    a.href = URL.createObjectURL(file)
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
})
