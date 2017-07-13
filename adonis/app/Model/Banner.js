'use strict'

const Lucid = use('Lucid')

class Banner extends Lucid {
    static get table() {
        return 'banners'
    }
}

module.exports = Banner
