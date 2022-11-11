function generateCards(options) {
    return options.sort(() => { return Math.random() - 0.5 })
}

function showCard(card) {
    card.children[0].classList.add('flip');
}

function hideCard(card) {
    card.children[0].classList.remove('flip');

}

function disableClickOnCard(card) {
    card.removeEventListener('click', clickOnCard, false);
}

function enableClickOnCard(card) {
    card.addEventListener('click', clickOnCard);
}

function startClock() {
    interval = setInterval(() => {
        minutes = document.getElementById('min');
        seconds = document.getElementById('seg');
        seconds_value = parseInt(seconds.innerHTML);
        minutes_value = parseInt(minutes.innerHTML);
        if (seconds_value < 59) {
            if (seconds_value < 9) {
                seconds.innerHTML = "0" + (++seconds_value);
            } else seconds.innerHTML++;
        } else {
            seconds.innerHTML = '00';
            if (minutes_value < 59) {
                if (minutes_value < 9) {
                    minutes.innerHTML = "0" + (++minutes_value);
                } else minutes.innerHTML++;
            }
        }
    }, 1000);
    started = true;
}

function clickOnCard(e) {
    if (started == false) {
        startClock();
    }
    card = document.getElementById(e.target.id);
    if (!(cards_actives.includes(card))){
        cards_actives.push(card);
    }
    disableClickOnCard(card.children[0].children[1].children[0]);
    showCard(card);
    if (cards_actives.length == 2) {
        for (card of cards) {
            disableClickOnCard(card);
        }
        checkCards();
        setTimeout(() => {
            for (card of cards) {
                enableClickOnCard(card);
            }
            for (card of pair_founds) {
                card.children[0].children[1].children[0].removeEventListener('click', clickOnCard, false);
            }
        }, 750)
        
    }
}

function checkCards() {
    for (card of cards) {
        disableClickOnCard(card);
    }
    if (cards_actives[0].children[0].children[1].children[0].src != cards_actives[1].children[0].children[1].children[0].src) {
        setTimeout(() => {
            hideCard(cards_actives[0]);
            hideCard(cards_actives[1]);
            cards_actives = [];
        }, 750)
    } else {
        pair_founds.push(...cards_actives);
        if (pair_founds.length == 10) {
            window.clearInterval(interval);
            interval = null;
            setTimeout(() => {
                for (card of document.getElementsByClassName('flip-card')) {
                    card.style.opacity = 1;
                }
                win_div = document.getElementById('win');
                win_div.innerHTML = "YOU WIN :D";
                restart_div = document.getElementById('restart');
                restart_btn = document.createElement('button');
                restart_btn.innerHTML="Play Again"
                restart_btn.onclick = () => {location.reload()};
                restart_div.appendChild(restart_btn);
            }, 750)
        } else {
            setTimeout(() => {
                cards_actives = [];
            }, 800)
            setTimeout(() => {
                cards_actives[0].style.opacity = 0;
                cards_actives[1].style.opacity = 0;
            }, 750)
        }
    }

}
window.onload = () => {
    options = ['coconut', 'coconut', 'lemon', 'lemon', 'strawberry', 'strawberry', 'pineapple', 'pineapple', 'grape', 'grape'];
    cards_actives = [];
    pair_founds = [];
    started = false;
    cards_text = generateCards(options);
    for (img of document.getElementsByTagName('img')) {
        img.ondragstart = function() { return false; };
    }
    for (card of document.getElementsByClassName('flip-card-back')) {
        card.children[0].src = "./img/" + cards_text[parseInt(card.children[0].id)] + "_card.png";
    }
    cards = document.getElementsByTagName('img');
    document.addEventListener('dblclick',(e)=>{
        e.preventDefault();
        e.stopPropagation();
    })
    for (card of cards) {
        card.addEventListener('click', clickOnCard);
    }
}