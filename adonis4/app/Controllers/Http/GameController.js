'use strict'

class GameController {
    render({ request, view }) {
        const guessedNumber = Number(request.input('number'))

        if (!guessedNumber) {
            return 'Please specify a number by passing ?number=<num> to the url'
        }

        const randomNumber = Math.floor(Math.random() * 20) + 1

        return view.render('web/game', { guessedNumber, randomNumber });
    }

}

module.exports = GameController
